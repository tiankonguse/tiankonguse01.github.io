---
layout: post
title: cjson 源码阅读笔记
description: 之前看了sphinx的源码之后，心中大概有了json实现的原型，但是没想到c语言的json实现是如此的暴力简单。      
tags:  cjson 源码 解析 序列化 自动机
keywords: cjson, 源码, 解析, 序列化, 自动机
updateData:  16:25 2014/12/18
categories: [软件研究]
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


## json 内存管理


### hook 管理函数


在 c 语言中内存一般是 malloc 和 free 的。  

为了方便用户自由的管理内存， cjson 使用 Hook 技术来让使用者可以自定义内存管理函数。  

即用户自定义 malloc 和 free.  

具体实现方式可以参考下面的代码， 默认使用系统的 malloc 和 free 函数， 用过 cJSON_InitHooks 函数可以替换成用户自定义的 malloc 和 free 函数。  


```
typedef struct cJSON_Hooks {
    void *(*malloc_fn)(size_t sz);
    void (*free_fn)(void *ptr);
} cJSON_Hooks;

static void *(*cJSON_malloc)(size_t sz) = malloc;
static void (*cJSON_free)(void *ptr) = free;

void cJSON_InitHooks(cJSON_Hooks* hooks) {
    if (!hooks) { /* Reset hooks */
        cJSON_malloc = malloc;
        cJSON_free = free;
        return;
    }

    cJSON_malloc = (hooks->malloc_fn)?hooks->malloc_fn:malloc;
    cJSON_free = (hooks->free_fn)?hooks->free_fn:free;
}
```

### 创建节点


有了内存管理函数，我们就可以生成我们的 value 节点了。  

```
/* Internal constructor. */
static cJSON *cJSON_New_Item(void) {
    cJSON* node = (cJSON*)cJSON_malloc(sizeof(cJSON));
    if (node) memset(node,0,sizeof(cJSON));
    return node;
}
```

然后通过再设置具体的类型即生成对应类型的节点。  


```
/* Create basic types: */
cJSON *cJSON_CreateNull(void) {
    cJSON *item=cJSON_New_Item();
    if(item)item->type=cJSON_NULL;
    return item;
}
cJSON *cJSON_CreateTrue(void);
cJSON *cJSON_CreateFalse(void);
cJSON *cJSON_CreateBool(int b) {
    cJSON *item=cJSON_New_Item();
    if(item)item->type=b?cJSON_True:cJSON_False;
    return item;
}
cJSON *cJSON_CreateNumber(double num) {
    cJSON *item=cJSON_New_Item();
    if(item) {
        item->type=cJSON_Number;
        item->valuedouble=num;
        item->valueint=(int)num;
    }
    return item;
}
cJSON *cJSON_CreateString(const char *string) {
    cJSON *item=cJSON_New_Item();
    if(item) {
        item->type=cJSON_String;
        item->valuestring=cJSON_strdup(string);
    }
    return item;
}
cJSON *cJSON_CreateArray(void);
cJSON *cJSON_CreateObject(void);
```


上面我们看到一个 cJSON_strdup 函数， 简单的理解就是复制字符串，返回新的字符串的指针。  


### 删除节点


删除节点很简单， 先删除儿子，然后清理内存即可。  

总结一下就是对于 object 和 array 需要先删除儿子，然后删除自己。  
对于 字符串， 需要先释放字符串的内存， 再释放自己这块内存。  
对于其他节点，直接释放自己这块内存。  


```
/* Delete a cJSON structure. */
void cJSON_Delete(cJSON *c) {
    cJSON *next;
    while (c) {
        next=c->next;
        if (!(c->type&cJSON_IsReference) && c->child) cJSON_Delete(c->child);
        if (!(c->type&cJSON_IsReference) && c->valuestring) cJSON_free(c->valuestring);
        if (c->string) cJSON_free(c->string);
        cJSON_free(c);
        c=next;
    }
}
```


## 节点操作


有了内存管理，我们就可以得到一些列不同类型的节点了。  

然后我们通过节点操作就可以把这些节点连接起来，组成一棵树。  

是的，所有的json 都可以理解为一颗有根树。  


而节点操作有把加点 a 添加为节点 b 的儿子， 把节点 b 从节点 a 的儿子中删除。  

