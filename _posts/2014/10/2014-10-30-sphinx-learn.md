---
layout:     post
title:      Sphinx 安装记录
description: 工作中需要使用 sphinx 来实现中文全文搜索，最后选择了 sphinx 这个工具，于是记录一下操作步骤。
keywords: sphinx, 全文索引, 搜索, coreseek, 源码安装
tags: sphinx 全文索引 搜索 coreseek 源码安装
categories: [软件研究]
---

![Sphinx logo][cover]

## 前言

如果你想支持中文全文检索的话，请参考 [coreseek 安装记录][coreseek-install-log]。  
如果你已经安装 sphinx 或者 coreseek, 只是想查找怎么配置和使用 sphinx 和 coreseek 的话，请参考 [coreeek 和 sphinx 的配置与使用][sphinx-use]


**下面的表纯属文章虚构，由于配置内容较多，部分省略，具体可以参考官方文档。**

想吐槽一句：编译安装真浪费时间， configure && make && make install 一个软件就需要几十分钟。我这安装四五个，几个小时就没了。



## 安装

安装前需要先去官网下载[源码][sphinxsearch-download].  
目前最新版本是 2.2.5-release, [点击下载][sphinxsearch-download-Source]即可。  

当然，如果你想直接在命令行下载，直接下载我这个版本也行，就是不知道会不会版本太久。

```
tiankonguse:~ $ cd /usr/local/src
tiankonguse:src $ su root -
tiankonguse:src # wget http://sphinxsearch.com/files/sphinx-2.2.5-release.tar.gz
```

然后解压缩，命令就不用说了吧

```
tiankonguse:src # tar zxvf filename.tar.gz
```
 
后来听说 sphinx 有两种安装方式  

1. 单独安装，查询时采用API调用。
2. 使用插件方式把sphinx编译成一个mysql插件并使用特定的sql语句进行检索。

这里我选择第一种方式，毕竟把 sphinx 和 mysql 耦合在一起的话， 将来将成为一个很大的坑。
 
> sphinx 查询出来的是 id, 然后会进行二次查询得到想要的数据。  

下面的命令都是在 root 权限下操作的。

```
tiankonguse:sphinx-2.2.5-release # ./configure –prefix=/usr/local/sphinx

tiankonguse:sphinx-2.2.5-release # make && make install
```

> --prefix 指向sphinx的安装路径  
> --with-mysql 指向mysql的安装路径  
> 不指定时按默认路径选择

安装完毕后查看一下 `/usr/local/sphinx` 下是否有 三个目录 bin etc var，如有，则安装无误！

```
tiankonguse:sphinx-2.2.5-release # cd /usr/local/sphinx/

tiankonguse:sphinx # ls
bin/  etc/  share/  var/
```

## 配置

### mysql 数据源

由于我使用的是 mysql, 所以需要为 sphinx 创建对应的db。

```
# server：127.0.0.1
# database : d_sphinx_testdb
# table: t_sphinx_article

CREATE SCHEMA IF NOT EXISTS `d_sphinx_testdb` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;

USE `d_sphinx_testdb` ;

CREATE TABLE `d_sphinx_testdb`.`t_sphinx_article` (
  `c_id` INT NOT NULL AUTO_INCREMENT,
  `c_title` VARCHAR(45) NOT NULL DEFAULT '',
  `c_content` VARCHAR(45) NOT NULL DEFAULT '',
  `c_comment_num` VARCHAR(45) NOT NULL DEFAULT 0,
  PRIMARY KEY (`c_id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

```

## sphinx 配置文件

首先需要找到需要配置的文件以及需要配置的内容。

我们需要配置的是 /usr/local/sphinx/sphinx.conf 文件里面的数据库的信息。 

```
tiankonguse:sphinx # cd etc

tiankonguse:etc # 

tiankonguse:etc # ls
example.sql  sphinx-min.conf.dist  sphinx.conf.dist

