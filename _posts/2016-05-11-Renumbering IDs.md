---
layout: post
title: Renumbering IDs
---

I received some code which can only cope with IDs that start from 1 therefore I had to renumber my IDs. Simply creating a new ID starting at 1 is relatively simple and can be done by creating a sequence starting at 1 that is the length of the data, for example

```
#Generate some data 
df <- data.frame(OldID = seq((x=sample(10^6,1)),x+99),Value=rnorm(100))
```
This samples a 6 digit random number then adds 1 100 times and `Value` just generates some random numbers. Then to restart these numbers from 1 use 

```
df <- transform(df, id = as.numeric(interaction(OldID, drop=TRUE)))
```
This also works when there are repeated IDs, for example

```
df2 <- data.frame(OldRepeatedID = rep(seq((x=sample(10^6,1)),x+99),each=4),Value=rnorm(400))
df2 <- transform(df2, id = as.numeric(interaction(OldRepeatedID, drop=TRUE)))
```




