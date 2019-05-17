---   
layout:     post  
title:      编译之路   
description: 为了编译，我们越走越远。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  23:59 2017/8/20  
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/Cte5aGAGuwAQ5tmQXTPhGw)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。  
>   
>    
  

## 零、背景

c++语言需要使用g++编译，这个没什么可说的。  
但是项目大了，平台多了，文件多了后，我们在编译的路上越走越远，比如makefile、configure、autoconf、automake等等。  
下面就来慢慢介绍这些东西。  


## 一、编译

大家平常如果仅仅写一个cpp文件时，往往是一条命令就编译出可执行程序了。  
但是学习编译原理课程的时候，龙书告诉我们这一条命令其实包含四个步骤：预处理，编译，汇编，链接。  


预处理阶段将源代码中的包含的头文件编译进来，其中宏也会展开。  
编译阶段时会先检查代码的规范性、是否有语法错误等，然后把代码翻译成汇编语言代码。   
汇编阶段是把”.s”汇编代码转成二进制中间目标文件。  
链接阶段将二进制中间目标文件链接成最终可执行文件或者库文件。  


这里有人可能会有疑问：为什么会有链接阶段，汇编阶段直接生产可执行文件不就行了吗？  
这是因为汇编阶段是将每个cpp文件分别转化为二进制中间目标文件，链接阶段是将所有中间文件打包为可执行程序。  


## 一、makefile


上个小节提到汇编是将每个cpp转化为目标文件，链接起到打包的作用。  


这也引入一个问题：假设我们一个程序写了很多cpp文件，就不能方便的使用一个命令来直接生产可执行程序了。  
我们需要先分别在汇编阶段生产中间目标文件，最后再链接为可执行程序。  


这就需要很多条命令才能编译。  
考虑到程序文件分布在多个目录，库文件也在不同的目录，这些事情人工来做显然变得特别复杂。  


所以这些事情需要脚本化。  
这个脚本就是`makefile`。  


又由于这些`makefile`脚本常常做的事情都差不多，于是`makefile`脚本规定了一些语法，用来更简洁的编写脚本。  
于是`makefile`也可以成为一种脚本语言了吧。  



## 二、configure

我们有了`makefile`就可以方便的编译程序了。  


可是随着开源的兴起，大家会发现我们的程序在其他人那里不能编译了。  
原来由于平台系统的差异，我们系统上存在的库在另一个人那可能没有。  

于是我们需要一个工具来检查需要的库在当前系统是否存在，于是`configure`这个脚本程序就出来了。  
当然`configure`的功能不仅仅检查库存在，还有很多其他的功能，这里只是用来举例方便大家理解。  


## 三、autoconf


上面提到`configure`用于检查库是否存在。  
但是我们一个程序会使用很多库，尤其是系统自带的库。  


如果手动去编写这个`configure`，那工作量将是分成巨大的，而且几乎不可能的。  
因为库其实还存在一个依赖问题，一个系统库依赖另一个系统库，我们是不知道的。  


所以这里只能使用工具来自动生成`configure`了，这个工具就是`autoconf`了。  
当然，`autoconf`这个工具的数据是`GNU m4`文件。  
而`GNU m4`这个文件也需要工具生成，那就是`aclocal`。  





## 四、aclocal


aclocal作用是根据已经安装的宏、用户定义宏、`acinclude.m4`文件中的宏 将`configure.ac`文件所需要的宏集中定义到文件`aclocal.m4`中。  
aclocal是一个perl 脚本程序，它的定义是：“aclocal - create aclocal.m4 by scanning configure.ac”  


是的，你们有猜错。  
aclocal有一个输入文件，叫做`configure.ac`。  
这个configure.ac也是使用工具生成的，那就是`autoscan`。  


## 五、autoscan

好吧，目前是2017，至少现在为止，`autoscan`是尽头了。  


`autoscan`扫描源代码以搜寻普通的可移植性问题，比如检查编译器，库，头文件等，生成文件`configure.scan`, 它是`configure.ac`的一个雏形。  



## 六、automake

其实讲`configure`的时候，有一点没有说。  
对于大项目，一般还需要`Makefile.in`文件。  
我们执行`configure`的时候，会将`Makefile.in`转化为`Makefile`。  


那么问题来了：`Makefile.in`怎么生成的呢？  
你没有猜错，就是`automake`。  


`automake`根据`Makefile.am`、`config.h.in`、`configure.ac`三类文件生成`Makefile.in`。  
`Makefile.am`是我们自己写的，`config.h.in`需要使用工具生成，这个工具的名字叫做`autoheader`。  


## 七、autoheader

`autoheader`根据`configure.ac`中的某些宏，比如cpp宏定义，运行`m4`，生成`config.h.in`。  


## 八、总结

好了，到现在为止我知道大家都分不清谁是谁了。  
但是看看下面的图，大家应该就清楚了。  

![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2272327214.png)

  

本来我们只是为了编译一个小项目，现在为了跨平台，却越搞越复杂了。  
  
  
对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
欢迎大家加入看各种算法的思路。  

![](http://res.tiankonguse.com/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，阅读不一样的技术文章。   
  
![](http://res.tiankonguse.com/images/weixin-50cm.jpg)  
  
  