tiankonguse:etc #  cp sphinx.conf.dist sphinx.conf

tiankonguse:etc # ls
example.sql  sphinx-min.conf.dist  sphinx.conf  sphinx.conf.dist

tiankonguse:etc $ vi sphinx.conf
```

可以看到下面的内容设置数据源 source

```
#############################################################################
## data source definition
#############################################################################
 
source d_sphinx_testdb 
{
    # data source type. mandatory, no default value
    # known types are mysql, pgsql, mssql, xmlpipe, xmlpipe2, odbc
    type            = mysql  # 数据库类型
 
    # some straightforward parameters for SQL source types
    #数据库主机地址
    sql_host        = 127.0.0.1 
    
    #数据库用户名
    sql_user        = root      
    
    #数据库密码
    sql_pass        = pwd       
    
    #数据库名称
    sql_db          = d_sphinx_testdb  
    
    # 数据库采用的端口
    sql_port        = 3306  
    
    # pre-query, executed before the main fetch query
    # multi-value, optional, default is empty list of queries
    #执行sql前要设置的字符集 
    sql_query_pre   = SET NAMES UTF8 
    
    # main document fetch query mandatory, integer document ID field MUST be the first selected column
    # 全文检索要显示的内容，在这里尽可能不使用where或group by，将where与groupby的内容交给sphinx，由sphinx进行条件过滤与groupby效率会更高
    # select 出来的字段必须至少包括一个唯一主键(ARTICLESID)以及要全文检索的字段，你计划原本在where中要用到的字段也要select出来，这里不需要使用orderby
    sql_query = SELECT c_id,c_title,c_content,c_comment_num FROM t_sphinx_article

    #####以下是用来过滤或条件查询的属性############

    #sql_attr_ 开头的表示一些属性字段，你原计划要用在where,orderby,groupby中的字段要在这里定义
    
    # unsigned integer attribute declaration
    sql_attr_uint = c_comment_num  # 无符号整数属性
    sql_attr_uint = c_id  # 无符号整数属性

    # boolean attribute declaration
    # sql_attr_bool     = is_deleted
    
    # bigint attribute declaration
    # sql_attr_bigint       = my_bigint_id
    
    # UNIX timestamp attribute declaration
    # sql_attr_timestamp    = posted_ts
    
    # floating point attribute declaration
    # sql_attr_float        = lat_radians
    
    # string attribute declaration
    sql_field_string       = c_title
    sql_field_string       = c_content
    
    # JSON attribute declaration
    # sql_attr_json     = properties
    
    # combined field plus attribute declaration (from a single column)
    # stores column as an attribute, but also indexes it as a full-text field
    #
    # sql_field_string  = author
    
}
```

然后设置数据源的索引

```
index d_sphinx_testdb_index
{
    #数据源名
    source = d_sphinx_testdb
    
    # 索引记录存放目录
    path = /usr/local/sphinx/var/data/d_sphinx_testdb_index
    
    # 文档信息存储方式
    docinfo = extern
    
    #缓存数据内存锁定
    mlock = 0
    
    # 形态学
    morphology = none
    
    # 索引的词最小长度
    min_word_len = 1
    
    #数据编码
    charset_type = utf-8
    
    #最小前缀
    min_prefix_len = 0
    
    #最小中缀
    min_infix_len = 1 
}

indexer  
{  
    # 内存限制
    mem_limit  = 32M  
}

searchd  
{  
    # 监听端口
    listen          = 9312  
    
    # 服务进程日志
    log         = /usr/local/sphinx/log/searchd.log  
    
    # 客户端查询日志
    query_log       = /usr/local/sphinx/log/query.log  
    
    # 请求超时
    read_timeout            = 5  
    
    # 同时可执行的最大searchd 进程数
    max_children            = 30  
    
    #进程ID文件
    pid_file        = /usr/local/sphinx/log/searchd.pid 

    # 查询结果的最大返回数    
    max_matches     = 1000  
    
    # 是否支持无缝切换，做增量索引时通常需要
    seamless_rotate         = 1  
}  
```

## 创建索引

进入  bin 目录，执行 

```
./indexer 索引名

