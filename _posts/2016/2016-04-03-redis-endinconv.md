---  
layout: post  
title: redis源码阅读之大小端转换
description:  大小端转换起始很简单，告诉你指定长度，然后翻转即可。  
updateData:  22:51 2016/04/03
categories: [数据库]
---  


## 背景

redis是一个很不错的NOSQL数据库。  
关于redis的使用文档， 可以参考[这里]({{ site.data.link.github_tiankonguse_redis_doc }}).  
关于redis大小端转换的源码可以参考[这里]({{ site.data.link.github_tiankonguse_git_redis_endinconv }})  


## 功能

一般需要进行大小端转换的有`short`(16位), `int`(32位), `long long`(64位).  
而下面这三个函数分别调用了对应的通用的转换函数。  

```
uint16_t intrev16(uint16_t v) {
    memrev16(&v);
    return v;
}

uint32_t intrev32(uint32_t v) {
    memrev32(&v);
    return v;
}

uint64_t intrev64(uint64_t v) {
    memrev64(&v);
    return v;
}
```

## 转换


由于要转换的只有三个尺寸， 所以直接交换即可。  
显然， 交换算法写成函数或者宏更好了。  

```
void memrev16(void *p) {
    unsigned char *x = p, t;
    t = x[0];x[0] = x[1];x[1] = t;
}

void memrev32(void *p) {
    unsigned char *x = p, t;
    t = x[0];x[0] = x[3];x[3] = t;
    t = x[1];x[1] = x[2];x[2] = t;
}

void memrev64(void *p) {
    unsigned char *x = p, t;
    t = x[0];x[0] = x[7];x[7] = t;
    t = x[1];x[1] = x[6];x[6] = t;
    t = x[2];x[2] = x[5];x[5] = t;
    t = x[3];x[3] = x[4];x[4] = t;
}
```

写成宏后就会简单点。  

```
#define SWAP(l, r, t) do{t = l;l = r;l = t;}while(0)

void memrev16(void *p) {
    unsigned char *x = p, t;
    SWAP(x[0], x[1], t);
}

void memrev32(void *p) {
    unsigned char *x = p, t;
    SWAP(x[0], x[3], t);
    SWAP(x[1], x[2], t);
}

void memrev64(void *p) {
    unsigned char *x = p, t;
    SWAP(x[0], x[7], t);
    SWAP(x[1], x[6], t);
    SWAP(x[2], x[5], t);
    SWAP(x[3], x[4], t);
}
```

虽然只有三个， 如果封装成通用的函数就更好了。  


```
#define SWAP(l, r, t) do{t = l;l = r;l = t;}while(0)

void memrev(void *p, int size) {
    unsigned char *x = p, t;
    int l=0, r = size - 1;
    while(l < r){
        SWAP(x[l], x[r], t);
        l++,r--;
    }
}

void memrev16(void *p) {
    memrev(p, 2);
}

void memrev32(void *p) {
    memrev(p, 4);
}

void memrev64(void *p) {
    memrev(p, 8);
}
```







