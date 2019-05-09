---
layout: post
title: 信号接口的含义与图片参考
description: 买了一个树莓派，由于不懂这些信号接口需要什么线，  一直没做什么。现在先把背景知识了解一下。  
tags:  [树莓派,信号接口,USB,VGA,RCA,硬件]
keywords: 树莓派, 信号接口, USB, VGA, RCA
updateData:  19:34 2014/12/5
categories: [程序人生]
---

![cover][]

## 前言

看到树莓派上的视频输出时 HDMI, 但是不知道什么意思。  
还记得电视上是圆接口，电脑上有两种方块接口，这些到底是什么名字呢？  
我搜集了一些资料。  



## S端子

![s-Video-line][]

  
<span class="red">
还记得老式的鼠标键盘吗？  
还记得老式的游戏机把柄吗？  
都不是这个。  
想知道是什么吗？请阅读本文的评论。
</span>

可以先看看 [wiki][s-Video-wiki] 的讲解。  


![s-Video-big][]


S端子（S-Video）是应用最普遍的视频接口之一，是一种视频信号专用输出接口。  


常见的S端子是一个5芯接口，其中两路传输视频亮度信号，两路传输色度信号，一路为公共屏蔽地线。 

 
由于省去了图像信号Y与色度信号C的综合、编码、合成以及电视机机内的输入切换、矩阵解码等步骤，可有效防止亮度、色度信号复合输出的相互串扰，提高图像的清晰度。  


一般DVD或VCD、TV、PC都具备S端子输出功能，投影机可通过专用的S端子线与这些设备的相应端子连接进行视频输入。  

由于是S-端子不能发送声音的信号。因此，还需要一组单独的音频连接线。  

这也就是为什么VCD都是两根线的原因。  


## VGA接口

![vga-img][]

VGA是Video Graphics Adapter的缩写，信号类型为模拟类型，视频输出端的接口为15针母插座，视频输入连线端的接口为15针公插头。  

VGA端子含红（R）、黄（G）、篮（B）三基色信号和行（HS）、场（VS）扫描信号。  

VGA端子也叫D-Sub接口。 

VGA接口外形象“D”，其具备防呆性以防插反，上面共有15个针孔，分成三排，每排五个。  

VGA接口是显卡上输出信号的主流接口，其可与CRT显示器或具备VGA接口的电视机相连，VGA接口本身可以传输VGA、SVGA、XGA等现在所有格式任何分辨率的模拟RGB+HV信号，其输出的信号已可和任何高清接口相貔美。


目前VGA接口不仅被广泛应用在了电脑上，投影机、影碟机、TV等视频设备也有很多都标配此接口。  
很多投影机上还有BGA输出接口，用于视频的转接输出。


## RCA端子


![rca-img][]

RCA端子, 又名 分量视频接口。  

分量视频接口也叫色差输出/输入接口，又叫3RCA。  

分量视频接口通常采用YPbPr和YCbCr两种标识。  

分量视频接口/色差端子是在S端子的基础上，把色度（C）信号里的蓝色差（b）、红色差（r）分开发送，其分辨率可达到600线以上，可以输入多种等级讯号，从最基本的480i到倍频扫描的480P，甚至720P、1080i等等。  

如显卡上YPbPr接口采用9针S端子（mini-DIN）然后通过色差输出线将其独立传输。  


分量视频接口是一种高清晰数字电视专业接口（逐行色差YPbPr），可连接高清晰数字信号机顶盒、卫星接收机、影碟机、各种高清晰显示器/电视设备。  

目前可以在投影机或高档影碟机等家电上看到有YUV YCbCr Y/B-Y/B-Y等标记的接口标识，虽然其标记方法和接头外形各异但都是色差端口。   



Y.Pb.Pr是逐行输入/输出，Y.Cb.Cr是隔行输入/输出。  


