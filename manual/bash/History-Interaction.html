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
<title>Bash Reference Manual: History Interaction</title>

<meta name="description" content="Bash Reference Manual: History Interaction">
<meta name="keywords" content="Bash Reference Manual: History Interaction">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Using-History-Interactively.html#Using-History-Interactively" rel="up" title="Using History Interactively">
<link href="Event-Designators.html#Event-Designators" rel="next" title="Event Designators">
<link href="Bash-History-Builtins.html#Bash-History-Builtins" rel="previous" title="Bash History Builtins">
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
<a name="History-Interaction"></a>
<div class="header">
<p>
Previous: <a href="Bash-History-Builtins.html#Bash-History-Builtins" accesskey="p" rel="previous">Bash History Builtins</a>, Up: <a href="Using-History-Interactively.html#Using-History-Interactively" accesskey="u" rel="up">Using History Interactively</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="History-Expansion"></a>
<h3 class="section">9.3 History Expansion</h3>
<a name="index-history-expansion"></a>

<p>The History library provides a history expansion feature that is similar
to the history expansion provided by <code>csh</code>.  This section
describes the syntax used to manipulate the history information.
</p>
<p>History expansions introduce words from the history list into
the input stream, making it easy to repeat commands, insert the
arguments to a previous command into the current input line, or
fix errors in previous commands quickly.
</p>
<p>History expansion takes place in two parts.  The first is to determine
which line from the history list should be used during substitution.
The second is to select portions of that line for inclusion into the
current one.  The line selected from the history is called the
<em>event</em>, and the portions of that line that are acted upon are
called <em>words</em>.  Various <em>modifiers</em> are available to manipulate
the selected words.  The line is broken into words in the same fashion
that Bash does, so that several words
surrounded by quotes are considered one word.
History expansions are introduced by the appearance of the
history expansion character, which is &lsquo;<samp>!</samp>&rsquo; by default.
Only &lsquo;<samp>\</samp>&rsquo; and &lsquo;<samp>'</samp>&rsquo; may be used to escape the history expansion
character.
</p>
<p>Several shell options settable with the <code>shopt</code>
builtin (see <a href="Bash-Builtins.html#Bash-Builtins">Bash Builtins</a>) may be used to tailor
the behavior of history expansion.  If the
<code>histverify</code> shell option is enabled, and Readline
is being used, history substitutions are not immediately passed to
the shell parser.
Instead, the expanded line is reloaded into the Readline
editing buffer for further modification.
If Readline is being used, and the <code>histreedit</code>
shell option is enabled, a failed history expansion will be
reloaded into the Readline editing buffer for correction.
The <samp>-p</samp> option to the <code>history</code> builtin command
may be used to see what a history expansion will do before using it.
The <samp>-s</samp> option to the <code>history</code> builtin may be used to
add commands to the end of the history list without actually executing
them, so that they are available for subsequent recall.
This is most useful in conjunction with Readline.
</p>
<p>The shell allows control of the various characters used by the
history expansion mechanism with the <code>histchars</code> variable,
as explained above (see <a href="Bash-Variables.html#Bash-Variables">Bash Variables</a>).  The shell uses
the history comment character to mark history timestamps when
writing the history file.
</p>
<table class="menu" border="0" cellspacing="0">
<tr><td align="left" valign="top">&bull; <a href="Event-Designators.html#Event-Designators" accesskey="1">Event Designators</a>:</td><td>&nbsp;&nbsp;</td><td align="left" valign="top">How to specify which history line to use.
</td></tr>
<tr><td align="left" valign="top">&bull; <a href="Word-Designators.html#Word-Designators" accesskey="2">Word Designators</a>:</td><td>&nbsp;&nbsp;</td><td align="left" valign="top">Specifying which words are of interest.
</td></tr>
<tr><td align="left" valign="top">&bull; <a href="Modifiers.html#Modifiers" accesskey="3">Modifiers</a>:</td><td>&nbsp;&nbsp;</td><td align="left" valign="top">Modifying the results of substitution.
</td></tr>
</table>

<hr>
<div class="header">
<p>
Previous: <a href="Bash-History-Builtins.html#Bash-History-Builtins" accesskey="p" rel="previous">Bash History Builtins</a>, Up: <a href="Using-History-Interactively.html#Using-History-Interactively" accesskey="u" rel="up">Using History Interactively</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
