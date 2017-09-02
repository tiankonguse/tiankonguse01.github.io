---
layout: post
title: raspberry pi 体验记录
description: 最近笔记本被我拆了，还没有还原，手里又没钱，只好买了一个 raspberry pi 来当做我的电脑。     
tags:  ["raspberry pi", "硬件"]
keywords: raspberry pi
updateData:  19:01 2014/12/18
categories: [程序人生]
---


## 前言

很早就听说这个东西了，当时只知道是个嵌入式的板子，最近接触后发现完全可以当做一个电脑玩了。  


一个半月前就买了 [raspberry pi][raspberry-pi-qzone], 但是一直没动手， 前几天买了数据线什么的， 才开始研究研究这个小电脑, 最后终于成功连上 wifi.   


Raspberry Pi 是一块单板电脑，只有一张卡片大小，使用的是 700MHz 的 ARM v6 CPU，带有 512MB内存，有网卡和四个USB接口，使用SD卡作为储存器。  

另外还有数字输出接口GPIO，可以通过编程控制连接的数字电路。

这里记录的很乱， 大家可以忽略这篇记录。  


## 准备配件


由于买的 树莓派是个裸机， 所以需要自己买各种配件。   

简单说需要买这些必需品。   

* SD 卡 相当于电脑的硬盘，建议买最新的 SD 卡， 旧的树莓派可能不能识别。    
* SD 卡读卡器 用于在电脑上向 SD 卡安装系统  
* HDMI 转 VGI 数据线 主要连接电脑显示器  
* mini usb 转 USB  Android 手机充电器即可， 当做树莓派的电源  
* 无线网卡 连接网络  
* USB 鼠标键盘   


不是所有的SD卡都能工作在“树莓派”上的。  

一个5V的Micro USB电源适配器，用来提供至少700mA的电源(我用的小米充电宝)。  

根据Raspberry Pi官网的介绍，不要使用USB Hub或是电脑作为供电源。


1、不用专门给PI配显示器是可行的，需要使用远程桌面方式（VNC)，如果不需要X，SSH亦可。这个方法在平板电脑、安卓手机上都可以实现。  
2、如果你希望让笔记本电脑的显示器当作PI的显示器，又不希望使用方法一。如果不做任何改造是不可以的。因为笔记本显示器是一个输出设备（比如输出给其他显示器、投影仪），不能直接接受信号源。笔记本电脑显卡与其显示器之间的连接是不开放的。  
3、如果你有一款老旧笔记本，不再使用，且屏幕完好，那么改造是可行的。你可以在某宝搜索笔记本屏幕DIY套件，一百多，可以给你的屏幕配上驱动卡，这样，你的笔记本屏幕就被改造成一个可以接受PI信号的显示器了。（不光笔记本屏幕可以改造，IPAD的屏幕也可以改造，同理）



具体国外实现步骤大概如下：  
1. 通过修改Raspberry Pi的inittab实现它启动时自动登录，且使用screen共享session，具体通过命令screen -xR 即可。  
2. kindle和pi使用usbnetwork创建连接彼此联通。  
3. kindle也通过ssh登录到pi上面，就可以自动使用screen程序共享session，也是执行 screen -xR  
4. Pi上面的USB键盘和Kindle上的键盘（或者Touch的虚拟键盘）分别操作pi和kindle，但是因为Pi和Kindle是通过Screen程序共享session，所以在kindle上面看的显示实际也就是Pi上的。  


主要需要具备两个条件：  
（1）树莓派可以和ipad或者Android设备连通，这个可以通过多种方式都可以，最直观的连接是通过无线，比如Android手机开热点，然后树莓派上面接USB无线网卡，连接到手机热点就实现手机与树莓派连接。  
（2）ipad或者Android设备上通过ssh登录到树莓派，执行树莓派上的screen -xR命令，就可以共享树莓派上的session。  


## 下载系统

主要是官网提供的系统。  

* [Debian Wheezy][RASPBIAN]
* [Fedora Remix][PIDORA]
* [An XBMC Media Centre][OPENELEC]
* [A non-Linux distribution][RISC-OS]


### 格式化 SD 卡工具

由于使用写系统工具写之后， SD 卡的大小会被隐藏， 所以需要使用这个格式化工具恢复大小。  

[formatter_4][]


## 无线网卡

下载 SD 卡写系统工具

[Win32DiskImager][]


