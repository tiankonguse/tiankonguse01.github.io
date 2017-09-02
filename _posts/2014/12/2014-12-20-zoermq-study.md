---
layout: post
title: 网络编程 与 ZeroMQ
description: 我之前从来没有写过网络编程 ，现在要写一个用ZeroMQ来写一个服务器了，记录一下我的笔记与思考。 
tags:  [ZeroMQ,网络编程]
keywords: [ZeroMQ,网络编程]
updateData:  16:44 2014/12/21
categories: [后台技术]
---


## 前言

以前经常听说网络编程这个词， 听起来很高大上的样子。  

最近由于工作需要， 也要做一个服务(server) 来为外界提供快速响应的服务了。  

于是来简单的聊聊网络编程与 ZMQ 这个东西吧。  

> <span class="red">声明：这是我第一次写网络编程程序， 理解错误或解释错误时不可避免的， 有错欢迎指出来。 </span>   



## 背景


其实我对网络编程的理解就是: 服务端收到客户端(client) 的消息， 然后服务端处理这个消息， 最后服务端把处理后的结果返回给客户端即可。  

然后再仔细想想， ~~经常听别人说 PUSH 和 PULL 这个词~~， 这就对服务于客户的关系进行了划分: 服务端是被动的，客户端主动; 服务端主动, 客户端被动。  

** PUSH 和 PULL 对应着下面的第三种模式。**  

这两种情况分别是: 比如我们的网站， 几乎都是前者， 即客户端主动向服务端发消息， 服务端被动的返回信息。  

对于第二种，我之前一直有个疑问：服务端怎么知道连接了哪些客户端呢？  

提出这个问题的原因是服务端一直在运行， ip和端口暴露给了客户端， 因此客户端可以主动给服务端发消息， 但是对于服务端，不知道那些客户端存在，怎么主动发消息呢？发给谁呢？  

然后想到一个解决方案：长连接。 即客户端主动连接服务端， 服务端保存这个链接的信息， 这样就知道有哪些客户端了。  

对于这个解决方案就暴露出下一个问题：服务端要保留那么多客户端的信息， 一个客户端一个连接，那有成千上万的客户端连接时， 怎么做到都保存下来的呢？  


以前我对网络编程的东西只能想到这， 然后就不知道接下来怎么解决的了。 又由于一直没有时间接触这方面的东西， 于是这个疑问也一直没有验证与解决。  

今天就以 ZeroMQ 为背景来详细的了解一下这个领域吧。  


## 网络编程结构


一个网络编程的框架应该包含这个几部分： 环境(content), 消息(Message) 和 Socket .  


一个程序一般只有一个环境， 但是一个环境可以有多个 Socket.  Socket 把 消息发出去或者接受到消息。  


环境一般在程序开始的时候创建， 在程序结束的时候关闭。  

socket 根据需求在适合的时候创建， 使用完后关闭。  

为了跨语言跨平台通信， 需要规范传送的消息的格式， 于是网络框架封装了一个消息。  

又由于网络编程一般有个服务器， 服务器为了提高网络传输速度，会使用一些压缩协议压缩， 比如比较出名的是 google 的 Protocol Buffers。  

好了，下面我们就来看看 ZeroMQ 的这些模块对应的 API 吧。


## zmq 简单简单了解

### zmq content


一个 进程只能有一个 zmq  环境， 所以我们需要在程序开始的时候创建 ZMQ 环境， 程序结束的时候回收 ZMQ 环境。 

创建环境后，我们还可以查询(get)或设置(set)环境的一些属性， 当然还可以对这个环境进行监听(monitor)。  


** zmq_ctx_new **  

创建一个 ZMQ ， 一个程序只能有一个 ZMQ.   


** zmq_init **  

老版本使用 这个函数创建一个 ZMQ, 新版本不适用这个函数了， 推荐使用 zmq_ctx_new 函数。   

以前这个函数需要传一个参数：int io_threads。  

官方上这样写着  


> The io_threads argument specifies the size of the ØMQ thread pool to handle I/O operations.    
> If your application is using only the inproc transport for messaging you may set this to zero, otherwise set it to at least one.  
>  
> ** Thread safety **  
>  
> A ØMQ context is thread safe and may be shared among as many application threads as necessary, without any additional locking required on the part of the caller.  


大概意思就是如果你的程序不想支持 inproc 的话， 传 0 就可以了， 否则传其他的数字。  

它还说 zmq 是线程安全的， 可以共享给其他应用程序。线程安全我没了解过，所以这里不多说了吧。  


** zmq_ctx_destroy ** 

回收 ZMQ, 和 zmq_ctx_new 对应。  


官网上又有这么一句话  

