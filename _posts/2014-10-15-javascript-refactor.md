---
layout:     post
title:      重构 javascript
description: 工作的时候实现了一个可以拖拽就摆出一个页面的js模板引擎，但是现在这个引擎实现比较复杂，当需要增加一个组件的时候，工作量很大，于是想对这个引擎进行一下重构。
keywords: javascript, 重构, js, 模板, 引擎, 面向对象
tags: javascript 重构 js 模板 引擎 面向对象
categories: [前端技术]
---

## 前言

实际上重构js代码有很过好处，比如 fuadam 说的那样：  
大家可以现在打开你最近写的网页代码，看看里面的javascript是不是充斥了$('#mainContain").height()或者getGridSelectIds()这样的代码。  
反正我的项目里是这样的，现在我终于下定决心要改变这种局面了。  
我不想因为站点主体div的名称发生了改变而使某一个页面中的布局变得错乱，也不想在一个页面中直接调用另一个嵌入页面的某个方法。  
并且这个嵌入页面的方法还会去获取外部页面上某些元素的一些属性，而且都是根据id来获取来的。  
这实在令人很不爽，虽然开发容易了但是维护代价增加了。  


现在我说说我要重构的原因吧。

1. 这个引擎不止一个网站使用
2. 引擎添加新功能工作量大
3. 需求有改动的时候需要改动很多地方。
    
刚好前端时间我翻了翻一本书《重构--改善既有代码的设计》，然后发现我的这个 js 引擎需要重构一下了。
    
## javascript 重构的常用手段
    
* 匿名函数
* 闭包
* 重用老代码
* 继承

## 重构的本质-继承

```
class Person{
  
};
class Acmer : public Person{

};
```

如果你会c++的话，上面的代码你一定了解，面向对象的三要素你一定也很清楚。  
封装继承多态有多重要也只有你真正编写大型程序的时候才会遇到。  


稍微有点经验的程序员，敲的代码都会有差不多的封装性，但是一般只是简单的几个组装的class,简单的几个函数提取。

但是那已经不错了。


毕竟敲的代码还是不够多，他还没有遇到不使用继承多态时代码会有多么复杂，有多么难维护。

所以遇到那种情况的时候，就是我们一定要学会使用继承的时候了。

比如看一个高深的继承：

```
(function inherit(parent,child){   
    child.prototype = new parent();   
    child.prototype.constructor = parent; //不要丢失构造器
})(parent,child); //匿名函数调用的方式  
```

## 重新认识 javascript 对象

我一直坚信：一切皆对象，对象即类型。

比如这样就是一个对象  

```javascript
var acmer = {
    "name" : "tiankonguse",
    "OJList" : []
};
```

然后我们就可以对这个对象操作了。  

```
//访问名字
console.log(acmer.name); //输出 tiankonguse
console.log(acmer["name"]);//也输出 tiankonguse
```

我们也可以添加方法。  

```
var getName = function(){
    return this.name;
};
acmer.getName = getName;

console.log(acmer.getName()); //输出 tiankonguse
```

上面的实际上是一个实例化的对象。

我们可以改变一下方式来定义这个对象  

```
var Acmer = function(name){
    this.name = name;
    this.OJList = [];
    this.setName = function(name){
        this.name = name;
    }
};

//动态添加名字
Acmer.prototype.getName = function(){
    return this.name;
};

var tiankong = new Acmer("tiankonguse");

console.log(tiankong.getName());
```

## 简单认识 javascript 继承

先看看下面的继承代码

```
var NenuAcmer = function(name){
    this.name = name;
};

NenuAcmer.prototype = new Acmer("");
var tiankong = new NenuAcmer("tiankonguse");

console.log(tiankong.getName());
```

看起来上面的代码已经可以帮我们实现继承了，只是有个问题，怎么调用基类的构造函数,这里先不说那个问题。

 
## 最新标准的继承

最新标准的可以参考 [ECMAScript 5][ECMAScript-5] .

```
//创建对象
var Acmer = Object.create(null);

//设置属性, writable,configurable,enumerable 都可以省略
 Object.defineProperties(Acmer,{
    'name'  : { 
        value:  'tiankonguse',
        writable:     true,
        configurable: true,
        enumerable:   true 
     },
    'OJList': {
        value: []
    },
    'setName': {
        value: function(name){
            this.name = name;
        }
    }
});

var NenuAcmer = Object.create(Acmer);

Object.defineProperties(NenuAcmer, {
    'getName': {
        value: function(){
            return this.name;
        }
    }
});

console.log(NenuAcmer.getName());
```

上面的代码中 NenuAcmer 可以使用 Acmer 的属性和方法，但是用起来给人一种仅仅是把Acmer的方法和属性copy给NenuAcmer似得。

而且上面那种方式也没有了构造函数，而且每个对象都是一个实力，可以理解为单类。

所以我们要想办法做到可以继承，创建多个新的对象，可以构造的对象。

```
var Acmer = function(name, school){
    this.name = name;
    this.school = school;
    this.OJList = [];
};

Acmer.prototype.getName = function(){
    return this.name;
};
Acmer.prototype.setName = function(name){
    return this.name = name;
}


var NenuAcmer = function(name, createYear){
    this.createYear = createYear || 2007;
    Object.getPrototypeOf(NenuAcmer.prototype).constructor.call(this, name, "nenu");
};

// 继承prototype
NenuAcmer.prototype = Object.create(Acmer.prototype);
 
//重置构造函数
NenuAcmer.prototype.constructor = NenuAcmer;

NenuAcmer.prototype.getCreateYear = function(){
    return this.createYear;
};
NenuAcmer.prototype.setCreateYear = function(createYear){
    this.createYear = createYear;
};


var tiankong = new NenuAcmer("tiankonguse", 2010);

console.log(tiankong.getName());
```

上面的代码终于完美的解决了继承的问题，但是有一个小问题，实现麻烦。  
于是我给封装了一下。

```
function Composition(target, source){
    var desc  = Object.getOwnPropertyDescriptor;
    var prop  = Object.getOwnPropertyNames;
    var def_prop = Object.defineProperty;
 
    prop(source).forEach(
        function(key) {
            target.prototype[key] = source[key];
        }
    );
}

function Inheritance(target, source){
    // 继承prototype
    target.prototype = Object.create(source.prototype);
    
    //重置构造函数
    target.prototype.constructor = target;
}

var Acmer = function (name, school){
    this.name = name;
    this.school = school;
    this.OJList = [];
};


Composition(Acmer, {
    "getName" : function(){
        return this.name;
    },
    "setName" : function(name){
        this.name = name;
    }
});

var NenuAcmer = function (name, createYear){
    this.createYear = createYear || 2007;
    Object.getPrototypeOf(NenuAcmer.prototype).constructor.call(this, name, "nenu");
};

Inheritance(NenuAcmer, Acmer);

Composition(NenuAcmer, {
    "getCreateYear" : function(){
        return this.createYear;
    },
    "setCreateYear" : function(createYear){
        this.createYear = createYear;
    }
});

var tiankong = new NenuAcmer("tiankonguse", 2010);

console.log(tiankong.getName());
```

好了，终于完成了。  
目前继承定义一个新类，在新类的构造函数里加一句调用父类的构造函数，然后在调用 Inheritance 即可。

## 参考资料

* [ECMAScript-5][]
* [Javascript 面向对象编程][coolshell-6441]
* [再谈javascript面向对象编程][coolshell-6668]


[coolshell-6441]: http://coolshell.cn/articles/6441.html
[coolshell-6668]: http://coolshell.cn/articles/6668.html
[ECMAScript-5]: http://www.ecma-international.org/ecma-262/5.1/
