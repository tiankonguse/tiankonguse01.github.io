---  
layout: post  
title: stl 源码阅读之allocator配置器
description: 前段时间一个服务大量使用了hashmap,于是简单看了下hashmap的实现方式，发现需要先看allocator，这里记录一下。    
updateData:  02:28 2016/11/07
categories: [stl]
---  


## 背景

在看vertor, map, set, string源码时， 总会看到有个`_Alloc`相关的模板参数。  
然后这些容器都是使用这个`_Alloc`管理内存的。  
这里简单的记录下`_Alloc`的设计与源码实现, 为之后的容器记录做准备。  


```
template<typename _Tp, typename _Alloc = std::allocator<_Tp> >
        class vector: protected _Vector_base<_Tp, _Alloc>;

template <typename _Key, typename _Tp, typename _Compare = std::less<_Key>,
        typename _Alloc = std::allocator<std::pair<const _Key, _Tp> > >
        class map;


template<typename _CharT, typename _Traits, typename _Alloc>
    class basic_string;

template<typename _CharT, typename _Traits = char_traits<_CharT>,
           typename _Alloc = allocator<_CharT> >
    class basic_string;

typedef basic_string<char>    string;
```

> 注1：我这里都是阅读c++ 4.8版本的stl源码。  
> 注2: 这里不去关系怎么管理内存来提高效率， 这里关系的是申请释放内存时做了哪些事。  

## 面向用户的allocator


根据源码，可以看到，`allocator`自身只是定义了一些类型，如指针，引用，值的类型等。   
这里唯一不协调的就是`rebind`了，正常情况下我们使用不上这个功能，所以本片文章不做介绍，后续项目涉及到这个了再深入记录一下。    

```
// /usr/include/c++/4.8/bits/allocator.h
template<typename _Tp>
class allocator: public __allocator_base<_Tp> {
public:
    typedef size_t size_type;
    typedef ptrdiff_t difference_type;
    typedef _Tp* pointer;
    typedef const _Tp* const_pointer;
    typedef _Tp& reference;
    typedef const _Tp& const_reference;
    typedef _Tp value_type;

    template<typename _Tp1> struct rebind { typedef allocator<_Tp1> other;};

    allocator() throw () {}
    allocator(const allocator& __a) throw () : __allocator_base<_Tp>(__a) {}
    template<typename _Tp1> allocator(const allocator<_Tp1>&) throw () {}
    ~allocator() throw () {}
};
```

## 中间件 __allocator_base

`__allocator_base` 只是一个中间符号， 用于指定默认使用那个内存分配器。默认是`new_allocator`.  


```
// /usr/include/c++/4.8/bits/c++allocator.h
#if __cplusplus >= 201103L
namespace std
{   
    template<typename _Tp>
    using __allocator_base = __gnu_cxx::new_allocator<_Tp>;
}
#else
// Define new_allocator as the base class to std::allocator.

#define __allocator_base  __gnu_cxx::new_allocator

#endif
```

## 一种具体实现new_allocator

`new_allocator`是最简单的内存管理实现,其他相关的实现还有`malloc_allocator`,`__pool_alloc`,`__mt_alloc`,`bitmap_allocato`等。  

我们看到， `new_allocator`里面也定义了那些指针，引用，值的类型， 而且也定义了`rebind`, 这里不讨论基类与子类重复申明这些的作用。  
真正有用的是分配内存函数`allocate`和`deallocate`, 还有构造和析构函数`construct`和`destroy`.  

这四个函数的功能与其名字一样， 一个是申请释放内存的， 一个是构造和析构的。  

由于容器一般提前申请内存了, 所以容器就有必要自己调用构造函数和析够函数.  
其中的`allocate`函数和`construct`函数延伸出一个知识点:`new operator`,`operator new`,`placement new`.  

```
// /usr/include/c++/4.8/ext/new_allocator.h

template<typename _Tp>
class new_allocator {
public:
    typedef size_t size_type;
    typedef ptrdiff_t difference_type;
    typedef _Tp* pointer;
    typedef const _Tp* const_pointer;
    typedef _Tp& reference;
    typedef const _Tp& const_reference;
    typedef _Tp value_type;

    template<typename _Tp1> struct rebind { typedef new_allocator<_Tp1> other; };

    new_allocator()  {}
    new_allocator(const new_allocator&)  {}
    template<typename _Tp1> new_allocator(const new_allocator<_Tp1>&)  {}
    ~new_allocator()  {}
    
    pointer address(reference __x) const  { 
        return std::__addressof(__x); 
    }
    const_pointer address(const_reference __x) const  { 
        return std::__addressof(__x); 
    }
    
    pointer allocate(size_type __n, const void* = 0) { 
        return static_cast<_Tp*>(::operator new(__n * sizeof(_Tp))); 
    }
    void deallocate(pointer __p, size_type) { 
        ::operator delete(__p); 
    }
    
    void construct(pointer __p, const _Tp& __val) { 
        ::new ((void *) __p) _Tp(__val); 
    }
    void destroy(pointer __p) { 
        __p->~_Tp(); 
    }
    
    size_type max_size() const { return size_t(-1) / sizeof(_Tp); }
};
```


## new operator, operator new 与 placement new

`operator new`是一个函数，我们可以重载，作用是申请指定大小的内存。  
`new operator`是一个我们熟悉的`new`，不可以重载，作用是调用`operator new`申请内存，并初始化， 一般用户调用。    
`placement new`是一个全局函数，不可重载，作用是允许我们在一个已分配的内存中主动初始化内存中的对象。  

`placement new`声明和使用如下: 

```
//声明
void *operator new( size_t, void * p ) throw();

//使用, 返回值依旧是传入的指针。  
void construct(pointer __p, const _Tp& __val) { 
    ::new ((void *) __p) _Tp(__val); 
}
```  

正是由于`placement new`的存在， 我们才可以自己管理内存分配内存，并进行初始化。

## 欠下的帐

* 内存管理相关算法  
* rebind作用  
* allocator与基类重复定义的原因  
* stl实现

