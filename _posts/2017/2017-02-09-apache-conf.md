---
layout:     post
title:      apache配置命令笔记
description: 几年前就写了不少杂七杂八的apache配置稳定，当时主要是快速配置，现在记录一下用的的命令。    
keywords: 后台服务
tags: [后台服务]
categories: [程序人生]
updateData:   00:50 2017/2/9
---

## 旧文

这里可以看到，　之前写了不少文章。  

* [.htaccess文件说明大全](http://tiankonguse.com/record/record.php?id=551)  
* [RewriteRule 指令](http://tiankonguse.com/record/record.php?id=124)  
* [apache RewriteCond](http://tiankonguse.com/record/record.php?id=125)  
* [利用 apache 实现子域名](http://tiankonguse.com/record/record.php?id=89)  


## 来源

来源的含义有两个：１.我为什么写这篇文章。２.这篇文章的参考文献。  

1.我为什么写这篇文章  

  年前做数据报表的时候，我在周末利用闲余时间基于php语言使用 MVC 架构和 RestFul 简单的重构了vunion的管理台。  
  当然，管理台的核心写接口都没有动，其他读接口以及旁路数据的操作接口大多数都重写了。  

  MVC框架是使用开源的框架，　但是由于服务器的PHP版本太低，且很多模块都没有，于是我读了框架的核心代码并重写部分逻辑，兼容低版本。  
  MVC　和 RestFul 都需要配置apache来映射一些地址规则，配置的过程中，发现有一些小坑，所以这篇文章主要记录我用到的命令以及遇到的小坑。  


2.这篇文章的参考文献  

  关于apache的配置文档，　主要参考官方英文文档[Apache HTTP Server Version 2.4 Documentation](https://httpd.apache.org/docs/2.4/en/)。  


## allowoverride

用于指定`.htaccess`是否可以覆盖旧配置，　即这个文件是否有效。  

注意事项：  

1. 只在`<Directory>`中有效。  
2. `<Directory>` 路径不能时正则表达式，否则无效。  
3. 在`<Location>`, `<DirectoryMatch>` 和 `<Files>`中无效。  
4. 值设置为`None` 且 `AllowOverrideList` 的值也是`None`时，　所有的`.htaccess`都会无效。  


其他值含义:  

1. `All` 所有的`.htaccess`都有效。  
2. `FileInfo` 可以控制文档类型(document types )，　文档元数据(document meta data)， 重写指令(rewrite directives), 别名指令(alias directives)等。  
3. `Indexes` 可以控制目录标识(directory indexing).  
4. `Limit` 控制主机访问(host access).  
5. `Nonfatal=[Override|Unknown|All]` 配置`.htaccess`的语法错误严重级别  


## Access Control

权限控制主要记录`Allow`, `Deny`　和 `Order`。  

### Allow/Deny

控制哪些主机可以访问当前作用域。  
可以通过主机名，ip地址，ip地址段，甚至是客户端请求的环境变量来控制是否有权限访问。  


使用如下:  

1.域名及所有子域名  
   如下面的配置将运行`tiankonguse.com`以及其他子域名如`github.tiankonguse.com`  
   
```
Allow from tiankonguse.com
```
   
2.ip地址或ip地址段  

```
Allow from 192.168.1.104 192.168.1.205
Allow from 10 172.20 192.168.2
Allow from 10.1.0.0/255.255.0.0
Allow from 10.1.0.0/16
Allow from 2001:db8::a00:20ff:fea7:ccea
Allow from 2001:db8::a00:20ff:fea7:ccea/10
```
   
3.环境变量  
   当环境变量存在时，才执行命令。  
   
```
Allow from env=env-variable
Allow from env=!env-variable
```

### Order

这个命令有两种使用方法: `Order Deny,Allow` 和　`Order Allow,Deny`.　　
对于命中结果则有四种情况：  

1. 只命中Deny  
2. 只命中Allow  
3. 都命中  
4. 都没有命中  

对于只命中Deny的肯定是拒绝了，　对于只命中allow的和都没命中的，肯定是通过了。这两个应该都没有疑问。  
对于都命中的，　是需要先看最后一个命令的，因为后一个命令会覆盖前一个命令的。  

结果如下：  


```
Match  |  Allow,Deny  | Deny,Allowt
Allow  |  allowed     | allowed 
Deny   |  denied      | denied 
No 	   |  Denied      | Allowed
both   |  Denied      | Allowed
```


## Directory

打包一组命令应用与一个目录或者子目录。  

`<Directory>`里面的路径可以是绝对路径，也可以是通配符匹配路径。  

注意事项:  

1. 通配符匹配路径中的`*`只能代表一个目录。  
2. 路径默认可以不加引号，如果路径有空格则必须加引号。  
3. 路径不支持符号链接  
4. 使用`~`可以使用正则匹配路径。  
5. 当有多个匹配时，使用最先匹配的(the directives are applied in the order of shortest match first)。  
6. 优先匹配正常的路径,最后按出现的顺序匹配正则路径。  


## RewriteRule

为重映射引擎定义映射规则。  

### 匹配的定义

在VirtualHost中，模式将首先与主机名和端口之后的URL的部分以及查询字符串之前进行匹配。路径使用百分号解码URL路径  
在具体的目录里面（Directory和.htaccess），模式仅匹配部分路径。  
如果想要匹配主机名，端口和查询字符串，需要在 RewriteCond里面使用`%{HTTP_HOST}`, `%{SERVER_PORT}`　和 `%{QUERY_STRING}`变量。  

### 具体目录映射

映射规则可以在Directory和.htaccess里面。  
为了打开映射引擎，你必须设置`RewriteEngine On`和`Options FollowSymLinks`.
如果想要重新匹配完整的路径，可以在RewriteCond里面使用`%{REQUEST_URI}`变量。  
删除的前缀总是使用反斜杠结尾，这意味着匹配的路径永远都不会有前缀反斜杠。因此使用`^/`开始的模式永远不会在目录里匹配。  
虽然在语法上 Location 和 Files 允许使用映射规则，　但是系统不支持他们。  
可以使用非运算符`!`来判断匹配是否不成立，当使用这个运算符时，不应该使用分组匹配替换功能。  

### FLAG

* `B` 反向引用转义   
  `RewriteRule "^search/(.*)$" "/search.php?term=$1"`  
* `backrefnoplus|BNP` 反向引用转义特殊处理加号 `+ => %20`  
* `chain|C` 绑定关系  
  含义：和下一条规则绑定。这条规则成功才去匹配下一条规则,否则跳过下一条规则。  
  可以递归绑定  
* `cookie|CO=NAME:VAL` 设置cookie  
* `env|E=[!]VAR[:VAL]` 设置环境变量  
* `forbidden|F` 返回403  
* `gone|G` 返回401  
* `Handler|H=Content-handler` 设置Content-handler  
* `last|L` 结束当前匹配，有可能进入子目录的匹配规则。  
* `END` 结束当前匹配，后续不在匹配。  
* `next|N` 重新开始匹配  

```
RewriteRule "(.*)A(.*)" "$1B$2" [N=100]
```

* `nocase|NC` 忽略大小写  
* `proxy|P` 代理  

```
RewriteRule "/(.*)\.(jpg|gif|png)$" "http://images.example.com/$1.$2" [P]
```

* `qsappend|QSA` 将请求参数追加上  

```
RewriteRule "/pages/(.+)" "/page.php?page=$1" [QSA]
```

* `redirect|R[=code]` 重定向  
* `skip|S=num` 如果这条规则匹配，则跳过num个规则  








