---
layout : post 
description : 最近wordpress站点打开缓慢，抓包后发现是google fonts的缘故，因此需要删掉那个东西。 
date : 2014-07-13
title : 删除 wordpress 中的 googleapis 字体 
keywords: googleapis, 字体, wordpress, 缓慢
tags: [googleapis,字体,wordpress,缓慢,网站]
categories: [前端技术]
---


最近 google 完全被墙了，　然后我的　wordpress 站点打开缓慢，　开了代理就不存在这种现象。

于是猜测某个外部引用的资源加载缓慢，　抓包后发现是　googleapi fonts　的缘故。

在天朝还是把这个字体保存在本地或者不用这个字体吧。


## 引用位置

要删除或修改这个　googleapi fonts, 就需要找到引用它的位置了。

去主题的　header.php　里找了找，发现没有。

后来想想肯定没有了，　这个主题是 [自己编写][make-yourself-wordpress-themes] 的，自己肯定不会使用别人的资源了，多么不可靠呀。

那只有在 wordpress 的自带文件里了。

其实也容易想到，我是在登陆页面遇到这个加载缓慢问题的，那个页面我的主题里没有做，所以只有是系统自己的了。


那位置到底在哪呢？

这个简单，查找一下不就行了。

```shell
grep -r "fonts.googleapis" *
```

显示如下

```text
tiankonguse@tiankonguse:~/public_html/blog$ grep -r "fonts.googleapis" *
wp-content/themes/twentythirteen/functions.php:		$fonts_url = add_query_arg( $query_args, "//fonts.googleapis.com/css" );
wp-content/themes/twentytwelve/functions.php:		$font_url = add_query_arg( $query_args, "$protocol://fonts.googleapis.com/css" );
wp-content/themes/twentyfourteen/functions.php:		$font_url = add_query_arg( 'family', urlencode( 'Lato:300,400,700,900,300italic,400italic,700italic' ), "//fonts.googleapis.com/css" );
wp-includes/script-loader.php:		$open_sans_font_url = "//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=$subsets";
wp-includes/js/tinymce/plugins/compat3x/css/dialog.css:@import url(//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=latin-ext,latin);
```

不用管与themes有关的，那剩下的就是

```text
wp-includes/script-loader.php:		$open_sans_font_url = "//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=$subsets";
wp-includes/js/tinymce/plugins/compat3x/css/dialog.css:@import url(//fonts.googleapis.com/css?family=Open+Sans:300italic,400italic,600italic,300,400,600&subset=latin-ext,latin);
```


可以看到，一个是php文件，一个是css文件。

## 解决方案

我们可以直接把那个php文件里的链接删掉，但是这样做并不好，因为如果wordpress升级了可能又遇到这个问题了。

那我们能不能在主题里修复这个问题呢？

经过　google 发现还真的可以。

在我们的主题里的　functions.php 里添加这个一个代码即可


```php
class Disable_Google_Fonts {
        public function __construct() {
                add_filter( 'gettext_with_context', array( $this, 'disable_open_sans'             ), 888, 4 );
        }
        public function disable_open_sans( $translations, $text, $context, $domain ) {
                if ( 'Open Sans font: on or off' == $context && 'on' == $text ) {
                        $translations = 'off';
                }
                return $translations;
        }
}
$disable_google_fonts = new Disable_Google_Fonts;
```

然后发现速度快了一些。

## 参考资料

* [删除wordpress内置的googleapis在线字体](http://blog.motea.org/29.html)

(完)

[make-yourself-wordpress-themes]: http://github.tiankonguse.com/blog/2014/07/10/make-yourself-wordpress-themes/
