---
layout: post
title: Acronyms and Abbreviations in Latex
---

It is possible to use a package to control this abbreviations and acronyms in Latex. The abbreviations are defined once within the .tex file and then referenced in the text similar to for instance a table. This means that the first time a name appears it is written in full then is abbreviatied in subsequent appearances. 

```
\documentclass{article}
\usepackage{longtable}
\usepackage[acronym]{glossaries}

% abbreviations:
\newacronym{ny}{NY}{New York}
\newacronym{la}{LA}{Los Angeles}
\newacronym{un}{UN}{United Nations}

% nomenclature:
\newglossaryentry{angelsperarea}{
  name = $a$ ,
  description = The number of angels per unit area,
}
\newglossaryentry{numofangels}{
  name = $N$ ,
  description = The number of angels per needle point
}
\newglossaryentry{areaofneedle}{
  name = $A$ ,
  description = The area of the needle point
}

\makeglossaries
\begin{document}

\gls{ny}, \gls{la} and \gls{un} are abbreviations whereas
\gls{angelsperarea}, \gls{numofangels} and \gls{areaofneedle} are part of the
nomenclature

\printglossary[type=\acronymtype,title=Abbreviations]

\printglossary[title=Nomenclature]

\end{document}
```
