---
layout: page
title: 程序错误集
---

## android

### HAX kernel module is not installed

```
Starting emulator for AVD 'Nexus_5_API_23_x86'
emulator: ERROR: x86 emulation currently requires hardware acceleration!
Please ensure Intel HAXM is properly installed and usable.
CPU acceleration status: HAX kernel module is not installed!
```


简单的说就是没有安装对应的依赖包.    
我当时下载的是android studio, 好几G, 安装后就以为所有的依赖包都有了.  
这个依赖包大概是Extra目录里的 "HAXM installer"吧.  


### No cached version of XXX available for offline mode
         
```
Error:A problem occurred configuring project ':app'.
> Could not resolve all dependencies for configuration ':app:_debugUnitTestCompile'.
   > Could not resolve junit:junit:4.12.
     Required by:
         AndroidTestTwo:app:unspecified
      > No cached version of junit:junit:4.12 available for offline mode.
```

Gradle需要下载依赖包, 但是设置中禁止联网了.  




### EmptyThrowable: The APK file XXX does not exist on disk


```
14:00:36 Executing tasks: [:app:assembleDebug]
14:00:47 Gradle build finished with 1 error(s) in 10s 853ms
14:00:47 EmptyThrowable: The APK file E:\AndroidStudioProjects\AndroidTestTwo\app\build\outputs\apk\app-debug.apk does not exist on disk.
```


需要先编译通过, 然后才能运行app.   



## 数据库


### 设置编码


```
set names utf8;
```


### 数据库 表大小

* TABLE_SCHEMA : 数据库名  
* TABLE_NAME：表名   
* ENGINE：所使用的存储引擎  
* TABLES_ROWS：记录数  
* DATA_LENGTH：数据大小  
* INDEX_LENGTH：索引大小  


### 表大小

```
SELECT TABLE_NAME,DATA_LENGTH+INDEX_LENGTH,TABLE_ROWS FROM information_schema.TABLES WHERE TABLE_SCHEMA='数据库名' AND TABLE_NAME='表名'
```
 
### 库大小

```
SELECT sum(DATA_LENGTH)+sum(INDEX_LENGTH) FROM information_schema.TABLES where TABLE_SCHEMA='数据库名';
```

### 字符个数

```
select c_tid, length(c_fields)-length(replace(c_fields,',','')) as c_count from t_data_cgi_config order by c_count desc;
select c_groupid, length(c_fieldid)-length(replace(c_fieldid,',','')) as c_count from t_field_group where c_tableid='2001' order by c_count desc;
```

### REPLACE 


REPLACE works exactly like INSERT, except that if an old row in the table has the same value as a new row for a PRIMARY KEY or a UNIQUE index, the old row is deleted before the new row is inserted.   


REPLACE is a MySQL extension to the SQL standard.     
It either inserts, or deletes and inserts.   
For another MySQL extension to standard SQL—that either inserts or updates  


>  REPLACE makes sense only if a table has a PRIMARY KEY or UNIQUE index.   
>  Otherwise, it becomes equivalent to INSERT, because there is no index to be used to determine whether a new row duplicates another.  


Values for all columns are taken from the values specified in the REPLACE statement.   
Any missing columns are set to their default values, just as happens for INSERT.   
You cannot refer to values from the current row and use them in the new row.   
If you use an assignment such as SET col_name = col_name + 1, the reference to the column name on the right hand side is treated as   DEFAULT(col_name), so the assignment is equivalent to SET col_name = DEFAULT(col_name) + 1.  


To use REPLACE, you must have both the INSERT and DELETE privileges for the table.  

The REPLACE statement returns a count to indicate the number of rows affected.   
This is the sum of the rows deleted and inserted.   
If the count is 1 for a single-row REPLACE, a row was inserted and no rows were deleted.   
If the count is greater than 1, one or more old rows were deleted before the new row was inserted.   
It is possible for a single row to replace more than one old row if the table contains multiple unique indexes and the new row duplicates values for different old rows in different unique indexes.  

The affected-rows count makes it easy to determine whether REPLACE only added a row or whether it also replaced any rows: Check whether the count is 1 (added) or greater (replaced).  