> Context termination is performed in the following steps:  
>   
> * Any blocking operations currently in progress on sockets open within context shall return immediately with an error code of ETERM.    
>   With the exception of zmq_close(), any further operations on sockets open within context shall fail with an error code of ETERM.   
> * After interrupting all blocking calls, zmq_term() shall block until the following conditions are satisfied:  
>   * All sockets open within context have been closed with zmq_close().  
>   * For each socket within context, all messages sent by the application with zmq_send() have either been physically transferred to a network peer, or the socket's linger period set with the ZMQ_LINGER socket option has expired.  

简单的说你执行 zmq_term 函数的时候， 会执行第一步: 使用 zmq 打开的在等待的 sockets 会立即返回，并但会一个错误码。  然后 zmq 会等待那些 使用 zmq 打开的 sockets 全部退出后再退出。  



** zmq_term **  

这个 和 zmq_ctx_destroy 类似， 回收 ZMQ.， 然后这个函数也是弃用的函数了。   


** zmq_ctx_get **  

查询 zmq 的一些信息， 比如 io 线程数， 最大的 sockets 数。  

```
zmq_ctx_get (context, ZMQ_IO_THREADS);  // I/O threads
zmq_ctx_get (context, ZMQ_MAX_SOCKETS); //maximum number of sockets
```

** zmq_ctx_set **  

这和查询的一样， 可以设置 io 线程数和最大 sockets 数。  

```
zmq_ctx_set (context, ZMQ_IO_THREADS, 0);
zmq_ctx_set (context, ZMQ_MAX_SOCKETS, 256);
```

** zmq_ctx_set_monitor  **  

还是看官网的介绍吧。  

> The zmq_ctx_set_monitor() function shall register a callback function specified by the monitor argument.   
> This is an event sink for changes in per socket connection and mailbox (work in progress) states.  

设置一个回调函数， 在每一个 socket 连接 和 mailbox 状态时触发。  


综合以上的几个函数，我们可以总结出下面这句话：  
  
> 以前使用 zmq_init 和 zmq_term 来创建和回收 ZMQ, 现在使用 zmq_ctx_new 和 zmq_ctx_destroy 来创建和回收 ZMQ.    


### zmq Messages

网络编程的核心就是消息传递， 所以 zmq 也提供了很多消息传递的函数。  

下面我们来简单的来看看这些函数吧.  



** 初始化消息 **  

zmq 提供了三个初始化消息的函数， 但是这三个函数时互斥的，所以我们只能选一个来初始化一个消息。  

第一次编写的时候我使用 zmq_msg_init_data 这个方法，结果抛出`malloc(): memory corruption` 的错误， 查看了好久代码和文档都没有找到错在哪里了， 最后使用 zmq_msg_init_size 方法实现了 demo 程序。  

```
// 直接初始化
int zmq_msg_init (zmq_msg_t *msg);

//指定消息大小，zmq 预先分配内存
int zmq_msg_init_size (zmq_msg_t *msg, size_t size);

//自己分配内存和释放内存。 释放内存通过回调函数实现。  主要用于发送消息时使用
typedef void (zmq_free_fn) (void *data, void *hint);
int zmq_msg_init_data (zmq_msg_t *msg, void *data, size_t size, zmq_free_fn *ffn, void *hint);
``` 

** 发送和接收消息 ** 

```
int zmq_msg_send (zmq_msg_t *msg, void *socket, int flags);

int zmq_msg_recv (zmq_msg_t *msg, void *socket, int flags);
```

对于 flags，主要用于设置是否是阻塞模式，就使用参数 ZMQ_DONTWAIT 。  
当然 zmq_msg_send 还有 ZMQ_SNDMORE 参数用于发送多个消息。  


** 回收消息 **  

由于消息是动态申请内存的，所以使用后需要及时释放内存。  

```
int zmq_msg_close (zmq_msg_t *msg);
```

** 得到消息的内容 **  

当我们收到消息后，我们需要获得消息的内容。  

首先我们可以得到消息的大小和消息的二进制。  
上面发消息时提到可以发送多个消息，于是也可以收多个消息，所以需要一个函数判断是不是还有消息。  

```
//消息大小
size_t zmq_msg_size (zmq_msg_t *msg);

//消息的内容， 返回消息的二进制内容的指针
void *zmq_msg_data (zmq_msg_t *msg);

//判断消息后面是否还有消息
int zmq_msg_more (zmq_msg_t *message);
```


** 消息的属性 **  

目前只是提供了这个消息属性的接口，并没有实质性操作。  
意思是不能设置消息属性， 只能得到消息后面是否还有消息这个属性。  

```
//通过 ZMQ_MORE 属性来判断是不是还有消息
int zmq_msg_get (zmq_msg_t *message, int property);

// do nothing
int zmq_msg_set (zmq_msg_t *message, int property, int value);
```

