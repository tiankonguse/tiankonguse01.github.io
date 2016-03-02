---
layout:     post
title:      简单分析一条mysql语句查询top数据
description: 前几天发了一道sql问题，很多人发了自己的答案但是错误的，今天来分析一下怎么解决这个问题吧。这个问题没有几个人能够解决这个问题的。  
keywords: [mysql]
tags: [mysql]
categories: [数据库]
updateData:  13:12 2015/4/13
---  

## 背景

网上遇到一道[mysql问题][sql-top]，我懒得建数据库测试，于是直接去写sql语句，然后发给对方，对方反馈一下我的sql是正确的还是错误的。  

这样一来一回，结果浪费了一个小时时间才写出正确的sql语句来。   


前几天我也把这个问题贴出来了，大家可以在这里看到 《[一条mysql语句查询top数据][department-top-three-salaries]》。  

PS： 如果你使用手机这篇记录，建议使用横屏浏览，后面代码较多，竖屏看起来效果不佳。  


## 前言

要想写出一个问题的正确的sql语句，第一件事是要明白自己想查的是什么数据。  

比如这次，实际上我看到的原问题比我说的隐晦多了，你需要尝试多次才能明白原问题题意的。  


还有，后来我改造问题，让输出 rank, 实际上是简化问题了，或者给你们提示问题的解决方法，但是大家看到rank后，认为问题更难了。  


原文题很简单，直接说你有两张表：员工表（Id， 名字， 薪水，公司id）和公司表（Id ，公司名称）。  

我们的目标是求每个公司下薪水前三的员工信息，输出结果为（公司名称，员工名称，员工薪水）。  

具体的原题，大家可以参考这里 [Department Top Three Salaries][department-top-three-salaries].  

PS:公司换成部门即可  


## 问题分析


### 疑问:公司内输出记录个数

看到这里，我们的第一个疑问是：对于同一个公司，最终输出最多是三个员工吗？ 还是工资相同时，按一个的统计。  

这里我们先假设一下吧。  

** 假设1： 同一个公司下，所有的员工的薪水都不同 **



### 问题简化


虽然问题要查两个表，但是本质上只有第一个表有用。  

假设我们已经挑出符合要求的所有员工了，再和公司表联合查一下，再排一下序，答案就出来了。  


所以这里我们把焦点聚集在第一个表吧，公司名就暂时用公司ID来代替。  


### 搜索所有的数据


这个时候，大家应该都会有所想法吧。   

比如先搜出所有的员工，先按公司排序，再按薪水排序，最后输出。  




```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay FROM Programmer t0  order by t0.Company, Pay desc;
+---------+------------+-------+
| Company | Programmer | Pay   |
+---------+------------+-------+
|       1 | E          | 70000 |
|       1 | H          | 50000 |
|       1 | D          | 40000 |
|       1 | A          | 10000 |
|       2 | C          | 80000 |
|       2 | B          | 60000 |
+---------+------------+-------+
6 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay FROM Programmer t0  order by t0.Company, Pay desc \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using filesort
1 row in set (0.00 sec)
```


>  
>  当然，我们现在先不要说效率什么的， 我们假设只有十几条数据吧， 最后我们解决方案后，在考虑效率的问题。    
>  


### top n 问题


我们现在已经搜索出所有的数据，　但是怎么才能挑选出前几的数据呢？　　

这个是经典的 top n 问题 或者 top k 问题。  

针对这个问题， 已经有现成的解决方案了。  


我们假设只有一个公司， 且这个公司所有员工的薪水不同， 然后要你挑出前几名员工， 你怎么做呢？  


查询的数据如下吧。  

```
mysql> SELECT t0.Id as Id, t0.Name as Name, t0.Pay as Pay, t0.Company as Company FROM test.Programmer t0 where t0.Company=1;
+----+------+-------+---------+
| Id | Name | Pay   | Company |
+----+------+-------+---------+
|  1 | A    | 10000 |       1 |
|  4 | D    | 40000 |       1 |
|  5 | E    | 70000 |       1 |
|  8 | H    | 50000 |       1 |
+----+------+-------+---------+
4 rows in set (0.00 sec)
```


我们还是先输出一个公司的所有员工的信息吧,即假设只有一个公司。  

