---
layout: post
title: cgi 探索之路(三)
description: 半年前自己曾研究过cgi这个东西，现在又要搭建一个 nginx 下的 cgi 服务器了，记录一下。      
tags:  nginx  cgi spawn-fcgi fcgiwrap php-cgi
keywords: nginx, cgi, spawn-fcgi, fcgiwrap, php-cgi
updateData:  20:48 2015/1/9
categories: [程序人生]
---


## 前言

半年前，我写了两篇记录 [cgi 探索之路][record_630] 和 [cgi 探索之路(二)][record_632] .  

在 [cgi 探索之路(二)][record_632] 的最后， 我清楚的写着只需要修改一个地方既可以用 nginx 支持 cgi 了。  

现在就按照那句话来试试怎么快速搭建这个一个服务器。  

## 搭建环境

当时我说的原话是 

```
我的 php-cgi 写的是
spawn-fcgi -a 127.0.0.1 -p 9000 -C 10 -u www-data -f /usr/bin/php-cgi

那我的 c++-cgi 写成这样呢
spawn-fcgi -a 127.0.0.1 -p 9001 -C 10 -u www-data  -f  /usr/sbin/fcgiwrap
```

在这里我们可以看到两个信息：我们需要有 spawn-fcgi 和 fcgiwrap 。  


### 安装 spawn-fcgi

我们可以直接去 [github][spawn-fcgi] 上下载源码， 然后在按照标准的方式安装即可。  

```
./autogen.sh
./configure
make
make install
```

### 安装 fcgiwrap

这个我也是去 [github][fcgiwrap] 下载的。  

然后安装。  

```
autoreconf -i
./configure
make
make install
```
  

### 安装 FastCGI

首先去 [官网][fastcgi] 下载 fastcgi 。下载地址是 [这里][fcgi_tar]  。  

然后执行安装命令流程。  

```
./configure
make
make install
```

## 配置 nginx 

配置 nginx 很简单那， 


```
server {
    listen       8080;
    server_name  127.0.0.1;
    location /{
        root /home/skyyuan/nginx/htdoc/;  
        index index.html;  
    }
    location ~ ^/cgi-bin/.*$ {
        #cgi path : /home/skyyuan/test/cgi-bin/
        root /home/skyyuan/test/;  
        if (!-f $document_root$fastcgi_script_name) {
            return 404;
        }   
        fastcgi_pass 127.0.0.1:9000;                           
        include fastcgi.conf;
    } 
}
```

## 安装问题


### FastCGI library is missing


安装fcgiwrap时，我们发现，缺少依赖库 FastCGI。

```
# ./configure
checking for gcc... gcc
checking whether the C compiler works... yes
checking for C compiler default output file name... a.out
checking for suffix of executables...
checking whether we are cross compiling... no
checking for suffix of object files... o
checking whether we are using the GNU C compiler... yes
checking whether gcc accepts -g... yes
checking for gcc option to accept ISO C89... none needed
checking for pkg-config... /usr/bin/pkg-config
checking pkg-config is at least version 0.9.0... yes
checking for FCGX_Init in -lfcgi… no
configure: error: FastCGI library is missing
```

于是我们需要先下载安装 FastCGI 了。


### EOF was not declared

安装 FastCGI 时， 很可惜也报错了，提示如下  

