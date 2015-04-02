---  
layout: post  
title: 通用型函数指针
description: 看了 kevinlynx 的一篇文章，然后按自己的理解重新实现一个通用型函数指针。
tag: 函数 指针
keywords: 函数,指针
updateData:  18:50 2015/3/1
categories: [程序人生]
---  

## 前言

看了 kevinlynx 的一篇通用型函数指针的文章，发现使用到的技术知识自己都知道，于是想着自己也实现一个来练练手。  


## 背景

什么是通用型的函数指针呢？  

这个不好解释，不过可以用例子来让大家看明白。  

### 正常类型指针

对于平常的指针，比如整形指针，我们直接可以像[下面的形式操作][normal]。

```
void normal() {
    int one = 1;
    int* pOne;
    pOne = &one;
    printf("pOne %d\n", *pOne);

    int two = 2;
    int* pTwo= &two;
    printf("pTwo %d\n", *pTwo);

    int three = 3;
    int* pThree(&three);
    printf("pThree %d\n", *pThree);

    printf("end normal\n\n");
}
```

这里我们可以看到整形指针有这么几个性质。  

1. 普通指针可以在定义时初始化  
2. 普通指针可以在正常赋值  
3. 我们可以操作指针的值  


### 正常函数指针

那[函数指针][pointFun]是什么样子呢？  

```
void testPointFun(int num) {
    printf("testPointFun %d\n",num);
}

void testPointFunTwo(int num, int num2) {
    printf("testPointFunTwo %d %d\n",num, num2);
}

void pointFun() {
    void (*pFunOne)(int);
    pFunOne = testPointFun;
    pFunOne(1);

    void (*pFunTwo)(int) = testPointFun;
    pFunTwo(2);

    void (*pFunThree)(int)(testPointFun);
    pFunThree(3);

    typedef void (*PestPointFun)(int);
    PestPointFun pFunFour = testPointFun;
    pFunFour(4);

    typedef void (*PestPointFunTwo)(int, int);
    PestPointFunTwo pFunFive = testPointFunTwo;
    pFunFive(5,5);

    printf("end  pointFun\n\n");
}
```

我们发现，普通指针也都可以做这些操作，但是我们需要使用函数指针那么很长很长的定义，即使使用 typedef , 也要为每一种函数声明单独定义新类型的名字。

### 期望的函数指针

于是我们想，能不能直接定义函数指针呢？

比如这样

```
void wantPointFun() {
    PointFun pointFunOne = testPointFun;
    pointFunOne(6);

    PointFun pointFunTwo = testPointFunTwo;
    pointFunTwo(7,7);

    printf("end  wantPointFun\n\n");
}
``` 

当然，根据一个函数名自动推导出对应的函数指针的技术可以实现，但是cpp标准中又没有这样的技术我就不知道了。  

我们就假设cpp中现在没有这样的技术吧。  


## 正文

既然目前标准中不支持这种技术，那我们该如何实现呢？  

### 初级通用函数指针

于是只好自己指定好类型了。  

例如[这样][firstPointFun]   

```

template <typename _R, typename _P1>
class functor {
public:
    typedef _R (*func_type)( _P1 );
public:
    explicit functor( const func_type &func ) :
        _func( func ) {
    }

    _R operator() ( _P1 p ) {
        return _func( p );
    }

private:
    func_type _func;
};

int testPointFun(int num) {
    printf("testPointFun %d\n",num);
    return 0;
}


void firstPointFun() {
    functor<int, int> cmd( testPointFun );
    cmd( 1 );
}
```

于是我们通过重载类的运算符 `()` 来模拟函数调用就完美的解决问题了。  

### 加强版通用函数指针

但是我们既然可以使用类来模拟函数(姑且称为函数对象吧)， 那传过来的函数指针会不会就是我们的那个函数对象呢？  

```
struct Func {
    int operator() ( int i ) {
        return i;
    }
};

void secondPointFun() {
    functor<int, int> cmd1( testPointFun );
    cmd1(1);

    Func obj;
    functor<int, int> cmd2(obj);
    cmd2( 2 );
}
```

