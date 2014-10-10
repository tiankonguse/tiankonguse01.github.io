---
layout:     post
title:      位运算 的探究
category: blog
description: 给学弟出了一道题，告诉你n个数，其中只有一个数出现一次，其他的数都出现三次。求出现一次的那个数。
---

## 问题的来源

学弟发给我一个代码，第一眼竟然没看明白。

```cpp
int run() {
    int ones = 0, twos = 0;
    for(int i = 0; i < n; i++) {
        ones = (ones ^ A[i]) & ~twos;
        twos = (twos ^ A[i]) & ~ones;
    }
    return ones;
}
```

然后想到，可能有位运算的一些规律，比如分配率，结合律，交换律等。


##  交换律

```
a | b = b | a
a & b = b & a
a ^ b = b ^ a
~~a = a
```
## 分配律

```
~(a & b) = (~a) | (~b)
~(a | b) = (~a) & (~b)
~(a ^ b) = (~a) ^ b = a ^ (~b) = ~((~a) ^ (~b))

a & (b | c) = (a & b) | (a & c)
a & (b ^ c) = (a & b) ^ (a & c)

a | (b & c) = (a | b) & (a | c)
a | (b ^ c) = ?

a ^ (b | c) = ?
a ^ (b & c) = ?

```

## 吸收率

```
a ^ (a | b) = ?
a ^ (a & b) = ?
a | (a ^ b) = ?
a | (a & b) = ?
a & (a ^ b) = ?
a & (a | b) = ?
```


