<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<!-- This text is a brief description of the features that are present in
the Bash shell (version 4.2, 28 December 2010).

This is Edition 4.2, last updated 28 December 2010,
of The GNU Bash Reference Manual,
for Bash, Version 4.2.

Copyright (C) 1988-2011 Free Software Foundation, Inc.

Permission is granted to make and distribute verbatim copies of
this manual provided the copyright notice and this permission notice
are preserved on all copies.

Permission is granted to copy, distribute and/or modify this document
under the terms of the GNU Free Documentation License, Version 1.3 or
any later version published by the Free Software Foundation; with no
Invariant Sections, with the Front-Cover texts being "A GNU Manual",
and with the Back-Cover Texts as in (a) below.  A copy of the license is
included in the section entitled "GNU Free Documentation License".

(a) The FSF's Back-Cover Text is: You are free to copy and modify
this GNU manual.  Buying copies from GNU Press supports the FSF in
developing GNU and promoting software freedom."
 -->
<!-- Created by Texinfo 4.13.90+dev, http://www.gnu.org/software/texinfo/ -->
<head>
<title>Bash Reference Manual: GNU Parallel</title>

<meta name="description" content="Bash Reference Manual: GNU Parallel">
<meta name="keywords" content="Bash Reference Manual: GNU Parallel">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Shell-Commands.html#Shell-Commands" rel="up" title="Shell Commands">
<link href="Shell-Functions.html#Shell-Functions" rel="next" title="Shell Functions">
<link href="Coprocesses.html#Coprocesses" rel="previous" title="Coprocesses">
<style type="text/css">
<!--
a.summary-letter {text-decoration: none}
blockquote.smallquotation {font-size: smaller}
div.display {margin-left: 3.2em}
div.example {margin-left: 3.2em}
div.lisp {margin-left: 3.2em}
div.smalldisplay {margin-left: 3.2em}
div.smallexample {margin-left: 3.2em}
div.smalllisp {margin-left: 3.2em}
kbd {font-style:oblique}
pre.display {font-family: serif}
pre.format {font-family: serif}
pre.menu-comment {font-family: serif}
pre.menu-preformatted {font-family: serif}
pre.smalldisplay {font-family: serif; font-size: smaller}
pre.smallexample {font-size: smaller}
pre.smallformat {font-family: serif; font-size: smaller}
pre.smalllisp {font-size: smaller}
span.nocodebreak {white-space:nowrap}
span.nolinebreak {white-space:nowrap}
span.roman {font-family:serif; font-weight:normal}
span.sansserif {font-family:sans-serif; font-weight:normal}
ul.no-bullet {list-style: none}
-->
</style>


</head>

<body lang="en" bgcolor="#FFFFFF" text="#000000" link="#0000FF" vlink="#800080" alink="#FF0000">
<a name="GNU-Parallel"></a>
<div class="header">
<p>
Previous: <a href="Coprocesses.html#Coprocesses" accesskey="p" rel="previous">Coprocesses</a>, Up: <a href="Shell-Commands.html#Shell-Commands" accesskey="u" rel="up">Shell Commands</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="GNU-Parallel-1"></a>
<h4 class="subsection">3.2.6 GNU Parallel</h4>

<p>GNU Parallel, as its name suggests, can be used to build and run commands
in parallel.  You may run the same command with different arguments, whether
they are filenames, usernames, hostnames, or lines read from files.
</p>
<p>For a complete description, refer to the GNU Parallel documentation.  A few
examples should provide a brief introduction to its use.
</p>
<p>For example, it is easy to prefix each line in a text file with a specified
string:
</p><div class="example">
<pre class="example">cat file | parallel -k echo prefix_string
</pre></div>
<p>The <samp>-k</samp> option is required to preserve the lines&rsquo; order.
</p>
<p>Similarly, you can append a specified string to each line in a text file:
</p><div class="example">
<pre class="example">cat file | parallel -k echo {} append_string
</pre></div>

<p>You can use Parallel to move files from the current directory when the
number of files is too large to process with one <code>mv</code> invocation:
</p><div class="example">
<pre class="example">ls | parallel mv {} destdir
</pre></div>

<p>As you can see, the {} is replaced with each line read from standard input.
This will run as many <code>mv</code> commands as there are files in the current
directory.  You can emulate a parallel <code>xargs</code> by adding the <samp>-X</samp>
option:
</p><div class="example">
<pre class="example">ls | parallel -X mv {} destdir
</pre></div>

<p>GNU Parallel can replace certain common idioms that operate on lines read
from a file (in this case, filenames):
</p><div class="example">
<pre class="example">	for x in $(cat list); do
		do-something1 $x config-$x
		do-something2 &lt; $x
	done | process-output
</pre></div>

<p>with a more compact syntax reminiscent of lambdas:
</p><div class="example">
<pre class="example">cat list | parallel &quot;do-something1 {} config-{} ; do-something2 &lt; {}&quot; | process-output
</pre></div>

<p>Parallel provides a built-in mechanism to remove filename extensions, which
lends itself to batch file transformations or renaming:
</p><div class="example">
<pre class="example">ls *.gz | parallel -j+0 &quot;zcat {} | bzip2 &gt;{.}.bz2 &amp;&amp; rm {}&quot;
</pre></div>
<p>This will recompress all files in the current directory with names ending
in .gz using bzip2, running one job per CPU (-j+0)  in parallel.
</p>
<p>If a command generates output, you may want to preserve the input order in
the output.  For instance, the following command
</p><div class="example">
<pre class="example">{ echo foss.org.my ; echo debian.org; echo freenetproject.org; } | parallel traceroute
</pre></div>
<p>will display as output the traceroute invocation that finishes first.  Using
the <samp>-k</samp> option, as we saw above
</p><div class="example">
<pre class="example">{ echo foss.org.my ; echo debian.org; echo freenetproject.org; } | parallel -k traceroute
</pre></div>
<p>will ensure that the output of <code>traceroute foss.org.my</code> is displayed first.
</p>
<hr>
<div class="header">
<p>
Previous: <a href="Coprocesses.html#Coprocesses" accesskey="p" rel="previous">Coprocesses</a>, Up: <a href="Shell-Commands.html#Shell-Commands" accesskey="u" rel="up">Shell Commands</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
