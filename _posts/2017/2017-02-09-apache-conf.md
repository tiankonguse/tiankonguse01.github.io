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


## 参考文档

关于apache的配置文档，　还是参考[Apache HTTP Server Version 2.4 Documentation](https://httpd.apache.org/docs/2.4/en/)比较全面一些。  


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

1. 域名及所有子域名  
   如下面的配置将运行`tiankonguse.com`以及其他子域名如`github.tiankonguse.com`  
   `Allow from tiankonguse.com`  
2. ip地址或ip地址段  
   ```
   Allow from 192.168.1.104 192.168.1.205
   Allow from 10 172.20 192.168.2
   Allow from 10.1.0.0/255.255.0.0
   Allow from 10.1.0.0/16
   Allow from 2001:db8::a00:20ff:fea7:ccea
   Allow from 2001:db8::a00:20ff:fea7:ccea/10
   ```
3. 环境变量  
   当环境变量存在时，　才执行命令。  
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


<未完成>

