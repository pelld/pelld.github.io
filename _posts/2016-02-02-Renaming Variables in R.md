---
layout: post
title: Renaming Variables in r
---

There are two main occasions when one might want to rename a variable either
- a single variable by name
- a single variable by position

To demonstrate I shall create some data with names

```
df <- data.frame(var1 = rnorm(10), var2 = rnorm(10))
```
this gives three variables called `var1` and `var2`

Renaming a variable by name 

Renaming a variable by name can be done as follows:

```
names(df)[names(df)=="var1"] <- "id"
```
which takes `var1` from the data frame `df` that was just created and names it `id`

Renaming a variable by position

```
colnames(df)[2] <- "Age"
```
A further useful way of changing a variable name is when it contains a character that you would like removed. This may have occured, for example, because it has been created by default in r and could look something like `Age.1`. If you would like to remove the `.1` then use you can use:

```
df <- data.frame(var1.1 = rnorm(10), var2.1 = rnorm(10))
names(df) <- sub("\\.1", "", names(df))
```
Here the `sub` function requires two backslashes `\\` to indicate that a special character - the `.` - is to be used.
This is particularly useful if you have a number of variables all containing a character that you would like to remove. A word of caution, this will remove all variables that include `.1` whether you would like it or not. 
