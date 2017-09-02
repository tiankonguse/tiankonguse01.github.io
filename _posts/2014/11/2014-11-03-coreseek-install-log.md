---
layout:     post
title:      coreseek 安装记录
description: 上周安装了 sphinx 后，发现搜索效果不好，于是尝试一下 coreseek .
keywords: coreseek, sphinx, 源码安装, 使用教程, 全文检索, 搜索
tags: coreseek sphinx 源码安装 使用教程 全文检索 搜索
categories: [软件研究]
---

![coreseek 封面][cover-image]

## 前言

前几天我写了 [sphinx 的安装记录][sphinx-learn], 今天再来记录一下 coreseek 的安装记录。

如果你只想使用简单的全文检索的话，请参考 [Sphinx 安装记录][sphinx-learn]。  
如果你已经安装 sphinx 或者 coreseek, 只是想查找怎么配置和使用 sphinx 和 coreseek 的话，请参考 [coreeek 和 sphinx 的配置与使用][sphinx-use].  



## 关于 coreseek

在 [coreseek 的官网][coreseek]上，可以看到, coreseek 是基于 sphinx ，CRF++ 和 LibMMSeg 组装而成。

* coreseek 是一款中文全文检索/搜索软件
* 以GPLv2许可协议开源发布
* 基于Sphinx研发并独立发布
* 专攻中文搜索和信息处理领域
* 适用于行业/垂直搜索、论坛/站内搜索、数据库搜索、文档/文献检索、信息检索、数据挖掘等应用场景
* 用户可以免费下载使用
* 同时针对有实际需要的客户，我们还提供专业的搜索技术与本地化的Sphinx技术支持服务


## 安装

### 下载 coreseek

在[官网][coreseek]可以很容易找到最新版本，目前是 [4.1版本][coreseek-source-4-1]。

```
tiankonguse:src # wget http://www.coreseek.cn/uploads/csft/4.0/coreseek-4.1-beta.tar.gz

tiankonguse:src # tar zxvf coreseek-4.1-beta.tar.gz

tiankonguse:src # cd coreseek-4.1-beta

tiankonguse:coreseek-4.1-beta # ls
README.txt  csft-4.1  mmseg-3.2.14  testpack

```

### 安装 mmseg

mmseg 是一个 中文分词软件包。

```
tiankonguse:coreseek-4.1-beta # cd mmseg-3.2.14/

tiankonguse:mmseg-3.2.14 # ./bootstrap    #输出的warning信息可以忽略，如果出现error则需要解决

tiankonguse:mmseg-3.2.14 # ./configure --prefix=/usr/local/mmseg3

tiankonguse:mmseg-3.2.14 # make && make install

tiankonguse:mmseg-3.2.14 # ls /usr/local/mmseg3/
bin  etc  include  lib

tiankonguse:mmseg-3.2.14 #  cd ..
```

###  安装coreseek

```
tiankonguse:coreseek-4.1-beta # cd csft-4.1

tiankonguse:csft-4.1 # sh buildconf.sh    #输出的warning信息可以忽略，如果出现error则需要解决

tiankonguse:csft-4.1 # ./configure --prefix=/usr/local/coreseek4  --without-unixodbc --with-mmseg --with-mmseg-includes=/usr/local/mmseg3/include/mmseg/ --with-mmseg-libs=/usr/local/mmseg3/lib/ --with-mysql 

tiankonguse:csft-4.1 # make && make install

tiankonguse:csft-4.1 # ls /usr/local/coreseek4
bin  etc  share  var

tiankonguse:csft-4.1 # cd ..
```

##  配置


```
tiankonguse:coreseek-4.1-beta # cd /usr/local/coreseek4/etc/

tiankonguse:coreseek-4.1-beta # ls
example.sql  sphinx-min.conf.dist  sphinx.conf.dist

tiankonguse:coreseek-4.1-beta # cp sphinx-min.conf.dist sphinx.conf

tiankonguse:coreseek-4.1-beta # vi sphinx.conf
```


