---  
layout:     post  
title:      Floating point exception错误
description: 接手一个中转系统，发布的时候遇到了这个错误，长见识了。         
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  21:44 2017/5/3 
published: true  
---  
  
  
>   
> 大家好，这里是tiankonguse的公众号(tiankonguse-code)。    
> tiankonguse曾是一名ACMer，现在是鹅厂视频部门的后台开发。    
> 这里主要记录算法，数学，计算机技术等好玩的东西。   
>      
> 这篇文章从公众号[tiankonguse-code](http://mp.weixin.qq.com/s/kjuZuB6l80e49rP_cJEr_g)自动同步过来。    
> 如果转载请加上署名：公众号tiankonguse-code，并附上公众号二维码，谢谢。    
>    
  

## 零、背景

之前曾说过我接手了一个三四年没人负责的中转系统，由于之前没有这个系统没有使用版本控制，所以线上的服务和代码可能不一致。 



## 一、问题

 
我看完代码后第一件是把代码编译通过，第二件事就是发布一次，把代码对齐。  
结果发布的时候， 几百台机器中，有三台启动不起来。  
一看，是Floating point exception这个错误, GDB发现在do_lookup_x函数上挂了。  


```
V_172_27_32_89_tlinux:/usr/local/services/vg_bus_agent-1.0/bin # ./bus_multi_agent ../conf/recvagent_trans_rule.xml
Floating point exception

V_172_27_32_89_tlinux:/usr/local/services/vg_bus_agent-1.0/bin # gdb bus_multi_agent
GNU gdb 6.6
...
(gdb) set args ../conf/recvagent_trans_rule.xml
(gdb) r
Starting program: /usr/local/services/vg_bus_agent-1.0/bin/bus_multi_agent ../conf/recvagent_trans_rule.xml
warning: no loadable sections found in added symbol-file system-supplied DSO at 0x7fffa4bff000

Program received signal SIGFPE, Arithmetic exception.
0x00007f3dca67d65f in do_lookup_x () from /lib64/ld-linux-x86-64.so.2
(gdb) bt
#0  0x00007f3dca67d65f in do_lookup_x () from /lib64/ld-linux-x86-64.so.2
#1  0x00007f3dca67da47 in _dl_lookup_symbol_x () from /lib64/ld-linux-x86-64.so.2
#2  0x00007f3dca67eff8 in _dl_relocate_object () from /lib64/ld-linux-x86-64.so.2
#3  0x00007f3dca67860b in dl_main () from /lib64/ld-linux-x86-64.so.2
#4  0x00007f3dca686f82 in _dl_sysdep_start () from /lib64/ld-linux-x86-64.so.2
#5  0x00007f3dca676246 in _dl_start () from /lib64/ld-linux-x86-64.so.2
#6  0x00007f3dca675a88 in _start () from /lib64/ld-linux-x86-64.so.2
#7  0x0000000000000002 in ?? ()
#8  0x00007fffa4b18728 in ?? ()
#9  0x00007fffa4b18761 in ?? ()
#10 0x0000000000000000 in ?? ()
(gdb) q
```  


## 二、原因


google搜索`do_lookup_x`, 在[stackoverflow](http://stackoverflow.com/questions/12570374/floating-point-exception-sigfpe-on-int-main-return0)上找到了答案。  


翻译一下就是同一个程序在一台高版本Linux上运行时没有问题,而在另一台低版本机器上运行报Floating Point Exception时,那么这极有可能是由高版本gcc链接造成的。  
高版本的gcc在链接时采用了新的哈希技术来提高动态链接的速度，这在低版本中是不支持的。  
因此会发生这个错误。  


gcc就是一个编译器。  
编译出来的软件在低版本操作系统上有些技术不支持造成这个原因。  


什么意思呢？  
就是用高版本GCC编译的程序在低版本GCC库环境下是无法运行的。  
当然了反过来讲也是对的，就是不同主版本的GCC编译出来的环境和程序是存在兼容性问题的。  



找一台正常的机器看一下， HASH果然不一样.  

```
异常机器
V_172_27_32_89_tlinux:/usr/local/services/vg_bus_agent-1.0/bin # readelf -a bus_multi_agent | grep HASH    
  [ 4] .hash             HASH             0000000000400290  00000290
 0x0000000000000004 (HASH)               0x400290

正常机器
[user_00@V_10.240.101.97 /usr/local/services/vg_bus_agent-1.0/bin]# readelf -a bus_multi_agent | grep HASH
  [ 4] .gnu.hash         GNU_HASH         0000000000400298  00000298
 0x000000006ffffef5 (GNU_HASH)           0x400298

```


## 三、解决方案


解决方案英文中自然有了就，简单的说就是编译的时候加个参数， 把两中hash都编译进入,向下兼容。  

```
To see if this is conclusively the problem, build with -Wl,--hash-style=sysv or -Wl,--hash-style=both and see if the crash goes away.  
```



来看看效果  

```
[user_00@V_10.175.90.106 /usr/local/services/vg_bus_agent-1.0/bin]# readelf -a bus_multi_agent | grep HASH  
  [ 4] .hash             HASH             0000000000400298  00000298
  [ 5] .gnu.hash         GNU_HASH         0000000000400928  00000928
 0x0000000000000004 (HASH)               0x400298
 0x000000006ffffef5 (GNU_HASH)           0x400928
 

user_00@Tencent64:/usr/local/services/vg_bus_agent-1.0/bin> readelf -a bus_multi_agent | grep HASH    
 [ 4] .hash             HASH             0000000000400298  00000298
0x0000000000000004 (HASH)               0x400298
```



## 七、结语


好了，看到这里就解决问题了。  
关于链接的hash技术，这里就不多提了，后续有机会可以学习一下编译链接里面的知识点。    



对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  


![](/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](/images/weixin-50cm.jpg)  
  
  
  