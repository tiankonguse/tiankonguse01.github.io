---
layout: post
title: sphinx 源码阅读之json, hash table配置分析器
description: sphinx 代码量之所以多，现在看来是因为自己造了很多轮子，前几天看到它实现了简单的数据结构和算法，今天又看到它实现了简单那的json和配置文件分析器。
tags: sphinx  搜索引擎 全文检索 开源 源代码 json 分析器 配置文件 
keywords: sphinx, 搜索引擎, 全文检索, 开源, 源代码, 快速排序, 二分查找, json, 分析器, 配置文件 
updateData: 20:42 2014/11/28
categories: [软件研究]
---

![json-cover][]
![auto-string][]

## 前言

读了 sphinx 的读取配置文件的代码， 心中有一个疑问： sphinx  为什么要自己造轮子呢？  
难道现在 sphinx 一直没人升级维护也是这个历史包袱的原因吗？  


不管哪么多了，先来看看 sphinx 怎么分析配置文件以及储存配置文件的吧。  


## 配置文件规则

下面是一个简单的还有增量索引的 sphinx  配置文件。  
其中 inc_source 继承 base_source 源。  
inc_index 继承 inc_index 索引。
然后又简单的配置了 indexer 和 searchd 选项。  

```
source base_source {
	type			= mysql

	sql_host		= 127.0.0.1 
	sql_user		= test 
	sql_pass		= test
	sql_db			= d_test 
	sql_port		= 3306

    sql_query_pre= SET NAMES utf8
    sql_query = select c_id, c_title, c_content, c_comments, c_mtime FROM t_post;
    
    sql_attr_uint = c_comments
	sql_attr_string = c_title 
    sql_field_string = c_content
    sql_field_string = c_mtime
}


source inc_source : base_source{
    sql_query_pre = SET NAMES utf8
    sql_query = select c_id, c_title, c_content, c_comments FROM t_post where c_mtime >=(SELECT c_mtime FROM t_post_inc where c_id = 1) ; 
}

index base_index {
	source			= base_source 
	path			=  var/data/base_index
	docinfo			= extern
	charset_type		= zh_cn.utf-8 
    charset_dictpath =  etc/  
    ngram_len = 0
}

index inc_index : base_index{
    source = inc_source
    path =  var/data/inc_index
}

indexer{
	mem_limit		= 32M
}


searchd{
	listen			= 9312
	listen			= 9306:mysql41
	log			=  var/log/searchd.log
	query_log		=  var/log/query.log
	pid_file		=  var/log/searchd.pid
}
```

## 配置文件数据结构

对于上面的配置文件，我们是可以用一个 json 来表示的。  
也就是就是一系列的递归的 key-value 而已。  
假设整个文件就是一个根的话，那么第一级儿子有 source, index, indexer, searchd 四个儿子。  
然后对于 index 和 source 的儿子是个数组，数组的每个位置都是一个对象，因为可以配置多个 index 和 source.  
对于 indexer 和 searchd 的儿子是一个对象。
上面所说的对象就是一系列的 key-value 叶子节点。  

对于 根 节点， sphinx 使用一个 hash 储存，实际上所有的节点都是使用 hash 来储存的。   

```
/// config (hash of section types)
typedef SmallStringHash_T < CSphConfigType >	CSphConfig;
```

对于第二级节点， 又是另一个 hash 对象。  

```
/// config section type (hash of sections)
typedef SmallStringHash_T < CSphConfigSection >	CSphConfigType;
```

CSphConfigSection 这一级需要表示两种类型： 叶子节点 和 数组。  
于是不是使用简单的 hash 对象， 而需要在 hash 对象基础上封装一层。  
实际上 sphinx 不是封装了一层，而是封装了 三层。  

```
/// config section (hash of variant values)
class CSphConfigSection : public SmallStringHash_T < CSphVariant >;

/// small hash with string keys
template < typename T >
class SmallStringHash_T : public CSphOrderedHash < T, CSphString, CSphStrHashFunc, 256 >;

/// simple dynamic hash
/// implementation: fixed-size bucket + chaining
/// keeps the order, so Iterate() return the entries in the order they was inserted
/// WARNING: slow copy
template < typename T, typename KEY, typename HASHFUNC, int LENGTH > class CSphOrderedHash;
```

最后一层终于看到基类了。

## json 与 hash table

看到这里， 我们发现所有的节点都继承于 SmallStringHash_T 这个模板类。  
这个类帮我们实现了储存 key-value 的方法。  

那他是怎么实现的呢？  
先说说需求吧，我们有一些列的 key-value, 然后我们实现快速添加和查找。  