### mysql 数据源配置

```
source mysql_source_name
{
    type                    = mysql

    sql_host                = localhost
    sql_user                = test
    sql_pass                = test
    sql_db                    = test
    sql_port                = 3306
    sql_query_pre            = SET NAMES utf8

    #sql_query第一列id需为整数
    #title、content作为字符串/文本字段，被全文索引
    sql_query                = SELECT id, group_id, UNIX_TIMESTAMP(date_added) AS date_added, title, content FROM test
    
    #从SQL读取到的值必须为整数
    sql_attr_uint            = group_id    
    #从SQL读取到的值必须为整数，作为时间属性
    sql_attr_timestamp        = date_added 

     #命令行查询时，设置正确的字符集
    sql_query_info_pre      = SET NAMES utf8                                       
    #命令行查询时，从数据库读取原始数据信息
    sql_query_info            = SELECT * FROM test WHERE id=$id 
}
```

### 索引配置

```
index mysql_index_name
{
    #对应的source名称
    source            = mysql_source_name             
    path            = /usr/local/coreseek/var/data/mysql_index_name 
    docinfo            = extern
    mlock            = 0
    morphology        = none
    min_word_len        = 1
    html_strip  = 0

    #中文分词配置，详情请查看：http://www.coreseek.cn/products-install/coreseek_mmseg/
    charset_dictpath = /usr/local/mmseg3/etc/ 
    charset_type        = zh_cn.utf-8
    
    #必须设置，表示取消原有的一元字符切分模式，不使其对中文分词产生干扰；
    #charset_table的配置需要注释掉！
    #ngram_len的配置需要设置为0！
    ngram_len = 0
}
```

### 其他定义

```
#全局index定义
indexer
{
    mem_limit            = 128M
}

#searchd服务定义
searchd
{
    listen                  =   9312
    read_timeout        = 5
    max_children        = 30
    max_matches            = 1000
    seamless_rotate        = 0
    preopen_indexes        = 0
    unlink_old            = 1
    pid_file = /usr/local/coreseek/var/log/searchd_mysql.pid  
    log = /usr/local/coreseek/var/log/searchd_mysql.log        
    query_log = /usr/local/coreseek/var/log/query_mysql.log 
    binlog_path =
}
```

## 测试

```
<?php  
    include('api/sphinxapi.php'); 
    $sphinx = new SphinxClient(); 
    $sphinx->setServer('10.12.191.99', 9312); 
    //$query =$_GET['query'];
    $query = "test"; 
    $res = $sphinx->query($query, 't_cover_sphinx_index');
    echo "<p>
        query = $query
    </p>";
    echo "<pre>";  
    print_r($sphinx->GetLastError());
    print_r($sphinx->GetLastWarning ());
    print_r($res); 
    echo "</pre> ";
?>
```

## 错误集

###  Query()查询后没有结果

把错误输出来。

```
print_r($sphinx->GetLastError());
print_r($sphinx->GetLastWarning ());
```

### client version higher daemon version

该问题说明你所使用的SphinxClient接口，与服务器端的版本不一致。  
需要使用安装Coreseek/Sphinx的包里面的api/目录下对应的Client库。  
实际上我用的是 sphinx 的api而不是 coreseek 的 api.  
更换之后就Ok了。

```
searchd error: client version is higher than daemon version (client is v.1.30, daemon is v.1.25)
```


[coreseek-install-log]: http://github.tiankonguse.com/blog/2014/11/03/coreseek-install-log/
[sphinx-use]: http://github.tiankonguse.com/blog/2014/11/06/sphinx-config-and-use/
[coreseek-source-4-1]: http://www.coreseek.cn/uploads/csft/4.0/coreseek-4.1-beta.tar.gz
[sphinx-learn]: http://github.tiankonguse.com/blog/2014/10/30/sphinx-learn/
[coreseek]: http://www.coreseek.com/
[cover-image]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3637290315.gif
