---
layout:     post
title:      memcached 源码阅读之 字符串 hash 与 搜集的一些 字符串 hash
description: 阅读 memcached 源码的时候，发现 memcached 有两个字符串hash 的代码，于是研究一下,然后理解这个hash的时候，搜集了一些互联网上的字符串hash方法
keywords: memcached, 源码阅读, hash, 字符串
tags: memcached 源码阅读 hash 字符串
updateData: 17:54 2014/11/9
categories: [软件研究]
---

![cover][]

## 前言

在 [memcached 源码阅读之 hash table][memcached-hash-table]文章的最后我说了，要研究一下 memcached 的 字符串 hash 方法的。  
现在就开始记录下研究的结果。  

## Jenkins hash


jenkins 的位置在 [jenkins_hash.c][jenkins_hash] .


### 大端小端


Little-Endian就是低位字节排放在内存的低地址端，高位字节排放在内存的高地址端。  
Big-Endian就是高位字节排放在内存的低地址端，低位字节排放在内存的高地址端。  
举一个例子，比如数字0x12 34 56 78在内存中的表示形式为： 

``` 
1)大端模式：  
低地址 -----------------> 高地址  
0x12  |  0x34  |  0x56  |  0x78  
2)小端模式：  
低地址 ------------------> 高地址  
0x78  |  0x56  |  0x34  |  0x12  
```

```
#if ENDIAN_BIG == 1
# define HASH_LITTLE_ENDIAN 0
# define HASH_BIG_ENDIAN 1
#else
# if ENDIAN_LITTLE == 1
#  define HASH_LITTLE_ENDIAN 1
#  define HASH_BIG_ENDIAN 0
# else
#  define HASH_LITTLE_ENDIAN 0
#  define HASH_BIG_ENDIAN 0
# endif
#endif
```


### rot 宏

看到的第一个是 rot 宏。  
这个宏的作用是循环左移若干位。  

```cpp
#define rot(x,k) (((x)<<(k)) ^ ((x)>>(32-(k))))
```

### mix 宏

一个可逆的加密。  
This is reversible, so any information in (a,b,c) before mix() is still in (a,b,c) after mix().  

```cpp
#define mix(a,b,c) \
{ \
  a -= c;  a ^= rot(c, 4);  c += b; \
  b -= a;  b ^= rot(a, 6);  a += c; \
  c -= b;  c ^= rot(b, 8);  b += a; \
  a -= c;  a ^= rot(c,16);  c += b; \
  b -= a;  b ^= rot(a,19);  a += c; \
  c -= b;  c ^= rot(b, 4);  b += a; \
}
```

### final 宏

final mixing of 3 32-bit values (a,b,c) into c  
将 a,b,c 合并到 c中。  

```cpp
#define final(a,b,c) \
{ \
  c ^= b; c -= rot(b,14); \
  a ^= c; a -= rot(c,11); \
  b ^= a; b -= rot(a,25); \
  c ^= b; c -= rot(b,16); \
  a ^= c; a -= rot(c,4);  \
  b ^= a; b -= rot(a,14); \
  c ^= b; c -= rot(b,24); \
}
```

### hash 算法

源代码中大端小端，而且还分是 0x3 还是 0x1，这个目前就不知道干什么了。  

```
uint32_t jenkins_hash( const void *key, size_t length) {
    uint32_t a,b,c;
    a = b = c = 0xdeadbeef + ((uint32_t)length) + 0;

    const char *k = (const char *)key;
    while (length > 12) {
        a += ((uint32_t)k[0])<<24;
        a += ((uint32_t)k[1])<<16;
        a += ((uint32_t)k[2])<<8;
        a += ((uint32_t)k[3]);
        b += ((uint32_t)k[4])<<24;
        b += ((uint32_t)k[5])<<16;
        b += ((uint32_t)k[6])<<8;
        b += ((uint32_t)k[7]);
        c += ((uint32_t)k[8])<<24;
        c += ((uint32_t)k[9])<<16;
        c += ((uint32_t)k[10])<<8;
        c += ((uint32_t)k[11]);
        mix(a,b,c);
        length -= 12;
        k += 12;
    }
    switch(length) {
    case 12:
        c+=k[11];
    case 11:
        c+=((uint32_t)k[10])<<8;
    case 10:
        c+=((uint32_t)k[9])<<16;
    case 9 :
        c+=((uint32_t)k[8])<<24;
    case 8 :
        b+=k[7];
    case 7 :
        b+=((uint32_t)k[6])<<8;
    case 6 :
        b+=((uint32_t)k[5])<<16;
    case 5 :
        b+=((uint32_t)k[4])<<24;
    case 4 :
        a+=k[3];
    case 3 :
        a+=((uint32_t)k[2])<<8;
    case 2 :
        a+=((uint32_t)k[1])<<16;
    case 1 :
        a+=((uint32_t)k[0])<<24;
        break;
    case 0 :
        return c;
    }

    final(a,b,c);
    return c;
}
```