怎么判断自己无线路由器的信息呢？  

先把路由器拔了， 执行`ls usb`， 然后再插上， 看出来的那个就是无线路由器的信息。  


比如我的多出来的是下面信息。  


```
ls usb  
Bus 001 Device 006: ID 2955:1001
```

后来得知   

```
0x148f,0x7601 MT 6370 
0x2955,0x0001 XiaoDu wifi
0x2955,0x1001 XiaoDu wifi
0x148F,0x760B 360 WIFI 2
0x2717,0x4106 XiaoMi wifi
```

修改common/rtusb_dev_id.c文件   

```
{USB_DEVICE(0x148f,0x7601)}, /* MT 6370 */下面加上
{USB_DEVICE(0x2955,0x0001)}, /* XiaoDu Wifi */
{USB_DEVICE(0x2955,0x1001)}, /* XiaoDu Wifi */
{USB_DEVICE(0x148f,0x760b)}, /* 360 Wifi */
```

### 下载MT7601U USB驱动源码包


使用make 命令编译后，执行make install   

根据iwpriv_usage.txt，执行初始化或重启系统，网卡就可以使用了  


### 修改键盘风格


Raspberry Pi 樹莓派[更改鍵盤配置][192833-raspberry-pi-can-change-the-keyboard-layout-to-us]成 us  

編輯 /etc/default/keyboard   

把 XKBLAYOUT="gb" 改成 XKBLAYOUT="us"  


## 网络


树莓派没有用到Network Manager  

网络接口是编辑/etc/network/interfaces设置的  

### 查看wifi列表

```
pi@raspberrypi ~ $ iwlist wlan0 scan
wlan0     Scan completed :
          Cell 10 - Address: 64:D9:54:8A:D5:5D
                    ESSID:"tiankonguse1"
                    Protocol:IEEE 802.11bgn
                    Mode:Master
                    Frequency:2.412 GHz (Channel 1)
                    Encryption key:on
                    Bit Rates:150 Mb/s
                    Extra:rsn_ie=30140100000fac040100000fac040100000fac020000
                    IE: IEEE 802.11i/WPA2 Version 1
                        Group Cipher : CCMP
                        Pairwise Ciphers (1) : CCMP
                        Authentication Suites (1) : PSK
                    Quality=100/100  Signal level=100/100
```

### 生成账号信息

```
wpa_passphrase SSID名称 密码 

pi@raspberrypi ~ $ wpa_passphrase tiankonguse 12345678
network={
	ssid="tiankonguse"
	#psk="12345678"
	psk=580fa382b17030f7d7f9ddd8adf0fa6bac0617b41cc54ab9455e23a692701618
} 
```

### 修改配置文件

```
pi@raspberrypi ~ $ sudo vi /etc/network/interfaces  

allow-hotplug wlan0  
auto wlan0  
iface wlan0 inet dhcp  
pre-up wpa_supplicant -B w -D wext -i wlan0 -c /etc/wpa_supplicant/wpa_supplicant.conf  
post-down killall -q wpa_supplicant 

sudo vi /etc/wpa_supplicant/wpa_supplicant.conf
network={
	ssid="tiankonguse"
	#psk="12345678"
	psk=580fa382b17030f7d7f9ddd8adf0fa6bac0617b41cc54ab9455e23a692701618
} 
```

### 启动wifi

```
sudo ifup wlan0  
```


### 关闭wifi

```
sudo ifdown wlan0
```


[192833-raspberry-pi-can-change-the-keyboard-layout-to-us]: http://tern.logdown.com/posts/192833-raspberry-pi-can-change-the-keyboard-layout-to-us
[installing-images-windows]: http://www.raspberrypi.org/documentation/installation/installing-images/windows.md
[Win32DiskImager]: http://sourceforge.net/projects/win32diskimager/
[formatter_4]: https://www.sdcard.org/downloads/formatter_4/
[RISC-OS]: http://downloads.raspberrypi.org/riscos_latest
[OPENELEC]: http://downloads.raspberrypi.org/openelec_latest
[PIDORA]: http://downloads.raspberrypi.org/pidora_latest
[RASPBIAN]: http://downloads.raspberrypi.org/raspbian_latest
[8592667]: http://blog.csdn.net/jacktan/article/details/8592667
[raspberry-pi-qzone]: http://user.qzone.qq.com/804345178/mood/5a55f12f4aae5d548e000300.1
