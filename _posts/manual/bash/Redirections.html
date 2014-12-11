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
<title>Bash Reference Manual: Redirections</title>

<meta name="description" content="Bash Reference Manual: Redirections">
<meta name="keywords" content="Bash Reference Manual: Redirections">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Basic-Shell-Features.html#Basic-Shell-Features" rel="up" title="Basic Shell Features">
<link href="Executing-Commands.html#Executing-Commands" rel="next" title="Executing Commands">
<link href="Quote-Removal.html#Quote-Removal" rel="previous" title="Quote Removal">
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
<a name="Redirections"></a>
<div class="header">
<p>
Next: <a href="Executing-Commands.html#Executing-Commands" accesskey="n" rel="next">Executing Commands</a>, Previous: <a href="Shell-Expansions.html#Shell-Expansions" accesskey="p" rel="previous">Shell Expansions</a>, Up: <a href="Basic-Shell-Features.html#Basic-Shell-Features" accesskey="u" rel="up">Basic Shell Features</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="Redirections-1"></a>
<h3 class="section">3.6 Redirections</h3>
<a name="index-redirection"></a>

<p>Before a command is executed, its input and output
may be <var>redirected</var>
using a special notation interpreted by the shell.
Redirection may also be used to open and close files for the
current shell execution environment.  The following redirection
operators may precede or appear anywhere within a
simple command or may follow a command.
Redirections are processed in the order they appear, from
left to right.
</p>
<p>Each redirection that may be preceded by a file descriptor number
may instead be preceded by a word of the form {<var>varname</var>}.
In this case, for each redirection operator except
&gt;&amp;- and &lt;&amp;-, the shell will allocate a file descriptor greater
than 10 and assign it to {<var>varname</var>}.  If &gt;&amp;- or &lt;&amp;- is preceded
by {<var>varname</var>}, the value of <var>varname</var> defines the file
descriptor to close.
</p>
<p>In the following descriptions, if the file descriptor number is
omitted, and the first character of the redirection operator is
&lsquo;<samp>&lt;</samp>&rsquo;, the redirection refers to the standard input (file
descriptor 0).  If the first character of the redirection operator
is &lsquo;<samp>&gt;</samp>&rsquo;, the redirection refers to the standard output (file
descriptor 1).
</p>
<p>The word following the redirection operator in the following
descriptions, unless otherwise noted, is subjected to brace expansion,
tilde expansion, parameter expansion, command substitution, arithmetic
expansion, quote removal, filename expansion, and word splitting.
If it expands to more than one word, Bash reports an error.
</p>
<p>Note that the order of redirections is significant.  For example,
the command
</p><div class="example">
<pre class="example">ls &gt; <var>dirlist</var> 2&gt;&amp;1
</pre></div>
<p>directs both standard output (file descriptor 1) and standard error
(file descriptor 2) to the file <var>dirlist</var>, while the command
</p><div class="example">
<pre class="example">ls 2&gt;&amp;1 &gt; <var>dirlist</var>
</pre></div>
<p>directs only the standard output to file <var>dirlist</var>,
because the standard error was made a copy of the standard output
before the standard output was redirected to <var>dirlist</var>.
</p>
<p>Bash handles several filenames specially when they are used in
redirections, as described in the following table:
</p>
<dl compact="compact">
<dt><code>/dev/fd/<var>fd</var></code></dt>
<dd><p>If <var>fd</var> is a valid integer, file descriptor <var>fd</var> is duplicated.
</p>
</dd>
<dt><code>/dev/stdin</code></dt>
<dd><p>File descriptor 0 is duplicated.
</p>
</dd>
<dt><code>/dev/stdout</code></dt>
<dd><p>File descriptor 1 is duplicated.
</p>
</dd>
<dt><code>/dev/stderr</code></dt>
<dd><p>File descriptor 2 is duplicated.
</p>
</dd>
<dt><code>/dev/tcp/<var>host</var>/<var>port</var></code></dt>
<dd><p>If <var>host</var> is a valid hostname or Internet address, and <var>port</var>
is an integer port number or service name, Bash attempts to open a TCP
connection to the corresponding socket.
</p>
</dd>
<dt><code>/dev/udp/<var>host</var>/<var>port</var></code></dt>
<dd><p>If <var>host</var> is a valid hostname or Internet address, and <var>port</var>
is an integer port number or service name, Bash attempts to open a UDP
connection to the corresponding socket.
</p>
</dd>
</dl>

