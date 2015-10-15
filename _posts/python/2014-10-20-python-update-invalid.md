---
layout:     post
title:      python mysql 更新和插入数据无效
description: 之前使用 python 一直是查询mysql语句，今天进行插入数据发现没有生效，于是查找了一下资料，发现需要 commit 事务。 
keywords: python, mysql, insert, update, 无效, 事务, commit
tags: python mysql insert update 无效 事务 commit
categories: [程序人生]
---


## 无效原因

在 [这里][cnblogs] 中文原因， 在 [官网][python-sqlite3] 上也找到英文原因了，简单的说就是

> python 操作mysql 是用 事物的方式来实现的，所以在update 或 insert 的时候 必须有commit 提交的过程，否则数据表不会生效;

>This method commits the current transaction.   
>If you don’t call this method, anything you did since the last call to commit() is not visible from other database connections.   
>If you wonder why you don’t see the data you’ve written to the database, please check you didn’t forget to call this method.


简单的说就是执行修改数据库的操作后，需要提交，才会确认执行。


## 文档的一个问题

如果你点开我的那个官方文档的话，会发现这个不是 mysql 的文档，而是 sqlite3 的文档。

因为在官方文档 没有 mysql 的文档，至少 2014-10-20 19:28:00 这个时候没有。




## 样例代码

直接 copy 官网的样例代码了。

```python
import MySQLdb

dbcfg   = {'host' : '127.0.0.1', 'port' : 3306, 'user' : 'test', 'passwd' : 'test', 'db' : 'test'}

try:
    conn = MySQLdb.connect(host=dbcfg["host"], user=dbcfg["user"], passwd=dbcfg["passwd"], db=dbcfg["db"], port=dbcfg["port"], charset='utf8')
    cur = conn.cursor()
    
    # Create table
    cur.execute("CREATE TABLE test(date text, trans text, symbol text, qty real, price real)")
    
    # Insert a row of data
    cur.execute("INSERT INTO test VALUES ('2006-01-05','BUY','RHAT',100,35.14)")    
    
    ## Never do this -- insecure!
    symbol = 'RHAT'
    
    # escape string
    symbol = conn.escape_string(symbol)
    
    # select
    c.execute("SELECT * FROM test WHERE symbol = '%s'" % symbol)
    
    # Save (commit) the changes
    conn.commit()
    
    # We can also close the connection if we are done with it.
    # Just be sure any changes have been committed or they will be lost.
    conn.close()
except MySQLdb.Error,e:
     print("Mysql Error %d: %s" % (e.args[0], e.args[1]))
```



## 官方资料

后来发现，之所以官方没有 mysql 的文档，是因为官方制定了[数据库操作的标准][python-peps].  
所有的数据库都按照这个标准提供接口的，所以只需要提供一个样例接口就行了。


[python-peps]: http://legacy.python.org/dev/peps/pep-0249/
[python-sqlite3]: https://docs.python.org/2/library/sqlite3.html
[cnblogs]: http://www.cnblogs.com/mingaixin/archive/2012/09/10/2679269.html
