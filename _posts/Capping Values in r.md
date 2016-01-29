##Capping values in r with `pmin`

What we'd like to do here is recode all values greater than a certain number to that number. There are some other ways to do this but in one line use the `pmin()` function. eg:

```{r}
#Generate some data and save to an object called foo and display the numbers by putting brackets around the code
(foo <- runif(10,1,1000))
#pmin takes two arguments the numbers to be capped and the amount to cap them at eg.150
pmin(foo,150)
```