分量视频接口与S端子相比，要多传输PB、PR两种信号，避免了两路色差混合解码并再次分离的过程，避免了因繁琐的传输过程所带来的图像失真，保障了色彩还原的更准确，保证了信号间互不产生干扰，所以其传输效果优于S端子。 
    
    
具有这个接口的投影机可以和提供这类输出的电脑、影碟机和DV等设备相连，并可连接数字电视机顶盒收看高画质的数字电视节目。


## DVI

![dvi-img][]


DVI全称为Digital Visual Interface。  

目前的DVI接口有两种，一为DVI-D（Digital，所谓纯数字）接口，只能接收数字信号，接口上只有3排8列共24个针脚，其中右上角的一个针脚为空，其不兼容模拟信号。  

一为DVI-I（Inteface，通用接口可通过转接头兼容VGA信号）接口，可同时兼容模拟（其可以通过一个DVI-I转VGA转接头实现模拟信号的输出）和数字信号，目前多数显卡、液晶显示器、投影机皆采用这种接口。
 
 
两种DVI接口的显卡接口相互之间不能直接连接使用。  
 
如果播放设备采用的是DVI-D接口，而投影机是DVI-I接口，那么还需要另配一个DVI-D转DVI-I的转接头或转接线才能正常连接。  

DVI传输的是数字信号，数字图像信息不需经过任何转换，就会直接被传送到显示设备上，因此减少了数字→模拟→数字繁琐的转换过程，大大节省了时间，因此它的速度更快，有效消除拖影现象，而且使用DVI进行数据传输，信号没有衰减，色彩更纯净，更逼真，更能满足高清信号传输的需求。


## HDMI

![HDMI-shou][]

这个就是我的树莓派上的接口吧。  

原来需要下面的线。  

![HDMI-gong][]

HDMI的英文全称是“High  Definition Multimedia”，中文的意思是高清晰度多媒体接口。  

HDMI连接器共有两种，即19针的A类连接器和29针的B类连接器。  

B类的外形尺寸稍大，支持双连接配置，可将最大传输速率提高一倍。  

使用这两类连接器可以分别获得165MHz及330MHz的像素时钟频率。

HDMI接口可以提供高达5Gbps的数据传输带宽，可以传送无压缩的音频信号及高分辨率视频信号。  

同时无需在信号传送前进行数/模或者模/数转换，可以保证最高质量的影音信号传送。 


HDMI在针脚上和DVI兼容，只是采用了不同的封装。  

与DVI相比，HDMI可以传输数字音频信号，并增加了对HDCP的支持，同时提供了更好的DDC可选功能。  

HDMI支持5Gbps的数据传输率，最远可传输15米，足以应付一个1080P的视频和一个8声道的音频信号。  

而因为一个1080P的视频和一个8声道的音频信号需求少于4GB/s，因此HDMI还有余量。 

这允许它可以用一个电缆分别连接DVD播放器，接收器和PRR。  

此外HDMI支持EDID，DDC2B，因此具有HDMI的设备具有“即插即用”的特点，信号源和显示设备之间会自动进行“协商”，自动选择最合适的视频/音频格式。


## USB


![usb-img][]

USB的英文缩写是Universal Serial Bus，翻译成中文就是“通用串行总线”，也称通用串联接口。

![MicroUSB][]


Micro USB是USB 2.0标准的一个便携版本，比部分手机使用的Mini USB接口更小.



## CTIA与OMTP

![CTIA_OMTP][]

CTIA 是国际标准， OMTP 是国内标准。  


[MicroUSB]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/1035516724.jpg
[CTIA_OMTP]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/918326574.jpg
[usb-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/429037192.jpg
[HDMI-gong]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/408932562.png
[HDMI-shou]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/381595384.jpg
[dvi-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/343082684.jpg
[rca-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/253243069.jpg
[RCA-jack]: http://zh.wikipedia.org/wiki/RCA%E7%AB%AF%E5%AD%90
[vga-img]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/204904083.jpg
[s-Video-wiki]: http://zh.wikipedia.org/wiki/S-%E7%AB%AF%E5%AD%90
[s-Video-line]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/129619668.jpg
[s-Video-big]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/123408797.jpg
[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/97188175.jpg
