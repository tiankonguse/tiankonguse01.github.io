---  
layout: post  
title: ununtu使用记录 
description:　五年前就开始使用ununtu，期间遇到各种问题，都是零碎的记录，现在需要汇总一下，方便以后快速使用．   
updateData:  9:52 2016/8/5
categories: [linux]
---  


## 背景

这篇文章主要记录两个东西：　




## 菜单栏不见了

由于各种原因，菜单栏不见了，　虽然还可以操作文件夹，也可以通过命令行打开各种软件，但是还是有点不习惯.  
查询了一下资料，解决方案如下：


1. unity 误卸载或者配置错误导致

先安装ccsm, 然后启动unity.  

```
sudo apt-get install compizconfig-settings-manager
```

* 桌面配置

在终端内输入ccsm即可启动, 在ccsm的桌面类别中，点击Ubuntu Unity Plugin，然后启用  

* 命令行配置

重设compiz设置  `dconf reset -f /org/compiz/`  
重置compiz后，重启Unity：`setsid unity`  
重置Unity图标：`unity --reset-icons`  


2. gnome 桌面异常


重启任务栏： `pkill gnome-panel `  
重启图形界面: `pkill gnome-session`  