```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay FROM Programmer t0  order by Pay desc;
+---------+------------+-------+
| Company | Programmer | Pay   |
+---------+------------+-------+
|       1 | E          | 70000 |
|       1 | H          | 50000 |
|       1 | D          | 40000 |
|       1 | A          | 10000 |
+---------+------------+-------+
4 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay FROM Programmer t0  order by Pay desc \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using filesort
1 row in set (0.00 sec)
```


然后我们怎么才能挑出前三呢？  

现在的解决方案一般是通过和自身表联合比较，然后挑选出前几的数据来。  


#### left join 挑出top数据


```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 left join Programmer t1 on(t0.Pay <= t1.Pay) group by t0.Name having(count(*)<=3) order by rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    2 |
|       1 | D          | 40000 |    3 |
+---------+------------+-------+------+
3 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 left join Programmer t1 on(t0.Pay <= t1.Pay) group by t0.Name having(count(*)<=3) order by rank \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: 
2 rows in set (0.00 sec)
```


#### 联合查询挑出top数据

```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 ,Programmer t1 where t0.Pay <= t1.Pay group by t0.Name having(count(*)<=3) order by rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    2 |
|       1 | D          | 40000 |    3 |
+---------+------------+-------+------+
3 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 ,Programmer t1 where t0.Pay <= t1.Pay group by t0.Name having(count(*)<=3) order by rank \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using where; Using join buffer
2 rows in set (0.00 sec)
```

#### 子查询挑出top数据

```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, (select count(*) from Programmer t1 where t0.Pay <= t1.Pay) as rank FROM Programmer t0 where 3 >= (select count(*) from Programmer t1 where t0.Pay <= t1.Pay) order by rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    2 |
|       1 | D          | 40000 |    3 |
+---------+------------+-------+------+
3 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, (select count(*) from Programmer t1 where t0.Pay <= t1.Pay) as rank FROM Programmer t0 where 3 >= (select count(*) from Programmer t1 where t0.Pay <= t1.Pay) order by rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using where; Using filesort
*************************** 2. row ***************************
           id: 3
  select_type: DEPENDENT SUBQUERY
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using where
*************************** 3. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using where
3 rows in set (0.00 sec)
```


大家可以看到上面三种方法都查到了薪水前三的员工，其实哪三种方法还是一个方法:和自身关联统计，只不过形式不一样罢了。  


效率嘛，这里我们先不谈效率，先能做出来在考虑怎么优化。  


突然发现，如果只考虑一个公司且薪水都不同的话， 我们已经搜出答案来了。  


### 分组 top n 问题


那现在假设有多个公司，且公司内薪水不同的话怎么搜吧。  

加个一个公司，相当于数据增加了一个维度，所以我们查询条件增加一个维度就行了。  

上面那句话是什么意思呢？  

还是用代码实例来说明吧。  

下面先来把之前的查询top数据改造成`查询条件增加一个维度`的方式来试试吧。  

查询数据如下吧  

```
mysql> SELECT t0.Id as Id, t0.Name as Name, t0.Pay as Pay, t0.Company as Company FROM test.Programmer t0;
+----+------+-------+---------+
| Id | Name | Pay   | Company |
+----+------+-------+---------+
|  1 | A    | 10000 |       1 |
|  2 | B    | 60000 |       2 |
|  3 | C    | 80000 |       2 |
|  4 | D    | 40000 |       1 |
|  5 | E    | 70000 |       1 |
|  8 | H    | 50000 |       1 |
+----+------+-------+---------+
6 rows in set (0.00 sec)
```



** left join 挑选分组top数据 **

```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 left join Programmer t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Name having(count(*)<=3) order by Company,rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    2 |
|       1 | D          | 40000 |    3 |
|       2 | C          | 80000 |    1 |
|       2 | B          | 60000 |    2 |
+---------+------------+-------+------+
5 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 left join Programmer t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Name having(count(*)<=3) order by Company,rank \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: 
2 rows in set (0.00 sec)
```

** 联合查询 挑选分组top数据 **


```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 ,Programmer t1 where t0.Company = t1.Company and t0.Pay <= t1.Pay group by t0.Company, t0.Name having(count(*)<=3) order by Company,rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    2 |
|       1 | D          | 40000 |    3 |
|       2 | C          | 80000 |    1 |
|       2 | B          | 60000 |    2 |
+---------+------------+-------+------+
5 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 ,Programmer t1 where t0.Company = t1.Company and t0.Pay <= t1.Pay group by t0.Company, t0.Name having(count(*)<=3) order by Company,rank \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using where; Using join buffer
2 rows in set (0.00 sec)
```

