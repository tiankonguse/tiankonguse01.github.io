---  
layout: post  
title: redis 基础知识
description: 最近准备看redis的源码了,看之前先看看redis有哪些功能.
tags:  redis
keywords: redis
updateData:  2015-07-28 19:44
categories: [程序人生]
---  

## 背景

之前曾使用过一次redis, 发现redis也是key-value型的, 但是一直没有机会真正的学习redis.   
现在抽空看了看手册,记录一下.  


## 资料

我这次阅读 redis 主要参考这么两个网站: [Redis中文官方网站][redis-cn] 和 [Redis 命令参考][redis-com].  


## 介绍

Redis是一个开源的高性能key-value存储系统.  


redis 有如下特点;

1. 内存性数据库, 可以持久化
2. 丰富的数据类型
3. 分布式部署
4. 操作原子性, 支持事务



## 数据类型


Redis支持5种类型的数据类型.

### 字符串

redis的字符串是二进制安全的, 最大长度是 512M.  

### 哈希

Redis的哈希是键值对的集合。  
Redis的哈希值是字符串字段和字符串值之间的映射，因此它们被用来表示对象  

### 列表

Redis列表是简单的字符串列表，按照插入顺序排序。  


### 集合

Redis集合是一个无序的字符串合集。  
你可以以O(1) 的时间复杂度完成 添加，删除以及测试元素是否存在的操作。  

### 有序集合

Redis有序集合和Redis集合类似，是不包含 相同字符串的合集。  
它们的差别是，每个有序集合 的成员都关联着一个评分，这个评分用于把有序集 合中的成员按最低分到最高分排列。  



## 命令操作

### Key（键）

** del **  

删除给定的一个或多个 key 。  
不存在的 key 会被忽略。  


** DUMP **  

序列化给定 key ，并返回被序列化的值，使用 RESTORE 命令可以将这个值反序列化为 Redis 键。 


** RESTORE **  

反序列化给定的序列化值，并将它和给定的 key 关联。  



** EXISTS **  

返回key是否存在。


** EXPIRE 与 EXPIREAT **  

设置key的过期时间,单位秒。  
如果key已过期，将会被自动删除。  
设置了过期时间的key被称之为volatile。  


** PEXPIRE 与 PEXPIREAT **  

以毫秒为单位设置 key 的生存时间  
 

** TTL与PTTL **  

返回给定 key 的剩余生存时间(TTL, time to live)。  



** PERSIST **  

移除给定 key 的生存时间 


** KEYS **  

查找所有符合给定模式 pattern 的 key 。  


** MIGRATE **  

将 key 原子性地从当前实例传送到目标实例的指定数据库上，一旦传送成功， key 保证会出现在目标实例上，而当前实例上的 key 会被删除。
简单的理解就是从这个redis总删除, 在另一个redis中添加, 但是这个操作可以认为是原子性的.  


** MOVE **  

将当前数据库的 key 移动到给定的数据库 db 当中。  


> 如果当前数据库(源数据库)和给定数据库(目标数据库)有相同名字的给定 key ，或者 key 不存在于当前数据库，那么 MOVE 没有任何效果。  
> 因此，也可以利用这一特性，将 MOVE 当作锁(locking)原语(primitive)。  


** OBJECT **  

OBJECT 命令允许从内部察看给定 key 的 Redis 对象。  


** RANDOMKEY **  

从当前数据库中随机返回(不删除)一个 key 。  


** RENAME 与 RENAMENX **  

将 key 改名为 newkey 。   

RENAME : 当 key 和 newkey 相同，或者 key 不存在时，返回一个错误。  
RENAME : 当 newkey 已经存在时， RENAME 命令将覆盖旧值。  
RENAMENX : 当且仅当 newkey 不存在时，将 key 改名为 newkey 。  


** SORT **  

返回或保存给定列表、集合、有序集合 key 中经过排序的元素。   
排序时可以依靠其他key, 返回时也可以返回其他key的值.  


** TYPE **  

返回 key 所储存的值的类型。  
  
* none (key不存在)
* string (字符串)
* list (列表)
* set (集合)
* zset (有序集)
* hash (哈希表)


** SCAN **  

用于迭代当前数据库中的数据库键。  
SCAN 命令的回复是一个包含两个元素的数组.  
第一个数组元素是用于进行下一次迭代的新游标， 而第二个数组元素则是一个数组， 这个数组中包含了所有被迭代的元素。  


### String（字符串）

** APPEND **  

如果 key 已经存在并且是一个字符串， APPEND 命令将 value 追加到 key 原来的值的末尾。  
如果 key 不存在， APPEND 就简单地将给定 key 设为 value ，就像执行 SET key value 一样。  


** BITCOUNT **  

计算给定字符串中，被设置为 1 的比特位的数量。  


** BITOP **  

对一个或多个保存二进制位的字符串 key 进行位元操作，并将结果保存到 destkey 上。  


** GETBIT **  

对 key 所储存的字符串值，获取指定偏移量上的位(bit)。  


** SETBIT **  

