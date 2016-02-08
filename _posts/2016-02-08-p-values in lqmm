---
layout: post
title: Calculating p-values in r
---

Developing an AIC, BIC or similar statistic of model selection has proved a fruitless task this is due to the inability to extract the information matrix from the `lqmm` model. I was able to extract the `Hessian` matrix from the `optim` optimised model however talking the square root of the inverse diagonals produced standard errors which did not match those produced by the `lqmm`. Instead of an overall indicator of the model's quality, producing `p-values` for each variable will indicate whether they should be included or not. 

To do this I first need to calculate the `t-value` and this is done by dividing the beta estimates by the standard error. Once I have this the `p-value` is calculated using the `t-distribution` function talking 2 times the absolute values of the beta estimates over the standard error. Using this method I am able to recreate the `p-values` provided by the `summary.lqmm` function.

(because I am unable, thus far, to use rmarkdown you'll just have to copy and paste this code into r and run it yourself) 

```
#Generate some datums 
test <- data.frame(x = runif(10*50,0,1), group = rep(1:50,each=10))
test$y <- 10*test$x + rep(rnorm(50, 0, 2), each = 10) + rchisq(10*50, 3)
#Run summary lqmm model
summary.fit.lqmm <- summary(lqmm(fixed = y ~ x, random = ~ 1, group = group,data = test, tau = 0.5))

#The summary table is called by tTable, column 1 are the beta estimates, 2 are the standard errors
p.values <- 2 * pt(-abs(summary.fit.lqmm$tTable[,1]/summary.fit.lqmm$tTable[,2]),50-1)

#compare the calculated p-values with those from the model (true means they match)
all(summary.fit.lqmm$tTable[,5]==p.values)
```

