---
layout: blog
title: Renaming Variables in r
---
There are two main occasions when one might want to rename a variable either
- a single variable by name
- a single variable by position

To demonstrate I shall create some data with names

```{r}
df <- data.frame(var1 = rnorm(10), var2 = rnorm(10))
```
this gives three variables called `var1` and `var2`

Renaming a variable by name 

Renaming a variable by name can be done as follows:
```{r}
names(df)[names(df)=="var1"] <- "id"
```
which takes `var1` from the data frame `df` that was just created and names it `id`

Renaming a variable by position

```{r}
colnames(df)[2] <- "Age"
```