<p>A failure to open or create a file causes the redirection to fail.
</p>
<p>Redirections using file descriptors greater than 9 should be used with
care, as they may conflict with file descriptors the shell uses
internally.
</p>
<a name="Redirecting-Input"></a>
<h4 class="subsection">3.6.1 Redirecting Input</h4>
<p>Redirection of input causes the file whose name results from
the expansion of <var>word</var>
to be opened for reading on file descriptor <code>n</code>,
or the standard input (file descriptor 0) if <code>n</code>
is not specified.
</p>
<p>The general format for redirecting input is:
</p><div class="example">
<pre class="example">[<var>n</var>]&lt;<var>word</var>
</pre></div>

<a name="Redirecting-Output"></a>
<h4 class="subsection">3.6.2 Redirecting Output</h4>
<p>Redirection of output causes the file whose name results from
the expansion of <var>word</var>
to be opened for writing on file descriptor <var>n</var>,
or the standard output (file descriptor 1) if <var>n</var>
is not specified.  If the file does not exist it is created;
if it does exist it is truncated to zero size.
</p>
<p>The general format for redirecting output is:
</p><div class="example">
<pre class="example">[<var>n</var>]&gt;[|]<var>word</var>
</pre></div>

<p>If the redirection operator is &lsquo;<samp>&gt;</samp>&rsquo;, and the <code>noclobber</code>
option to the <code>set</code> builtin has been enabled, the redirection
will fail if the file whose name results from the expansion of
<var>word</var> exists and is a regular file.
If the redirection operator is &lsquo;<samp>&gt;|</samp>&rsquo;, or the redirection operator is
&lsquo;<samp>&gt;</samp>&rsquo; and the <code>noclobber</code> option is not enabled, the redirection
is attempted even if the file named by <var>word</var> exists.
</p>
<a name="Appending-Redirected-Output"></a>
<h4 class="subsection">3.6.3 Appending Redirected Output</h4>
<p>Redirection of output in this fashion
causes the file whose name results from
the expansion of <var>word</var>
to be opened for appending on file descriptor <var>n</var>,
or the standard output (file descriptor 1) if <var>n</var>
is not specified.  If the file does not exist it is created.
</p>
<p>The general format for appending output is:
</p><div class="example">
<pre class="example">[<var>n</var>]&gt;&gt;<var>word</var>
</pre></div>

<a name="Redirecting-Standard-Output-and-Standard-Error"></a>
<h4 class="subsection">3.6.4 Redirecting Standard Output and Standard Error</h4>
<p>This construct allows both the
standard output (file descriptor 1) and
the standard error output (file descriptor 2)
to be redirected to the file whose name is the
expansion of <var>word</var>.
</p>
<p>There are two formats for redirecting standard output and
standard error:
</p><div class="example">
<pre class="example">&amp;&gt;<var>word</var>
</pre></div>
<p>and
</p><div class="example">
<pre class="example">&gt;&amp;<var>word</var>
</pre></div>
<p>Of the two forms, the first is preferred.
This is semantically equivalent to
</p><div class="example">
<pre class="example">&gt;<var>word</var> 2&gt;&amp;1
</pre></div>

<a name="Appending-Standard-Output-and-Standard-Error"></a>
<h4 class="subsection">3.6.5 Appending Standard Output and Standard Error</h4>
<p>This construct allows both the
standard output (file descriptor 1) and
the standard error output (file descriptor 2)
to be appended to the file whose name is the
expansion of <var>word</var>.
</p>
<p>The format for appending standard output and standard error is:
</p><div class="example">
<pre class="example">&amp;&gt;&gt;<var>word</var>
</pre></div>
<p>This is semantically equivalent to
</p><div class="example">
<pre class="example">&gt;&gt;<var>word</var> 2&gt;&amp;1
</pre></div>

<a name="Here-Documents"></a>
<h4 class="subsection">3.6.6 Here Documents</h4>
<p>This type of redirection instructs the shell to read input from the
current source until a line containing only <var>word</var>
(with no trailing blanks) is seen.  All of
the lines read up to that point are then used as the standard
input for a command.
</p>
<p>The format of here-documents is:
</p><div class="example">
<pre class="example">&lt;&lt;[-]<var>word</var>
        <var>here-document</var>
<var>delimiter</var>
</pre></div>

