---   
layout:     post  
title:      浅读腾讯贡献给Linux基金会的TSeer
description: 几天前腾讯给Linux基金会贡献的开源项目刷屏了，这里简单看下源码。    
keywords: 技术 
tags: [技术]  
categories: [技术]  
updateData:  23:40 2018/07/06   
published: false   
---  


## 背景

6 月 25 日，Linux 基金会集结世界顶级开发者的非营利开源组织，宣布腾讯正式成为 Linux 基金会白金会员。  
腾讯表示将向Linux基金会提供其名为TARS的开源微服务项目和一个开源服务项目Tseer。  
这里我们先来看看这个Tseer项目吧。  


## 项目背景  

Tseer的项目代码地址是https://github.com/Tencent/TSeer  
官方介绍为"A high available service discovery & registration & fault-tolerance framework"。  


为什么需要Tseer这一类组件呢？  
设想


目前这项目分几大模块：服务、agent、api、管理台、储存DB。  


## 安装

我去腾讯云买了一台服务器，尝试从0搭建Tseer。  




1. 安装git `yum install -y git`  
2. 安装cmake ` yum install -y cmake`  
3. 安装bison `yum -y install bison`  
4. 安装flex `yum -y install flex`  
5. 安装jdk `yum -y install java-1.8.0-openjdk*` 
6. 安装openssh `yum -y install openssl*`  
7. 安装resin 先去官网下载源码，然后编译。  
   编译命令：`./configure --prefix=/data/service/resin4 --enable-64bit && make && make install`
   然后修改conf/resin.properties下的`web_admin_external`，打开外网权限。
8. 拉取TSeer源码 `git clone https://github.com/Tencent/TSeer.git`   
   然后执行自动化安装程序`cd build; python tseer_deploy.py`  
9. 安装maven `yum -y install maven`  
   然后执行`mvn install`并将产生的war复制到resin的webapps 目录下。  
   
按照TSeer的文档， 我买了一台腾讯云机器，操作了一番。  
发现这个文档有一个很大的问题。  
文档上说已经有自动化脚本了，什么都不需要关系，执行脚本即可。  
备注上说如果想要了解详细用法，可以看下一小节。  
可是下一小节只有各个模块的配置信息，并没有各个模块的安装使用信息。  


对于WEB管理台，文档上说没有实现一键安装脚本，于是介绍了详细的安装WEB管理台的文档。  
照在管理台的文档，我管理台很快就跑起来了。  
而对于自动化的其他模块，我执行完后并不可用，看输出的日志全是"Please submit a full bug report"。  
于是我只好去研究一下自动化安装工具的代码，看看具体怎么自动化的，好手动安装每个模块。  


自动化脚本做了这样几件事情。  

1. 抱团取暖，安装一个广告tars。  
2. 安装储存etcd  
3. 安装自家json库rapidjson，这里没有写rapidjson，而是命名为depedency。  
4. 使用cmake对服务和api编译安装  
5. 对配置文件的ip和端口进行替换，并尝试启动服务和agent。  


cmake编译确实是一个好东西。  
14年的时候我在媒资的时候，内部刚好需要进行32位服务迁移64位服务，我和hades一起搭建了一套cmake编译环境。  
当时我算是内部第一个吃螃蟹的人了，当时还写了几篇使用文章。  
当然，后来我们还是都使用makefile了。  
我们的项目还没有那么复杂，也不需要跨平台，使用makefile就足够了。  


cmake编译的时候会先生成makefile, 然后后面就和makefile没区别了。  
所以我















  







   
	