我们发现对于函数对象， 编译不通过。提示这个错误  

```
error: no matching function for call to 'functor<int, int>::functor(Func&)'
```

报这个错误也正常，我们的通用函数指针式 `int (*)(int)` 类型， 但是我们传进去的是 `Func` 类型，当然不匹配了。  

这个时候我们就会意识到需要对这个函数的类型进行抽象了，比如[这样][threePointFun]。  

```
template <typename _R, typename _P1,typename _FuncType>
class functor {
public:
    typedef _FuncType func_type;
public:
    explicit functor( const func_type &func ) :
        _func( func ) {
    }

    _R operator() ( _P1 p ) {
        return _func( p );
    }

private:
    func_type _func;
};

int testPointFun(int num) {
    printf("testPointFun %d\n",num);
    return 0;
}


struct Func {
    int operator() ( int num ) {
        printf("Func class %d\n",num);
        return num;
    }
};

void threePointFun() {
    functor<int, int, int (*)(int)> cmd1( testPointFun );
    cmd1(1);

    Func obj;
    functor<int, int, Func> cmd2(obj);
    cmd2( 2 );
}
```

这个时候我们终于编译通过了。  

### 回头思考人生

但是，编译通过的代价却是我们手动指定函数指针的类型， 这与直接声明函数指针变量有什么区别呢？  

比如对于上面的，我们直接使用函数指针不是更方便吗？  

```
void fourPointFun() {
    int (*cmd1)(int) ( testPointFun );
    cmd1(1);

    Func obj;
    Func cmd2(obj);
    cmd2( 2 );
}
```

那我们为了什么那样这样的寻找所谓的'通用型函数指针'呢？  

答案是为了统一函数指针的定义，对，是统一。  

### 自动推导类型

那我们能不能省去函数指针的类型呢？  

貌似使用多态可以省去函数指针的类型，可以让系统自己推导，然后我们只需要调用函数即可。  

例如[这样][fivePointFun]

```

template <typename _R, typename _P1>
struct handler_base {
    virtual _R operator() ( _P1 ) = 0;
};

template <typename _R, typename _P1, typename _FuncType>
class handler : public handler_base<_R, _P1> {
public:
    typedef _FuncType func_type;
public:
    handler( const func_type &func ) :
        _func( func ) {
    }

    _R operator() ( _P1 p ) {
        return _func( p );
    }

public:
    func_type _func;
};

template <typename _R, typename _P1>
class functor {
public:
    typedef handler_base<_R, _P1> handler_type ;
public:
    template <typename _FuncType>
    functor( _FuncType func ) :
        _handler( new handler<_R, _P1, _FuncType>( func ) ) {
    }

    ~functor() {
        delete _handler;
    }

    _R operator() ( _P1 p ) {
        return (*_handler)( p );
    }

private:
    handler_type *_handler;
};

int testPointFun(int num) {
    printf("testPointFun %d\n",num);
    return 0;
}


struct Func {
    int operator() ( int num ) {
        printf("Func class %d\n",num);
        return num;
    }
};

void fivePointFun() {
    functor<int, int>cmd1( testPointFun );
    cmd1(1);

    Func obj;
    functor<int, int>cmd2(obj);
    cmd2( 2 );
}
```  

### 支持任意参数


我们通过模板和多态实现了指定参数的通用型函数指针。  
由于模板是编译的时候确定类型的，所以参数的个数需要编译的时候确定。  
又由于模板不支持任意类型参数，所以我们只好把不同个数参数的模板都定义了。  

这里有涉及到怎么优雅的定义不同个数参数的模板了。  

去年我去听过一个培训，讲的是就是c++的模板，重点讲了偏特化。  

我们利用偏特化就可以暂时解决这个问题。  

实现代码可以参考我的 [github][github-tiankonguse-empty-comfun-sixPointFun] 。  

看了实现代码，发现使用起来还是很不方便。  

```
functor<int, TYPE_LIST1(int)>cmd1( testPointFun );
cmd1(1);

Func obj;
functor<int, TYPE_LIST1(int)>cmd2(obj);
cmd2( 2 );

functor<int, TYPE_LIST2(int,int)>cmd3( testPointFunTwo );
cmd3(1,2);
```

