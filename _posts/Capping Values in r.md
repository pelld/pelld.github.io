##Capping values in r with `pmin`

To cap values in r use the `pmin()` function. eg:

```{r}
foo <- runif(10,1,1000)
foo
pmin(foo,150)
```