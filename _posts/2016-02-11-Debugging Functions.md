---
layout: post
title: Debugging functions
---

When examining code others have written there are a few things that I use that I have collected thus far

- Downloading packages from CRAN
- Saving the workspace

To find the code behind the function you can simply type the functions name in to the console and the code will be returned some but not all of the time. When this isn't the case there are ways to try and view the code such as `getAnywhere(insert function name here)`. Another I have found useful, particularly when looking not just at an individual function but at many functions within the package is to download it from CRAN. Firstly go to `https://cran.r-project.org/src/contrib/` and find the version of the package you want then: download and untar:

```
URL <- "http://cran.r-project.org/src/contrib/A3_1.0.0.tar.gz"
download.file(URL, "tempPack.tar.gz")
dir.create("A3")
untar("tempPack.tar.gz", files="A3")
list.files("A3")
```
and the files will be found in the working directory, which can be located with `getwd()`. Inside there will be a numbers including the `r` folder which contains `r` code and if applicable an `src` folder containing `c` or `fortran` code. 

To debug functions use `debug(function name)`, this will allow you to step through the function as it excutes. There are buttons in `RStudio` one can press alternatively shortcuts include `s` to step through each function this is the lowest level and will allow you to see all functions called in executing the command. Then `n` executes the current line in the function but does not necessarily jump into functions called within functions. `c` moves to the end of the section and `q` quits.

If you would like to examine the contents of an object during execution of the function then the method I have used is to edit the function, usually by saving the function to the working environment using: 
```
trickyfunction <- function(foo){
tricky things
}
```
Then, as long as it has the same name this function will be called instead of the function in the package. This means it can be edited and if you wish to examine an object then you can save it so it can be viewed outside of the function execution:
```
save(list=ls(),file="fileloc.Rda")
```
So this save everything to the location specified `fileloc.Rda`, to access it go there and open it.