<p>No parameter expansion, command substitution, arithmetic expansion,
or filename expansion is performed on
<var>word</var>.  If any characters in <var>word</var> are quoted, the
<var>delimiter</var> is the result of quote removal on <var>word</var>,
and the lines in the here-document are not expanded.
If <var>word</var> is unquoted,
all lines of the here-document are subjected to parameter expansion,
command substitution, and arithmetic expansion.  In the latter
case, the character sequence <code>\newline</code> is ignored, and &lsquo;<samp>\</samp>&rsquo;
must be used to quote the characters
&lsquo;<samp>\</samp>&rsquo;, &lsquo;<samp>$</samp>&rsquo;, and &lsquo;<samp>`</samp>&rsquo;.
</p>
<p>If the redirection operator is &lsquo;<samp>&lt;&lt;-</samp>&rsquo;,
then all leading tab characters are stripped from input lines and the
line containing <var>delimiter</var>.
This allows here-documents within shell scripts to be indented in a
natural fashion.
</p>
<a name="Here-Strings"></a>
<h4 class="subsection">3.6.7 Here Strings</h4>
<p>A variant of here documents, the format is:
</p><div class="example">
<pre class="example">&lt;&lt;&lt; <var>word</var>
</pre></div>

<p>The <var>word</var> is expanded and supplied to the command on its standard
input.
</p>
<a name="Duplicating-File-Descriptors"></a>
<h4 class="subsection">3.6.8 Duplicating File Descriptors</h4>
<p>The redirection operator
</p><div class="example">
<pre class="example">[<var>n</var>]&lt;&amp;<var>word</var>
</pre></div>
<p>is used to duplicate input file descriptors.
If <var>word</var>
expands to one or more digits, the file descriptor denoted by <var>n</var>
is made to be a copy of that file descriptor.
If the digits in <var>word</var> do not specify a file descriptor open for
input, a redirection error occurs.
If <var>word</var>
evaluates to &lsquo;<samp>-</samp>&rsquo;, file descriptor <var>n</var> is closed.  If
<var>n</var> is not specified, the standard input (file descriptor 0) is used.
</p>
<p>The operator
</p><div class="example">
<pre class="example">[<var>n</var>]&gt;&amp;<var>word</var>
</pre></div>
<p>is used similarly to duplicate output file descriptors.  If
<var>n</var> is not specified, the standard output (file descriptor 1) is used.
If the digits in <var>word</var> do not specify a file descriptor open for
output, a redirection error occurs.
As a special case, if <var>n</var> is omitted, and <var>word</var> does not
expand to one or more digits, the standard output and standard
error are redirected as described previously.
</p>
<a name="Moving-File-Descriptors"></a>
<h4 class="subsection">3.6.9 Moving File Descriptors</h4>
<p>The redirection operator
</p><div class="example">
<pre class="example">[<var>n</var>]&lt;&amp;<var>digit</var>-
</pre></div>
<p>moves the file descriptor <var>digit</var> to file descriptor <var>n</var>,
or the standard input (file descriptor 0) if <var>n</var> is not specified.
<var>digit</var> is closed after being duplicated to <var>n</var>.
</p>
<p>Similarly, the redirection operator
</p><div class="example">
<pre class="example">[<var>n</var>]&gt;&amp;<var>digit</var>-
</pre></div>
<p>moves the file descriptor <var>digit</var> to file descriptor <var>n</var>,
or the standard output (file descriptor 1) if <var>n</var> is not specified.
</p>
<a name="Opening-File-Descriptors-for-Reading-and-Writing"></a>
<h4 class="subsection">3.6.10 Opening File Descriptors for Reading and Writing</h4>
<p>The redirection operator
</p><div class="example">
<pre class="example">[<var>n</var>]&lt;&gt;<var>word</var>
</pre></div>
<p>causes the file whose name is the expansion of <var>word</var>
to be opened for both reading and writing on file descriptor
<var>n</var>, or on file descriptor 0 if <var>n</var>
is not specified.  If the file does not exist, it is created.
</p>
<hr>
<div class="header">
<p>
Next: <a href="Executing-Commands.html#Executing-Commands" accesskey="n" rel="next">Executing Commands</a>, Previous: <a href="Shell-Expansions.html#Shell-Expansions" accesskey="p" rel="previous">Shell Expansions</a>, Up: <a href="Basic-Shell-Features.html#Basic-Shell-Features" accesskey="u" rel="up">Basic Shell Features</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
