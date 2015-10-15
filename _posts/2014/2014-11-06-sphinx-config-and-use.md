---
layout:     post
title:      coreeek 和 sphinx 的配置与使用
description: sphinx 是搭建好了，但是还需要支持增量索引和闲时索引合并，于是又研究了一番。
keywords: coreeek, sphinx, 安装, 配置, 教程, 全文索引, 搜索
tags: coreeek sphinx 安装 配置 教程 全文索引 搜索
categories: [软件研究]
---

![cover][]

## 前言

关于 sphinx 的安装请参考 [Sphinx 安装记录][sphinx-learn].  
关于 coreeek 的安装请参考 [coreseek 安装记录][coreseek-install-log].  

sphinx 和 coreeek 安装好后，是可以搜索出满意的结果了，凡是有一个问题：对于新增的数据，我们需要在 sphinx 中重建索引。  
又由于旧的数据量是很大的，所以重建索引是很费时间的，所有如果数据不需要实时同步，那么每天晚上定时重建一下就行了。  
如果需要实时同步，比如几分钟内就要搜索生效，那么就需要使用增量索引了。  
然后再在晚上闲时合并增量索引和主索引。


## 关于配置

在 sphinx 中，需要配置两个数据源和两个索引， 一个是主索引，另一个是增量索引，而且增量索引需要继承于主索引。   

由于我们的索引会在指定时间合并，所以在下次合并索引之前，我们增量索引需要做的就是重建上次合并索引之后改变或新增的数据。  

所有我们需要一个辅助表来记录上次修改的时间，用于增量索引使用。
 
辅助表 结构很简单，只有一个字段上次合并的时间，而且永远只有一条记录。
 
```
CREATE TABLE t_blog_time_sphinx
(
    c_id INTEGER PRIMARY KEY NOT NULL,
    c_time DATETIME NOT NULL
);
```

关于 sphinx 的配置如下

```
# 主数据源
source main_source
{
    type            = mysql
 
    sql_host        = 127.0.0.1  
    sql_user        = test 
    sql_pass        = test
    sql_db          = test 
    sql_port        = 3306
 
    sql_query_pre= SET NAMES utf8
    sql_query = select c_id,c_title,c_content,c_year,c_month,c_day,c_modifytime,c_createtime FROM t_blog_sphinx;

    sql_attr_uint = c_year
    sql_attr_uint = c_month 
    sql_attr_uint = c_day 
    sql_attr_timestamp  = c_modifytime
    sql_attr_timestamp  = c_createtime
    sql_field_string = c_title
    sql_field_string = c_content
}

# 增量数据源
source main_inc_source : main_source
{
    sql_query_pre = SET NAMES utf8
    sql_query = select c_id,c_title,c_content,c_year,c_month,c_day,c_modifytime,c_createtime FROM t_blog_sphinx where c_modifytime > ( SELECT c_time FROM t_blog_time_sphinx limit 1 );
 
}

# 主索引
index  main_index 
{
    source          = main_source 
    path            = /usr/local/coreseek4/var/data/main_index
    docinfo         = extern
    charset_type        = zh_cn.utf-8 
    charset_dictpath = /usr/local/mmseg3/etc/  
    ngram_len = 0 
}

# 增量索引
index main_inc_index : main_index
{
    source = main_inc_source
    path = /usr/local/coreseek4/var/data/main_inc_index
}

# 索引程序
indexer
{  
    mem_limit       = 32M
}

# 守护程序
searchd
{  
    listen          = 9312
    listen          = 9306:mysql41
    log         = /usr/local/coreseek4/var/log/searchd.log
    query_log       = /usr/local/coreseek4/var/log/query.lo
    client_timeout= 300
    read_timeout        = 5
    max_children        = 30
    pid_file        = /usr/local/coreseek4/var/log/searchd.pid
    max_matches     = 1000
    seamless_rotate     = 1
    preopen_indexes     = 1
    unlink_old      = 1
    mva_updates_pool= 1M
    max_packet_size= 8M
    max_filters= 256
    max_filter_values= 4096
    max_batch_queries= 32
    workers         = threads # for RT to work
}
```

## 启动 sphinx

第一步是辅助表中插入一个时间

```
INSERT INTO t_blog_time_sphinx (c_time)VALUES(now());
```

第二步是创建主索引和增量索引

```
/usr/local/coreseek4/bin/indexer main_index
/usr/local/coreseek4/bin/indexer main_inc_index
```

第三部是启动守护程序

```
/usr/local/coreseek4/bin/searchd
```

## 定时任务

定时任务需要做的有这么几件事。  

1. 实时重建当天的索引(增量索引)
2. 晚上合并增量索引到主索引
3. 更新辅助表的时间为当前时间(一般减去若干分钟，来使数据有几分钟的冗余，避免遗漏数据)


```
# 增量索引
/usr/local/coreseek4/bin/indexer t_cover_sphinx_inc_index --rotate

# 合并
/usr/local/coreseek4/bin/indexer --merge t_cover_sphinx_index t_cover_sphinx_inc_index --rotate

# 修改辅助表上次的合并时间
update t_blog_time_sphinx set c_time = now() - 10*60;
```



## php 测试程序

在 coreseek 的测试目录下可以找到 sphinxapi.php 文件，复制到你的 php 源代码对应的位置。

关于全文索引字段的组装格式，可以参考 [官方文档][matching-modes]

```
//加入 sphinx api
include('api/coreseek_sphinxapi.php');

//初始化 sphinx
$sphinx = new SphinxClient(); 
$sphinx->setServer($ip, $port);


//设置属性字段
if(isset($_GET["year"]) && strlen($_GET["year"]) > 0){
    $sphinx->SetFilter("c_year", array($_GET["year"]));
}

//设置全文检索字段
$query = "";

if(isset($_GET["title"]) && strlen($_GET["title"]) > 0){
    $query .= "|" . trim($_GET["title"]);
}

if(isset($_GET["content"]) && strlen($_GET["content"]) > 0){
   $query .= "|" . trim($_GET["content"]);
}

$query = trim($query);

//开始搜索，索引必须是主索引和增量索引
$res = $sphinx->query($query, 'main_inc_index,main_index');

echo "<p>query = $query </p>";

//输出结果，其中 GetLastError 和 GetLastWarning 用于调试。
echo "<pre>";  
print_r($sphinx->GetLastError());
print_r($sphinx->GetLastWarning ());
print_r($res); 
echo "</pre> ";
```

[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3071317700.png
[matching-modes]: http://www.tapy.org/articles/sphinx1.0/sphinxManual.html#matching-modes
[sphinx-learn]: http://github.tiankonguse.com/blog/2014/10/30/sphinx-learn/
[coreseek-install-log]: http://github.tiankonguse.com/blog/2014/11/03/coreseek-install-log/
[sphinx-use]: http://github.tiankonguse.com/blog/2014/11/06/sphinx-config-and-use/