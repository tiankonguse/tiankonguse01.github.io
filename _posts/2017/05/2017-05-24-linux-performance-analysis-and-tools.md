---  
layout:     post  
title:      回顾一下自己常用的linux命令
description: 作为一个开发, linux上的常用命令是必备的。  
keywords: 后台服务  
tags: [后台服务]  
categories: [程序人生]  
updateData:  0:40 2017/5/25
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

作为一个开发, linux上的常用命令是必备的。  
可是实际情况是很多人即使最最简单的命令，可能都不会， 或者命令对应的字段不知道什么意思。  
几年前曾看过一本 linux shell的书籍, 一本厚厚的数据全是介绍命令的，于是自己几年前写的一篇旧文重新提一下《Linux 命令记录(持续更新中)》， 现在我在这里立个flag：剩余的命令需要继续完善上去。  
这篇旧文点击原文可以阅读，建议使用电脑打开阅读。  



## 一、命令



这里我就不重复一个一个介绍那些命令了。  
我只罗列一下我作为后台开发最近半年来常用的命令，这些命令显然也是我需要再深入学习的。  
下面的命令没有前后顺序, 我回忆到哪个命令就写哪个命令.  


ssh：我常用在三个地方：登陆远程机器 -p port user@ip ， ssh代理 -D，执行远程命令 最后面跟要执行的命令。 
grep：文件内搜索字符串,有时候也使用egrep。常用参数 -v -E --color -r -n  
cat： 查看文件全部内容，用于查看小文件。  
tail: 查看文件最后几行。常用参数 -n -f   
awk: 提取部分字符串, 统计等, 提取数据后常使用grep进一步过滤.  
sed: 正则替换分隔字符串, 分隔后长使用awk进行分隔.  
sort: 排序, 常用参数 -n -r --sort=WORD   
uniq: 去重，常用参数 -c   
tcpdump: 抓包命令.常用参数 -iany -AXnlps0  tcp|udp host port dst src   
gdb: 单步调试, 常用参数 set follow-fork-mode child directory b bt p   
netstat: 查看端口, 常用参数 -anlp   
wc: 统计, 常用参数 -l   
top: 系统汇总信息。 常用参数 -p -H 1 f F u c   
free: 查看内存使用情况.常用参数 -m   
perf: 性能分析命令. 常用参数 top record report   
strace: 系统调用分析命令. 常用来查看系统调用耗时。  
ipcs：共享内存操作命令。原因是我维护的几个服务都大量的使用了共享内存。 参数 -m    
lsof: 查看FD使用情况, 端口使用情况.  
ps: 查看进程, 常用参数 -aef -p -o lstart , 一般使用grep搜索自己关心的进程.  
gcc: 编译命令, 一般使用makefile, 这里面的参数很多就不说了, 说自己手敲的比如遇到奇葩问题是需要生成预处理文件 -E ，汇编文件 -S 等。  
objdump: 反汇编命令.  常用参数 -d -f   
bash: shell命令,  -b 常用来刷新环境变量.  
history: 查看历史命令, 常使用快捷键搜索 ctrl+r   
md5sum:  md5生成与检查. 参数 -c 
zip: 压缩  
df/du: 查看磁盘是否满与查找大文件 .  
kill: 杀死进程或者发送信号  
man: 命令手册  
dmesg: 系统关键日志  
ip: 查看本机ip  
ls, mv, cp,chmod,chown等一些命令就不多说了, 发现说的有点多了  


上面这些命令是我工作中常用的命令，尤其是grep, awk, sed这三个命令, 几乎每天都在使用,可谓是文本上的神器。  


其中有三个命令很重要，虽然我知道怎么用，但是实际工作中我确实没有使用过。  
是这三个系统神器命令：vmstat， iostat，sar。  


之所以没有使用是由于公司已经有很强大的监控系统了， 可以直接在浏览器中查看了， 所以就没有使用这三个命令了。  


最后来一张以前曾经很火的一张图。  


![](http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1702102723.png)


## 二、结论


好了，不多说了，这篇文章算是一个flag文章吧，给自己立下一个flag：晚上。      
想看更多命令的话可以看看那篇旧文， 点击原文可以阅读，建议使用电脑打开阅读。  


对了现在开通了公众号和小密圈。  
博客记录所有内容。  
技术含量最高的文章放在公众号发布。  
比较好玩的算法放在[小密圈](https://wx.xiaomiquan.com/mweb/views/joingroup/join_group.html?group_id=281548515451&secret=r0krqw9fw0at24vxjxo1uo4k0h4lfe47&extra=d67ce0c25ec91252b3af846a10154c9e9d4cb50c763fee178acd68cd2c2e09ee)发布。  
小密圈这周接受免费加入，欢迎大家加入看各种算法的思路。  

![](/images/suanfa_xiaomiquan.jpg)  
  
  
长按图片关注公众号，接受最新文章消息。   
  
![](/images/weixin-50cm.jpg)  
  
  
  