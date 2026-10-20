---
title: "Comparing directories in Python: start with a content-difference report"
description: When only some files changed between two large directories, you need additions, modifications and removals. The original workflow also copied files an
type: blog
slug: python-directory-diff-report
categoryId: python
categoryName: PYTHON
categoryOrder: 0
order: 0
status: Published
featured: false
date: 2026-10-13
draft: false
sitePublish: true
tags: []
productIds: []
workIds: []
docIds: []
lang: en
translationKey: python-directory-diff-report
publishedAt: 2026-10-13
sourceHash: a25716d8130f2fe56df9b8921da1fc558f0f94c7d78ab595e8baa1900b843a00
generatedBodyHash: 742be2f97bc48ff3b38dda55773a42d4a9ca72a07aa138d30c3ccef248796d5e
translationStatus: translated
---

Batch File Comparison
===

# Use Case
I wrote this because our company has a project for an outside party and needs to send them a package, but the package is huge—tens of gigabytes. Sending the whole thing again with every version would be a real hassle, so I wrote this to reduce the size of what we send. That lets the people on the other end update the package they already have (there is not actually much for them to change; I have already sorted everything out, so once I send it over, they just need to run an .exe. If they cannot even do that, I really am going to start yelling!!! 😕).
# Code Analysis
Just a heads-up: the code shown here is only part of it, and I have changed the order slightly to make it easier to explain. Scroll down to the source download for the complete code!
```python
import os
import shutil
from filecmp import dircmp
```
The three libraries used here, os, shutil, and dircmp, are all part of Python's standard library and do not require a separate download. os and shutil handle creating, deleting, and copying files, while dircmp compares file information.

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
This is the main function. Pretty simple, right? Let me explain the variables: old is the old-version folder, cur is the current-version folder, and new is the newly created folder we need to send them. Then myadd, mydiff, and myremove mean exactly what they say (yes, I am terrible at naming things 😀): they record the folder and file names for additions, modifications, and deletions, respectively.

The program copies added and modified files, a record of files to delete, and an automatic deletion program into the new folder. Then you just send that folder to the other party and have them run the automatic deletion program inside it. That is all.
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
All the program's core functionality is here. right_only contains paths that exist only in the new version, meaning newly added files; left_only contains paths that exist only in the old version, meaning files to delete; and diff_files contains files that differ between the old and new versions, meaning files to modify.

Finally, the function runs recursively until all folders have been compared.
