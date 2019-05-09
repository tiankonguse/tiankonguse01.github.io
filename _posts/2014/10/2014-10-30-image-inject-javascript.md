---
layout:     post
title:      图片注入 javascript 测试
description: 想在自己的QQ空间加上自己的 google 广告，于是想到图片注入 javascript 的方法。
keywords: javascript, 图片, 嵌入代码
tags: javascript 图片 嵌入代码
categories: [前端技术]
---

![javascript 注入图片][cover-image]

## 背景

其实一年可以转广告费只有2$, 主要是学习一些简单的注入技术。



## BMP 文件格式简单认识

每个格式的文件都有自己的固定结构或者类似结构。

而 BMP 文件大概分为四部分：

* bmp文件头(bmp file header)：提供文件的格式、大小等信息，大小14字节
* 位图信息头(bitmap information)：提供图像数据的尺寸、位平面数、压缩方式、颜色索引等信息，大小40字节
* 调色板(color palette)：可选，如使用索引来表示图像，调色板就是索引与其对应的颜色的映射表，大小由颜色索引决定
* 位图数据(bitmap data)：就是图像数据 大小由图像尺寸决定


一般24位图像是没有调色板的，16位的位图文件的调色板是1024字节。

文件头结构如下

```
typedef struct { 
    /* type : Magic identifier,一般为BM(0x42,0x4d) */ 
    unsigned short int type; 
    unsigned int size;/* File size in bytes,全部的档案大小 */ 
    unsigned short int reserved1, reserved2; /* 保留位 */ 
    unsigned int offset;/* Offset to image data, bytes */ 
} FILEHEADER;
```

信息头结构如下

```
typedef struct { 
    unsigned int size;/* Info Header size in bytes */ 
    int width,height;/* Width and height of image */ 
    unsigned short int planes;/* Number of colour planes */ 
    unsigned short int bits; /* Bits per pixel */ 
    unsigned int compression; /* Compression type */ 
    unsigned int imagesize; /* Image size in bytes */ 
    int xresolution,yresolution; /* Pixels per meter */ 
    unsigned int ncolours; /* Number of colours */ 
    unsigned int importantcolours; /* Important colours */ 
} INFOHEADER;
```

结构参考 [o_sun_o][o_sun_o-bmp] .

## BMP javascript  注入


有了上面的基础知识，我们就可以尝试注入了。


* 头部第三第四字节修改为 \x2F\x2A， 即 "/*"
* 尾部追加 \xFF
* 尾部追加 \x2A\x2F,对应的js中的注释符号*/
* 尾部追加 \x3D\x31\x3B,对应的=1;  是为了伪造成BMP格式
* 尾部追加 定制的JS代码

![test](test.bmp)
<script src="/images/test.bmp"></script>



[cover-image]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3781498896.png
[o_sun_o-bmp]: http://blog.csdn.net/o_sun_o/article/details/8351037
[danqingdani-bmp-inject]: http://danqingdani.blog.163.com/blog/static/186094195201392303213948
