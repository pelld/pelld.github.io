To get a count of the number of cases per group then:

`select COUNT (distinct(variable))
from [data table] `

This is equivalent to `table()` in R

`SELECT variable, COUNT(*) 
from [data table] 
where gender = 'males'
GROUP BY variable`

It is also possible to filter the table using the `Where` clause
