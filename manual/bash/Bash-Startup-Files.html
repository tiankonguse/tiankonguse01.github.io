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
<title>Bash Reference Manual: Bash Startup Files</title>

<meta name="description" content="Bash Reference Manual: Bash Startup Files">
<meta name="keywords" content="Bash Reference Manual: Bash Startup Files">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Bash-Features.html#Bash-Features" rel="up" title="Bash Features">
<link href="Interactive-Shells.html#Interactive-Shells" rel="next" title="Interactive Shells">
<link href="Invoking-Bash.html#Invoking-Bash" rel="previous" title="Invoking Bash">
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
<a name="Bash-Startup-Files"></a>
<div class="header">
<p>
Next: <a href="Interactive-Shells.html#Interactive-Shells" accesskey="n" rel="next">Interactive Shells</a>, Previous: <a href="Invoking-Bash.html#Invoking-Bash" accesskey="p" rel="previous">Invoking Bash</a>, Up: <a href="Bash-Features.html#Bash-Features" accesskey="u" rel="up">Bash Features</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="Bash-Startup-Files-1"></a>
<h3 class="section">6.2 Bash Startup Files</h3>
<a name="index-startup-files"></a>

<p>This section describes how Bash executes its startup files.
If any of the files exist but cannot be read, Bash reports an error.
Tildes are expanded in file names as described above under
Tilde Expansion (see <a href="Tilde-Expansion.html#Tilde-Expansion">Tilde Expansion</a>).
</p>
<p>Interactive shells are described in <a href="Interactive-Shells.html#Interactive-Shells">Interactive Shells</a>.
</p>
<a name="Invoked-as-an-interactive-login-shell_002c-or-with-_002d_002dlogin"></a>
<h4 class="subsubheading">Invoked as an interactive login shell, or with <samp>--login</samp></h4>

<p>When Bash is invoked as an interactive login shell, or as a
non-interactive shell with the <samp>--login</samp> option, it first reads and
executes commands from the file <samp>/etc/profile</samp>, if that file exists.
After reading that file, it looks for <samp>~/.bash_profile</samp>,
<samp>~/.bash_login</samp>, and <samp>~/.profile</samp>, in that order, and reads
and executes commands from the first one that exists and is readable.
The <samp>--noprofile</samp> option may be used when the shell is started to
inhibit this behavior.
</p>
<p>When a login shell exits, Bash reads and executes commands from
the file <samp>~/.bash_logout</samp>, if it exists.
</p>
<a name="Invoked-as-an-interactive-non_002dlogin-shell"></a>
<h4 class="subsubheading">Invoked as an interactive non-login shell</h4>

<p>When an interactive shell that is not a login shell is started, Bash
reads and executes commands from <samp>~/.bashrc</samp>, if that file exists.
This may be inhibited by using the <samp>--norc</samp> option.
The <samp>--rcfile <var>file</var></samp> option will force Bash to read and
execute commands from <var>file</var> instead of <samp>~/.bashrc</samp>.
</p>
<p>So, typically, your <samp>~/.bash_profile</samp> contains the line
</p><div class="example">
<pre class="example"><code>if [ -f ~/.bashrc ]; then . ~/.bashrc; fi</code>
</pre></div>
<p>after (or before) any login-specific initializations.
</p>
<a name="Invoked-non_002dinteractively"></a>
<h4 class="subsubheading">Invoked non-interactively</h4>

<p>When Bash is started non-interactively, to run a shell script,
for example, it looks for the variable <code>BASH_ENV</code> in the environment,
expands its value if it appears there, and uses the expanded value as
the name of a file to read and execute.  Bash behaves as if the
following command were executed:
</p><div class="example">
<pre class="example"><code>if [ -n &quot;$BASH_ENV&quot; ]; then . &quot;$BASH_ENV&quot;; fi</code>
</pre></div>
<p>but the value of the <code>PATH</code> variable is not used to search for the
file name.
</p>
<p>As noted above, if a non-interactive shell is invoked with the
<samp>--login</samp> option, Bash attempts to read and execute commands from the
login shell startup files. 
</p>
<a name="Invoked-with-name-sh"></a>
<h4 class="subsubheading">Invoked with name <code>sh</code></h4>

<p>If Bash is invoked with the name <code>sh</code>, it tries to mimic the
startup behavior of historical versions of <code>sh</code> as closely as
possible, while conforming to the <small>POSIX</small> standard as well.
</p>
<p>When invoked as an interactive login shell, or as a non-interactive
shell with the <samp>--login</samp> option, it first attempts to read
and execute commands from <samp>/etc/profile</samp> and <samp>~/.profile</samp>, in
that order.
The <samp>--noprofile</samp> option may be used to inhibit this behavior.
When invoked as an interactive shell with the name <code>sh</code>, Bash
looks for the variable <code>ENV</code>, expands its value if it is defined,
and uses the expanded value as the name of a file to read and execute.
Since a shell invoked as <code>sh</code> does not attempt to read and execute
commands from any other startup files, the <samp>--rcfile</samp> option has
no effect.
A non-interactive shell invoked with the name <code>sh</code> does not attempt
to read any other startup files.
</p>
<p>When invoked as <code>sh</code>, Bash enters <small>POSIX</small> mode after
the startup files are read.
</p>
<a name="Invoked-in-POSIX-mode"></a>
<h4 class="subsubheading">Invoked in <small>POSIX</small> mode</h4>

<p>When Bash is started in <small>POSIX</small> mode, as with the
<samp>--posix</samp> command line option, it follows the <small>POSIX</small> standard
for startup files.
In this mode, interactive shells expand the <code>ENV</code> variable
and commands are read and executed from the file whose name is the
expanded value.
No other startup files are read.
</p>
<a name="Invoked-by-remote-shell-daemon"></a>
<h4 class="subsubheading">Invoked by remote shell daemon</h4>

<p>Bash attempts to determine when it is being run with its standard input
connected to a network connection, as when executed by the remote shell
daemon, usually <code>rshd</code>, or the secure shell daemon <code>sshd</code>.
If Bash determines it is being run in
this fashion, it reads and executes commands from <samp>~/.bashrc</samp>, if that
file exists and is readable.
It will not do this if invoked as <code>sh</code>.
The <samp>--norc</samp> option may be used to inhibit this behavior, and the
<samp>--rcfile</samp> option may be used to force another file to be read, but
<code>rshd</code> does not generally invoke the shell with those options or
allow them to be specified.
</p>
<a name="Invoked-with-unequal-effective-and-real-UID_002fGIDs"></a>
<h4 class="subsubheading">Invoked with unequal effective and real <small>UID/GID</small>s</h4>

<p>If Bash is started with the effective user (group) id not equal to the
real user (group) id, and the <code>-p</code> option is not supplied, no startup
files are read, shell functions are not inherited from the environment,
the <code>SHELLOPTS</code>, <code>BASHOPTS</code>, <code>CDPATH</code>, and <code>GLOBIGNORE</code>
variables, if they appear in the environment, are ignored, and the effective
user id is set to the real user id.
If the <code>-p</code> option is supplied at invocation, the startup behavior is
the same, but the effective user id is not reset.
</p>
<hr>
<div class="header">
<p>
Next: <a href="Interactive-Shells.html#Interactive-Shells" accesskey="n" rel="next">Interactive Shells</a>, Previous: <a href="Invoking-Bash.html#Invoking-Bash" accesskey="p" rel="previous">Invoking Bash</a>, Up: <a href="Bash-Features.html#Bash-Features" accesskey="u" rel="up">Bash Features</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
