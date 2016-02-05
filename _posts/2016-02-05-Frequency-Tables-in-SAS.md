---
layout: post
title: Frequency Tables in SAS
---

Coming from R to SAS has given me some challenges - I think this is mainly caused by the open source to propriatal nature of the two packages. In R stackoverflow has proved to be an invaluable source of help and there is, more often that not, someone else who has had the same problem asked a question and recieved a resolution. Whereas in SAS in my experience you simply get referred to a manual without any means of getting further clarity. Therefore I am adding fairly trivial code as I come across it to build up some examples of SAS functions and try and fill some of the gaps. 

To produce a frequency table containing `Frequency counts` `Percentage counts` `Cumulative frequency` and `Cumulative counts`

```
PROC FREQ DATA = ndns;
TABLES amount;
RUN;
```

`PROC FREQ` is the procedure requiring a `DATA` set. Here I am using `ndns`. `TABLES` requires the variable to be specified, `amount` in this case. Then a `RUN` command to make it happen. Note that each `SAS` command - here at least - requires the line to end with a `;`

SAS isn't case sensitive but I like to capitalise the functions to make them stand out a bit more (though I am not completely consistent in this). 
