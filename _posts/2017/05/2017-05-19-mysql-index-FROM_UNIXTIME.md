---  
layout:     post  
title:      mysql中一个索引与FROM_UNIXTIME的问题
description: 这个问题问了好多人，没人知道，今天分享一下。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  22:32 2017/5/19
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  

## 零、背景

这周四收到很多告警，找DBA看了看，发现有个慢查询。  
简单收集一些信息后，发现这个慢查询问题隐藏的很深，问了好多人包括DBA都不知道原因。  


## 一、问题

有一个DB, 有一个字段, 定义如下.  

```
MySQL [d_union_stat]> desc t_local_cache_log_meta;
+----------------+--------------+------+-----+---------------------+
| Field          | Type         | Null | Key | Default             |
+----------------+--------------+------+-----+---------------------+
| c_id           | int(11)      | NO   | PRI | NULL                |
| c_key          | varchar(128) | NO   | MUL |                     |
| c_time         | int(11)      | NO   | MUL | 0                   |
| c_mtime        | varchar(45)  | NO   | MUL | 0000-00-00 00:00:00 |
+----------------+--------------+------+-----+---------------------+
17 rows in set (0.01 sec)
```

索引如下:  

```
MySQL [d_union_stat]> show index from t_local_cache_log_meta \G         
*************************** 1. row ***************************
        Table: t_local_cache_log_meta
   Non_unique: 0
     Key_name: PRIMARY
  Column_name: c_id
    Collation: A
  Cardinality: 6517096
   Index_type: BTREE
*************************** 2. row ***************************
.
.
.
*************************** 6. row ***************************
        Table: t_local_cache_log_meta
   Non_unique: 1
     Key_name: index_mtime
  Column_name: c_mtime
    Collation: A
  Cardinality: 592463
   Index_type: BTREE
6 rows in set (0.02 sec)
```

然后我写了一个SQL如下:  

```
SELECT 
    count(*)
FROM
    d_union_stat.t_local_cache_log_meta
where
    `c_mtime` < FROM_UNIXTIME(1494485402);
```

终于有一天DBA过来了, 扔给我一个流水，说这个SQL是慢SQL。  

```
# Time: 170518 11:31:14
# Query_time: 12.312329  Lock_time: 0.000061 Rows_sent: 0  Rows_examined: 5809647
SET timestamp=1495078274;
DELETE FROM `t_local_cache_log_meta` WHERE `c_mtime`< FROM_UNIXTIME(1494473461) limit 1000;
```

我顿时无语了，我的DB都是加了索引，SQL都是精心优化了的，怎么是慢SQL呢？  
问为什么是慢SQL，DBA答不上来， 问了周围的同事也都答不上来。  
我心里暗想遇到一个隐藏很深的知识点了。  

令人怀疑的地方有两个：1.有6个索引。 2. 右值是 FROM_UNIXTIME 函数。  


于是查询MYSQL官方文档，发现6个不是问题。  

```
All storage engines support at least 16 indexes per table and a total index length of at least 256 bytes.   
Most storage engines have higher limits.  
```

于是怀疑问题是 FROM_UNIXTIME 函数了。  

然后看看MYSQL的INDEX小节，找到一点蛛丝马迹。  


1. To find the rows matching a WHERE clause quickly.  
2. To eliminate rows from consideration.   
  If there is a choice between multiple indexes, MySQL normally uses the index that finds the smallest number of rows.  
3. If the table has a multiple-column index, any leftmost prefix of the index can be used by the optimizer to look up rows.   
4. MySQL can use indexes on columns more efficiently if they are declared as the same type and size.  
  Comparison of dissimilar columns (comparing a string column to a temporal or numeric column, for example) may prevent use of indexes if values cannot be compared directly without conversion.  
5. ...


看到第4条的时候，提到不同类型可能导致不走索引，难道 FROM_UNIXTIME 的返回值不能转化为字符串类型？  

于是查询 FROM_UNIXTIME 函数的返回值。  

```
MySQL FROM_UNIXTIME() returns a date /datetime from a version of unix_timestamp.   
```

返回的是一个时间类型，那强制转化为字符串类型呢？  

```

MySQL [d_union_stat]> explain SELECT 
    ->     *
    -> FROM
    ->     t_local_cache_log_meta
    -> where
    ->     `c_mtime` = CONCAT(FROM_UNIXTIME(1494485402)) \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t_local_cache_log_meta
         type: ref
possible_keys: index_mtime
          key: index_mtime
      key_len: 137
          ref: const
         rows: 1
        Extra: Using where
1 row in set (0.01 sec)
```

这次可以看到, 使用了索引，只扫描了一个数据。  


## 三、结论


这次对 FROM_UNIXTIME 的返回值强制转化一下就可以利用上索引了。  
所以这个SQL不能利用上索引是右值与左值的类型不一致导致的。  。  


好了，不多说了， 这篇文章算是一个插曲，后面继续介绍算法吧。     


对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
小密圈这周接受免费加入，欢迎大家加入看各种算法的思路。  

![](/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](/images/weixin-50cm.jpg)  
  
  
  