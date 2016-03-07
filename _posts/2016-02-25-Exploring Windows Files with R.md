---
layout: post
title: Exploring Windows files with R
---

To return a list of files saved within a folder use `list.files("file path")`

To open a script file use `file.edit(list.files("file.path")[1])` and if you happen to want to open data saved within a zipped file then use `data <- read.table(unz("file path.zip", "file name", header=T, sep="\t")`, note the `read.table` arguments to include headers and for `tab` delimited values.