** 子查询 挑选分组top数据**

```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, (select count(*) from Programmer t1 where t0.Company = t1.Company and t0.Pay <= t1.Pay) as rank FROM Programmer t0 where 3 >= (select count(*) from Programmer t1 where t0.Company = t1.Company and t0.Pay <= t1.Pay) order by Company,rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    2 |
|       1 | D          | 40000 |    3 |
|       2 | C          | 80000 |    1 |
|       2 | B          | 60000 |    2 |
+---------+------------+-------+------+
5 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, (select count(*) from Programmer t1 where t0.Company = t1.Company and t0.Pay <= t1.Pay) as rank FROM Programmer t0 where 3 >= (select count(*) from Programmer t1 where t0.Company = t1.Company and t0.Pay <= t1.Pay) order by Company,rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using where; Using filesort
*************************** 2. row ***************************
           id: 3
  select_type: DEPENDENT SUBQUERY
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using where
*************************** 3. row ***************************
           id: 2
  select_type: DEPENDENT SUBQUERY
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using where
3 rows in set (0.00 sec)
```

我们看到，使用增加子查询的方法很容易就可以查询到多个公司内的薪水是前几名的员工了。  


### 单公司重复数据top n 问题


上面的查询语句让人很满意， 但是我们的问题还没有解决。  

因为我们做了假设：假设每个公司内员工的薪水互不相同， 这在现实生活中怎么可能呢？  

于是我们需要继续改造我们的 sql 语句了。  


改造前还是需要假设的，因为这个问题有点复杂。  

我们还是假设只有一个公司吧。  


首先展示一下我们的查询数据吧。  

```
mysql> SELECT t0.Id as Id, t0.Name as Name, t0.Pay as Pay, t0.Company as Company FROM test.Programmer t0;
+----+------+-------+---------+
| Id | Name | Pay   | Company |
+----+------+-------+---------+
|  1 | A    | 10000 |       1 |
|  4 | D    | 40000 |       1 |
|  5 | E    | 70000 |       1 |
|  7 | G    | 40000 |       1 |
|  8 | H    | 50000 |       1 |
|  9 | I    | 50000 |       1 |
+----+------+-------+---------+
6 rows in set (0.00 sec)
```


然后我们要做的就是挑出待遇最高的那三个人。  


大部分人跑出的是这个结果。  

```
mysql> SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 left join Programmer t1 on(t0.Pay <= t1.Pay) group by t0.Name having(count(*)<=3) order by rank;
+---------+------------+-------+------+
| Company | Programmer | Pay   | rank |
+---------+------------+-------+------+
|       1 | E          | 70000 |    1 |
|       1 | H          | 50000 |    3 |
|       1 | I          | 50000 |    3 |
+---------+------------+-------+------+
3 rows in set (0.00 sec)

mysql> explain SELECT t0.Company, t0.Name as Programmer, t0.Pay as Pay, count(*) as rank FROM Programmer t0 left join Programmer t1 on(t0.Pay <= t1.Pay) group by t0.Name having(count(*)<=3) order by rank \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: SIMPLE
        table: t1
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: 
2 rows in set (0.00 sec)
```


但是假设第一名70000的也有两个，那你怎么显示呢？  

所以我们需要先挑出去重后的待遇，然后再搜出符合条件的信息。  


** 挑出公司所有员工的不同待遇 **

```
mysql> select distinct  Pay,Company from Programmer;
+-------+---------+
| Pay   | Company |
+-------+---------+
| 10000 |       1 |
| 40000 |       1 |
| 70000 |       1 |
| 50000 |       1 |
+-------+---------+
4 rows in set (0.00 sec)

mysql> explain select distinct  Pay,Company from Programmer \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
1 row in set (0.00 sec)
```

** 挑出所有公司的待遇的前三名 **


```
mysql> SELECT t0.Pay as Pay, count(*) as rank FROM (select distinct Pay from Programmer) t0 left join (select distinct Pay from Programmer) t1 on(t0.Pay <= t1.Pay) group by t0.Pay having(count(*)<=3) order by rank;
+-------+------+
| Pay   | rank |
+-------+------+
| 70000 |    1 |
| 50000 |    2 |
| 40000 |    3 |
+-------+------+
3 rows in set (0.00 sec)

mysql> explain SELECT t0.Pay as Pay, count(*) as rank FROM (select distinct Pay from Programmer) t0 left join (select distinct Pay from Programmer) t1 on(t0.Pay <= t1.Pay) group by t0.Pay having(count(*)<=3) order by rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived3>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: 
*************************** 3. row ***************************
           id: 3
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary
*************************** 4. row ***************************
           id: 2
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary
4 rows in set (0.00 sec)
```

