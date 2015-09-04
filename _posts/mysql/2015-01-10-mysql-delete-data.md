---  
layout: post  
title: 浅谈 mysql 删除或清空表的数据  
description: 我的工作岗位，算是管理数据的吧，于是经常要和数据打交道，经常有清空表的数据的这个需求了。  
tags:  mysql truncate delete  
keywords: mysql, truncate, delete  
updateData:  17:32 2015/1/10  
categories: [数据库]
---  


## 前言  

很多人看到这个标题，可能会想删除一个表的数据有什么好说的，不就是一条 delete 语句的事嘛。  

是的， delete 语句时万能的语句。  

但是某些场景 delete 语句下并不是最好的选择， 甚至不能满足你的需求。  
 

>  
> 当然， 你可能会发现，我说的删除是项目逻辑层的删除，而不是项目数据层的删除。   
>  



 
## 简单的删除数据  


我们最常见的需求是按指定条件删除数据。  


### 标记位删除  

当然， 实际项目中一般都是使用一个标记位(state) 来实现删除的。  

也就是说大部分项目中，没有真实的删除数据， 而是 update 数据， 这已经是最最基本的做法了。  


具体实现方式就是表里增加一个字段 `c_state` , 默认值为0 代表正常数据。  

我们平常查询数据的时候都加上 `c_state = 0` 这个条件。  


```  
select something from d_test.t_test where something and c_state = 0;  
```  


需要删除的时候， 把 `c_state` update 为 1 即可。  


```  
update  d_test.t_test set c_state = 1 where something;  
```  


### 真实删除  

当然某些时候，我们会真的删除数据。  

这个时候直接执行删除语句即可。  


```  
delete from d_test.t_test where something;  
```  


## 频繁删除全部数据  


我经常有这个需求， 按照指定的条件， 跑出一些数据来， 数据量数几千的级别吧。  

我把跑出的数据存在一张表中，这样就方便后续操作了。  

但是跑出的这些数据是临时数据， 也就是说只会使用一次， 以后需要的话会重新跑最新的数据的。  


### 真实删除全部数据  


于是我最初的做法是下次跑数据前， 把数据真实的全部删除掉。  


```  
SELECT max(c_id) FROM d_test.t_test;  
DELETE FROM d_test.t_test WHERE c_id <= c_max_id;  
```  

可能有人会问怎么不使用 `DELETE FROM d_test.t_test` 来删呢？  

原因有两个。  

第一个是为了安全。  

我们目前无效的数据的 id 小于 c_max_id 的数据， 而 删除全部的话， 如果最新的有效数据导进来的话， 也会被误删。  


第二个原因才是根本原因。  

我的 mysql 客户端做了安全限制， 删除数据时只能使用主键为条件来删除， 我也不想解除这个限制。  


### 记录上次数据的位置  

我们知道， 一般数据库建表的时候都会加上一个自增id为主键。  

之后添加数据时， id 会自动填充， 而且是从之前最大的 id 开始计数的， 即使的 id 有很多未使用。  

于是如果假设我们记录下上次的最大 id 不就可以不删除了吗？  

是的， 后来我不想删除数据了， 我就是这样做的。  


```  
SELECT max(c_id) FROM d_test.t_test;  
select something from d_test.t_test where c_id > c_max_id;  
```  

于是这样，我就可以得到最新的数据了， 在我的眼里小于等于 c_max_id 的数据都已经删除了。  


### 标记数字来记录数据  


上面通过 记录上次数据的位置 确实方便了一些， 但是我需要记住那个 c_max_id 倒是相当不方便。  

有没有更好的方法呢？  

后来我通过把 `c_state` 和 `c_max_id` 结合， 想出一个比较实用的方法。  

添加一个新字段 `c_times`, 来代表当前跑数据的id.  

这个  `c_times` 自己的跑数据前自己手动分配。由于跑数据前一般需要修改程序， 于是我顺便把这个  `c_times` 设置为最大  `c_times` 加 1 即可。  


操作如下  


```  
times = 7  
INSERT INTO d_test.t_test (`something`, `c_time`) VALUES ('something', times);  
select something from d_test.t_test where c_times = times;  
```  

现在我还在使用这个方法， 当数据跑出来的时候， 我只需要说一声 c_times 是 7 ， 别人就可以得到数据了。  


## 偶尔删除全部数据  

偶尔删除表的全部数据你会怎么做呢？  


### DELETE 清空数据  

最简单的方法莫过于  