```
cd . \
	  && CONFIG_FILES= CONFIG_HEADERS=fcgi_config.h \
	     /bin/sh ./config.status
config.status: creating fcgi_config.h
config.status: fcgi_config.h is unchanged
make  all-recursive
make[1]: Entering directory `/usr/local/src/fcgi-2.4.1-SNAP-0311112127'
Making all in libfcgi
make[2]: Entering directory `/usr/local/src/fcgi-2.4.1-SNAP-0311112127/libfcgi'
source='fcgio.cpp' object='fcgio.lo' libtool=yes \
	depfile='.deps/fcgio.Plo' tmpdepfile='.deps/fcgio.TPlo' \
	depmode=gcc3 /bin/sh ../depcomp \
	/bin/sh ../libtool --mode=compile g++ -DHAVE_CONFIG_H -I. -I. -I..   -I../include  -g -O2 -c -o fcgio.lo `test -f fcgio.cpp || echo './'`fcgio.cpp
rm -f .libs/fcgio.lo
g++ -DHAVE_CONFIG_H -I. -I. -I.. -I../include -g -O2 -c fcgio.cpp -MT fcgio.lo -MD -MP -MF .deps/fcgio.TPlo  -fPIC -DPIC -o .libs/fcgio.lo
fcgio.cpp: In destructor 'virtual fcgi_streambuf::~fcgi_streambuf()':
fcgio.cpp:50: error: 'EOF' was not declared in this scope
fcgio.cpp: In member function 'virtual int fcgi_streambuf::overflow(int)':
fcgio.cpp:70: error: 'EOF' was not declared in this scope
fcgio.cpp:75: error: 'EOF' was not declared in this scope
fcgio.cpp: In member function 'virtual int fcgi_streambuf::sync()':
fcgio.cpp:86: error: 'EOF' was not declared in this scope
fcgio.cpp:87: error: 'EOF' was not declared in this scope
fcgio.cpp: In member function 'virtual int fcgi_streambuf::underflow()':
fcgio.cpp:113: error: 'EOF' was not declared in this scope
make[2]: *** [fcgio.lo] Error 1
make[2]: Leaving directory `/usr/local/src/fcgi-2.4.1-SNAP-0311112127/libfcgi'
make[1]: *** [all-recursive] Error 1
make[1]: Leaving directory `/usr/local/src/fcgi-2.4.1-SNAP-0311112127'
make: *** [all] Error 2
```

在 stackoverflow 上找到了 [解决方案][installing-fastcgi-dev-kit].  

简单的说就是在 fcgio.cpp 或 fcgio.h 文件里加入 stdio.h 头文件即可。  

然后就安装好了。  


### undefined reference to rpl_malloc


安装好 FastCGI 后， 我们接着安装  fcgiwrap 时， 又报错了。  

```
cc -std=gnu99 -Wall -Wextra -Werror -pedantic -O2 -g3    fcgiwrap.c  -lfcgi  -o fcgiwrap
/tmp/ccnKvVHf.o: In function `get_cgi_filename':
/usr/local/src/fcgiwrap-master/fcgiwrap.c:413: undefined reference to `rpl_malloc'
collect2: ld returned 1 exit status
make: *** [fcgiwrap] Error 1
```

按照网上的搜索结果在configure的时候加上--with-gnu-ld和config.h里加上#undefine rpl_malloc都不能解决问题。

最后在[这里][linux_lyb_3536911]找到了解决方案.  

简单的说就是把 config.h 或 config.h.in 里面与 malloc 相关的配置一下。  

默认配置把 malloc 禁用了。

比如我的，有这么两行  

```
/* Define to rpl_malloc if the replacement function should be used. */                                            
#define malloc rpl_malloc

/* Define to 1 if your system has a GNU libc compatible `malloc' function, and
    to 0 otherwise. */                                    
#define HAVE_MALLOC 0
```

我修改成 

```
//#define malloc rpl_malloc
#define HAVE_MALLOC 1
```

然后就编译通过了。  


### spawn-fcgi child exited with 127

软件都安装好了， 我们就需要启动我们的 fcgiwrap 了。  

但是却提示未执行成功

```
spawn-fcgi -a 127.0.0.1 -p 9000 -C 10 -u www  -f  /usr/local/sbin/fcgiwrap 
spawn-fcgi: child exited with: 127
```

网上搜到了很久，但是没有找到 127 的对应解决方法。  

于是我尝试执行 `spawn-fcgi` 命令。  

```
skyyuan:~ $ spawn-fcgi
Usage: spawn-fcgi [options] [-- <fcgiapp> [fcgi app arguments]]

spawn-fcgi v1.6.5 - spawns FastCGI processes