有了这个公司的前三名的待遇，我们就可以搜出对应员工的信息了。  

```
mysql> select t2.Name, t2.Pay, t2.Company, t3.Rank from Programmer t2 inner join (SELECT t0.Pay as Pay, count(*) as Rank FROM (select distinct Pay from Programmer) t0 left join (select distinct Pay from Programmer) t1 on(t0.Pay <= t1.Pay) group by t0.Pay having(count(*)<=3)) t3 on(t2.Pay = t3.Pay) order by Rank;
+------+-------+---------+------+
| Name | Pay   | Company | Rank |
+------+-------+---------+------+
| E    | 70000 |       1 |    1 |
| I    | 50000 |       1 |    2 |
| H    | 50000 |       1 |    2 |
| D    | 40000 |       1 |    3 |
| G    | 40000 |       1 |    3 |
+------+-------+---------+------+
5 rows in set (0.00 sec)

mysql> explain select t2.Name, t2.Pay, t2.Company, t3.Rank from Programmer t2 inner join (SELECT t0.Pay as Pay, count(*) as Rank FROM (select distinct Pay from Programmer) t0 left join (select distinct Pay from Programmer) t1 on(t0.Pay <= t1.Pay) group by t0.Pay having(count(*)<=3)) t3 on(t2.Pay = t3.Pay) order by Rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: t2
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using where; Using join buffer
*************************** 3. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived3>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: Using temporary; Using filesort
*************************** 4. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived4>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 4
        Extra: 
*************************** 5. row ***************************
           id: 4
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary
*************************** 6. row ***************************
           id: 3
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary
6 rows in set (0.00 sec)
```


当然，这个也有很多方法实现到这一步，我就不多说了，我们现在来增加一个维度实现所有公司的查询吧。


### 所有公司重复数据top n 问题

所有公司的数据如下  

```
mysql> SELECT t0.Id as Id, t0.Name as Name, t0.Pay as Pay, t0.Company as Company FROM Programmer t0;
+----+------+-------+---------+
| Id | Name | Pay   | Company |
+----+------+-------+---------+
|  1 | A    | 10000 |       1 |
|  2 | B    | 60000 |       2 |
|  3 | C    | 80000 |       2 |
|  4 | D    | 40000 |       1 |
|  5 | E    | 70000 |       1 |
|  6 | F    | 80000 |       2 |
|  7 | G    | 40000 |       1 |
|  8 | H    | 50000 |       1 |
|  9 | I    | 50000 |       1 |
+----+------+-------+---------+
9 rows in set (0.00 sec)

mysql> explain SELECT t0.Id as Id, t0.Name as Name, t0.Pay as Pay, t0.Company as Company FROM Programmer t0 \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: t0
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: 
1 row in set (0.00 sec)
```


第一步我们仍然是搜索所有公司里面的不同待遇。  

```
mysql> SELECT distinct Pay , Company FROM Programmer;
+-------+---------+
| Pay   | Company |
+-------+---------+
| 10000 |       1 |
| 60000 |       2 |
| 80000 |       2 |
| 40000 |       1 |
| 70000 |       1 |
| 50000 |       1 |
+-------+---------+
6 rows in set (0.00 sec)

mysql> explain SELECT distinct Pay , Company FROM Programmer \G
*************************** 1. row ***************************
           id: 1
  select_type: SIMPLE
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
1 row in set (0.00 sec)
```


第二步是挑出每个公司的前三名。  

```
mysql> SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as rank FROM (SELECT distinct Pay , Company FROM Programmer) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3) order by Company, rank;
+-------+---------+------+
| Pay   | Company | rank |
+-------+---------+------+
| 70000 |       1 |    1 |
| 50000 |       1 |    2 |
| 40000 |       1 |    3 |
| 80000 |       2 |    1 |
| 60000 |       2 |    2 |
+-------+---------+------+
5 rows in set (0.00 sec)

mysql> explain SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as rank FROM (SELECT distinct Pay , Company FROM Programmer) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3) order by Company, rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived3>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: 
*************************** 3. row ***************************
           id: 3
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
*************************** 4. row ***************************
           id: 2
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
4 rows in set (0.00 sec)
```