需要我们手动指定参数的个数，以及传进去参数的类型。  

由于我们不能自动推导参数的类型，所以类型必须手动指定，但是个数我们应该可以在编译器期确定吧。  


### 获得宏的个数


现在我们的目的是这样的使用函数指针。  


```
functor<int, TYPE_LIST(int)>cmd1( testPointFun );
cmd1(1);

Func obj;
functor<int, TYPE_LIST(int)>cmd2(obj);
cmd2( 2 );

functor<int, TYPE_LIST(int,int)>cmd3( testPointFunTwo );
cmd3(1,2);
```


这个倒是很容易实现。比如[这样][github-tiankonguse-empty-comfun-servenPointFun]  


```
#define NUM_PARAMS(...) NUM_PARAMS_OUTER(__VA_ARGS__, NUM_PARAMS_EXTEND())
#define NUM_PARAMS_OUTER(...) NUM_PARAMS_INTER(__VA_ARGS__)
#define NUM_PARAMS_INTER( _1, _2, _3, _4, _5, _6, _7, _8, _9,_10, _11,_12,_13,_14,_15,_16, N, ...) N
#define NUM_PARAMS_EXTEND() 16,15,14,13,12,11,10, 9,8,7,6,5,4,3,2,1,0


#define TYPE_LIST1( T1 ) type_list<T1, null_type>
#define TYPE_LIST2( T1, T2 ) type_list<T1, TYPE_LIST1( T2 )>
#define TYPE_LIST3( T1, T2, T3 ) type_list<T1, TYPE_LIST2( T2, T3 )>

#define TYPE_LIST(...) TYPE_LIST_N(NUM_PARAMS(__VA_ARGS__), __VA_ARGS__)
#define TYPE_LIST_N(n,...) TYPE_LIST_N_FIX(n, __VA_ARGS__)
#define TYPE_LIST_N_FIX(n, ...) TYPE_LIST##n(__VA_ARGS__)
```


这个实现还是有一点不爽： 我们需要写出所有可能的 TYPE_LISTn.  

能不能使用宏来做到这个呢？  

宏中怎么才能判断出到到达最后一个参数或者没有参数了呢？  

还是依靠得到宏个数的技术。  

但是经过嵌套尝试，发现宏时不能递归展开的。  

好吧，既然不能递归展开，那也只能到达这一步了。  


## 源代码

源代码可以参考我的 [github][github-tiankonguse-empty-comfun].

## 参考资料

* [实现functor - 增强型的函数指针][cppblog-kevinlynx-44678]
* [C语言 __VA_ARGS__ 宏][tiankonguse-record-175]
* [C/C++宏的奇技淫巧][cppblog-misakamm-164258]
* [C 语言中你想不到的一些问题][github-tiankonguse-c-base]

[pointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/pointFun.cpp
[normal]: https://github.com/tiankonguse/empty/blob/master/comfun/normal.cpp
[firstPointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/firstPointFun.cpp
[secondPointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/secondPointFun.cpp
[threePointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/threePointFun.cpp
[fourPointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/fourPointFun.cpp
[fivePointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/fivePointFun.cpp
[github-tiankonguse-empty-comfun-sixPointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/sixPointFun.cpp
[github-tiankonguse-empty-comfun-servenPointFun]: https://github.com/tiankonguse/empty/blob/master/comfun/servenPointFun.cpp
[github-tiankonguse-c-base]: http://github.tiankonguse.com/blog/2014/12/05/c-base/
[cppblog-misakamm-164258]: http://www.cppblog.com/misakamm/archive/2012/01/16/164258.html
[tiankonguse-record-175]: http://tiankonguse.com/record/record.php?id=175
[github-tiankonguse-empty-comfun]: https://github.com/tiankonguse/empty/tree/master/comfun
[cppblog-kevinlynx-44678]: http://www.cppblog.com/kevinlynx/archive/2008/03/17/44678.html