Sphinx 2.2.5-id64-release (r4825)
Copyright (c) 2001-2014, Andrew Aksyonoff
Copyright (c) 2008-2014, Sphinx Technologies Inc (http://sphinxsearch.com)

using config file '/usr/local/sphinx/etc/sphinx.conf'...
indexing index 'd_sphinx_testdb_index'...
collected 1000 docs, 0.4 MB
sorted 0.0 Mhits, 100.0% done
total 1000 docs, 408329 bytes
total 0.041 sec, 9739278 bytes/sec, 23851.54 docs/sec
total 1006 reads, 0.002 sec, 1.0 kb/call avg, 0.0 msec/call avg
total 14 writes, 0.001 sec, 106.9 kb/call avg, 0.1 msec/call avg
```

## 启动停止 sphinx

```
# 启动
/usr/local/sphinx/bin/searchd

#停止
/usr/local/sphinx/bin/searchd --stop
```


## 测试

测试前需要安装测试环境，以前 sphinx 的 bin 目录里面有个自带 search 程序，新版本没有了，所以只好使用api方式调用了。

这里我采用 linux + apache + php + sphinx 的方式来完整测试吧。

### apache 源码安装

Apache  的最新版本请参考 [官网下载页面][httpd-apache-download].   
我这里下载的是 [httpd-2.4.10][apache-httpd-2] 最新的 apache 源码版本。

```
wget http://apache.dataguru.cn//httpd/httpd-2.4.10.tar.gz
tar zxvf httpd-2.4.10.tar.gz
cd httpd-2.4.10/
./configure --prefix=/usr/local/apache --with-apr=/usr/local/apr --with-apr-util=/usr/local/apr-util --enable-so
make && make install
lsof -i # 查看端口占用情况

/usr/local/apache/bin/apachectl -k start

```

然后访问 127.0.0.1:8080 就可以看到 It works! 了。


### php 源码安装

php 目前的最新版本 [5.6.2][php-source], 建议去[官网下载页][php-home]下载最新版本

```
wget http://cn2.php.net/distributions/php-5.6.2.tar.gz
tar zxvf php-5.6.2.tar.gz
cd php-5.6.2
./configure --prefix=/usr/local/php  --with-apxs2=/usr/local/apache/bin/apxs --with-mysql --enable-sockets  --enable-shmop
make && make install
```


### 配置 apache 支持 php

```
DirectoryIndex index.php index.html
AddType application/x-httpd-php .php

#调用 PHP 模块
LoadModule php5_module modules/libphp5.so

#特定的扩展名解析成 PHP
<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```


### php 测试

```
<?php  
    include('api/sphinxapi.php'); 
    $sphinx = new SphinxClient(); 
    $sphinx->setServer('127.0.0.1', 9312); 
    $query =$_GET['query'];
    $res = $sphinx->query($query, 'd_sphinx_testdb_index');
    echo "<p>                                                                                                                                              
        query = $query
    </p>";
    echo "<PRE>";  
    print_r($res); 
    echo "</pre> ";
?>
```

## 错误集

### libmysqlclient.so.18

但是我报下面的错误

```
./indexer: error while loading shared libraries: libmysqlclient.so.18: cannot open shared object file: No such file or directory
```

原因：这主要是因为你安装库后,没有配置相应的环境变量.可以通过连接修正这个问题 

```
sudo ln /usr/local/mysql/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.18 
```

但是还是报错，原来添加一个动态库后需要重新加载动态库。

```
tiankonguse:bin #  ldconfig
```


### Invalid cross-device link

但是我又报错了

```
ln: creating hard link `/usr/lib/libmysqlclient.so.18 ' => `/usr/local/mysql/lib/libmysqlclient.so.18': Invalid cross-device link
```

于是我只好创建软连接了。

```
sudo  ln -s /usr/local/mysql/lib/libmysqlclient.so.18 /usr/lib/libmysqlclient.so.18 
```


### 查看检索是否启动

```
tiankonguse:bin #  ps -ef | grep search
tiankonguse   9601     1  0 Oct28 ?        00:00:00 xs-searchd: master                                             
tiankonguse   9602  9601  0 Oct28 ?        00:00:00 xs-searchd: worker[1]                                          
tiankonguse   9603  9601  0 Oct28 ?        00:00:00 xs-searchd: worker[2]                                          
tiankonguse   9604  9601  0 Oct28 ?        00:00:00 xs-searchd: worker[3]                                          
root     32637 18048  0 21:12 pts/0    00:00:00 grep search
```


### WARNING attribute not found

执行索引的时候，看到这个错误，搜索了一下，原来主键不能加入到属性中去。

```
WARNING: attribute 'c_id' not found - IGNORING
```

参考文档 [数据源配置：mysql数据源][coreseek-products-instal-mysql] 和 [WARNING: zero/NULL document_id, skipping][coreseek-2_948_0] .

### ERROR index No fields in schema


```
ERROR: index 'd_sphinx_testdb_index': No fields in schema - will not index
```

还是在[这里][coreseek-products-instal-mysql]找到了原因。

> 使用sql_attr设置的字段，只能作为属性，使用SphinxClient::SetFilter()进行过滤；  
> 未被设置的字段，自动作为全文检索的字段，使用SphinxClient::Query("搜索字符串")进行全文搜索


而我把所有字段都设置为 sql_attr 了，于是把需要全文索引的字段去掉。终于跑出一些接过来。

但是还有一些问题。


### WARNING sql_query_info removed from Sphinx

```
WARNING: key 'sql_query_info' was permanently removed from Sphinx configuration. Refer to documentation for details.
WARNING: key 'charset_type' was permanently removed from Sphinx configuration. Refer to documentation for details.
```

好吧，我说怎么没有在配置文件中看到 sql_query_info 的说明呢，原来已经删除了，那就注释掉吧。  


### word overrun buffer

还是搜[主键][coreseek-2_1016_0]搜到的原因是我的主键不是一个整数，而 sphinx 要求必须是一个整数。  
但是添加整数主键后还是出现这个问题，于是继续查找，最后找到是 sphinx 的一个 bug.
但是 google 搜索，又没有搜索出来，于是猜想可能哪里配置不对。

后来启动 ngram， 设置ngram_chars后，这个警告就没有了。

```
WARNING: source : skipped 300 document(s) with zero/NULL ids
WARNING: word overrun buffer, clipped!!!
WARNING: 601 duplicate document id pairs found
```

###  APR not found

在 config apache 的时候，提示下面的错误。

```
configure: error: APR not found.  Please read the documentation.
```
在[官网的安装页面][apache-install] 可以看到有个 Requirements 类表。

apache 需要依赖于下面的一些东西。

* APR and APR-Util
* Perl-Compatible Regular Expressions Library (PCRE)
* Disk Space
* ANSI-C Compiler and Build System
* Accurate time keeping
* Perl 5 [OPTIONAL]

然后我们可以 [apr][apache-apr] 的官网下载对应的东西即可。

其实就是在 [apr下载页面][apache-apr-download-page] 找到[下载链接][apache-apr-download-source] .

当然我们还要下载 [apr-util][apache-apr-util-download-source] .

#### 安装apr

```
wget http://apache.fayea.com/apache-mirror//apr/apr-1.5.1.tar.gz
tar zxvf  apr-1.5.1.tar.gz
cd apr-1.5.1
./configure --prefix=/usr/local/apr
make && make install

#提示
Libraries have been installed in:
   /usr/local/apr/lib

If you ever happen to want to link against installed libraries
in a given directory, LIBDIR, you must either use libtool, and
specify the full pathname of the library, or use the `-LLIBDIR'
flag during linking and do at least one of the following:
   - add LIBDIR to the `LD_LIBRARY_PATH' environment variable
     during execution
   - add LIBDIR to the `LD_RUN_PATH' environment variable
     during linking
   - use the `-Wl,-rpath -Wl,LIBDIR' linker flag
   - have your system administrator add LIBDIR to `/etc/ld.so.conf'
   
```
#### 安装 apr-util

```
wget http://mirrors.cnnic.cn/apache//apr/apr-util-1.5.4.tar.gz
tar zxvf  apr-util-1.5.4.tar.gz
cd apr-util-1.5.4
./configure --prefix=/usr/local/apr-util

#提示不能找到 APR， 于是指定 APR 的位置
configure: error: APR could not be located. Please use the --with-apr option.


./configure --prefix=/usr/local/apr-util --with-apr=/usr/local/apr/
make && make install

#  运行完后得到下面的提示
Libraries have been installed in:
   /usr/local/apr-util/lib

If you ever happen to want to link against installed libraries
in a given directory, LIBDIR, you must either use libtool, and
specify the full pathname of the library, or use the `-LLIBDIR'
flag during linking and do at least one of the following:
   - add LIBDIR to the `LD_LIBRARY_PATH' environment variable
     during execution
   - add LIBDIR to the `LD_RUN_PATH' environment variable
     during linking
   - use the `-Wl,-rpath -Wl,LIBDIR' linker flag
   - have your system administrator add LIBDIR to `/etc/ld.so.conf'

See any operating system documentation about shared libraries for
more information, such as the ld(1) and ld.so(8) manual pages.
```

### Address already in use

```
/usr/local/apache/bin/apachectl -k start

AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 127.0.0.1. Set the 'ServerName' directive globally to suppress this message
(98)Address already in use: AH00072: make_sock: could not bind to address 0.0.0.0:80
no listening sockets available, shutting down
AH00015: Unable to open logs
```

不管那么多，直接修改 ServerName 和监听端口。

```
Listen 8080
ServerName 127.0.0.1:8080
```

然后再启动就成功了。


### php页面自动下载

php和 apache 都安装完之后，访问写的一个php页面，浏览器却要下载页面。

于是查看 php 的[官方文档][php-install-apache]，还真找到了。

简单的说就是编译 apache 的时候，需要添加启动so选项

```
./configure --enable-so
```

编译php的时候，指定加载为 apache 模块，并使用 mysql.

```
./configure --with-apxs2=/usr/local/apache2/bin/apxs --with-mysql
```

### sphinxclient No such file

编写了一个php测试 sphinx ,但是提示没有这个文件，那就需要去[网上][google-code-sphinxapi]找一个。

```
PHP Warning:  include(sphinxclient.php): failed to open stream: No such file or directory in /usr/local/apache/htdocs/index.php on line 2
```

### unexpected T_STRING

下载 sphinx api 文件后，提示下面的错误

```
PHP Parse error:  syntax error, unexpected T_STRING in /usr/local/apache/htdocs/api/sphinxapi.php on line 28
```

在[这里][phpcms-273392]找到解决方案的,原来下载的文件中由特殊字符，与我处理了一下特殊字符就ok了。  

### unknown key name 'U'

在配置中文的时候，提示下面的错误，后来发现是由于粘贴的字符串中反斜杠有问题，反斜杠后面不能有空白。

```
ERROR: unknown key name 'U' in /usr/local/sphinx/etc/sphinx.conf line 515 col 6.
FATAL: failed to parse config file '/usr/local/sphinx/etc/sphinx.conf'
```

## 参考资料

* [Sphinx 2.2.5-release reference manual][sphinxsearch-docs] 推荐
* [Sphinx中文入门指南][sphinx-tutorial] 最后修改：2010年1月23日
* [数据源配置：mysql数据源][coreseek-mysql]
* [sphinx系列之sphinx安装和运行测试(二)][cnblogs-1869388]
* [PHP+MySQL+SPHINX安装配置与测试][luochuan-7303829]
* [sphinx检索语法与匹配模式备忘][luochuan-7313052]
* [Linux下MySQL、Apache、PHP源码安装全程实录（CentOS 6.4）][lamp-config]
* [基于apache + mysql + php编译安装过程详解][luowenjing-1178205]


### undefined function socket_create

在[这里][Fatal-error-Call-to-undefined-function-socket]找到了答案，原来默认编译安装的 php不支持 socket,需要加上支持socket的参数 `--enable-sockets`。

```
Fatal error: Call to undefined function socket_create()
```


###  undefined function shmop_open

和上面的问题一样，编译php时没有开启shmop_open，加上 ` --enable-shmop`参数即可。参考[这里][yebihai-562]

```
Fatal error: Call to undefined function shmop_open() in
```

### expected searchd protocol version

得到下面的错误的原因是配错ip和host了。默认 sphinx的 post是9312，而我配成8080了.

```
expected searchd protocol version 1+, got version '0'
```



[sphinx-learn]: http://github.tiankonguse.com/blog/2014/10/30/sphinx-learn/
[coreseek-install-log]: http://github.tiankonguse.com/blog/2014/11/03/coreseek-install-log/
[sphinx-use]: http://github.tiankonguse.com/blog/2014/11/06/sphinx-config-and-use/
[yebihai-562]: http://www.yebihai.com/php/562.html
[Fatal-error-Call-to-undefined-function-socket]: http://board.phpbuilder.com/showthread.php?10274229-Fatal-error-Call-to-undefined-function-socket_create()
[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2503078963.png
[sphinxsearch-docs]: http://sphinxsearch.com/docs/current.html
[luochuan-7303829]: http://blog.csdn.net/luochuan/article/details/7303829
[luochuan-7313052]: http://blog.csdn.net/luochuan/article/details/7313052
[coreseek-mysql]: http://www.coreseek.cn/products-install/mysql/
[cnblogs-1869388]: http://www.cnblogs.com/chenzehe/archive/2010/11/04/1869388.html
[sphinx-tutorial]: http://www.sphinxsearch.org/sphinx-tutorial
[lamp-config]: http://www.zjmainstay.cn/lamp-config
[luowenjing-1178205]: http://luowenjing.blog.51cto.com/6627118/1178205
[phpcms-273392]: http://bbs.phpcms.cn/thread-273392-1-1.html
[google-code-sphinxapi]: https://code.google.com/p/sphinxsearch/source/browse/trunk/api/sphinxapi.php
[php-install-apache]: http://php.net/manual/zh/install.unix.apache2.php
[apache-apr-util-download-source]: http://mirrors.cnnic.cn/apache//apr/apr-util-1.5.4.tar.gz
[apache-apr-download-source]: http://apache.fayea.com/apache-mirror//apr/apr-1.5.1.tar.gz
[apache-apr-download-page]: http://apr.apache.org/download.cgi
[apache-apr]: http://apr.apache.org/
[apache-install]: http://httpd.apache.org/docs/2.4/en/install.html
[php-home]: http://cn2.php.net/downloads.php
[php-source]: http://cn2.php.net/distributions/php-5.6.2.tar.gz
[apache-httpd-2]: http://apache.dataguru.cn//httpd/httpd-2.4.10.tar.gz
[httpd-apache-download]: http://httpd.apache.org/download.cgi#apache24
[coreseek-2_1016_0]: http://www.coreseek.cn/forum/2_1016_0.html
[coreseek-products-instal-mysql]: http://www.coreseek.cn/products-install/mysql/
[coreseek-2_948_0]: http://www.coreseek.cn/forum/2_948_0.html
[sphinxsearch-download-Source]: http://sphinxsearch.com/files/sphinx-2.2.5-release.tar.gz 
[sphinxsearch-download]: http://sphinxsearch.com/downloads/release/