第三步是挑出每个公司对应待遇的那匹配了。  

```
mysql> select t2.Name, t2.Pay, t2.Company, t3.Rank from  Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as rank FROM (SELECT distinct Pay , Company FROM Programmer) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, rank;
+------+-------+---------+------+
| Name | Pay   | Company | Rank |
+------+-------+---------+------+
| E    | 70000 |       1 |    1 |
| H    | 50000 |       1 |    2 |
| I    | 50000 |       1 |    2 |
| G    | 40000 |       1 |    3 |
| D    | 40000 |       1 |    3 |
| C    | 80000 |       2 |    1 |
| F    | 80000 |       2 |    1 |
| B    | 60000 |       2 |    2 |
+------+-------+---------+------+
8 rows in set (0.00 sec)

mysql> explain select t2.Name, t2.Pay, t2.Company, t3.Rank from  Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as rank FROM (SELECT distinct Pay , Company FROM Programmer) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 5
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: t2
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using where; Using join buffer
*************************** 3. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived3>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary; Using filesort
*************************** 4. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived4>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: 
*************************** 5. row ***************************
           id: 4
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
*************************** 6. row ***************************
           id: 3
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
6 rows in set (0.00 sec)
```

### 解决方案


上面我们搜出了所有公司的前三名，那接下来就是把公司的名字显示出来了。  

我们只需要按上面的步骤的第一步中开始，就加入公司的名字，这样顺着下来就有公司的名字了。  

```
mysql> select t2.Name, t2.Pay, t3.CompanyName  as Company, t3.Rank from  Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank,t0.CompanyName as CompanyName FROM (SELECT distinct Pay , Company, Company.Name as CompanyName FROM Programmer inner join Company on(Programmer.Company = Company.Id)) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, Rank;
+------+-------+----------+------+
| Name | Pay   | Company  | Rank |
+------+-------+----------+------+
| F    | 80000 | alibaba  |    1 |
| C    | 80000 | alibaba  |    1 |
| B    | 60000 | alibaba  |    2 |
| E    | 70000 | baidu    |    1 |
| H    | 50000 | baidu    |    2 |
| I    | 50000 | baidu    |    2 |
| D    | 40000 | baidu    |    3 |
| G    | 40000 | baidu    |    3 |
+------+-------+----------+------+
8 rows in set (0.00 sec)

mysql> explain select t2.Name, t2.Pay, t3.CompanyName  as Company, t3.Rank from  Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank,t0.CompanyName as CompanyName FROM (SELECT distinct Pay , Company, Company.Name as CompanyName FROM Programmer inner join Company on(Programmer.Company = Company.Id)) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, Rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 5
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: t2
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using where; Using join buffer
*************************** 3. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived3>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary; Using filesort
*************************** 4. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived4>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: 
*************************** 5. row ***************************
           id: 4
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
*************************** 6. row ***************************
           id: 3
  select_type: DERIVED
        table: Company
         type: ALL
possible_keys: PRIMARY
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 2
        Extra: Using temporary
*************************** 7. row ***************************
           id: 3
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using where; Using join buffer
7 rows in set (0.00 sec)
```

或者这里我简单写一下步骤。

```
---第一步 搜出所有公司中不同的待遇
SELECT distinct Pay , Company, Company.Name as CompanyName FROM Programmer inner join Company on(Programmer.Company = Company.Id);

---第二步 搜出所有公司前三名的待遇
SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank,t0.CompanyName as CompanyName FROM (SELECT distinct Pay , Company, Company.Name as CompanyName FROM Programmer inner join Company on(Programmer.Company = Company.Id)) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3);

---第三步 搜出所有公司前三名待遇的所有员工
select t2.Name, t2.Pay, t3.CompanyName  as Company, t3.Rank from  Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank,t0.CompanyName as CompanyName FROM (SELECT distinct Pay , Company, Company.Name as CompanyName FROM Programmer inner join Company on(Programmer.Company = Company.Id)) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, Rank;
```

当然，对于公司名字，我们也可以只需要在最后一层加个联合搜索也行。  



