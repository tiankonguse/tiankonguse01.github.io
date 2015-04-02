---
layout: post
title: node js 学习记录(持续更新中)
description: 做一个项目的时候，发现有个开源项目可以参考，但是那个用 node js 写的，于是需要了解一下 node js 的基本知识。  
tags:  nodejs require exports
keywords: nodejs, require, exports
updateData:  19:45 2014/12/12
categories: [后台技术]
---


## 前言

这里只会记录一些 node js 的基本语法。  
tiankonguse 假设你已经有 javascript 的基础知识了。  
这里主要参考 [node js 官网api][nodejs-api-modules]


## 背景知识


简单的说几个必要的知识。  

* 除了基本类型， 其他类型全是对象, 函数也是对象， 对象都是引用的。  
* 一切对象都可以当做参数的。  


## 基础代码

先来看看一个最简单的服务器吧。  

```
var http = require("http");

http.createServer(function(request, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
  response.write("Hello World");
  response.end();
}).listen(8080);
```

我们先假设 `require("http")` 就创建了 http 服务， 然后监听 8080 端口。  

来请求了就返回 `Hello World` .  

恩，一切都很简单的样子。  

但是有一些细节我要注意，下面就慢慢道来。  


## require 

看别人的代码，最常见的就是 require 函数了。  

这个函数的意思是包含一个文件，相当于 C 语言中的 include。  

不过由于 require 是个函数，所以有个返回值，返回值是文件想要对外暴露出来的对象(函数也是对象)。  

比如 circle.js 文件如下

```
var PI = Math.PI;

exports.area = function (r) {
  return PI * r * r;
};

exports.circumference = function (r) {
  return 2 * PI * r;
};
```

含有 require 的文件 foo.js 如下 

```
var circle = require('./circle.js');
console.log( 'The area of a circle of radius 4 is ' + circle.area(4));
```

require 的专业名称是 模块加载。 
 
circle.js 文件可以称为一个模块， 默认文件内所有变量对文件外不可见，但是我们可以通过 exports 把某些函数提供给外面的文件使用。    


### require 递归问题

把 require 讲明白后，我们就需要讨论一个问题了： 文件递归 require 怎么办？  

C 语言中我们使用 ifdef 这个 宏定义来判断， nodejs 中自动帮我们判断了。   

也就是我们递归的 require 一个文件时， 会直接返回那个文件目前的 exports 。  


### require 重名问题

讨论完 require 的递归了，我们就需要讨论 require 中名字重复的问题了。  

当有多个时， 优先访问 系统模块。  

由于非系统模块都有自己的路径，所以不存在重名问题。  


### require 命名问题

我们有时候发现 require 文件时，大多数时候都没有加后缀 `.js`。  

这是因为当找不到对应的文件时，会依次去找 `.js`, `.json`, 最后是 `.node` 。  


### require 路径问题

这个和其他语言一样。  

以 `/` 开始的，是绝对路径。  

以 `./` 和 `../` 开始的是相对路径。  

没找到了，会抛出 `MODULE_NOT_FOUND` 错误。  

实际上还有一种情况，那就是直接是文件的名字。比如 文件 `/home/tiankonguse/projects/foo.js`  的内容是下面的一行代码  

``
require('bar.js')
``

则在 父目录下的 node_modules  目录中查找， 即 `/home/tiankonguse/projects/node_modules/bar.js` .  

没找到就再去父路径，直到根路径。  

```
/home/tiankonguse/projects/node_modules/bar.js
/home/tiankonguse/node_modules/bar.js
/home/node_modules/bar.js
/node_modules/bar.js
```

### require 目录

为了方便管理编写的库， nodejs 又提供了一个 require 目录的方法。  

即我们预先把自己实现的库文件路径写在 package.json 文件中， 然后引用目录时， nodejs 会自动去加载相关的库文件。  

package.json 文件如下  

```
{
    "name" : "folders",
    "main" : "./lib/some-library.js"
}
```

然后我们引用目录 `require('./folders')` 将会自动引用 `./folders/lib/some-library.js`.  

如果 我们没有提供 `package.json` 文件，则 nodejs 会尝试去找 `index.js` 和  `index.node` 文件。  


### 多次 require 问题

我们一个 库文件往往做了很多事，那么现在又会出现一个问题：我们多次引用一个文件会计算几次？  

答案是那个文件只会运行一次， 之后会直接返回上次运行的结果。  



## exports

上面可以看到， 默认函数和对象是私有的，通过 exports 我们可以提供给外界一些接口。  


## module.exports

看到 module.exports 是不是一以为是 exports 呢？  

exports 返回的是一个对象， 对象中有一些可以使用的接口。  

而 module.exports 则是向外面提供一个类或者函数。  

与 exports 简单的区别就是只提供一个接口。  

例如  square.js 文件如下  

```
// assigning to exports will not modify module, must use module.exports
module.exports = function(width) {
  return width * width;
}
```

调用文件 bar.js 如下

```
var square = require('./square.js');
var mySquare = square(2);
console.log('The area of my square is ' + mySquare);
```

### 为什么不使用 exports

如果你理解 javascript 的引用的话就好理解了。  

我们可以近似的实现这个 exports, 其中 module 已经是一个对象了。  


我们的一个文件可以看做是一个闭包的函数。  

```
(function(module){
    module.exports = {};
    var exports = module.exports;

    //do some thing 
    exports.fun = function(){
        console.log("hello word");
    }

    return module.exports;
})({})

```

但是如果我们直接给 exports 赋值为函数时，其实是给变量 exports 重新付了一个变量。  

```
(function(module){
    module.exports = {};
    var exports = module.exports;

    //do some thing 
    exports = function(){
        console.log("hello word");
    }

    return module.exports;
})({})

```


但是我们使用 module.exports 就可以保存住我们想传出来的东西。  


```
(function(module){
    module.exports = {};
    var exports = module.exports;

    //do some thing 
    module.exports = function(){
        console.log("hello word");
    }

    return module.exports;
})({})
```







[nodejs-api-modules]: http://nodejs.org/api/modules.html