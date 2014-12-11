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
<title>Bash Reference Manual: Conditional Init Constructs</title>

<meta name="description" content="Bash Reference Manual: Conditional Init Constructs">
<meta name="keywords" content="Bash Reference Manual: Conditional Init Constructs">
<meta name="resource-type" content="document">
<meta name="distribution" content="global">
<meta name="Generator" content="texi2any">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<link href="index.html#Top" rel="start" title="Top">
<link href="Indexes.html#Indexes" rel="index" title="Indexes">
<link href="index.html#SEC_Contents" rel="contents" title="Table of Contents">
<link href="Readline-Init-File.html#Readline-Init-File" rel="up" title="Readline Init File">
<link href="Sample-Init-File.html#Sample-Init-File" rel="next" title="Sample Init File">
<link href="Readline-Init-File-Syntax.html#Readline-Init-File-Syntax" rel="previous" title="Readline Init File Syntax">
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
<a name="Conditional-Init-Constructs"></a>
<div class="header">
<p>
Next: <a href="Sample-Init-File.html#Sample-Init-File" accesskey="n" rel="next">Sample Init File</a>, Previous: <a href="Readline-Init-File-Syntax.html#Readline-Init-File-Syntax" accesskey="p" rel="previous">Readline Init File Syntax</a>, Up: <a href="Readline-Init-File.html#Readline-Init-File" accesskey="u" rel="up">Readline Init File</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>
<hr>
<a name="Conditional-Init-Constructs-1"></a>
<h4 class="subsection">8.3.2 Conditional Init Constructs</h4>

<p>Readline implements a facility similar in spirit to the conditional
compilation features of the C preprocessor which allows key
bindings and variable settings to be performed as the result
of tests.  There are four parser directives used.
</p>
<dl compact="compact">
<dt><code>$if</code></dt>
<dd><p>The <code>$if</code> construct allows bindings to be made based on the
editing mode, the terminal being used, or the application using
Readline.  The text of the test extends to the end of the line;
no characters are required to isolate it.
</p>
<dl compact="compact">
<dt><code>mode</code></dt>
<dd><p>The <code>mode=</code> form of the <code>$if</code> directive is used to test
whether Readline is in <code>emacs</code> or <code>vi</code> mode.
This may be used in conjunction
with the &lsquo;<samp>set keymap</samp>&rsquo; command, for instance, to set bindings in
the <code>emacs-standard</code> and <code>emacs-ctlx</code> keymaps only if
Readline is starting out in <code>emacs</code> mode.
</p>
</dd>
<dt><code>term</code></dt>
<dd><p>The <code>term=</code> form may be used to include terminal-specific
key bindings, perhaps to bind the key sequences output by the
terminal&rsquo;s function keys.  The word on the right side of the
&lsquo;<samp>=</samp>&rsquo; is tested against both the full name of the terminal and
the portion of the terminal name before the first &lsquo;<samp>-</samp>&rsquo;.  This
allows <code>sun</code> to match both <code>sun</code> and <code>sun-cmd</code>,
for instance.
</p>
</dd>
<dt><code>application</code></dt>
<dd><p>The <var>application</var> construct is used to include
application-specific settings.  Each program using the Readline
library sets the <var>application name</var>, and you can test for
a particular value. 
This could be used to bind key sequences to functions useful for
a specific program.  For instance, the following command adds a
key sequence that quotes the current or previous word in Bash:
</p><div class="example">
<pre class="example">$if Bash
# Quote the current or previous word
&quot;\C-xq&quot;: &quot;\eb\&quot;\ef\&quot;&quot;
$endif
</pre></div>
</dd>
</dl>

</dd>
<dt><code>$endif</code></dt>
<dd><p>This command, as seen in the previous example, terminates an
<code>$if</code> command.
</p>
</dd>
<dt><code>$else</code></dt>
<dd><p>Commands in this branch of the <code>$if</code> directive are executed if
the test fails.
</p>
</dd>
<dt><code>$include</code></dt>
<dd><p>This directive takes a single filename as an argument and reads commands
and bindings from that file.
For example, the following directive reads from <samp>/etc/inputrc</samp>:
</p><div class="example">
<pre class="example">$include /etc/inputrc
</pre></div>
</dd>
</dl>

<hr>
<div class="header">
<p>
Next: <a href="Sample-Init-File.html#Sample-Init-File" accesskey="n" rel="next">Sample Init File</a>, Previous: <a href="Readline-Init-File-Syntax.html#Readline-Init-File-Syntax" accesskey="p" rel="previous">Readline Init File Syntax</a>, Up: <a href="Readline-Init-File.html#Readline-Init-File" accesskey="u" rel="up">Readline Init File</a> &nbsp; [<a href="index.html#SEC_Contents" title="Table of contents" rel="contents">Contents</a>][<a href="Indexes.html#Indexes" title="Index" rel="index">Index</a>]</p>
</div>



</body>
</html>
