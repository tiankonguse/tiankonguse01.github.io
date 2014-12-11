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
<title>Bash Reference Manual: Interactive Shell Behavior</title>

<meta name="description" content="Bash Reference Manual: Interactive Shell Behavior">
<meta name="keywords" content="Bash Reference Manual: Interactive Shell Behavior">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Interactive-Shells.html#Interactive-Shells" rel="up" title="Interactive Shells">
<link href="Bash-Conditional-Expressions.html#Bash-Conditional-Expressions" rel="next" title="Bash Conditional Expressions">
<link href="Is-this-Shell-Interactive_003f.html#Is-this-Shell-Interactive_003f" rel="previous" title="Is this Shell Interactive?">
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
<a name="Interactive-Shell-Behavior"></a>
<div class="header">
<p>
Previous: <a href="Is-this-Shell-Interactive_003f.html#Is-this-Shell-Interactive_003f" accesskey="p" rel="previous">Is this Shell Interactive?</a>, Up: <a href="Interactive-Shells.html#Interactive-Shells" accesskey="u" rel="up">Interactive Shells</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="Interactive-Shell-Behavior-1"></a>
<h4 class="subsection">6.3.3 Interactive Shell Behavior</h4>

<p>When the shell is running interactively, it changes its behavior in
several ways.
</p>
<ol>
<li> Startup files are read and executed as described in <a href="Bash-Startup-Files.html#Bash-Startup-Files">Bash Startup Files</a>.

</li><li> Job Control (see <a href="Job-Control.html#Job-Control">Job Control</a>) is enabled by default.  When job
control is in effect, Bash ignores the keyboard-generated job control
signals <code>SIGTTIN</code>, <code>SIGTTOU</code>, and <code>SIGTSTP</code>.

</li><li> Bash expands and displays <code>PS1</code> before reading the first line
of a command, and expands and displays <code>PS2</code> before reading the
second and subsequent lines of a multi-line command.

</li><li> Bash executes the value of the <code>PROMPT_COMMAND</code> variable as a command
before printing the primary prompt, <code>$PS1</code>
(see <a href="Bash-Variables.html#Bash-Variables">Bash Variables</a>).

</li><li> Readline (see <a href="Command-Line-Editing.html#Command-Line-Editing">Command Line Editing</a>) is used to read commands from
the user&rsquo;s terminal.

</li><li> Bash inspects the value of the <code>ignoreeof</code> option to <code>set -o</code>
instead of exiting immediately when it receives an <code>EOF</code> on its
standard input when reading a command (see <a href="The-Set-Builtin.html#The-Set-Builtin">The Set Builtin</a>).

</li><li> Command history (see <a href="Bash-History-Facilities.html#Bash-History-Facilities">Bash History Facilities</a>)
and history expansion (see <a href="History-Interaction.html#History-Interaction">History Interaction</a>)
are enabled by default.
Bash will save the command history to the file named by <code>$HISTFILE</code>
when an interactive shell exits.

</li><li> Alias expansion (see <a href="Aliases.html#Aliases">Aliases</a>) is performed by default.

</li><li> In the absence of any traps, Bash ignores <code>SIGTERM</code>
(see <a href="Signals.html#Signals">Signals</a>).

</li><li> In the absence of any traps, <code>SIGINT</code> is caught and handled
((see <a href="Signals.html#Signals">Signals</a>).
<code>SIGINT</code> will interrupt some shell builtins.

</li><li> An interactive login shell sends a <code>SIGHUP</code> to all jobs on exit
if the <code>huponexit</code> shell option has been enabled (see <a href="Signals.html#Signals">Signals</a>).

</li><li> The <samp>-n</samp> invocation option is ignored, and &lsquo;<samp>set -n</samp>&rsquo; has
no effect (see <a href="The-Set-Builtin.html#The-Set-Builtin">The Set Builtin</a>).

</li><li> Bash will check for mail periodically, depending on the values of the
<code>MAIL</code>, <code>MAILPATH</code>, and <code>MAILCHECK</code> shell variables
(see <a href="Bash-Variables.html#Bash-Variables">Bash Variables</a>).

</li><li> Expansion errors due to references to unbound shell variables after
&lsquo;<samp>set -u</samp>&rsquo; has been enabled will not cause the shell to exit
(see <a href="The-Set-Builtin.html#The-Set-Builtin">The Set Builtin</a>).

</li><li> The shell will not exit on expansion errors caused by <var>var</var> being unset
or null in <code>${<var>var</var>:?<var>word</var>}</code> expansions
(see <a href="Shell-Parameter-Expansion.html#Shell-Parameter-Expansion">Shell Parameter Expansion</a>).

</li><li> Redirection errors encountered by shell builtins will not cause the
shell to exit.

</li><li> When running in <small>POSIX</small> mode, a special builtin returning an error
status will not cause the shell to exit (see <a href="Bash-POSIX-Mode.html#Bash-POSIX-Mode">Bash POSIX Mode</a>).

</li><li> A failed <code>exec</code> will not cause the shell to exit
(see <a href="Bourne-Shell-Builtins.html#Bourne-Shell-Builtins">Bourne Shell Builtins</a>).

</li><li> Parser syntax errors will not cause the shell to exit.

</li><li> Simple spelling correction for directory arguments to the <code>cd</code>
builtin is enabled by default (see the description of the <code>cdspell</code>
option to the <code>shopt</code> builtin in <a href="The-Shopt-Builtin.html#The-Shopt-Builtin">The Shopt Builtin</a>).

</li><li> The shell will check the value of the <code>TMOUT</code> variable and exit
if a command is not read within the specified number of seconds after
printing <code>$PS1</code> (see <a href="Bash-Variables.html#Bash-Variables">Bash Variables</a>).

</li></ol>

<hr>
<div class="header">
<p>
Previous: <a href="Is-this-Shell-Interactive_003f.html#Is-this-Shell-Interactive_003f" accesskey="p" rel="previous">Is this Shell Interactive?</a>, Up: <a href="Interactive-Shells.html#Interactive-Shells" accesskey="u" rel="up">Interactive Shells</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
