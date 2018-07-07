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
8.
2. 拉取TSeer源码 `git clone https://github.com/Tencent/TSeer.git`  


	




