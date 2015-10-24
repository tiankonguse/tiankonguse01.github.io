---
layout: page
categories: [project]
title : javascript MVC模式框架
---


<script data-main="app" src="/javascripts/require.js"></script>

## 目录结构

```
tiankonguse:single-page-app $ tree
.
├── app.js
├── control
│   └── main.js
├── index.md
├── lib
│   └── require.js
├── model
│   └── messages.js
└── view
    └── print.js
```


## 配置层

```
//app.js
requirejs.config({
    baseUrl: 'lib',
    paths: {
        view: '../view',
        model: '../model',
        control: '../control'
    }
});

requirejs(['control/main']);
```

## control 层


```
//main.js
define(function (require) {
    var messages = require('model/messages');
    var print = require('view/print');

    print(messages.getHello());
});
```

## 逻辑层

```
//messages.js
define(function () {
    return {
        getHello: function () {
            return 'Hello World';
        }
    };
});
```

## 渲染层

```
//print.js
define(function () {
    return function print(msg) {
        console.log(msg);
    };
});
```