** 操作消息 **  

一般不建议使用两个函数。  

```
int zmq_msg_copy (zmq_msg_t *dest, zmq_msg_t *src);
int zmq_msg_move (zmq_msg_t *dest, zmq_msg_t *src);
```

### zmq Sockets

上面提供了很多消息方法， 这些消息实际上是通过 socket 来传送的。  

所以我们需要一些 socket 操作函数，比如创建 socket, 释放 socket, 绑定端口等操作。  


** 创建 socket **  

创建 socket 需要两个参数， 第一个是我们 zmq 环境， 第二个是 socket 的参数类型。  


```
void *zmq_socket (void *context, int type);
```

在前言和背景中介绍了我对 网络编程的认识， 而且我提及到两种模式: 服务端主动请求和被动请求。  

经过查看 ZMQ 的文档那个， 我发现有四种模式。  


#### Request-reply pattern

请求响应模式，就是我提及到的服务端被动响应模式。  

客户端发来请求， 服务端响应请求。  

目前大多数服务器都是这样模式。  


一般情况下需要设为值 ZMQ_REQ 类型， 服务端需要设置为 ZMQ_REP 类型。  

实际上还有两个扩展类型 ZMQ_DEALER 和 ZMQ_ROUTER. 这里先不多说这两个类型吧。  


#### Publish-subscribe pattern

订阅模式， 就是我提及到的服务端主动响应模式。  

客户端不向服务端发送消息， 一直ishi客户端接收自己想要的消息。  

常见的有邮箱订阅服务吧(我猜想的)。  

这个时候服务端需要设置为 ZMQ_PUB 类型， 只能发送消息。  

客户端需要设置为 ZMQ_SUB 类型， 只能接收消息。  

当然这个模式也有两个扩展模式 ZMQ_XPUB 和 ZMQ_XSUB， 大概是增加了可以相互发送其他详细的功能。  


#### Pipeline pattern

管道模式， 在分布式中服务器一般是很多的， 怎么来做到数据同步呢？ 我猜就是靠这个吧。  

这个时候没有客户端与服务端了， 而且只有两个操作 ZMQ_PUSH 和 ZMQ_PULL。  

一个是分发数据， 一个是拉取数据。  


#### Exclusive pair pattern

这个模式主要用于线程之间传递消息。  

只有一个参数 ZMQ_PAIR。  


看完这四个模式， 原来一般情况下我们只需要知道第一个模式的那两个最基本的类型即可。  


** 关闭 socket **  

直接关闭 socket, 没什么说的了。  

```
int zmq_close (void *socket);
```


** socket 选项 **  


socket 的选项， 可以简单的理解为 socket 的属性吧。  

socket 的选项有很多，这里就不描述了。  

```
int zmq_getsockopt (void *socket, int option_name, void *option_value, size_t *option_len);
int zmq_setsockopt (void *socket, int option_name, const void *option_value, size_t option_len);
```

** 绑定 socket ** 

对于服务端， 需要 绑定一个确定的端口来为外界提供服务。  

```
int zmq_bind (void *socket, const char *endpoint);

//比如
zmq_bind(responder, "tcp://127.0.0.1:5555");
```

** 连接 socket ** 


对于客户端需要连接服务器， 客户端会随机的分配一个自己的端口去连接服务器。  

```
int zmq_connect (void *socket, const char *endpoint);
```

** 消息管理 **  

消息函数在消息那一小节已经介绍过了，还有两个不安全的发送和接受消息的函数。  

```
int zmq_msg_send (zmq_msg_t *msg, void *socket, int flags);
int zmq_msg_recv (zmq_msg_t *msg, void *socket, int flags);

//不安全， 不同的语言对字符串处理方式不同
int zmq_send (void *socket, void *buf, size_t len, int flags);
int zmq_recv (void *socket, void *buf, size_t len, int flags);
```

** 其他 **  

zmq 还提供得到错误码， 根据错误码得到错误信息， 得到zmq版本等函数。

```
int zmq_errno (void);

const char *zmq_strerror (int errnum);

void zmq_version (int *major, int *minor, int *patch);
```



## zmq 样例程序

最后呈现一个最基本的demo程序吧。  


### server demo


server 程序如下， 只是简单的返回一个随机数(虽然只是简单的加1模10， 但还是一个伪随机数的)  

