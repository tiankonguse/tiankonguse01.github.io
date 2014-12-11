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
<title>Bash Reference Manual: Command Execution Environment</title>

<meta name="description" content="Bash Reference Manual: Command Execution Environment">
<meta name="keywords" content="Bash Reference Manual: Command Execution Environment">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Executing-Commands.html#Executing-Commands" rel="up" title="Executing Commands">
<link href="Environment.html#Environment" rel="next" title="Environment">
<link href="Command-Search-and-Execution.html#Command-Search-and-Execution" rel="previous" title="Command Search and Execution">
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
<a name="Command-Execution-Environment"></a>
<div class="header">
<p>
Next: <a href="Environment.html#Environment" accesskey="n" rel="next">Environment</a>, Previous: <a href="Command-Search-and-Execution.html#Command-Search-and-Execution" accesskey="p" rel="previous">Command Search and Execution</a>, Up: <a href="Executing-Commands.html#Executing-Commands" accesskey="u" rel="up">Executing Commands</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="Command-Execution-Environment-1"></a>
<h4 class="subsection">3.7.3 Command Execution Environment</h4>
<a name="index-execution-environment"></a>

<p>The shell has an <var>execution environment</var>, which consists of the
following:
</p>
<ul>
<li> open files inherited by the shell at invocation, as modified by
redirections supplied to the <code>exec</code> builtin

</li><li> the current working directory as set by <code>cd</code>, <code>pushd</code>, or
<code>popd</code>, or inherited by the shell at invocation

</li><li> the file creation mode mask as set by <code>umask</code> or inherited from
the shell&rsquo;s parent

</li><li> current traps set by <code>trap</code>

</li><li> shell parameters that are set by variable assignment or with <code>set</code>
or inherited from the shell&rsquo;s parent in the environment

</li><li> shell functions defined during execution or inherited from the shell&rsquo;s
parent in the environment

</li><li> options enabled at invocation (either by default or with command-line
arguments) or by <code>set</code>

</li><li> options enabled by <code>shopt</code> (see <a href="The-Shopt-Builtin.html#The-Shopt-Builtin">The Shopt Builtin</a>)

</li><li> shell aliases defined with <code>alias</code> (see <a href="Aliases.html#Aliases">Aliases</a>)

</li><li> various process <small>ID</small>s, including those of background jobs
(see <a href="Lists.html#Lists">Lists</a>), the value of <code>$$</code>, and the value of
<code>$PPID</code>

</li></ul>

<p>When a simple command other than a builtin or shell function
is to be executed, it
is invoked in a separate execution environment that consists of
the following.  Unless otherwise noted, the values are inherited
from the shell.
</p>
<ul>
<li> the shell&rsquo;s open files, plus any modifications and additions specified
by redirections to the command

</li><li> the current working directory

</li><li> the file creation mode mask

</li><li> shell variables and functions marked for export, along with variables
exported for the command, passed in the environment (see <a href="Environment.html#Environment">Environment</a>)

</li><li> traps caught by the shell are reset to the values inherited from the
shell&rsquo;s parent, and traps ignored by the shell are ignored

</li></ul>

<p>A command invoked in this separate environment cannot affect the
shell&rsquo;s execution environment. 
</p>
<p>Command substitution, commands grouped with parentheses,
and asynchronous commands are invoked in a
subshell environment that is a duplicate of the shell environment,
except that traps caught by the shell are reset to the values
that the shell inherited from its parent at invocation.  Builtin
commands that are invoked as part of a pipeline are also executed
in a subshell environment.  Changes made to the subshell environment
cannot affect the shell&rsquo;s execution environment.
</p>
<p>Subshells spawned to execute command substitutions inherit the value of
the <samp>-e</samp> option from the parent shell.  When not in <small>POSIX</small> mode,
Bash clears the <samp>-e</samp> option in such subshells.
</p>
<p>If a command is followed by a &lsquo;<samp>&amp;</samp>&rsquo; and job control is not active, the
default standard input for the command is the empty file <samp>/dev/null</samp>.
Otherwise, the invoked command inherits the file descriptors of the calling
shell as modified by redirections.
</p>
<hr>
<div class="header">
<p>
Next: <a href="Environment.html#Environment" accesskey="n" rel="next">Environment</a>, Previous: <a href="Command-Search-and-Execution.html#Command-Search-and-Execution" accesskey="p" rel="previous">Command Search and Execution</a>, Up: <a href="Executing-Commands.html#Executing-Commands" accesskey="u" rel="up">Executing Commands</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