看完这个代码，我们可以给他缩短一下。  


```
uint32_t jenkins_hash( const void *key, size_t length) {
    uint32_t a,b,c;
    a = b = c = 0xdeadbeef + ((uint32_t)length) + 0;

    const char *k = (const char *)key;
    while (length >= 12) {
        a += *((uint32_t*)(k+0));
        b += *((uint32_t*)(k+4));
        c += *((uint32_t*)(k+8));
        mix(a,b,c);
        length -= 12;
        k += 12;
    }

    if(length == 0) {
        return c;
    }

    switch(length) {
        case 11:
            c+=((uint32_t)k[10])<<8;
        case 10:
            c+=((uint32_t)k[9])<<16;
        case 9 :
            c+=((uint32_t)k[8])<<24;
        case 8 :
            b += *((uint32_t*)(k+4));
            a += *((uint32_t*)(k+0));
            break;
        case 7 :
            b+=((uint32_t)k[6])<<8;
        case 6 :
            b+=((uint32_t)k[5])<<16;
        case 5 :
            b+=((uint32_t)k[4])<<24;
        case 4 :
            a += *((uint32_t*)(k+0));
            break;
        case 3 :
            a+=((uint32_t)k[2])<<8;
        case 2 :
            a+=((uint32_t)k[1])<<16;
        case 1 :
            a+=((uint32_t)k[0])<<24;
    }

    final(a,b,c);
    return c;
}
```

## murmur3 hash

murmur3 hash 的位置在 [murmur3_hash.c][murmur3_hash] .


```
//不检查数据越界问题，主要用于得到一些随机数字
#define    FORCE_INLINE inline __attribute__((always_inline))

//循环左移
static inline uint32_t ROTL32 ( uint32_t x, int8_t r ) {
    return (x << r) | (x >> (32 - r));
}

//得到指针p位置的值，i可能为负数
static FORCE_INLINE uint32_t getblock32 ( const uint32_t * p, int i ) {
    return p[i];
}

static FORCE_INLINE uint32_t fmix32 ( uint32_t h ) {
    h ^= h >> 16;
    h *= 0x85ebca6b;
    h ^= h >> 13;
    h *= 0xc2b2ae35;
    h ^= h >> 16;
    return h;
}

uint32_t MurmurHash3_x86_32 ( const void * key, size_t length) {
    const uint8_t * data = (const uint8_t*)key;
    const int nblocks = length / 4;

    uint32_t h1 = 0;

    uint32_t c1 = 0xcc9e2d51;
    uint32_t c2 = 0x1b873593;

    const uint32_t * blocks = (const uint32_t *)(data + nblocks*4);

    for(int i = -nblocks; i; i++) {
        uint32_t k1 = getblock32(blocks,i);
        k1 *= c1;
        k1 = ROTL32(k1,15);
        k1 *= c2;
        h1 ^= k1;
        h1 = ROTL32(h1,13);
        h1 = h1*5+0xe6546b64;
    }

    const uint8_t * tail = (const uint8_t*)(data + nblocks*4);

    uint32_t k1 = 0;

    switch(length & 3) {
        case 3:
            k1 ^= tail[2] << 16;
        case 2:
            k1 ^= tail[1] << 8;
        case 1:
            k1 ^= tail[0];
            k1 *= c1;
            k1 = ROTL32(k1,15);
            k1 *= c2;
            h1 ^= k1;
    };

    h1 ^= length;
    h1 = fmix32(h1);
    return h1;
}
```

## Additive Hash

```
ub4 additive(char *key, ub4 len, ub4 prime){
    ub4 hash, i;
    for (hash=len, i=0; i<len; ++i) 
        hash += key[i];
    return (hash % prime);
}
```

