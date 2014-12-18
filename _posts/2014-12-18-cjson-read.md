---
layout: post
title: cjson 源码阅读笔记
category: blog
description: 之前看了sphinx的源码之后，心中大概有了json实现的原型(hashtable实现)，但是没想到c语言的json实现是如此的暴力简单(链表实现)。      
tags:  cjson 源码 解析 序列化 自动机
keywords: cjson, 源码, 解析, 序列化, 自动机
updateData:  16:25 2014/12/18
---


## 前言


cjson 的代码只有 1000+ 行， 而且只是简单的几个函数的调用。  

而且 cjson 还有很多不完善的地方， 推荐大家看完之后自己实现一个 封装好的功能完善的 cjson 程序。  


## json 基本信息


在阅读 json 之前， 建议阅读一下 [json 的官方介绍][json-org]。   

如果上面的英文吓到你了的话， 可以看看这个[中文翻译版本][json-org-zh].  

我的 这个 cjson 是从官网指定的地方下载的 [ourceforge][cjson].  


在看完官网的介绍后，我们知道 json 的 value 存在这么几种类型: 对象， 数组， 字符串， 数字， true, false, null。  

其中对象是一个 key-value 的集合， 而数组是一些 value 的有序列表。  

于是 cjson 中在 头文件中定义了 这些类型的数字编号和 cJSON value 的结构体。  


```
/* cJSON Types: */
#define cJSON_False 0
#define cJSON_True 1
#define cJSON_NULL 2
#define cJSON_Number 3
#define cJSON_String 4
#define cJSON_Array 5
#define cJSON_Object 6

#define cJSON_IsReference 256
```

对于上面的 define , 如果是我的话，会选择 emnu 来实现这个类型的定义。  

例如  


```
enum {cJSON_False, cJSON_True, cJSON_NULL, cJSON_Number, cJSON_String, cJSON_Array, cJSON_Object, cJSON_IsReference=256};
```


然后是 json 一个 value 的结构，看注释也都可以明白干什么的。  


```
/* The cJSON structure: */
typedef struct cJSON {
    struct cJSON *next,*prev;	/同一级的元素使用双向列表储存/
    struct cJSON *child;		/* 如果是个 object 或 array 的话，第一个儿子的指针 */

    int type;					/* value 的类型 */
 
    char *valuestring;			/* 如果这个 value 是 字符串 的话，字符串值 */
    int valueint;				/* 如果是数字的话，整数值 */
    double valuedouble;			/* 如果是数字的话，浮点数值 */

    char *string;				/* 如果是对象的 key-value 元素的话， key 值 */
} cJSON;
```


《完》


[number-gif]: http://www.json.org/number.gif
[sphinx-json-conf]: http://github.tiankonguse.com/blog/2014/11/28/sphinx-json-conf/
[hash-table]: http://github.tiankonguse.com/blog/2014/11/04/hash-table/
[memcached-hash-table]: http://github.tiankonguse.com/blog/2014/11/07/memcached-hash-table/
[cjson]: http://sourceforge.net/projects/cjson/
[json-org]: http://www.json.org/
[json-org-zh]: http://www.json.org/json-zh.html