---
layout: post
title: Jekyll 中输出转义的字符
description: 使用 github 做静态网站，写文章的时候避免不了要显示大括号这个符号，但是大括号是 jekyll 的转义字符，所以我们需要想办法输出这个符号了。
keywords: github, Jekyll, 字符, 转义, 插件, plugin, markdown
tags: [github, Jekyll, 字符, 转义, 插件, plugin, markdown, 网站]
categories: [前端技术]
---

## 安装插件

第一步我们需要安装一个插件。

实际上就是在 _plugin 下新建一个名字为 raw_tag.rb 的文件。

``` ruby
 module Jekyll
   class RawTag < Liquid::Block
     def parse(tokens)
       @nodelist ||= []
       @nodelist.clear
       while token = tokens.shift
         if token =~ FullToken
           if block_delimiter == $1
             end_tag
             return
           end
         end
         @nodelist << token if not token.empty?
       end
     end
   end
 end
 Liquid::Template.register_tag('raw', Jekyll::RawTag)
````

然后就可以把需要转义的文本放到 {% raw %} { % raw % } { % endraw % }  {% endraw %} 里面了。

比如

{% raw %}
    { % raw % }
        /(\d{1,3}\.){3}\d{1,3}/.test("127.0.0.1")
    { % endraw % }
{% endraw %}


## 开始转义

一般的文本直接放到 {% raw %} { % raw % } { % endraw % }  {% endraw %} 即可转义。

但是对于代码高亮文件，直接使用这个会出现问题。

有人说使用 highlight 来解决这个问题，但是使用这个颇为麻烦。

{% raw %}
    {% highlight text %} 
        { % raw % } something { % endraw % }
     {% endhighlight %} 
{% endraw %}


最简单的方法就是使用缩进代替 highlight 即可。

因为 markdown 中代码前留4个空格就代表高亮代码了。

## 参考资料

1. [codeif][]
2. [farseer][]


[codeif]: http://www.codeif.com/post/1513/
[farseer]: http://www.farseer.cn/jekyll/2013/07/19/about-jekyll/