```  
SELECT max(c_id) FROM d_test.t_test;  
DELETE FROM d_test.t_test WHERE c_id <= c_max_id;  
```  

或者在命令行连接数据库，执行下面的语句  

```  
DELETE FROM d_test.t_test;  
```  


但是我执行这个语句， 跑了10分钟还没有删完。  

什么？ 数据量有多大呢？  

至少有五百万吧。  

### DROP AND CREATE 

这个时候我们意识到 DELETE 做的事太多了， 需要访问每一条记录。  

干脆我们把表删了， 然后重建 CREATE 得了。  


```  
DROP TABLE d_test.t_test;  
CREATE TABLE d_test.t_test(  
  `c_id` int(10) unsigned NOT NULL AUTO_INCREMENT,  
  PRIMARY KEY (`c_id`)  
) ENGINE=InnoDB  DEFAULT CHARSET=utf8;  

```  

实际上我也是这样干的， 一会就执行完两条语句了。  

官网上有关于 [drop][drop-table] 的讲解。  

[stackoverflow][delete-all-query-or-drop-query] 上更有这个[类似][delete-all-query-or-drop-query]的问题。  


然后我了解到，如果需要删除全部数据的话， 有个 **truncate optimization**.  



> A default build of SQLite, if a DELETE statement has no WHERE clause and operates on a table with no triggers, an optimization occurs that causes the DELETE to occur by dropping and recreating the table.  
 
> Dropping and recreating a table is usually much faster than deleting the table content row by row.  
 
> This is the "truncate optimization".  


然后我在官网查到怎么使用这个 [truncate optimization][truncate-table].  

```  
TRUNCATE TABLE d_test.t_test;  
```  

官网是这样介绍的。  

> TRUNCATE TABLE empties a table completely.   

> It requires the DROP privilege.  

> Logically, TRUNCATE TABLE is similar to a DELETE statement that deletes all rows, or a sequence of DROP TABLE and CREATE TABLE statements.   

> To achieve high performance, it bypasses the DML method of deleting data.   

> Thus, it cannot be rolled back, it does not cause ON DELETE triggers to fire, and it cannot be performed for InnoDB tables with parent-child foreign key relationships.  

> Although TRUNCATE TABLE is similar to DELETE, it is classified as a DDL statement rather than a DML statement.   


大概意思就是 TRUNCATE TABLE 可以完全的清空表的数据， 需要 DROP(删除表) 的权限。  
逻辑上，  TRUNCATE TABLE 和 删除所有记录的 DELETE 类似， 也和 删除表(DROP TABLE) 再 重建表(CREATE TABLE) 类似。  
只是为了性能， 它使用 DML 方法删除数据的。  
因此它不能回滚数据， 它不能触发 DELETE 触发器， 如果有外键依赖与它的话， 将不能执行。  


关于这三个删除全部数据的性能， 经过阅读文档，得出这个结论： `drop> truncate > delete `.  

任何事情都有两面性， 性能高了， 其他方面就弱了， 比如安全方面。  

delete 是有事务的， 也就是可以恢复数据的， 但是 其他两个， 就不能恢复数据了。  


### 附加知识  

这里我看看到了 DDL 这个词， 什么意思呢？  

原来 SQL 的命令分四部分： DDL,DML,DCL,TCL。  

* DDL(Data Definition Language)   
  数据库定义语言(statements are used to define the database structure or schema)  
  用于定义数据库的三级结构，包括外模式、概念模式、内模式及其相互之间的映像，定义数据的完整性、安全控制等约束  
  DDL不需要commit  
  命令: CREATE,ALTER,DROP,TRUNCATE,COMMENT,RENAME  
* DML(Data Manipulation Language)  
  数据操纵语言(statements are used for managing data within schema objects)  
  由DBMS提供，用于让用户或程序员使用，实现对数据库中数据的操作。  
  需要commit.  
  命令: SELECT,INSERT,UPDATE,DELETE,MERGE,CALL,EXPLAIN PLAN,LOCK TABLE  
* DCL(Data Control Language)  
  数据库控制语言  
  授权，角色控制等  
  命令: GRANT,REVOKE  
* TCL(Transaction Control Language)  
  事务控制语言  
  命令: SAVEPOINT,ROLLBACK,SET TRANSACTION  







[truncate-table]: http://dev.mysql.com/doc/refman/5.6/en/truncate-table.html  
[delete-all-query-or-drop-query]: http://stackoverflow.com/questions/7401609/delete-all-query-or-drop-query  
[drop-table]: http://dev.mysql.com/doc/refman/5.6/en/drop-table.html  