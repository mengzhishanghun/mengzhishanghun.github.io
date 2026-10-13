#!/bin/bash
set -euo pipefail
database=${1:-umami}
[[ "$database" =~ ^[A-Za-z0-9_]+$ ]] || exit 1
container=${2:-mzsh-postgres}
[[ "$container" =~ ^[A-Za-z0-9_-]+$ ]] || exit 1
psql_cmd=(podman exec -e 'PGOPTIONS=-c timezone=UTC -c datestyle=ISO,YMD' -e "PGPORT=${PGPORT:-5432}" "$container" psql -X -At -Uumami -d "$database")
while IFS= read -r table; do
  [[ "$table" =~ ^[A-Za-z0-9_]+$ ]] || exit 1
  count=$("${psql_cmd[@]}" -c "SELECT count(*) FROM \"$table\"")
  hash=$("${psql_cmd[@]}" -c "SELECT row_to_json(t)::text FROM \"$table\" t ORDER BY row_to_json(t)::text COLLATE \"C\"" | sha256sum | cut -d' ' -f1)
  printf '%s %s %s\n' "$table" "$count" "$hash"
done < <("${psql_cmd[@]}" -c "SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename")
