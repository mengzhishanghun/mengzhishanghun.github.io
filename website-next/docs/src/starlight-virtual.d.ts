declare module 'virtual:starlight/project-context' {
  const context: { trailingSlash: 'always' | 'never' | 'ignore' };
  export default context;
}

declare module 'virtual:starlight/user-config' {
  const config: {
    isMultilingual: boolean;
    locales: Record<string, { label: string }>;
  };
  export default config;
}
