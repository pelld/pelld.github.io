---
layout: post
title: Excluding subjects aged less than 10 - subsetting data
---

Here I want to exclude all people aged less than a certain value, 11 years old in this case as I am working on five-a-day values and there is no guidance for people aged 10 or less

```{r}
#Generate some values
(age <- runif(100,1,50))
#Generate some ids
id <- seq(1:100)
#stick these together and save to a data frame called df
df <- data.frame(id,age)
#keep all ids whose age is greater than 10 
df <- subset(df, age > 10)
```