或者修改节点 a 的值或者查询节点 a 的值。  

对，就是传说中的 ** 增删改查 **。  


### 添加儿子节点


添加儿子节点有两种情况，一种是给 object 增加儿子， 一种是给 array 增加儿子。  

object 和 array 相比, 仅仅多了一个操作 ，即设置 key .  

所以我们可以再 object 中设置完 key 之后再调用 给 array 添加儿子的操作来实现给 object 添加儿子。  

具体参考胆码。


```
/* Utility for array list handling. */
static void suffix_object(cJSON *prev,cJSON *item) {
    //两个兄弟的指针互相指向对方
    prev->next=item; 
    item->prev=prev;
}

/* Add item to array/object. */
void   cJSON_AddItemToArray(cJSON *array, cJSON *item) {
    cJSON *c=array->child;
    if (!item) return;
    if (!c) {
        array->child=item; //之前没有儿子，直接添加
    } else {
        while (c && c->next) c=c->next; // 先找到最后一个儿子。
        suffix_object(c,item); // 添加儿子， c 是 item 的兄弟
    }
}

void   cJSON_AddItemToObject(cJSON *object,const char *string,cJSON *item) {
    if (!item) return;
    if (item->string) cJSON_free(item->string);//这个 儿子之前有key, 先清理了。  
    item->string=cJSON_strdup(string); // 设置 key
    cJSON_AddItemToArray(object,item); // 添加儿子
}
```

实际上上面这两个操作即可满足我们的添加需求了。  

但是 cjson 为了我们更方便的使用添加节点的操作， 它又封装了一些操作， 当然使用宏定义封装的。    

比如我们平常给 object 增加一个 false 儿子需要这样 


```
cJSON_AddItemToObject(object, name, cJSON_CreateFalse())
```

现在我们只需要这样

```
cJSON_AddFalseToObject(object,name)
```

具体实现方式就是定义一个宏。  

而且 cjson 只定义了对象的添加，而没有对数组定义这个宏。  

大概原因是那时候， 一般一个数组内的元素的类型都是相同的吧， 不像对象这么灵活。  


```
/* Macros for creating things quickly. */
#define cJSON_AddNullToObject(object,name)		cJSON_AddItemToObject(object, name, cJSON_CreateNull())
#define cJSON_AddTrueToObject(object,name)		cJSON_AddItemToObject(object, name, cJSON_CreateTrue())
#define cJSON_AddFalseToObject(object,name)		cJSON_AddItemToObject(object, name, cJSON_CreateFalse())
#define cJSON_AddBoolToObject(object,name,b)	cJSON_AddItemToObject(object, name, cJSON_CreateBool(b))
#define cJSON_AddNumberToObject(object,name,n)	cJSON_AddItemToObject(object, name, cJSON_CreateNumber(n))
#define cJSON_AddStringToObject(object,name,s)	cJSON_AddItemToObject(object, name, cJSON_CreateString(s))
```

因此 cjson 还专门为 数组定义了下面的批量创建节点。  


```
/* These utilities create an Array of count items. */
cJSON *cJSON_CreateIntArray(const int *numbers,int count);
cJSON *cJSON_CreateFloatArray(const float *numbers,int count);
cJSON *cJSON_CreateDoubleArray(const double *numbers,int count);
cJSON *cJSON_CreateStringArray(const char **strings,int count);
```


另外， 当我们要添加的节点已经在一个树上的时候， 再向另一个树中添加这个节点时， 这个节点的 pre 和 next 指针会被覆盖。  

于是 cjson 又提供了一种引用性添加节点的方法。  

简单的说就是在创建一个 item, 新创建的 item 的 value 指针直接指向原来的 value 值， 这样两个 item 就指向了同一个 item 了。  

但是这个引用计数是个难题， cjson 也没有处理好， 只能引用一次， 大家可以想象怎么解决。  

我们先来看看 cjson 的引用是怎么实现的。  


```
/* Utility for handling references. */
static cJSON *create_reference(cJSON *item) {
    cJSON *ref=cJSON_New_Item();
    if (!ref) return 0;
    memcpy(ref,item,sizeof(cJSON));
    ref->string=0;
    ref->type|=cJSON_IsReference;
    ref->next=ref->prev=0;
    return ref;
}
```

上面的引用计数仅仅存在 type 里面，显示是有问题的。  