## Rotating Hash

```
ub4 rotating(char *key, ub4 len, ub4 prime){
    ub4 hash, i;
    for (hash=len, i=0; i<len; ++i)
        hash = (hash<<4)^(hash>>28)^key[i];
    return (hash % prime);
}
```

## One-at-a-Time Hash

```
ub4 one_at_a_time(char *key, ub4 len){
    ub4   hash, i;
    for (hash=0, i=0; i<len; ++i){
        hash += key[i];
        hash += (hash << 10);
        hash ^= (hash >> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >> 11);
    hash += (hash << 15);
    return (hash & mask);
}
```

## Bernstein  hash

```
ub4 bernstein(ub1 *key, ub4 len, ub4 level){
    ub4 hash = level;
    ub4 i;
    for (i=0; i<len; ++i) hash = 33*hash + key[i];
    return hash;
}
```

## Goulburn Hash

```
u4 goulburn( const unsigned char *cp, size_t len, uint32_t last_value){
    register u4 h = last_value;
    int u;
    for( u=0; u<len; ++u ) {
        h += g_table0[ cp[u] ];
        h ^= (h << 3) ^ (h >> 29);
        h += g_table1[ h >> 25 ];
        h ^= (h << 14) ^ (h >> 18);
        h += 1783936964UL;
    }
    return h;
}
```

## Murmur Hash

uint32_t MurmurHash1 ( const void * key, int len, uint32_t seed ){
    const unsigned int m = 0xc6a4a793;

    const int r = 16;

    unsigned int h = seed ^ (len * m);

    //----------

    const unsigned char * data = (const unsigned char *)key;

    while(len >= 4){
        unsigned int k = *(unsigned int *)data;

        h += k;
        h *= m;
        h ^= h >> 16;

        data += 4;
        len -= 4;
    }

    //----------

    switch(len){
        case 3:
        h += data[2] << 16;
        case 2:
        h += data[1] << 8;
        case 1:
        h += data[0];
        h *= m;
        h ^= h >> r;
    };

    //----------

    h *= m;
    h ^= h >> 10;
    h *= m;
    h ^= h >> 17;

    return h;
} 

## Pearson Hash

```
//This preinitializes tab[] to an arbitrary permutation of 0 .. 255.
char pearson(char *key, ub4 len, char tab[256]){
    char hash;
    ub4  i;
    for (hash=len, i=0; i<len; ++i) 
        hash=tab[hash^key[i]];
    return (hash);
}
```

## CRC Hashing

```
ub4 crc(char *key, ub4 len, ub4 mask, ub4 tab[256]){
    ub4 hash, i;
    for (hash=len, i=0; i<len; ++i)
        hash = (hash >> 8) ^ tab[(hash & 0xff) ^ key[i]];
    return (hash & mask);
}
```

## Generalized CRC Hashing

```
//The size of tab[] is the maximum number of input bits. 
//Values in tab[] are chosen at random. 
ub4 universal(char *key, ub4 len, ub4 mask, ub4 tab[MAXBITS]){
    ub4 hash, i;
    for (hash=len, i=0; i<(len<<3); i+=8){
        register char k = key[i>>3];
        if (k&0x01) hash ^= tab[i+0];
        if (k&0x02) hash ^= tab[i+1];
        if (k&0x04) hash ^= tab[i+2];
        if (k&0x08) hash ^= tab[i+3];
        if (k&0x10) hash ^= tab[i+4];
        if (k&0x20) hash ^= tab[i+5];
        if (k&0x40) hash ^= tab[i+6];
        if (k&0x80) hash ^= tab[i+7];
    }
    return (hash & mask);
}
```

## Zobrist Hashing

```
ub4 zobrist( char *key, ub4 len, ub4 mask, ub4 tab[MAXBYTES][256]){
    ub4 hash, i;
    for (hash=len, i=0; i<len; ++i)
        hash ^= tab[i][key[i]];
    return (hash & mask);
}
```

[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3100784970.png
[murmur3_hash]: https://github.com/tiankonguse/memcached/blob/master/murmur3_hash.c
[jenkins_hash]: https://github.com/tiankonguse/memcached/blob/master/jenkins_hash.c
[memcached-hash-table]: http://github.tiankonguse.com/blog/2014/11/07/memcached-hash-table/