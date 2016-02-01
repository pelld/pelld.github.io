---
layout: blog
title: Installing Chocolatey for Windows
---

I was strugging to download Chocolatey and I eventually found the answer which as it usually does involved changing the path. Anyway this piece of code worked for me - simply open the command prompt i.e. type 'cmd` on the search box on the start menu then paste this code in and you should be away.

```
`%SYSTEMROOT%\System32\WindowsPowerShell\v1.0\powershell.exe -NoProfile -ExecutionPolicy unrestricted -Command "iex ((new-object net.webclient).DownloadString('https://chocolatey.org/install.ps1'))" && SET PATH=%PATH%;%ALLUSERSPROFILE%\chocolatey\bin`
```