我们的 value 是保持不变的，所有的引用都指向这个value.  

所以我们可以通过一个和 value 类似的东西， 大家都指向这个 东西， 新增加一个引用的时候加1， 释放一个引用的时候减一即可。  

这个看着怎么那么像智能指针呢？  


这个话题就说到这吧，实现方式很多的，大家自己多想想。  


### 删除儿子节点

删除也是从 array 和 object 中删除，实现就比较简洁了。  


```
void   cJSON_DeleteItemFromArray(cJSON *array,int which) {
    cJSON_Delete(cJSON_DetachItemFromArray(array,which));
}
void   cJSON_DeleteItemFromObject(cJSON *object,const char *string) {
    cJSON_Delete(cJSON_DetachItemFromObject(object,string));
}
```

Detach 是什么东西呢？  

我们把一个节点从 json 树中删除， 但是不释放内存，而是先保留这个节点的指针， 这样储存在这个节点的信息都保留了下来。   

接下来我们就可以做很多事了， 合适的时候添加到其他对象中， 合适的时候释放内存。  

比如上面的 delete 函数， 就需要真实的删除了， 这个时候我们删除即可。  

而 detach 实现也比较简单， 只是少了一步删除操作。  

```
// 节点从双向链表中删除即可
cJSON *cJSON_DetachItemFromArray(cJSON *array,int which) {
    cJSON *c=array->child;
    while (c && which>0) c=c->next,which--;
    if (!c) return 0;
    if (c->prev) c->prev->next=c->next;
    if (c->next) c->next->prev=c->prev;
    if (c==array->child) array->child=c->next;
    c->prev=c->next=0;
    return c;
}
cJSON *cJSON_DetachItemFromObject(cJSON *object,const char *string) {
    int i=0;
    cJSON *c=object->child;
    while (c && cJSON_strcasecmp(c->string,string)) i++,c=c->next;
    if (c) return cJSON_DetachItemFromArray(object,i);
    return 0;
}
```

### 查找节点

对于一般类型的item, 我们直接就得到对应的节点.   

但是对于 array 和 object , 我们需要查找对应的节点, 所以就需要去查找了。  

这个查找算法由 cjson 的储存节点方式决定着。  

由于cjson 采用链表储存了， 所以查找当时只能是暴力遍历了。  

```
cJSON *cJSON_GetArrayItem(cJSON *array,int item) {
    cJSON *c=array->child;
    while (c && item>0) item--,c=c->next;
    return c;
}
cJSON *cJSON_GetObjectItem(cJSON *object,const char *string) {
    cJSON *c=object->child;
    while (c && cJSON_strcasecmp(c->string,string)) c=c->next;
    return c;
}
```


### 修改节点

我们查找到对应的节点了，就可以对节点进行简单的修改了。   

什么是简单的修改呢？  

节点的类型不是 array 和 object 都可以算是简单类型,可以直接修改修改其值即可。  

但是对于 array 和 object, 我们想给他赋值的话，涉及到释放就得内存这个问题。

下面我们来看看 cjson 的实现代码。  

```
/* Replace array/object items with new ones. */
void   cJSON_ReplaceItemInArray(cJSON *array,int which,cJSON *newitem) {
    cJSON *c=array->child;
    while (c && which>0) c=c->next,which--;
    if (!c) return;
    newitem->next=c->next;
    newitem->prev=c->prev;
    if (newitem->next) newitem->next->prev=newitem;
    if (c==array->child) array->child=newitem;
    else newitem->prev->next=newitem;
    c->next=c->prev=0;
    cJSON_Delete(c);
}
void   cJSON_ReplaceItemInObject(cJSON *object,const char *string,cJSON *newitem) {
    int i=0;
    cJSON *c=object->child;
    while(c && cJSON_strcasecmp(c->string,string))i++,c=c->next;
    if(c) {
        newitem->string=cJSON_strdup(string);
        cJSON_ReplaceItemInArray(object,i,newitem);
    }
}
```

看到这，可能会产生一个疑问：为什么不先查找得到那个节点的父节点指向自己的指针的引用呢？  

这又是一个很有趣的小知识点， 这里就不展开了。  

实际上这是指针的知识点， 经常会在链表中遇到， 一不小心链表就会因为这个小问题而写残了。  