这个怎么看起来好熟悉的样子？  
对了，这不正是 hash table  做的事情吗？  
前几天我写了两篇文章 [hash table 研究与实现][hash-table] 和 [memcached 源码阅读之 hash table][memcached-hash-table] .  
难道这次又要写一个 sphinx 的 hash table 吗？  

想要知道一个 key-value 是怎么储存的，只需要看看它的 add 函数就可以了。  
下面就先来看看 sphinx 的 add 操作。

```
/// add new entry
/// returns true on success
/// returns false if this key is already hashed
bool Add ( const T & tValue, const KEY & tKey ){
    unsigned int uHash = ( (unsigned int) HASHFUNC::Hash ( tKey ) ) % LENGTH;

    // check if this key is already hashed
    HashEntry_t * pEntry = m_dHash [ uHash ];
    HashEntry_t ** ppEntry = &m_dHash [ uHash ];
    while ( pEntry ){
        if ( pEntry->m_tKey==tKey )return false;
        ppEntry = &pEntry->m_pNextByHash;
        pEntry =   pEntry->m_pNextByHash;
    }

    pEntry = new HashEntry_t;
    // do other thing
}
```

好吧，看到上面那个循环，我又想起了 [memcached 源码阅读之 hash table][memcached-hash-table] 顶端的封面图了。  
典型的链表式 hash 。  

什么意思呢？  
hash 遇到冲突了，以链表的形式储存即可。  

这里就不多说 sphinx 的 hash table 了。  
然后我们通过 hash-table 的递归， 我们就可以实现自己的 json 了吧。  

唯一的不同时 json 储存的类型比较复杂， 而我们的类型比较单一， 叶子节点的值都是 string 和 数字。  
不过这并影响我们自己实现 json 的那些功能。  

## 配置文件解析器


看到这里，我们就会发现储存 配置信息并不是难题， 现在的难题是怎么把这个配置文件转化为我们储存的数据结构。  

其实我们的配置文件还是蛮复杂的，当然我是和 ini配置文件对比的。  
像现在的配置文件， 基本上都是这个形式，而且一般内部还要再嵌套几层。  
不管配置文件有多复杂， 对于我们这个配置文件解析器来说，都一样的。  

为什么这个说呢?  
作为修电脑专业，大家上大学的时候都学过编译原理这门课吧。  
那门课的最初几张就是讲这个解析器的基本原理的，即自动机。  


我们定义一套规则，配置文件按这套规则配置，解析器按照这套规则解析即可。  

说了这个多，还是自动机 的状态吧。  


sphinx 的配置文件可以用下面这几个状态表示。  

```
enum { S_TOP, S_SKIP2NL, S_TOK, S_TYPE, S_SEC, S_CHR, S_VALUE, S_SECNAME, S_SECBASE, S_KEY }
```

S_TOP 是开始的状态。   
而 S_SKIP2NL 是注释的状态，配置文件内一般只支持行注释，所以注释标示符后面的内容我们往往忽略掉。  
当然一般第一行会有特殊的用处，sphinx 也有特殊的用处。  
但是这个我查了文档没有找到， sphinx 源码有大概意思是可以执行指定程序，参数是这个配置文件。  
我们不管这个了。我们就假设没有这一项就行了。  

一般 S_TOP  状态下，忽略空白后，第一个遇到的就是 source， index, searchd, indexer 这四个串中的一个了。  
所以 S_TOP  会先调用 S_TOK 去读取一个单词(token), 然后转到 S_TYPE 状态。  

S_TYPE 会根据读取得到的字符串而分出两个状态来。  
其中 source 和 index 会转向 S_SECNAME 状态， 而 indexer， searchd， 和 common 会转向 S_SEC 状态。  


为什么要这么分呢？  
那是因为 source 和 index 后面会有个名字， 而其他的没有名字，直接就是 key-value 了。  

S_SEC 状态简单， 我们先看 S_SEC 状态的转移。  
当然，在转移到 S_SEC 状态前，我们需要读取一个左大括号 "{", 读取一个确定的单词由状态 S_CHR 完成。  
在 S_SEC 中，我们需要做的是读取一个 key-value, 其中 key-value 用 等号分割。  
于是第一次遇到非空字符，我们需要先读取 key, 于是 S_SEC 转移到 状态 S_KEY。  
而遇到结束符 "}" 代表这个配置结束。  


状态 S_KEY 是一个token, 所以我们需要调用 S_TOK 状态来完成读取这个 token.  

在 S_KEY 中，我们需要先读取 一个确定的等号 "=" (状态 S_CHR)， 然后读取 value, 于是转移到 状态 S_VALUE。  

在状态 S_VALUE 我们需要先把读到的 value 存起来， 然后在遇到结束符的时候调用添加 key-value 的函数。  