对 key 所储存的字符串值，设置或清除指定偏移量上的位(bit)。  


** DECR 与 DECRBY **  

将 key 中储存的数字值减一。  
如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 DECR 操作。  
如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。  


** INCR 与 INCRBY **  


将 key 中储存的数字值增一。  
如果 key 不存在，那么 key 的值会先被初始化为 0 ，然后再执行 INCR 操作。  
如果值包含错误的类型，或字符串类型的值不能表示为数字，那么返回一个错误。  


** INCRBYFLOAT **  

为 key 中所储存的值加上浮点数增量 increment 。  


** GET **  

返回 key 所关联的字符串值。  
如果 key 不存在那么返回特殊值 nil 。  
假如 key 储存的值不是字符串类型，返回一个错误，因为 GET 只能用于处理字符串值。  


** GETRANGE **  

返回 key 中字符串值的子字符串，字符串的截取范围由 start 和 end 两个偏移量决定(包括 start 和 end 在内)。  


** GETSET **  

将给定 key 的值设为 value ，并返回 key 的旧值(old value)。  


** MGET **  

返回所有(一个或多个)给定 key 的值。  


** SET **  

将字符串值 value 关联到 key 。  


** MSET **  

同时设置一个或多个 key-value 对。  


** SETNX **  

将 key 的值设为 value ，当且仅当 key 不存在。  


** MSETNX **  

同时设置一个或多个 key-value 对，当且仅当所有给定 key 都不存在。  


** SETEX 与 PSETEX**  

将值 value 关联到 key ，并且存在生存时间。  


** SETRANGE **  

用 value 参数覆写(overwrite)给定 key 所储存的字符串值，从偏移量 offset 开始。  


** STRLEN **  

返回 key 所储存的字符串值的长度。  


### Hash（哈希表）

** HSET,HSETNX,HMSET **  

HSET: 将哈希表 key 中的域 field 的值设为 value 。  
HSETNX : 将哈希表 key 中的域 field 的值设置为 value ，当且仅当域 field 不存在。  
HMSET : 同时将多个 field-value (域-值)对设置到哈希表 key 中。


** HGET,HMGET,HVALS,HGETALL,HKEYS **  

HGET : 返回哈希表 key 中给定域 field 的值。  
HMGET : 返回哈希表 key 中，一个或多个给定域的值。  
HVALS : 返回哈希表 key 中所有域的值。  
HGETALL : 返回哈希表 key 中，所有的域和值。 
HKEYS : 返回哈希表 key 中的所有域。   


** HINCRBY,HINCRBYFLOAT **  

HINCRBY : 为哈希表 key 中的域 field 的值加上增量 increment 。  
HINCRBYFLOAT : 为哈希表 key 中的域 field 加上浮点数增量 increment 。  


** HDEL **  

删除哈希表 key 中的一个或多个指定域，不存在的域将被忽略。  


** HEXISTS **  

查看哈希表 key 中，给定域 field 是否存在。  


** HLEN **  

返回哈希表 key 中域的数量。  


### List（列表）


** RPUSH,RPUSHX,LPUSH,LPUSHX **  

RPUSH : 将一个或多个值 value 插入到列表 key 的表尾(最右边)  
RPUSHX : 将值 value 插入到列表 key 的表尾，当且仅当 key 存在并且是一个列表。
LPUSH : 将一个或多个值 value 插入到列表 key 的表头  
LPUSHX : 将值 value 插入到列表 key 的表头，当且仅当 key 存在并且是一个列表。  


** LPOP,RPOP,BRPOP,BLPOP **  

LPOP : 移除并返回列表 key 的头元素。  
RPOP : 移除并返回列表 key 的尾元素。  
BRPOP : BRPOP 是列表的阻塞式(blocking)弹出原语。  
BLPOP : BLPOP 是列表的阻塞式(blocking)弹出原语。  


** LTRIM,LSET,LREM,LINSERT **  

LTRIM : 对一个列表进行修剪(trim)，不在指定区间之内的元素都将被删除。  
LSET : 将列表 key 下标为 index 的元素的值设置为 value 。  
LREM : 根据参数 count 的值，移除列表中与参数 value 相等的元素。
LINSERT: 将值 value 插入到列表 key 当中，位于值 pivot 之前或之后。  


** LRANGE,LLEN,LINDEX **  

LRANGE : 返回列表 key 中指定区间内的元素，区间以偏移量 start 和 stop 指定。  
LLEN : 返回列表 key 的长度。  
LINDEX : 返回列表 key 中，下标为 index 的元素。   


** RPOPLPUSH,BRPOPLPUSH **  

命令 RPOPLPUSH 在一个原子时间内，执行以下两个动作：  

1. 将列表 source 中的最后一个元素(尾元素)弹出，并返回给客户端。  
2. 将 source 弹出的元素插入到列表 destination ，作为 destination 列表的的头元素。  

BRPOPLPUSH : BRPOPLPUSH 是 RPOPLPUSH 的阻塞版本  


### 待完善








[redis-com]: http://redisdoc.com/
[redis-cn]: http://redis.cn/