我以前曾接介绍过这个问题，但不记得具体在哪里介绍了， 大概实在 [hash table 研究与实现][hash-table] 或 [memcached 源码阅读之 hash table][memcached-hash-table] 吧。  


好了， 这个修改操作其实就是链表的替换操作， 我就不展开讨论这个知识点了。  


## json 解析


### 整体解析部分

如果你看过我的 [sphinx 源码阅读之json, hash table配置分析器][sphinx-json-conf] 的话， 你就会发现这个解析其实就是个自动机。  

自动机可以使用一系列状态及模拟栈来实现， 也可以直接使用一些列的递归函数实现。  

本质上是等价的， 建议自己都实现一下。  


```
/* Utility to jump whitespace and cr/lf */
static const char *skip(const char *in) {
    while (in && *in && (unsigned char)*in<=32) in++;
    return in;
}
/* Parse an object - create a new root, and populate. */
cJSON *cJSON_ParseWithOpts(const char *value,const char **return_parse_end,int require_null_terminated) {
    const char *end=0;
    cJSON *c=cJSON_New_Item();
    ep=0;
    if (!c) return 0;       /* memory fail */

    end=parse_value(c,skip(value));
    if (!end) {
        cJSON_Delete(c);    /* parse failure. ep is set. */
        return 0;
    }

    /* if we require null-terminated JSON without appended garbage, skip and then check for a null terminator */
    if (require_null_terminated) {
        end=skip(end);
        if (*end) {
            cJSON_Delete(c);
            ep=end;
            return 0;
        }
    }
    if (return_parse_end) *return_parse_end=end;
    return c;
}

/* Default options for cJSON_Parse */
cJSON *cJSON_Parse(const char *value) {
    return cJSON_ParseWithOpts(value,0,0);
}
```


上面两个函数， 其实对我们有用的只有一句 `end=parse_value(c,skip(value));`, 也就是我们只需要了解一下 `parse_value` 函数即可。  

当然，skip 用于用于忽略空白，这里跳过了 ascii 值小于 32 的。  


```
/* Parser core - when encountering text, process appropriately. */
static const char *parse_value(cJSON *item,const char *value) {
    if (!value)return 0;/* Fail on null. */
    if (!strncmp(value,"null",4)) {
        item->type=cJSON_NULL;
        return value+4;
    }
    if (!strncmp(value,"false",5)) {
        item->type=cJSON_False;
        return value+5;
    }
    if (!strncmp(value,"true",4)) {
        item->type=cJSON_True;
        item->valueint=1;
        return value+4;
    }
    if (*value=='\"') {
        return parse_string(item,value);
    }
    if (*value=='-' || (*value>='0' && *value<='9')) {
        return parse_number(item,value);
    }
    if (*value=='[') {
        return parse_array(item,value);
    }
    if (*value=='{') {
        return parse_object(item,value);
    }

    ep=value;
    return 0;/* failure. */
}
```

parse_value 的实现方式很简单， 根据前几个字符来判断写一个类型是什么。  

如果是 null, false 或 true 设置类型，并返回偏移指针。  

如果是其他的，则进入对应的函数中。  


### 解析字符串部分

解析字符串时， 对于特殊字符也应该转义，比如 "\\\\n" 字符应该转换为 '\\n' 这个换行符。  

当然，如果只有特殊字符转换的话，代码不会又这么长， 对于字符串， 还要支持非 ascii 码的字符， 即 utf8字符。  
这些字符在字符串中会编码为 \\uXXXX 的字符串， 我们现在需要还原为 0-255 的一个字符。  

