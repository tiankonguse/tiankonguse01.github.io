---  
layout: post  
title:  简单了解C/C++内存检测软件
description: 网上找了一个开源的定时器，但是仅仅是测试定时器，效率低下，内存开销大等。于是我改造内指针的形式，于是就需要检测是否有内存泄露的问题了。  
keywords: 内存,指针,内存泄露
updateData:  21:01 2015/3/2
tags: [内存, 指针, 内存泄露]
categories: [程序人生]
---  

## 前言


内存泄露问题一直都是 c/c++ 语言开发不可避免的问题。  
因为当一个系统足够大的时候，就会发现很多实现必须采用指针的形式。

既然我们不能避免不适用指针，那就要想法避免内存泄露了。  

对于指针如果能够保证正常回收内存的话，当然不会泄露，这就要对整个系统充分了解，保证每一个出口都会回收内存。  

更有甚者，有时候我们多个指针指向同一片内存，还要保证有多个指针指向那片内存时，不能回收内存。  

当多个指针指向的内存必须回收时，就要保证对所有的指针初始化为 NULL.  

最后还有一种情况要注意：发生异常时也要记得回收内存。   

当然，上面的只是我的经验之谈。  

毕竟我手动管理内存的经验还较少，



## 内存泄露背景


简单的说内存泄露问题经常在 server 中出现，就是申请了内存，但是不用了，而且还不知道这片内存的地址了。    

所谓的 server 就是要一直保持运行的程序， 因为对于普通的程序，运行完后就全部回收内存了，所以如果有内存泄露，短时间内就能够快速定位出来的。  

对于 server, 一般都是很大的系统， 而越大的程序，发生内存泄露的概率越高。  

对于这个，大家可以查一下 [Memory Leak][Memory_leak] 来了解一下。  



## 内存泄露检测工具

这些工具很多。  


### MallocDebug

关于 MallocDebug， 推荐查看 IBM 的这篇文章，将的不错 [在 AIX V5.3 中使用 MALLOCDEBUG 隔离并解决内存泄漏][au-mallocdebug]


### Valgrind

关于 Valgrind， 网上的资料比较多。  

* [Valgrind 官网][valgrind-org]
* [IBM 对 Valgrind 的介绍][l-cn-valgrind]
* [Using Valgrind to Find Memory Leaks and Invalid Memory Use][cprogramming-valgrind]



### 其他

* [Kcachegrind 的官网][Kcachegrind]
* dmalloc [官网][dmalloc] [参考1][stuff-mit-dmalloc] [参考2][web-mit-dmalloc]
* Insure++ [wiki][wiki-Insure]


## 如何检测内存泄露

这方面，windows 倒是做的比较好了，网上搜到的全是 windows 下的内存检测工具。  
当然，对于那些只在 windows 上有的内存检测工具，我没有列出来，毕竟大多数时候，我都是在linux下运行程序的。  

在linux中，最简单的检测内存是否泄露的方法就是重载申请内存和释放内存相关的函数。  

具体可以参考[这里][l-mleak] 和 [这里][au-memorytechniques]


对于大型的系统，我们可能不能避免内存泄露，但是如果我们有良好的编码习惯的话， 还是可以减少出现内存泄露的概率的。  





[au-memorytechniques]: http://www.ibm.com/developerworks/cn/aix/library/au-memorytechniques.html
[l-mleak]: http://www.ibm.com/developerworks/cn/linux/l-mleak/
[purifyplus]: http://unicomsi.com/products/purifyplus/
[wiki-Insure]: http://en.wikipedia.org/wiki/Insure%2B%2B
[stuff-mit-dmalloc]: https://stuff.mit.edu/afs/sipb/project/gnucash-test/src/dmalloc-4.8.2/dmalloc.html
[dmalloc]: http://dmalloc.com/
[web-mit-dmalloc]: http://web.mit.edu/6.033/1997/handouts/html/dmalloc.html
[Kcachegrind]: http://kcachegrind.sourceforge.net/html/Home.html
[cprogramming-valgrind]: http://www.cprogramming.com/debugging/valgrind.html
[l-cn-valgrind]: http://www.ibm.com/developerworks/cn/linux/l-cn-valgrind/
[valgrind-org]: http://valgrind.org/
[Memory_leak]: http://en.wikipedia.org/wiki/Memory_leak
[au-mallocdebug]: http://www.ibm.com/developerworks/cn/aix/library/au-mallocdebug.html
