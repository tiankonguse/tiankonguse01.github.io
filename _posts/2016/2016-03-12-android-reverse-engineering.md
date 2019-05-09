---  
layout: post  
title: android 逆向工程
description:  学习一下android反编译，获取一些好的app的资源。    
updateData:  18:31 2016/03/12
categories: [程序人生]
---  


## 一、准备

环境： ubuntu  
需要软件：  

* [apktool]({{ site.data.link.android_apktool }}) 资源文件获取，可以提取出图片文件和布局文件进行使用查看  
* [dex2jar]({{ site.data.link.android_dex2jar }}) 源码文件获取 将apk反编译成java源码（classes.dex转化成jar文件）  
* [jd-gui]({{ site.data.link.java_jd_gui }}) [eclipse插件]({{ site.data.link.java_jd_eclipse }}) 源码查看   

 
## 二、操作步骤


### 1. 资源文件获取

```
#得到源码
git clone git://github.com/iBotPeaches/Apktool.git
cd Apktool

#编译
./gradlew build fatJar

cd ./brut.apktool/apktool-cli/build/libs

#apk文件解包
./apktool.jar d -f first.apk -o test 

#解包后的文件打包
./apktool.jar b test -o test_b.apk
```


### 2. 得到源码


**解压缩**  

```
unzip first.apk -d first/
```

解压缩后， 可以看到 `classes.dex` 文件， 它就是java文件编译再通过dx工具打包而成的。  

**环境准备**

```
#得到dex2jar源码
git clone https://github.com/pxb1988/dex2jar.git
cd dex2jar

#dex文件转换为jar文件
./dex2jar classes.dex
 

#得到jd-gui源码
git clone https://github.com/java-decompiler/jd-gui.git
cd jd-gui

# 生成jd-gui

./gradlew build
./gradlew installOsxDist
cd /build/libs


# 打开jar
./jd-gui first_dex2jar.jar
# 打开后，可能发现名字被混淆过了

```


### 3.反混淆

不好意思， 暂时未研究。  