```
/*
 * media_openapi_server.cpp
 *
 *  Created on: 2014年12月18日
 *      Author: skyyuan
 */

#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <map>
#include <vector>
#include <string>
#include <string.h>
#include <cstring>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <algorithm>
#include <time.h>
#include <pthread.h>
#include <assert.h>

extern "C" {
#include <unistd.h>
#include <getopt.h>
#include <stddef.h>
}

#include "zmq.h"

#define CHECK_ABORT(fun, exp) if (!(exp)) { printf("%d fun %s error: %s\n", __LINE__,  #fun, zmq_strerror(errno));abort(); } else

void send(void *responder, int times) {
    int rc = 0;

    char str[] = "word 0";
    int size = strlen(str);
    str[size - 1] = '0' + times;

    zmq_msg_t msg;
    rc = zmq_msg_init_size(&msg, size);
    CHECK_ABORT(zmq_msg_init_data, rc != -1);

    memcpy(zmq_msg_data(&msg), str, size);

    rc = zmq_msg_send(&msg, responder, 0);
    CHECK_ABORT(zmq_msg_send, rc != -1);

    printf("send %s\n", str);

    rc = zmq_msg_close(&msg);
    CHECK_ABORT(zmq_msg_close, rc != -1);
}

void recv(void *responder) {
    zmq_msg_t msg;
    int rc = zmq_msg_init(&msg);
    CHECK_ABORT(zmq_msg_init, rc != -1);

    rc = zmq_msg_recv(&msg, responder, 0);
    CHECK_ABORT(zmq_msg_recv, rc != -1);

    int recvMsgSize = zmq_msg_size(&msg);
    ;
    printf("Received %s, size %d\n", (char*) zmq_msg_data(&msg), recvMsgSize);

    rc = zmq_msg_close(&msg);
    CHECK_ABORT(zmq_msg_close, rc != -1);
}

int myrand() {
    static int times = 0;
    times = (times + 1) % 10;
    return times;
}

int main(int argc, char** argv) {

    void *context = zmq_ctx_new();
    CHECK_ABORT(zmq_ctx_new, context != NULL);

    void *responder = zmq_socket(context, ZMQ_REP);
    CHECK_ABORT(zmq_socket, responder != NULL);

    int rc = zmq_bind(responder, "tcp://127.0.0.1:5555");
    CHECK_ABORT(zmq_bind, rc == 0);

    while (1) {
        recv(responder);
        send(responder, myrand());
    }

    zmq_close(responder);
    zmq_ctx_destroy(context);
    return 0;
}
```


### client demo


客户端请求后，把收到的消息打印出来  

```
/*
 * media_openapi_clent.cpp
 *
 *  Created on: 2014年12月18日
 *      Author: skyyuan
 */

#include <stdio.h>
#include <iostream>
#include <stdlib.h>
#include <map>
#include <vector>
#include <string>
#include <string.h>
#include <cstring>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <algorithm>
#include <time.h>
#include <pthread.h>
#include <assert.h>

extern "C" {
#include <unistd.h>
#include <getopt.h>
#include <stddef.h>
}

#include "zmq.h"

#define CHECK_ABORT(fun, exp) if (!(exp)) { printf("%d fun %s error: %s\n", __LINE__,  #fun, zmq_strerror(errno));abort(); } else

void send(void *responder) {
    int rc = 0;

    const char* str = "hello";
    int size = strlen(str);

    zmq_msg_t msg;
    rc = zmq_msg_init_size(&msg, size);
    CHECK_ABORT(zmq_msg_init_data, rc != -1);

    memcpy(zmq_msg_data(&msg), str, size);

    rc = zmq_msg_send(&msg, responder, 0);
    CHECK_ABORT(zmq_msg_send, rc != -1);

    printf("send %s\n", str);

    rc = zmq_msg_close(&msg);
    CHECK_ABORT(zmq_msg_close, rc != -1);
}

void recv(void *responder) {
    zmq_msg_t msg;
    int rc = zmq_msg_init(&msg);
    CHECK_ABORT(zmq_msg_init, rc != -1);

    rc = zmq_msg_recv(&msg, responder, 0);
    CHECK_ABORT(zmq_msg_recv, rc != -1);

    int recvMsgSize = zmq_msg_size(&msg);

    printf("Received %s size = %d\n", (char*) zmq_msg_data(&msg), recvMsgSize);

    rc = zmq_msg_close(&msg);
    CHECK_ABORT(zmq_msg_close, rc != -1);
}

int main(int argc, char** argv) {
    void *context = zmq_ctx_new();
    CHECK_ABORT(zmq_ctx_new, context != NULL);

    void *responder = zmq_socket(context, ZMQ_REQ);
    CHECK_ABORT(zmq_socket, responder != NULL);

    int rc = zmq_connect(responder, "tcp://127.0.0.1:5555");
    CHECK_ABORT(zmq_connect, rc == 0);

    send(responder);
    recv(responder);

    zmq_close(responder);
    zmq_ctx_destroy(context);
    return 0;
}
```