```
static unsigned parse_hex4(const char *str) {
    unsigned h=0;
    if (*str>='0' && *str<='9') h+=(*str)-'0';
    else if (*str>='A' && *str<='F') h+=10+(*str)-'A';
    else if (*str>='a' && *str<='f') h+=10+(*str)-'a';
    else return 0;
    h=h<<4;
    str++;
    if (*str>='0' && *str<='9') h+=(*str)-'0';
    else if (*str>='A' && *str<='F') h+=10+(*str)-'A';
    else if (*str>='a' && *str<='f') h+=10+(*str)-'a';
    else return 0;
    h=h<<4;
    str++;
    if (*str>='0' && *str<='9') h+=(*str)-'0';
    else if (*str>='A' && *str<='F') h+=10+(*str)-'A';
    else if (*str>='a' && *str<='f') h+=10+(*str)-'a';
    else return 0;
    h=h<<4;
    str++;
    if (*str>='0' && *str<='9') h+=(*str)-'0';
    else if (*str>='A' && *str<='F') h+=10+(*str)-'A';
    else if (*str>='a' && *str<='f') h+=10+(*str)-'a';
    else return 0;
    return h;
}

/* Parse the input text into an unescaped cstring, and populate item. */
static const unsigned char firstByteMark[7] = { 0x00, 0x00, 0xC0, 0xE0, 0xF0, 0xF8, 0xFC };
static const char *parse_string(cJSON *item,const char *str) {
    const char *ptr=str+1;
    char *ptr2;
    char *out;
    int len=0;
    unsigned uc,uc2;
    if (*str!='\"') {
        ep=str;    /* not a string! */
        return 0;
    }

    while (*ptr!='\"' && *ptr && ++len) if (*ptr++ == '\\') ptr++;/* Skip escaped quotes. */

    out=(char*)cJSON_malloc(len+1);/* This is how long we need for the string, roughly. */
    if (!out) return 0;

    ptr=str+1;
    ptr2=out;
    while (*ptr!='\"' && *ptr) {
        if (*ptr!='\\') *ptr2++=*ptr++;
        else {
            ptr++;
            switch (*ptr) {
            case 'b':
                *ptr2++='\b';
                break;
            case 'f':
                *ptr2++='\f';
                break;
            case 'n':
                *ptr2++='\n';
                break;
            case 'r':
                *ptr2++='\r';
                break;
            case 't':
                *ptr2++='\t';
                break;
            case 'u': /* transcode utf16 to utf8. */
                uc=parse_hex4(ptr+1);
                ptr+=4;/* get the unicode char. */

                if ((uc>=0xDC00 && uc<=0xDFFF) || uc==0)break;/* check for invalid.*/

                if (uc>=0xD800 && uc<=0xDBFF) {/* UTF16 surrogate pairs.*/
                    if (ptr[1]!='\\' || ptr[2]!='u')break;/* missing second-half of surrogate.*/
                    uc2=parse_hex4(ptr+3);
                    ptr+=6;
                    if (uc2<0xDC00 || uc2>0xDFFF)break;/* invalid second-half of surrogate.*/
                    uc=0x10000 + (((uc&0x3FF)<<10) | (uc2&0x3FF));
                }

                len=4;
                if (uc<0x80) len=1;
                else if (uc<0x800) len=2;
                else if (uc<0x10000) len=3;
                ptr2+=len;

                switch (len) {
                case 4:
                    *--ptr2 =((uc | 0x80) & 0xBF);
                    uc >>= 6;
                case 3:
                    *--ptr2 =((uc | 0x80) & 0xBF);
                    uc >>= 6;
                case 2:
                    *--ptr2 =((uc | 0x80) & 0xBF);
                    uc >>= 6;
                case 1:
                    *--ptr2 =(uc | firstByteMark[len]);
                }
                ptr2+=len;
                break;
            default:
                *ptr2++=*ptr;
                break;
            }
            ptr++;
        }
    }
    *ptr2=0;
    if (*ptr=='\"') ptr++;
    item->valuestring=out;
    item->type=cJSON_String;
    return ptr;
}
```


### 解析数字

数字解析需要考虑科学计数法， 即大概形式如下图   

![number-gif][]

```
/* Parse the input text to generate a number, and populate the result into item. */
static const char *parse_number(cJSON *item,const char *num) {
    double n=0,sign=1,scale=0;
    int subscale=0,signsubscale=1;

    if (*num=='-') sign=-1,num++;/* Has sign? */
    if (*num=='0') num++;/* is zero */
    if (*num>='1' && *num<='9')don=(n*10.0)+(*num++ -'0');
    while (*num>='0' && *num<='9');/* Number? */
    if (*num=='.' && num[1]>='0' && num[1]<='9') {
        num++;   /* Fractional part? */
        don=(n*10.0)+(*num++ -'0'),scale--;
        while (*num>='0' && *num<='9');
    }
    if (*num=='e' || *num=='E') {/* Exponent? */
        num++;
        if (*num=='+') num++;
        else if (*num=='-') signsubscale=-1,num++;/* With sign? */
        while (*num>='0' && *num<='9') subscale=(subscale*10)+(*num++ - '0');/* Number? */
    }

    n=sign*n*pow(10.0,(scale+subscale*signsubscale));/* number = +/- number.fraction * 10^+/- exponent */

    item->valuedouble=n;
    item->valueint=(int)n;
    item->type=cJSON_Number;
    return num;
}
```


