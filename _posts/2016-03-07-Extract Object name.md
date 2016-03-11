---
layout: post
title: Extract object name
---

Often you will want some text to be read as an object name, for example here we generate some data and plot it, to speed things up we can write a function that only requires the name of the data frame and then uses its name as the title. This is done with `paste(deparse(substitute(data)))`

```
Data1 <- data.frame(x=rnorm(10),y=rnorm(10))
Data2 <- data.frame(x=rnorm(10),y=rnorm(10))

plot.fun <- function(data){
plot(data, main= paste(deparse(substitute(data))))
}

plot.fun(Data1)
plot.fun(Data2)
```
Otherwise we would need to add the title in each time.
The above example takes an object and extracts its name as a text the following does the reverse i.e. takes some user provided text and r reads it as an object.

```
eval(parse(text=paste("Data",1, sep = "")))
```

This will return `Data1` and so changing from `1` to `2` will return `Data2`. To save an object as using the same  idea use `assign(paste("Data",i, sep = "")`. So you can generate lots of data frames using a simple loop.

```
for (i in 1:100) {
assign(paste("Data",i, sep = ""), data.frame(x=rnorm(10),y=rnorm(10)))
}
```
and then plot them with a title 

```
for (i in 1:100){
  plot(eval(parse(text=paste("Data",i, sep = ""))), main=paste("Data",i, sep = ""))
}
```




