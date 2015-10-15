---
layout: post
title: PHP 下使用 ZeroMQ 和 protobuf 
description: 前几天 用 c++ 语言, protobuf 协议, ZeroMQ 网络框架写了一个 server, 后来需要 用 php 语言来给  server 通信,于是简单记录一下。  
tags:  PHP ZeroMQ protobuf
keywords: shell, ZeroMQ, protobuf
updateData:  18:02 2014/12/28
categories: [后台技术]
---


## 前言

这个记录总的来说分两部分：

1. 搭建环境。   
2. 简单使用教程。  


## 搭建环境


### 安装 ZeroMQ  库

首先 PHP 很早之前就安装了， 所以我不想选择重新编译 PHP ， 而是想用动态加载模块的方法来添加这个库。 

正好 zmermq 的[官网][zeromq-org]介绍的有，于是我学会了动态给php安装库。

不过安装 php 版本的 zmq 模块之前， 需要有 c++ 版本的 zmw 库。  

于是先安装 c++ 版本的库。  

```
wget http://download.zeromq.org/zeromq-4.0.5.tar.gz
tar zxvf zeromq-4.0.5.tar.gz 
cd zeromq-4.0.5.tar.gz 
./configure
make
make test
make install
```

### 安装 php ZeroMQ  模块

然后安装 php 版本的模块， 和普通安装只多了一步: phpize  

下载地址在  [github][mkoppanen-php-zmq] 上

```
git clone git://github.com/mkoppanen/php-zmq.git
unzip php-zmq-master.zip
cd php-zmq-master
phpize
./configure
make -B
make test
make install
```

### Build complete 问题

```
# ./configure
config.status: creating config.h
config.status: config.h is unchanged

# make
Build complete.
Don't forget to run 'make test'.
```

这个可以看上面的两个代码的区别。  

由于 make 的时候就只编译有修改的文件链， 而我们的文件什么也没有修改， 所以不会重新编译。  

这个时候就要使用 `make -B` 强制重新编译了。  


### ZMQContext not found 问题

大概错误如下  

```
Fatal error: Class 'ZMQContext' not found ( but it is installed and works on the terminal )
```

stackoverflow 上找到三个类似的问题 [这里][stackoverflow1]， [这里][stackoverflow2], 还有这里 [stackoverflow3][].  

他们的大概结论就是配置文件的问题。  

而且他们提示命令行可以正常执行的，于是我尝试在命令行试试，结果真的可以的。  

```
php test.php
#正常输出结果
```

而且 他们都是强调php有两个配置文件， 一个是 命令行使用的， 一个是 apache 使用的， 但是我使用 `whereis php` 找到有 php 的地方， 然后去看， 只有 `/etc/php.ini` 这一个地方有。  


```
# whereis php
php: /usr/bin/php /etc/php.d /etc/php.ini /usr/lib64/php /usr/include/php /usr/local/php /usr/share/php /usr/share/man/man1/php.1.gz
```


于是我猜想：最大的可能就是 apache 没有使用 `/etc/php.ini`  这个配置文件。  

但是当时我想着命令行能用，就先用命令行吧。  

先让整个客户端能够运行起来在说，于是我不管这个问题了。(最后还需要面对这个问题，并找到原因解决了，详见下面)


### 安装 protobuf 库

protobuf 在 google 的[官网][google-protobuf]上没有找到 php 版本的源码， 只在 github 上找到两个， 我选择了 [这个][allegro-php-protobuf]。 


然后下载安装  

```
git clone https://github.com/allegro/php-protobuf/archive/master.zip
unzip php-protobuf-master.zip
cd php-protobuf-master
phpize
./configure
make
make test
make install
```

然后命令行可以正常运行了。  


## 简单实用记录


### php 下 zmq 的使用

由于我只是在 php 下作为客户端链接其他地方的服务端， 这里只记录客户端的使用方法。  

看下面的代码之前可以先看看之前我记录的一篇 Z[MQ 简单记录][zoermq-study]。  

语言是相同的，所以理解了一个语言，其他语言很快也能上手的。  


```
// 创建环境
$context = new ZMQContext();

//创建 socket
$requester = new ZMQSocket($context, ZMQ::SOCKET_REQ);

//连接服务端， 如果是服务端，只需要改成 bind ， 以及 socket 的第二个参数修改一下就行了吧。
$requester->connect("tcp://10.12.191.112:5555");

//发送数据
$requester->send("hello");

//接受数据
$ret = $requester->recv();

//处理数据
dump($ret);
```

### php 下 protobuf 的使用


首先编写自己的协议，比如简单的登陆协议, 保存为 proto 后缀的文件，比如 test.proto .  

```
package test; 

message api_req 
{ 
    required string    username = 1;
    required string    password = 2;
}

message api_rsp 
{ 
    required int32    ret = 1; // 0 通过验证  1 拒绝验证
    required string   err_msg = 2; //错误信息
}
```