Options:
省略一万字
```

### No such file or directory


然后我有执行 `fcgiwrap` 命令。  

```
skyyuan:~ $ fcgiwrap
fcgiwrap: error while loading shared libraries: libfcgi.so.0: cannot open shared object file: No such file or directory
```

很高兴看到这个结果， 因为这样就说明找到上面执行不成功的原因了。  

接着找一下 `libfcgi.so` 位置在哪里。  

```
skyyuan:~ $ whereis libfcgi.so
libfcgi: /usr/local/lib/libfcgi.so /usr/local/lib/libfcgi.a /usr/local/lib/libfcgi.la
```

然后查看一下 `/usr/local/lib/` 下面有什么。  

```
skyyuan:~ $ ll /usr/local/lib/libfcgi.so*
lrwxrwxrwx 1 root root   16 Jan  8 16:07 /usr/local/lib/libfcgi.so -> libfcgi.so.0.0.0*
-rwxr-xr-x 1 root root 124K Jan  8 16:07 /usr/local/lib/libfcgi.so.0.0.0*
```

原来没有 `libfcgi.so.0` 这个文件， 那我们就创造一个吧。  

```
skyyuan:~ $ sudo ln -s /usr/local/lib/libfcgi.so.0.0.0 /usr/local/lib/libfcgi.so.0
```

然后再执行 `fcgiwrap` 还是不行。  

于是我把 `libfcgi.so.0`  在 `/usr/lib64/` 和  `/usr/lib/` 里都链接了一份。  

```
skyyuan:~ $ sudo ln -s /usr/local/lib/libfcgi.so.0.0.0 /usr/lib/libfcgi.so.0
skyyuan:~ $ sudo ln -s /usr/local/lib/libfcgi.so.0.0.0 /usr/lib64/libfcgi.so.0
```

然后再执行 `fcgiwrap` 没有出错， 于是再执行那个命令试试吧。  

```
skyyuan:~ $ spawn-fcgi -a 10.12.191.112 -p 9001 -C 10  -f  /usr/local/sbin/fcgiwrap  -u www
spawn-fcgi: child spawned successfully: PID: 11987
```

### No input file specified

终于调通了，于是我去配置一下 nginx, 然后在浏览器中输入对应的网址， 却提示404. 

这个应该是 nginx 配置的原因。

而且这个问题我以前[记录][record_635]过，配置一下`root` 的位置即可。  

由于我们的 cgi 与静态文件在不同的位置， 所有我们需要在  cgi 映射的选项中单独再次为 cgi 配置 root.  

即下面的配置  

> cgi 位置在 `/home/skyyuan/test/cgi-bin/` 下。      


```
location ~ ^/cgi-bin/.*$ {
    #cgi path : /home/skyyuan/test/cgi-bin/
    root /home/skyyuan/test/;  
    if (!-f $document_root$fastcgi_script_name) {
        return 404;
    }   
    fastcgi_pass 127.0.0.1:9000;                           
    include fastcgi.conf;
} 
```

### 403 Forbidden

再次尝试提示 `403 Forbidden`.  

没权限， 怎么可能？  

于是对 cgi 升权限。  

```
chmod -R 777 cgi/
```

结果还是不行， 我查看一下 cgi 的用户信息。  

```
skyyuan:~ $ ll ./cgi-bin/*
-rwxrwxrwx 1 skyyuan users 3.1M Dec 22 17:11 ./cgi-bin/test
```


> 背景知识: www 的组名称也是  users。  


于是我尝试使用 组试试。  


```
skyyuan:~ $ spawn-fcgi -a 10.12.191.112 -p 9000 -C 10  -f  /usr/local/sbin/fcgiwrap  -g users 
```


结果就可以了。  



### Address already in use

使用组试的时候，实际上提示如下。  

```
skyyuan:~ $ spawn-fcgi -a 10.12.191.112 -p 9000 -C 10  -f  /usr/local/sbin/fcgiwrap  -g users 
spawn-fcgi: bind failed: Address already in use
```

大概意思是地址已经使用了， 那我们需要先把之前进程杀死， 但是那个进程号是多少呢？  

```
skyyuan:~ $ ps -aef  | grep fcgiwrap
skyyuan  11987     1  0 20:30 ?        00:00:00 /usr/local/sbin/fcgiwrap
skyyuan:~ $ kill 11987
```

有人可能说这个进程号在启动这个进程的时候有输出， 但是我这个过程中已经输了很多命令了， 不想去 history 中找了。  


就这样， nginx 成功配置了 cgi 环境。  





[record_635]: http://tiankonguse.com/record/record.php?id=635
[linux_lyb_3536911]: http://blog.csdn.net/linux_lyb/article/details/3536911
[installing-fastcgi-dev-kit]: http://stackoverflow.com/questions/8833718/installing-fastcgi-dev-kit
[fcgi_tar]: http://www.fastcgi.com/dist/fcgi.tar.gz
[fastcgi]: http://www.fastcgi.com/drupal/node/5
[fcgiwrap]: https://github.com/gnosek/fcgiwrap
[spawn-fcgi]: https://github.com/lighttpd/spawn-fcgi
[record_630]:http://tiankonguse.com/record/record.php?id=630
[record_632]: http://tiankonguse.com/record/record.php?id=632