```
mysql> select t2.Name, t2.Pay, t4.Name  as Company, t3.Rank from  Company t4 inner join Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank FROM (SELECT distinct Pay , Company FROM Programmer) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t4.Id and t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, Rank; 
+------+-------+----------+------+
| Name | Pay   | Company  | Rank |
+------+-------+----------+------+
| C    | 80000 | alibaba  |    1 |
| F    | 80000 | alibaba  |    1 |
| B    | 60000 | alibaba  |    2 |
| E    | 70000 | baidu    |    1 |
| H    | 50000 | baidu    |    2 |
| I    | 50000 | baidu    |    2 |
| G    | 40000 | baidu    |    3 |
| D    | 40000 | baidu    |    3 |
+------+-------+----------+------+
8 rows in set (0.00 sec)

mysql> explain select t2.Name, t2.Pay, t4.Name  as Company, t3.Rank from  Company t4 inner join Programmer t2 inner join (SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank FROM (SELECT distinct Pay , Company FROM Programmer) t0 left join (SELECT distinct Pay , Company FROM Programmer) t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3)) t3 on(t2.Company = t4.Id and t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, Rank \G
*************************** 1. row ***************************
           id: 1
  select_type: PRIMARY
        table: <derived2>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 5
        Extra: Using temporary; Using filesort
*************************** 2. row ***************************
           id: 1
  select_type: PRIMARY
        table: t2
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using where; Using join buffer
*************************** 3. row ***************************
           id: 1
  select_type: PRIMARY
        table: t4
         type: eq_ref
possible_keys: PRIMARY
          key: PRIMARY
      key_len: 4
          ref: test.t2.Company
         rows: 1
        Extra: Using where
*************************** 4. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived3>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: Using temporary; Using filesort
*************************** 5. row ***************************
           id: 2
  select_type: DERIVED
        table: <derived4>
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 6
        Extra: 
*************************** 6. row ***************************
           id: 4
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
*************************** 7. row ***************************
           id: 3
  select_type: DERIVED
        table: Programmer
         type: ALL
possible_keys: NULL
          key: NULL
      key_len: NULL
          ref: NULL
         rows: 9
        Extra: Using temporary
7 rows in set (0.00 sec)
```

### 结束语


好了，终于写到这里了。  

这个解决方案虽然可以跑出答案来， 但是效率却不高。  

假设有n个公司， 每个公司的的待遇分m级， 每一级有k个人。  

则第一张员工表就会有 `n*m*k`个数据， 第二张表会有 `n` 个数据。  


我们第一步 搜出所有公司中不同的待遇共跑了两次。  

这两次的时间复杂度分别是 `O(n*m*k * n)` 和 `O(n*m*k)`, 操作代价是使用了缓存表。  

这个查询之后， 我们的两张表都有 `n*m` 条数据了。  

```
SELECT distinct Pay , Company, Company.Name as CompanyName FROM Programmer inner join Company on(Programmer.Company = Company.Id) t0
SELECT distinct Pay , Company FROM Programmer t1
```

第二步操作时搜出所有公司前三名的待遇。  

由于我们对临时表进行了`group by`操作，所以操作代价是使用临时表，使用了排序。  

这次查询的时间复杂度是 `O(n*m * n*m)`, 代价比较大。  

但是这个也是为了查处数据排名必须的操作，如果能够有其他的方法当然更好了。  

查询之后， 我们得到的数据还是 `n*3` 条，不过数据带了排名。  


```
SELECT t0.Pay as Pay, t0.Company  as Company, count(*) as Rank,t0.CompanyName as CompanyName FROM t0 left join t1 on(t0.Company = t1.Company and t0.Pay <= t1.Pay) group by t0.Company, t0.Pay having(count(*)<=3) t3;
```

最后一步就是筛选出排名里的数据。  

虽然我们是两个表联合查询的，所以复杂度自然是 `O(n*3 * n)` 了。  

```
select t2.Name, t2.Pay, t3.CompanyName  as Company, t3.Rank from  Programmer t2 inner join t3 on(t2.Company = t3.Company and t2.Pay = t3.Pay) order by Company, Rank;
```


由于我们没有使用子查询，所以这个内部查询和外部查询只交叉一次，所以复杂度就是上面三部复杂度之和了。  


关于具体怎么优化，这里就不继续下去了， 如果有时间，我可以补上一些关于 mysql 优化的一些记录吧。  

## 尾记

好吧，我以前是学算法的，所以我只能从数据量，输入，输出简单来估计复杂度。  

对于那些索引，内存缓存表，磁盘缓存表等复杂度的数量级也相差很大，所以这里就不说那些了。  

[sql-top]: http://github.tiankonguse.com/blog/2015/04/02/sql-top/
[department-top-three-salaries]: https://github.com/tiankonguse/leetcode-solutions/tree/master/department-top-three-salaries