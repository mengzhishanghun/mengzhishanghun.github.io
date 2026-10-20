---
title: Python 按列名更新 Excel：组合键与独立输出
description: 参照表提供新值，目标表按多个列匹配后更新指定列。原工具把匹配字段用下划线拼起来，`("A_B", "C")` 与 `("A", "B_C")` 就可能撞键。本文将核心处理独立出来，适用于 Python 3 与 openpyxl 的普通 `.xlsx`；不复刻原 GUI。
type: blog
slug: python-excel-column-update
categoryId: python
categoryName: PYTHON
categoryOrder: 0
order: 0
status: 已发布
featured: false
date: 2026-10-13
publishedAt: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: zh
translationKey: python-excel-column-update
---

Execl表根据列名替换
===

t# 实现效果
![](/media-occurrence/blog%3Apython-excel-column-update%3Amedia%3A1)
![](/media-occurrence/blog%3Apython-excel-column-update%3Amedia%3A2)
这个东西是帮同学做的，要求是根据列名，在参照表中检索跟待修改表中值一样的行，修改待修改表中对应的列，最后保存待修改表
# 源码
```python
import tkinter as tk
from tkinter import filedialog
import pandas as pd
import sys
import os
from openpyxl import load_workbook

# 定义一个类，用于将输出重定向到日志文本框
class RedirectOutput:
    def __init__(self, text_widget):
        self.text_widget = text_widget

    def write(self, string):
        # 将输出写入文本框
        self.text_widget.config(state='normal')
        self.text_widget.insert(tk.END, string)
        self.text_widget.see(tk.END)  # 滚动到末尾
        self.text_widget.config(state='disabled')

    def flush(self):
        pass  # 不执行任何操作

def select_file(entry_widget):
    file_path = filedialog.askopenfilename(filetypes=[("Excel files", "*.xlsx")])
    if file_path:
        entry_widget.config(state='normal')
        entry_widget.delete(0, tk.END)
        entry_widget.insert(0, file_path)
        entry_widget.config(state='readonly')

def replace_values():
    # 清空日志文本框
    log_text.config(state='normal')
    log_text.delete('1.0', tk.END)
    log_text.config(state='disabled')

    reference_file = entry_reference.get()
    target_file = entry_target.get()
    ref_compare_cols_input = entry_ref_compare_columns.get()
    tgt_compare_cols_input = entry_tgt_compare_columns.get()
    ref_replace_cols_input = entry_ref_replace_columns.get()
    tgt_replace_cols_input = entry_tgt_replace_columns.get()

    # 使用竖线 | 作为分隔符，分割列名
    delimiter = '|'
    ref_compare_cols = [col.strip() for col in ref_compare_cols_input.split(delimiter) if col.strip()]
    tgt_compare_cols = [col.strip() for col in tgt_compare_cols_input.split(delimiter) if col.strip()]
    ref_replace_cols = [col.strip() for col in ref_replace_cols_input.split(delimiter) if col.strip()]
    tgt_replace_cols = [col.strip() for col in tgt_replace_cols_input.split(delimiter) if col.strip()]

    if not reference_file:
        print("请先选择参照表文件。\n")
        return
    if not target_file:
        print("请先选择待修改表文件。\n")
        return
    if not ref_compare_cols or not tgt_compare_cols:
        print("请先输入参照表和待修改表的比较列名（使用 '|' 分隔多个列名）。\n")
        return
    if not ref_replace_cols or not tgt_replace_cols:
        print("请先输入参照表和待修改表的替换列名（使用 '|' 分隔多个列名）。\n")
        return
    if len(ref_compare_cols) != len(tgt_compare_cols):
        print("参照表和待修改表的比较列名数量不一致。\n")
        return
    if len(ref_replace_cols) != len(tgt_replace_cols):
        print("参照表和待修改表的替换列名数量不一致。\n")
        return
    try:
        # 读取参照表和待修改表的数据
        df_reference = pd.read_excel(reference_file)
        df_target = pd.read_excel(target_file)

        # 检查参照表的列名是否存在
        for col in ref_compare_cols + ref_replace_cols:
            if col not in df_reference.columns:
                print(f"参照表中不存在列名 '{col}'。\n")
                return

        # 检查待修改表的列名是否存在
        for col in tgt_compare_cols + tgt_replace_cols:
            if col not in df_target.columns:
                print(f"待修改表中不存在列名 '{col}'。\n")
                return

        # 创建用于匹配的键（多列组合）
        df_reference['key'] = df_reference[ref_compare_cols].astype(str).agg('_'.join, axis=1)
        df_target['key'] = df_target[tgt_compare_cols].astype(str).agg('_'.join, axis=1)

        # 创建替换字典，键为组合键，值为替换列的值（多个列）
        replace_dict = df_reference.set_index('key')[ref_replace_cols].to_dict('index')

        # 加载待修改表的工作簿
        wb = load_workbook(target_file)
        ws = wb.active  # 默认情况下，使用活动的工作表

        # 获取列名和列索引的映射
        column_mapping = {cell.value: idx for idx, cell in enumerate(next(ws.iter_rows(min_row=1, max_row=1)), 1)}

        # 检查替换列在工作表中是否存在
        for col in tgt_replace_cols + tgt_compare_cols:
            if col not in column_mapping:
                print(f"待修改表中不存在列名 '{col}'。\n")
                return

        # 遍历待修改表的行，进行替换
        max_row = ws.max_row
        for row_idx in range(2, max_row + 1):  # 从第二行开始（第一行是标题）
            # 获取当前行的比较键
            key_values = []
            for col in tgt_compare_cols:
                cell_value = ws.cell(row=row_idx, column=column_mapping[col]).value
                key_values.append(str(cell_value))
            key = '_'.join(key_values)

            if key in replace_dict:
                # 进行替换
                for ref_col, tgt_col in zip(ref_replace_cols, tgt_replace_cols):
                    new_value = replace_dict[key][ref_col]
                    ws.cell(row=row_idx, column=column_mapping[tgt_col], value=new_value)
            else:
                print(f"行 {row_idx}: 匹配键 '{key}' 未在参照表中找到，无法替换。\n")

        # 尝试保存修改后的工作簿到原文件
        try:
            wb.save(target_file)
            print(f"替换操作完成，已直接修改原始文件：\n{target_file}\n")
        except Exception as e:
            print(f"无法保存到原始文件，可能原因：文件正在被其他程序占用或没有写入权限。\n")
            # 保存修改后的工作簿，保存为新文件
            target_dir, target_filename = os.path.split(target_file)
            target_name, target_ext = os.path.splitext(target_filename)
            new_filename = f"{target_name}_modified{target_ext}"
            new_file_path = os.path.join(target_dir, new_filename)
            wb.save(new_file_path)
            print(f"修改后的文件已另存为：\n{new_file_path}\n")

    except Exception as e:
        print(f"替换过程中发生错误：{e}\n")

def export_log():
    # 获取日志内容
    log_content = log_text.get('1.0', tk.END)
    if not log_content.strip():
        print("日志为空，无法导出。\n")
        return

    # 让用户选择保存日志的文件路径
    file_path = filedialog.asksaveasfilename(defaultextension=".txt", filetypes=[("Text files", "*.txt")])
    if file_path:
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(log_content)
            print(f"日志已成功导出到：\n{file_path}\n")
        except Exception as e:
            print(f"导出日志时发生错误：{e}\n")
    else:
        print("导出日志已取消。\n")

# 创建主窗口
root = tk.Tk()
root.title("Excel 文件修改器")

# 允许窗口大小可调
root.resizable(True, True)

# 配置行和列的权重
root.columnconfigure(1, weight=1)
root.columnconfigure(2, weight=1)
root.columnconfigure(3, weight=1)
for i in range(9):
    root.rowconfigure(i, weight=1)

# 参照表文本框和按钮
label_reference = tk.Label(root, text="参照表路径：")
label_reference.grid(row=0, column=0, padx=10, pady=5, sticky='e')

entry_reference = tk.Entry(root, state='readonly')
entry_reference.grid(row=0, column=1, padx=10, pady=5, columnspan=2, sticky='we')

button_reference = tk.Button(root, text="选择参照表", command=lambda: select_file(entry_reference))
button_reference.grid(row=0, column=3, padx=10, pady=5, sticky='we')

# 待修改表文本框和按钮
label_target = tk.Label(root, text="待修改表路径：")
label_target.grid(row=1, column=0, padx=10, pady=5, sticky='e')

entry_target = tk.Entry(root, state='readonly')
entry_target.grid(row=1, column=1, padx=10, pady=5, columnspan=2, sticky='we')

button_target = tk.Button(root, text="选择待修改表", command=lambda: select_file(entry_target))
button_target.grid(row=1, column=3, padx=10, pady=5, sticky='we')

# 参照表比较列名输入框
label_ref_compare_columns = tk.Label(root, text="参照表比较列名（用 '|' 分隔）：")
label_ref_compare_columns.grid(row=2, column=0, padx=10, pady=5, sticky='e')

entry_ref_compare_columns = tk.Entry(root)
entry_ref_compare_columns.grid(row=2, column=1, padx=10, pady=5, columnspan=3, sticky='we')

# 待修改表比较列名输入框
label_tgt_compare_columns = tk.Label(root, text="待修改表比较列名（用 '|' 分隔）：")
label_tgt_compare_columns.grid(row=3, column=0, padx=10, pady=5, sticky='e')

entry_tgt_compare_columns = tk.Entry(root)
entry_tgt_compare_columns.grid(row=3, column=1, padx=10, pady=5, columnspan=3, sticky='we')

# 参照表替换列名输入框
label_ref_replace_columns = tk.Label(root, text="参照表替换列名（用 '|' 分隔）：")
label_ref_replace_columns.grid(row=4, column=0, padx=10, pady=5, sticky='e')

entry_ref_replace_columns = tk.Entry(root)
entry_ref_replace_columns.grid(row=4, column=1, padx=10, pady=5, columnspan=3, sticky='we')

# 待修改表替换列名输入框
label_tgt_replace_columns = tk.Label(root, text="待修改表替换列名（用 '|' 分隔）：")
label_tgt_replace_columns.grid(row=5, column=0, padx=10, pady=5, sticky='e')

entry_tgt_replace_columns = tk.Entry(root)
entry_tgt_replace_columns.grid(row=5, column=1, padx=10, pady=5, columnspan=3, sticky='we')

# 替换按钮
button_replace = tk.Button(root, text="替换", command=replace_values)
button_replace.grid(row=6, column=1, padx=10, pady=5, sticky='we')

# 导出日志按钮
button_export_log = tk.Button(root, text="导出日志", command=export_log)
button_export_log.grid(row=6, column=2, padx=10, pady=5, sticky='we')

# 添加日志文本框，使用滚动条
log_frame = tk.Frame(root)
log_frame.grid(row=7, column=0, columnspan=4, padx=10, pady=10, sticky='nsew')

log_text = tk.Text(log_frame, state='disabled')
log_text.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

scrollbar = tk.Scrollbar(log_frame, command=log_text.yview)
scrollbar.pack(side=tk.RIGHT, fill=tk.Y)
log_text.config(yscrollcommand=scrollbar.set)

# 配置日志文本框的大小
root.rowconfigure(7, weight=3)

# 重定向标准输出到日志文本框
sys.stdout = RedirectOutput(log_text)

# 运行主循环
root.mainloop()

```


