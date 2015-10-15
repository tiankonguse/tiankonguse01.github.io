---
layout:     post
title:      php 源码安装 GMP
description: 之前源码安装了php, 后来发现没有 GMP, 于是今天又安装了 GMP.
tags: php GMP 源码 安装
keywords: php, GMP, 源码, 安装, 动态, 模块, 扩展, phpize, 下载
updateData: 13:15 2014/11/20
categories: [后台技术]
---

## 源码下载

之前写过一篇文章里面附带的有[源码安装 php 的教程][content-h3-php]。  

所以这里只需要下载 GMP 源码即可。  

对于下载源码这件事，还是去官网([gmplib][])比较好。  

现在 GMP 的最新版本是 [GMP 6.0.0][gmp6-0].  
然后在[下载页面][gmplib-2014-March-000042]有三个压缩格式的文件。  
我选择[gmp-6.0.0a.tar.xz][gmplib-6-0-tar-xz].  
因为我的压缩工具只能解压缩这个文件。  


## 解压缩 tar.xz 文件

对于 tar.xz 这中压缩文件我之前没有见过，不过还是有对应的压缩命令的。  
我是在 [CSDN][silvervi-6325698] 上找到的。  


```
# -k 保持压缩文件
xz -k ***.tar.xz
tar -xzvf  ***.tar
```

## 安装 GMP

安装命令也是在[官网安装教程页][Installing-GMP]看到的。  

简单说就是   

```
./configure
make
make install
```

## php 附加 gmp 源码编译

在 [php 官网的 gmp 安装教程页][php-gmp-installation] 可以看到编译 php 的时候加上 `--with-gmp` 参数即可。  

```
./configure --enable-shmop
make
make install
```

安装完之后重启一下服务器即可。  

## 动态 添加 php 模块 扩展

编译 php 时指定需要用的模块扩展肯定可以成功，但是大多数时候我们并不想再次编译php源码。  
而且我们也不记得当时编译的时候的参数了。  
即使记得那些参数，编译一次也要很长时间，我们也不想等那个时间。  
于是动态添加模块扩展这个需求必须要解决。  


然后我在 php 的官网上随便找了一个扩展， 比如 [pecl][php-pecl] .  
在目录中的最后一行可以看到 [Compiling PECL extensions statically into PHP][install-pecl-static].  
大概意思就是将扩展编译到php中去。  

然后在第四和第五行可以看到 [Compiling shared PECL extensions with the pecl command][install-pecl-pear] 和 [Compiling shared PECL extensions with phpize][install-pecl-phpize].  
大概意思就是 php 有两种方法动态添加模块扩展，一种是使用 pecl 命令, 另一种是使用 phpize.   


接下来我们分别来看看。  

### pecl 命令 动态安装php模块扩展

在 [pecl][install-pecl-pear]页面有简单的说明。  

只需要下面一条命令，就会自己下载对应的模块源码，并自己安装到php中。  
但是我这既然选择了源码安装，肯定不是为了显摆自己多牛X, 而是环境本身没有网络。  
于是这个方法行不通了。  

```
pecl install extname
```

### phpize 动态安装php模块扩展

幸好，pecl 行不通， [phpize][install-pecl-phpize] 可以离线安装需要的扩展。  
前面我们下载了源码，在编译安装前先执行 phpize ，然后正常安装就可以使用扩展了。  

```
cd extname
phpize
./configure
make
make install
```

当然，安装完后需要配置 php.ini 文件，加入安装的模块。  




[install-pecl-phpize]: http://php.net/manual/en/install.pecl.phpize.php
[install-pecl-pear]: http://php.net/manual/en/install.pecl.pear.php
[install-pecl-static]: http://php.net/manual/en/install.pecl.static.php
[php-pecl]: http://php.net/manual/en/install.pecl.php
[php-gmp-installation]: http://php.net/manual/en/gmp.installation.php
[Installing-GMP]: https://gmplib.org/manual/Installing-GMP.html#Installing-GMP
[silvervi-6325698]: http://blog.csdn.net/silvervi/article/details/6325698
[gmplib-6-0-tar-xz]: https://gmplib.org/download/gmp/gmp-6.0.0a.tar.xz
[gmplib-2014-March-000042]: https://gmplib.org/list-archives/gmp-announce/2014-March/000042.html
[gmp6-0]: https://gmplib.org/gmp6.0.html
[gmplib]: https://gmplib.org/
[content-h3-php]: http://github.tiankonguse.com/blog/2014/10/30/sphinx-learn/#content-h3-php 源码安装