---
layout: post
title: mysql binlog简单认识
description:  我的小组主要用来管理视频资料, 也就是管理Db的啦. 后来发现有很多慢查询, 于是导了一份慢查询和binlog来看了看.  
tags:  mysql
keywords: mysql
updateData:  14:58 2015/9/4
categories: [程序人生]
---

## 背景

几个月前, 我曾多次找DBA, 说某些语句是慢查询, 需要优化.  
后来DBA直接把我加到DBA的告警名单了, 一单有慢查询, 就会发出告警.  
结果那段时间, 每个十几分钟就会收到一条告警, 然后我收集一下慢查询信息, 找相关人员来改造sql.  
但是后来, 慢查询都集中到一个系统中去了, 然后那个系统怎么催都催不动, 理由是没时间.  
催的旧了, 我催不动了, DBA发现没啥效果了, 就把告警阀值调整了一下, 改成几个小时告警一次了.  

说了这么多废话, 当时查询资料时保存了一些书签,现在整理一下这些书签, 并记录一下binlog吧.  


## big log 结构

下面是我虚构的一条语句.  

```
# at 383846410
#150414  7:00:00 server id 12303  end_log_pos 383846601 	Query	thread_id=3684309056	exec_time=0	error_code=0
SET TIMESTAMP=1428966000/*!*/;
update t_video_5  set c_value='',c_mtime=now() where c_value<>'' and ((c_id='324325' and c_idx=0))
```

第一行 `at 383846410` 代表一个这次sql事件的文件偏移量,或者开始位置.  
第二行 分别是 日期, 事件, 服务id, 结束偏移量.  
thread_id 代表哪个线程执行了这个事件, exec_time 代表这个时间在主库上执行的时间, 如果是从库, 这个时间也是在主库上的时间, 所以可能会比较大.  
exec_time 的单位是秒, 当初我查这个单位查了好久, 所有的资料都说是时间, 但是单位呢, 都没说.最后在[这里](https://www.percona.com/blog/2011/01/31/what-is-exec_time-in-binary-logs/)的例子中找到了答案.    



## mysqlbinlog 参数简单说明

我不是DBA, 也没有怎么操作过mysqlbinlog, 所以这里只是简单的查询资料, 简单的记录一下.  

### 筛选指定数据库

`-d, –database=name` 参数可以筛选指定的数据库.  

需要注意的是, 这个参数只能筛选使用 `use database;` 语句的sql, 对于 `database.table` 的sql语句是不能筛选出来的.  


### 跳过指定条数据

`-o, –-offset=#` 可以通过偏移量来跳过指定数量的 entries .  


### 筛选指定时间内的数据


通过 `--start-datetime=datetime` 和 `--stop-datetime=datetime` 我们可以筛选指定时间内的 entries.  


## 参考资料

* [mysqlbinlog — Utility for Processing Binary Log Files](https://dev.mysql.com/doc/refman/5.1/en/mysqlbinlog.html#option_mysqlbinlog_start-datetime)
* [mysqlbinlog用法举例](http://www.linux-centos.com/2012/11/01/mysqlbinlog%E7%94%A8%E6%B3%95%E4%B8%BE%E4%BE%8B/)
