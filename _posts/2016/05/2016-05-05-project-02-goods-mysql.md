---  
layout: post  
title: 年轻司机介绍关联商品系统与mysql
description:  作为一个年轻的司机,来公司已经两年了.刚来的时候,做了关联商品系统,现在简单介绍一下.    
updateData:  00:23 2016/05/05
categories: [程序人生]
published: true
---  

## 概要

这篇文章简单的记录做的一个简单的系统, 并介绍一下mysql相关的知识点.  

## 项目背景

以前, 视频投广告一般有这么几种形式:   

1. 页面上留一个固定大小位置, 用于广告系统只能显示广告.  
2. 视频编码时嵌入广告  
3. 播放器根据配置定时向广告系统拉取并显示广告.  

对于像广告系统拉广告的形式, 随机性有点大, 对于视频编码嵌入有过于死板.  
而且这几种广告都与视频内容没关系.  

现在希望有这么一个系统: 用户看视频时, 当用户认为视频里某件物品不错时, 又推送了对应的物品广告, 用户可以点击对应的广告.  
项目的第一期需要编辑手动打上去的, 后续可以走商家打广告, 审核通过后放出去.  


## 项目介绍

需要做一个伴随性广告管理后台.  
这个后台需要支持多种广告形式, 由于广告形式未知, 所以需要拖拽式配置化.  

这个项目需要具备以下几个功能.  

1. 模板拖拽式配置化(过度设计)  
2. 选择某个模板新建广告
3. 提供几个接口供其他系统查询(其他系统曝光这个广告)
4. 广告写入到内存型数据库中供其他系统使用  
5. 提供一个外网cgi供外网拉数据  

流程图如下:  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2147261086.png)



## 项目实现

这个系统实现分为几个模块.  

### 模板模块

一个模板支持文本组件可图片组件.  
其中文本需要限制长度, 图片需要限制文件大小和文件尺寸.  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3081596932.png)

模板信息数据库储存为两个表.    
一张是模板的信息, 一张是模板组件的信息.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3226317163.png)
 
 
模板的功能都是由js实现.  
后台只需要提供增删改查四个接口即可.  
 
 
### 商品模块

商品就是某个模板的实例化.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2444463596.png)


数据库简化为一张表, 商品数据储存为json.  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1003092548.png)


这部分是模板展现, 以及数据填充.  
需要有拉取模板列表(轻量级接口), 拉取模板详情接口, 拉取商品详情接口, 修改商品详情接口, 上传图片接口.  

### 写内存数据库模块

写内存数据库就是一个定时任务脚本, 由于数据量不大, 对数据实时性要求不高, 所以定时增量写还可以接受.  


### 外网CGI

外网CGI只是读内存数据库, 然后返回数据.  
所以性能还是很高的, 没什么瓶颈.  


## 项目结语  

做这个项目, 其实javascript用的较多, 毕竟需要实现一套模板引擎.  
但是这里不介绍javascript, 准备下篇文章介绍.  
这里准备介绍一下mysql数据库.  

 
## mysql介绍

由于mysql是DBA管理的, 所以这里不讨论mysql的主从容灾,读写分离问题.  
这里重点介绍mysql查询.  

当然, 写查询的过程中, 这里更偏向于研究其中的相关算法.  


mysql接收到查询sql后, 一般会做下面几件事.  

1. 解析sql (词法分析, 语法分析, 语义分析)
2. 重写sql
3. 优化sql
4. 编译sql
5. 执行


### 解析sql

解析很容易理解, 就像我们的编译型语言的编译器.  
提前检查代码合法性, 并转化为内部表示法.  

这里主要完成下面几件事.  

1. 词法分析 - 分成一个一个的单词和符合. 不识别的直接报错
2. 语法分析 - 按照指定的语法, 进行匹配解析. 比如 [select](http://dev.mysql.com/doc/refman/5.7/en/select.html)语法.  
3. 语义分析 - 比如mysql中有各种函数, 需要检查函数是否正确调用, 类型是否正确.  
4. 数据库, 表, 字段 合法性检查. - 需要检查是否存在
5. 权限检查 - 这个用户是否有更改操作等.  


### 重写sql

mysql内部有很多重写规则, 当检查到和某个规则匹配时, 会执行对应的重新规则.  

比如子查询转化.    

```
SELECT 
    t_meterial_relation . *
FROM
    t_meterial_relation
where
    t_meterial_relation.c_template_id in (SELECT 
            t_meterial_template.c_template_id
        FROM
            t_meterial_template
        where
            t_meterial_template.c_title like '%商品%');
```

可能会被转化为下面的形式(只是可能).  


```
explain SELECT 
    t_meterial_relation . *
FROM
    t_meterial_template,
    t_meterial_relation
where
    t_meterial_relation.c_template_id = t_meterial_template.c_template_id
        and t_meterial_template.c_title like '%商品%';
```

重写的目的有下面几个:  

* 去除不必要的运算符  
* 排除冗余的联接  
* 常数计算赋值  
* 其他  


### 优化sql  

这里的优化大多数是对联接查询的优化.  
大概方法是对每个运算标记一个成本，通过选择成本最低的一系列运算，来找到最佳的降低查询成本的方法。  
比如 `A JOIN B` 的成本跟 `B JOIN A`的成本是不同的, 优化器会选择适当的方法进行优化.  
  

### 查询


假设我们需要查询`A JOIN B`





## 结语

结语  