### 解析数组


解析数组， 需要先遇到 '\[' 这个符号， 然后挨个的读取节点内容， 节点使用 ',' 分隔， ',' 前后还可能有空格， 最后以 ']' 结尾。  

我们要编写的也是这样。  

先创建一个数组对象， 判断是否有儿子， 有的话读取第一个儿子， 然后判断是不是有 逗号， 有的话循环读取后面的儿子。  

最后读取 ']' 即可。  

```
/* Build an array from input text. */
static const char *parse_array(cJSON *item,const char *value) {
    cJSON *child;
    if (*value!='[') {
        ep=value;    /* not an array! */
        return 0;
    }

    item->type=cJSON_Array;
    value=skip(value+1);
    if (*value==']') return value+1;/* empty array. */

    item->child=child=cJSON_New_Item();
    if (!item->child) return 0; /* memory fail */
    value=skip(parse_value(child,skip(value)));/* skip any spacing, get the value. */
    if (!value) return 0;

    while (*value==',') {
        cJSON *new_item;
        if (!(new_item=cJSON_New_Item())) return 0; /* memory fail */
        child->next=new_item;
        new_item->prev=child;
        child=new_item;
        value=skip(parse_value(child,skip(value+1)));
        if (!value) return 0;/* memory fail */
    }

    if (*value==']') return value+1;/* end of array */
    ep=value;
    return 0;/* malformed. */
}
```


### 解析对象


解析对象和解析数组类似， 只不过对象的一个儿子是个 key-value, key 是字符串， value 可能是任何值， key 和 value 用 ":" 分隔。  



```
/* Build an object from the text. */
static const char *parse_object(cJSON *item,const char *value) {
    cJSON *child;
    if (*value!='{') {
        ep=value;    /* not an object! */
        return 0;
    }

    item->type=cJSON_Object;
    value=skip(value+1);
    if (*value=='}') return value+1;/* empty array. */

    item->child=child=cJSON_New_Item();
    if (!item->child) return 0;
    value=skip(parse_string(child,skip(value)));
    if (!value) return 0;
    child->string=child->valuestring;
    child->valuestring=0;
    if (*value!=':') {
        ep=value;    /* fail! */
        return 0;
    }
    value=skip(parse_value(child,skip(value+1)));/* skip any spacing, get the value. */
    if (!value) return 0;

    while (*value==',') {
        cJSON *new_item;
        if (!(new_item=cJSON_New_Item()))return 0; /* memory fail */
        child->next=new_item;
        new_item->prev=child;
        child=new_item;
        value=skip(parse_string(child,skip(value+1)));
        if (!value) return 0;
        child->string=child->valuestring;
        child->valuestring=0;
        if (*value!=':') {
            ep=value;    /* fail! */
            return 0;
        }
        value=skip(parse_value(child,skip(value+1)));/* skip any spacing, get the value. */
        if (!value) return 0;
    }

    if (*value=='}') return value+1;/* end of array */
    ep=value;
    return 0;/* malformed. */
}
```

这样都实现后， 字符串解析为 json 对象就实现了。  


## json 序列化

json 序列化也成为把 json 输出出来。  

一般有两种输出：格式化输出，压缩输出。  

简单的说就是要不要输出一些空白的问题。  

```
/* Render a cJSON item/entity/structure to text. */
char *cJSON_Print(cJSON *item) {
    return print_value(item,0,1);
}
char *cJSON_PrintUnformatted(cJSON *item) {
    return print_value(item,0,0);
}

/* Render a value to text. */
static char *print_value(cJSON *item,int depth,int fmt) {
    char *out=0;
    if (!item) return 0;
    switch ((item->type)&255) {
    case cJSON_NULL:
        out=cJSON_strdup("null");
        break;
    case cJSON_False:
        out=cJSON_strdup("false");
        break;
    case cJSON_True:
        out=cJSON_strdup("true");
        break;
    case cJSON_Number:
        out=print_number(item);
        break;
    case cJSON_String:
        out=print_string(item);
        break;
    case cJSON_Array:
        out=print_array(item,depth,fmt);
        break;
    case cJSON_Object:
        out=print_object(item,depth,fmt);
        break;
    }
    return out;
}
```