If you are using the C API, the affected-rows count can be obtained using the mysql_affected_rows() function.  

Currently, you cannot replace into a table and select from the same table in a subquery.  

MySQL uses the following algorithm for REPLACE (and LOAD DATA ... REPLACE):  

Try to insert the new row into the table  

While the insertion fails because a duplicate-key error occurs for a primary key or unique index:  

Delete from the table the conflicting row that has the duplicate key value  

Try again to insert the new row into the table  

It is possible that in the case of a duplicate-key error, a storage engine may perform the REPLACE as an update rather than a delete plus insert, but the semantics are the same.   
There are no user-visible effects other than a possible difference in how the storage engine increments Handler_xxx status variables.  


## 优化

### TcMalloc优化内存


TcMalloc是一个针对多线程并发做了优化的高性能内存分配器。主要通过对每个线程有自己的缓存及无锁的数据结构实现了高性能，官方提供了相应的性能测试结果，但由于生产环节不同（CPU架构、编译器版本），各项指标也会略有不同以及业务特点不同多为小内存分配，所以我们在使用前最好也先做性能测试，做到一切尽在掌握。  

在单线程的情况下glibc自带的内存分配在小内存的情况相比TcMalloc还要相对有优势，分配到了1MB时TcMalloc才开始比glibc快。  
而在多线程的情况，TcMalloc性能完全是碾压glibc，glibc增长几乎随着分配字节大小近指数增长  

tcmalloc是gperftools套装之一，是作为一个lib存在，编译时只要将这个lib链接进去，就能有效提高内存分配性能。在小内存分配频繁的业务场景下，带来的性能提升非常明显。  


tomalloc本质是一个内存池，不过它是直接替换malloc,free函数，在这点上比起普通内存池要更高效。  
对小内存,tcmalloc按8的整数次倍分配内存，对于大内存，按4k的整数次倍分配内存。线程中有各自每种尺寸的分配器。一个线程的空闲内存较多时会交还给进程，进程可以调配给其他线程使用。  
作为内存池就必然会带来空间利用率方面的损失。不过对于我们大多数后台服务来说，使用100M内存和110M内存，对服务器来说没有太大区别。  
tcmalloc的意义是不需要任何开发代价(只需要在makefile中链上这个库)，就能提高内存分配效率。  

使用:  

将编译好的两个动态库(libunwind.so.8、libtcmalloc.so)放到指定位置, 然后配置文件配置一下.    




## 规范


```
一、带项目	

最近一年内，参与过部门级的项目，并承担关键任务;		
最近一年内，成功主导过部门级关键项目，或参与过跨部门项目,承担过关键任务			
最近一年内，成功主导过跨部门的重大项目;		


二、写文档	

最近一年内，参与过本岗位或部门内的流程优化或制度/文档建设工作;		
最近一年内，主导过部门内的流程优化或制度/文档建设工作；或参与过公司级的流程优化或制度/文档建设工作;	
最近一年内，主导过公司级或本专业领域内的流程优化或制度/文档建设工作		


三、讲课程

至少讲授过一门内部课程（不限内容），最近一年的授课时数在4小时以上(包括部门内部培训)		
至少讲授或者开发过一门本通道内的专业课程，最近一年的授课时数在4小时以上(包括部门内部培训)			
至少开发过一门本通道内的专业课程，并且最近一年的公司级授课时数在7小时以上		


四、轮岗位

参加工作以来,至少在本专业领域做过两个以上模块工作,且每个时间不少于半年			
参加工作以来,至少在本专业领域做过三个以上岗位工作,且每个岗位时间不少于半年		


五、培养人

担任过至少一次新员工导师或辅导过在职员工，时间至少三个月			
担任过至少三次新员工导师或辅导过在职员工，时间每人至少三个月
```


## 语言

> 后台系统里没有什么事是一层中间层不能解决的，如果有，那就两层  


> 看不惯别人，是否说明自己修养不够？  


> 我确信已发现了一种美妙的架构，同时满足CAP，可惜这里空白的地方太小，写不下。  


> Less is more.  






