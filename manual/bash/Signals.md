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
<title>Bash Reference Manual: Signals</title>

<meta name="description" content="Bash Reference Manual: Signals">
<meta name="keywords" content="Bash Reference Manual: Signals">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Executing-Commands.html#Executing-Commands" rel="up" title="Executing Commands">
<link href="Shell-Scripts.html#Shell-Scripts" rel="next" title="Shell Scripts">
<link href="Exit-Status.html#Exit-Status" rel="previous" title="Exit Status">
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
<a name="Signals"></a>
<div class="header">
<p>
Previous: <a href="Exit-Status.html#Exit-Status" accesskey="p" rel="previous">Exit Status</a>, Up: <a href="Executing-Commands.html#Executing-Commands" accesskey="u" rel="up">Executing Commands</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="Signals-1"></a>
<h4 class="subsection">3.7.6 Signals</h4>
<a name="index-signal-handling"></a>

<p>When Bash is interactive, in the absence of any traps, it ignores
<code>SIGTERM</code> (so that &lsquo;<samp>kill 0</samp>&rsquo; does not kill an interactive shell),
and <code>SIGINT</code>
is caught and handled (so that the <code>wait</code> builtin is interruptible).
When Bash receives a <code>SIGINT</code>, it breaks out of any executing loops.
In all cases, Bash ignores <code>SIGQUIT</code>.
If job control is in effect (see <a href="Job-Control.html#Job-Control">Job Control</a>), Bash
ignores <code>SIGTTIN</code>, <code>SIGTTOU</code>, and <code>SIGTSTP</code>.
</p>
<p>Non-builtin commands started by Bash have signal handlers set to the
values inherited by the shell from its parent.
When job control is not in effect, asynchronous commands
ignore <code>SIGINT</code> and <code>SIGQUIT</code> in addition to these inherited
handlers.
Commands run as a result of
command substitution ignore the keyboard-generated job control signals
<code>SIGTTIN</code>, <code>SIGTTOU</code>, and <code>SIGTSTP</code>.
</p>
<p>The shell exits by default upon receipt of a <code>SIGHUP</code>.
Before exiting, an interactive shell resends the <code>SIGHUP</code> to
all jobs, running or stopped.
Stopped jobs are sent <code>SIGCONT</code> to ensure that they receive
the <code>SIGHUP</code>.
To prevent the shell from sending the <code>SIGHUP</code> signal to a
particular job, it should be removed
from the jobs table with the <code>disown</code>
builtin (see <a href="Job-Control-Builtins.html#Job-Control-Builtins">Job Control Builtins</a>) or marked
to not receive <code>SIGHUP</code> using <code>disown -h</code>.
</p>
<p>If the  <code>huponexit</code> shell option has been set with <code>shopt</code>
(see <a href="The-Shopt-Builtin.html#The-Shopt-Builtin">The Shopt Builtin</a>), Bash sends a <code>SIGHUP</code> to all jobs when
an interactive login shell exits.
</p>
<p>If Bash is waiting for a command to complete and receives a signal
for which a trap has been set, the trap will not be executed until
the command completes. 
When Bash is waiting for an asynchronous
command via the <code>wait</code> builtin, the reception of a signal for
which a trap has been set will cause the <code>wait</code> builtin to return
immediately with an exit status greater than 128, immediately after
which the trap is executed.
</p>
<hr>
<div class="header">
<p>
Previous: <a href="Exit-Status.html#Exit-Status" accesskey="p" rel="previous">Exit Status</a>, Up: <a href="Executing-Commands.html#Executing-Commands" accesskey="u" rel="up">Executing Commands</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