然后使用 protoc-php.php  对我们的协议进行转换  

这个 protoc-php.php 文件在上面我说的 github 上可以找到， ProtobufCompiler 也要下载的。  

```
php protoc-php.php test.proto
```

执行完之后会输出一个 php 的文件， 里面是用 php 封装好的我们的协议类。  


最后就是使用我们的协议类了。  

```
//引入我们的头文件
require_once 'pb_proto_test.php';

//对我们的数据进行打包，并返回字符串
$req = new Test_ApiReq();
$req->setUsername($username);
$req->setPassword($password);
$packed = $req->serializeToString();

//对得到的字符串进行解包
$rsp= new Test_ApiRsp();
try {
    $rsp->parseFromString($packed);
} catch (Exception $ex) {
    die('Upss.. there is a bug in this example');
}
$ret = $rsp->getRet();
$msg = $rsp->getErrMsg();
```

## 遗留问题


最终， php 下的 zeromq 和 protobuf 都可以正常运行了， 只不过是在命令行下运行的。  

然后我无意间看到有人说配置文件不对， 编译库的时候需要指定 php-config 。

于是我尝试了一下

```
cd php-zmq-master
/usr/local/php/bin/phpize
./configure -with-php-config=/usr/local/php/bin/php-config
make -B
make test
make install
```

然后浏览器中竟然没有 提示找不到 `ZMQContext` 了。  

但是出现了新的问题， 提示： 找不到 ProtobufMessage。  

于是使用相同的方法对 protobuf 进行编译。  

```
cd php-protobuf-master
/usr/local/php/bin/phpize
./configure -with-php-config=/usr/local/php/bin/php-config
make -B
make test
make install
```


good, 没有提示找不到 ProtobufMessage 了。  

但是提示 ` undefined symbol: zend_new_interned_string in Unknown on line 0` .  

于是我开始大量的查询资料了。  

第一个是[这里][parallels] 和 [这里][stackoverflow-18442103], 但是我这模块不是通过 pecl 安装的，所以无效。  

但是我还是执行了 `php -v` 这个参数，提示我是 5.3.3 版本的 php.  


然后我又在[这里][zendtech] 和 [这里][dofound], 没有解决问题。  

但是它提示我查看 phpinfo 这个倒是需要做一下。  

然后我发现我的 php 版本是 5.6 .  

此时我意识到一个问题： 我的这台开发机上安装了有两个 php 程序。  

当然，我起初搜到[这里][bug1], [这里][bug2], [还有这里][bug3],[还有这里][bug4]，大家都说是 bug, 现在看来不是 bug 了。  


### 解决方案

既然确定是有两个 php 版本的缘故， 那就需要先把版本保持一致再说。  

于是我采用比较暴力的方法， 把 `/usr/local/php/bin/` 里的文件复制一份到 `/etc/bin/` 下面。  

当然，覆盖前先把原先的文件备份一下。  

```
ls /usr/local/php/bin/
pear        peardev     pecl        phar        phar.phar   php         php-cgi     php-config  phpize

cp /usr/local/php/bin/* /etc/bin/*
```

这样不需要指定路径再重新编译一下， 重启 apache, 浏览器访问发现可以正常返回结果了。  


### 总结

出现这些问题了， 先确认是不是配置文件的问题， 不是了再确认是不是版本的原因。  

《完》




[bug1]: https://bugs.php.net/bug.php?id=61575
[bug2]: https://github.com/drslump/Protobuf-PHP/issues/6
[bug3]: https://github.com/allegro/php-protobuf/issues/16
[bug4]: http://www.linuxquestions.org/questions/programming-9/php-gearman-undefined-symbol-zend_new_interned_string-in-unknown-on-line-0-a-941003/
[dofound]: http://dofound.blog.163.com/blog/static/17114324620135255144286/
[stackoverflow-18442103]: http://stackoverflow.com/questions/18442103/mongodb-conifg-issues-at-lampp-ubuntu-13-04
[zendtech]: https://github.com/zendtech/ZendOptimizerPlus/issues/72
[parallels]: http://kb.sp.parallels.com/en/119804
[zeromq-org]: http://zeromq.org/bindings%3aphp
[zoermq-study]: http://github.tiankonguse.com/blog/2014/12/20/zoermq-study/
[google-protobuf]: https://code.google.com/p/protobuf/
[allegro-php-protobuf]: https://github.com/allegro/php-protobuf
[mkoppanen-php-zmq]: https://github.com/mkoppanen/php-zmq
[stackoverflow1]: http://stackoverflow.com/questions/17896191/fatal-error-class-zmqcontext-not-found-but-it-is-installed-and-works-on-the
[stackoverflow2]: http://stackoverflow.com/questions/9241210/php-an-external-class-library-is-accessible-from-apache-but-not-from-phpunit
[stackoverflow3]: http://stackoverflow.com/questions/20252657/class-zmqcontext-not-found-even-though-zmq-is-installed