由于基本类型输出的实现比较简单，这里就不多说了，这里只说说输出 对象的实现吧。  

假设我们要使用格式化输出， 也就是美化输出。  


cjson 的做法不是边分析 json 边输出， 而是预先将要输的内容全部按字符串存在内存中， 最后输出整个字符串。  

这对于比较大的 json 来说， 内存就是个问题了。  

另外，格式化输出依靠的是节点的深度， 这个也可以优化， 一般宽度超过80 时， 就需要从新的一行算起的。  



```
/* Render an object to text. */
static char *print_object(cJSON *item,int depth,int fmt) {
    char **entries=0,**names=0;
    char *out=0,*ptr,*ret,*str;
    int len=7,i=0,j;
    cJSON *child=item->child;
    int numentries=0,fail=0;
    /* Count the number of entries. */
    while (child) numentries++,child=child->next;
    /* Explicitly handle empty object case */
    if (!numentries) {
        out=(char*)cJSON_malloc(fmt?depth+4:3);
        if (!out)return 0;
        ptr=out;
        *ptr++='{';
        if (fmt) {
            *ptr++='\n';
            for (i=0; i<depth-1; i++) *ptr++='\t';
        }
        *ptr++='}';
        *ptr++=0;
        return out;
    }
    /* Allocate space for the names and the objects */
    entries=(char**)cJSON_malloc(numentries*sizeof(char*));
    if (!entries) return 0;
    names=(char**)cJSON_malloc(numentries*sizeof(char*));
    if (!names) {
        cJSON_free(entries);
        return 0;
    }
    memset(entries,0,sizeof(char*)*numentries);
    memset(names,0,sizeof(char*)*numentries);

    /* Collect all the results into our arrays: */
    child=item->child;
    depth++;
    if (fmt) len+=depth;
    while (child) {
        names[i]=str=print_string_ptr(child->string);
        entries[i++]=ret=print_value(child,depth,fmt);
        if (str && ret) len+=strlen(ret)+strlen(str)+2+(fmt?2+depth:0);
        else fail=1;
        child=child->next;
    }

    /* Try to allocate the output string */
    if (!fail) out=(char*)cJSON_malloc(len);
    if (!out) fail=1;

    /* Handle failure */
    if (fail) {
        for (i=0; i<numentries; i++) {
            if (names[i]) cJSON_free(names[i]);
            if (entries[i]) cJSON_free(entries[i]);
        }
        cJSON_free(names);
        cJSON_free(entries);
        return 0;
    }

    /* Compose the output: */
    *out='{';
    ptr=out+1;
    if (fmt)*ptr++='\n';
    *ptr=0;
    for (i=0; i<numentries; i++) {
        if (fmt) for (j=0; j<depth; j++) *ptr++='\t';
        strcpy(ptr,names[i]);
        ptr+=strlen(names[i]);
        *ptr++=':';
        if (fmt) *ptr++='\t';
        strcpy(ptr,entries[i]);
        ptr+=strlen(entries[i]);
        if (i!=numentries-1) *ptr++=',';
        if (fmt) *ptr++='\n';
        *ptr=0;
        cJSON_free(names[i]);
        cJSON_free(entries[i]);
    }

    cJSON_free(names);
    cJSON_free(entries);
    if (fmt) for (i=0; i<depth-1; i++) *ptr++='\t';
    *ptr++='}';
    *ptr++=0;
    return out;
}
```

《完》


[number-gif]: http://www.json.org/number.gif
[sphinx-json-conf]: http://github.tiankonguse.com/blog/2014/11/28/sphinx-json-conf/
[hash-table]: http://github.tiankonguse.com/blog/2014/11/04/hash-table/
[memcached-hash-table]: http://github.tiankonguse.com/blog/2014/11/07/memcached-hash-table/
[cjson]: http://sourceforge.net/projects/cjson/
[json-org]: http://www.json.org/
[json-org-zh]: http://www.json.org/json-zh.html