这个时候我们就完成了读取 S_SEC 状态的一个 key-value，直到读取到结束符 "}" 我们就回到了 S_TOP 状态。  


当 S_TOP 转向 S_SECNAME 状态时，我们需要先读取 配置名字。  
于是我们先转向 S_TOK 状态读取一个 token.  
然后会遇到两种情况：一种遇到了 开始符号 "{"，我们转向 状态 S_SEC。  
另一种情况我们遇到 ":", 意思是这个配置要集成与之前的某个配置。  
于是我们需要先读取一个 base 的名字，即转向 状态 S_SECBASE 。  

S_SECBASE 状态先转向 S_TOK 来读取一个 base 的名字。  
然后会把 名字为 base 的配置复制到当前配置。  
接着就可以用 S_CHR 读取开始符 "{" 并转向 状态 S_SEC 了。  

这样状态自动机就完成了。  

具体可以参考下面的这幅图：

![sphinx-ac][]


简单的状态如下

```
#define LOC_PUSH(_new) { eStack[iStack++] = eState; eState = _new; }
#define LOC_POP() { eState = eStack[--iStack]; }
#define LOC_BACK() { p--; }
for (;; p++) {
    // if this line is over, load next line

    // handle S_TOP state
    if (eState == S_TOP) {  
        iToken = 0;
        LOC_PUSH(S_TYPE);
        LOC_PUSH(S_TOK);
        LOC_BACK();
        continue;
    }

    // handle S_SKIP2NL state
    if (eState == S_SKIP2NL) {
        LOC_POP ();
        p = pEnd;
        continue;
    }

    // handle S_TOK state
    if (eState == S_TOK) {
        if (!sphIsAlpha(*p)) {
            LOC_POP ();
            sToken[iToken] = '\0';
            iToken = 0;
            LOC_BACK();
            continue;
        }
        if (!iToken) {
            sToken[0] = '\0';
        }
        sToken[iToken++] = *p;
        continue;
    }

    // handle S_TYPE state
    if (eState == S_TYPE) {
        if (IsPlainSection(sToken)) {
            if (!AddSection(sToken, sToken))break;
            sToken[0] = '\0';
            LOC_POP();
            LOC_PUSH(S_SEC);
            LOC_PUSH(S_CHR);
            iCh = '{';
            LOC_BACK();
            continue;
        }
        if (IsNamedSection(sToken)) {
            m_sSectionType = sToken;
            sToken[0] = '\0';
            LOC_POP ();
            LOC_PUSH(S_SECNAME);
            LOC_BACK();
            continue;
        }
    }

    // handle S_CHR state
    if (eState == S_CHR) {
        LOC_POP ();
        continue;
    }

    // handle S_SEC state
    if (eState == S_SEC) {
        if (*p == '}') {
            LOC_POP ();
            continue;
        }
        if (sphIsAlpha(*p)) {
            LOC_PUSH(S_KEY);
            LOC_PUSH(S_TOK);
            LOC_BACK();
            iValue = 0;
            sValue[0] = '\0';
            continue;
        }
    }

    // handle S_KEY state
    if (eState == S_KEY) {
        LOC_POP ();
        LOC_PUSH(S_VALUE);
        LOC_PUSH(S_CHR);
        iCh = '=';
        LOC_BACK()
        continue;
    }

    // handle S_VALUE state
    if (eState == S_VALUE) {
        if (*p == '\n') {
            AddKey(sToken, sValue);
            iValue = 0;
            LOC_POP ();
            continue;
        }
        if (iValue < iValueMax) {
            sValue[iValue++] = *p;
            sValue[iValue] = '\0';
        }
        continue;
    }

    // handle S_SECNAME state
    if (eState == S_SECNAME) {
        if (!sToken[0]) {
            LOC_PUSH(S_TOK);
            LOC_BACK();
            continue;
        }
        AddSection(m_sSectionType.cstr(), sToken);
        sToken[0] = '\0';
        if (*p == ':') {
            eState = S_SECBASE;
            continue;
        }
        if (*p == '{') {
            eState = S_SEC;
            continue;
        }
    }

    // handle S_SECBASE state
    if (eState == S_SECBASE) {
        if (!sToken[0]) {
            LOC_PUSH(S_TOK);
            LOC_BACK()
            ;
            continue;
        }

        // copy the section
        LOC_BACK();
        eState = S_SEC;
        LOC_PUSH(S_CHR);
        iCh = '{';
        continue;
    }
}
```





[sphinx-ac]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/842828130.jpg
[memcached-hash-table]: http://github.tiankonguse.com/blog/2014/11/07/memcached-hash-table/
[hash-table]: http://github.tiankonguse.com/blog/2014/11/04/hash-table/
[auto-string]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1225209794.png
[json-cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1217946526.png