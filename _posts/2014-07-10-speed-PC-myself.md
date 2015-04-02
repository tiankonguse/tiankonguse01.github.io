---
layout: post 
description : 电脑最近变得非常的慢，于是想手动优化一下自己的系统。 
title: 自己手动加速自己的电脑
keywords: 电脑, 优化, 加速, Ubuntu
tags: 电脑 优化 加速 Ubuntu
categories: [程序人生]
---



## 卸载不必要的软件


```
sudo apt-get purge google-chrome-unstable
```

## 停用不需要开机启动的服务


```
sudo update-rc.d -f apache2 remove
sudo update-rc.d -f virtualbox remove
sudo update-rc.d -f lightdm remove
sudo update-rc.d -f tomcat7 remove
sudo update-rc.d -f bluetooth remove
sudo update-rc.d -f mysql remove
sudo update-rc.d -f mongodb remove
```

## 删除对于的内核

查看内核
```
dpkg --get-selections|grep linux
```

删除内核
```
sudo apt-get remove linux-headers-3.13.0-30
```
(完)


