---
title: Python 比较目录：先生成内容差异报告
description: 两个大目录只改了一部分文件，希望知道新增、修改和删除项。原方案还复制文件并安排删除；本篇收窄为 Python 3 标准库的只读报告，避免把比对与修改混在一起。
type: blog
slug: python-directory-diff-report
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
translationKey: python-directory-diff-report
---

文件批量对比
===

# 应用场景
写这个的原因是因为公司有个对外的项目需要发包给其他人，但是包很大有几十个G，每次版本迭代都要重新发包的话就很麻烦，所以写了这个，目的就是能减小发送包的大小，这样就能让那边的人在原来的包上做修改（其实也没啥要改的，我都改弄完了到时候发过去直接循行个.exe就完事了，这要是都不会我真的就要骂人了！！！😕）
# 代码分析
注意嗷，这里给的代码只是部分代码，并且为了方便分析，代码顺序有一丢丢不同， 完整代码请下拉到源码下载！
```python
import os
import shutil
from filecmp import dircmp
```
这里用到的三个库os, shutil, dircmp都是Python的标准库，不需要另外下载，其中os和shutil用来处理创建、删除、拷贝文件，dircmp用来对比文件信息

```python
if __name__ == '__main__':
    old = 'old'
    cur = 'cur'
    new = 'new'
    
    copydir = os.path.realpath(os.curdir) + '\\' + new
    shutil.rmtree(copydir, ignore_errors=True)
    os.mkdir(copydir)

    #打开文件
    myadd = open('Add.txt', 'w+', encoding='utf-8')
    mydiff = open('Diff.txt', 'w+', encoding='utf-8')
    myremove = open('Remove.txt', 'w+', encoding='utf-8')

    CheckDiff(dircmp(old, cur, ['*.o', '*.lo', '*.la', '*.al', '.libs', '*.so', '*.so.[0-9]*', 
    '*.a', '*.pyc', '*.pyo __pycache__', '*.rej', '*~', '#*#', '.#*', '.*.swp', '.DS_Store', '[Tt]humbs.db']), '\\')

    #关闭文件
    myadd.close()
    mydiff.close()
    myremove.close()

    #拷贝删除程序和删除文件到项目中
    shutil.copy2('./Remove.txt', copydir + '\\Remove.txt')
    shutil.copy2('./AutoRemove.exe', copydir + '\\AutoRemove.exe')
```
这个就是主函数啦，很简单吧，解释一下变量的意思，old就是旧版本文件夹，cur是当前版本文件夹，new是需要发送给他们的新建文件夹，然后myadd,mydiff,myremove就是字面意思（没错，我就是起名废柴😀），分别代表用来记录添加、修改、删除的文件夹及文件名

这个程序会将添加、修改的文件和需要删除的记录文件以及自动删除程序拷贝放到新建文件夹中，然后只需要把新建文件夹发给对方，让对方运行其中的自动删除程序就OK了
```python
def CheckDiff(mydcmp, dir):
    for name in mydcmp.right_only:
        str = os.path.realpath(os.curdir) + '\\' +cur + dir + name
        if(os.path.isfile(str)):
            myadd.write(dir + name + '\n')
            os.makedirs(copydir + dir, exist_ok=True)
            shutil.copy2(str, copydir + dir + name)
        else:
            str1 = os.path.realpath(os.curdir) + '\\' + old + dir + name
            if not os.path.exists(str1):
                myadd.write(dir + name + '\\' + '\n')
                os.makedirs(copydir + dir + name, exist_ok=True)
                shutil.copytree(str, copydir + dir + name, dirs_exist_ok=True)
    for name in mydcmp.diff_files:
        str = os.path.realpath(os.curdir) + '\\' +cur + dir + name
        if os.path.isfile(str):
            mydiff.write(dir + name + '\n')
            os.makedirs(copydir + dir, exist_ok=True)
            shutil.copy2(str, copydir + dir + name)
    for name in mydcmp.left_only:
        str = os.path.realpath(os.curdir) + '\\' + old + dir + name
        if os.path.isfile(str):
            myremove.write(dir + name + '\n')
        else:
            str1 = os.path.realpath(os.curdir) + '\\' +cur + dir + name
            if not os.path.exists(str1):
                myremove.write(dir + name + '\\' + '\n')
    for subdir in mydcmp.subdirs.keys():
         CheckDiff(mydcmp.subdirs[subdir], dir + subdir + '\\')
```
该程序的核心功能都在这里了，这里的right_only是仅存在于新版本中的路径，即新增的文件，left_only是仅存在与旧版本中的路径，即需要删除的文件，diff_files是新旧版本不同的文件，即需要修改的文件

最后递归执行该函数指导所有文件夹都比对完成