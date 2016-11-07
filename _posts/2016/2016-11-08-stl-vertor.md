---  
layout: post  
title: stl 源码阅读之容器vertor
description: 昨天记录了stl的内存相关的实现，今天开始就开始记录容器。先写vertor.   
updateData:  01:00 2016/11/08
categories: [stl]
---  


## 背景

上篇文章记录了《[stl 源码阅读之allocator配置器](http://github.tiankonguse.com/blog/2016/11/07/stl-allocator.html)》, 有了这个基础，就可以快速记录容器了。  
这里简单记录一下容器vertor的实现。  


## vertor

vector类中本身没有任何变量，　所以vector里面方法都是对基类的变量的操作。  
这里罗列一下常用的方法，　后面介绍了数据怎么储存后再回头介绍这些方法的实现方式。  

```
// /usr/include/c++/4.8/bits/stl_vector.h

template<typename _Tp, typename _Alloc = std::allocator<_Tp> >
class vector: protected _Vector_base<_Tp, _Alloc> {
public:
    vector() : _Base() {}
    ~vector() ;
    size_type　size() const ;

    void resize(size_type __new_size, value_type __x = value_type());
    size_type capacity() const;
    bool  empty() const;
    void reserve(size_type __n);
    reference operator[](size_type __n);
    const_reference operator[](size_type __n) const;
    void push_back(const value_type& __x);
    void clear();
};
```

## _Vector_base

在`_Vector_base`里面我们看到了真实的变量`_M_impl`, 它又是一个类的实例。　所以这个类中的方法也都是对这个变量的操作啦。  


```
// /usr/include/c++/4.8/bits/stl_vector.h

template<typename _Tp, typename _Alloc>
struct _Vector_base {
    typedef typename __gnu_cxx::__alloc_traits<_Alloc>::template
    rebind<_Tp>::other _Tp_alloc_type;
    typedef typename __gnu_cxx::__alloc_traits<_Tp_alloc_type>::pointer pointer;

public:
    typedef _Alloc allocator_type;

    _Tp_alloc_type&  _M_get_Tp_allocator() ;
    const _Tp_alloc_type&  _M_get_Tp_allocator() const;
    allocator_type get_allocator();

    _Vector_base() :  _M_impl() {
    }
    ~_Vector_base();
public:
    _Vector_impl _M_impl;

    pointer _M_allocate(size_t __n);
    void _M_deallocate(pointer __p, size_t __n) ;
};
```

## _Vector_impl

`_Vector_impl`继承了一个类`_Tp_alloc_type`，是rebing的别名, 上篇文章没有介绍这个模板，这里也只是简单的提一下。  
大家可以把`_Tp_alloc_type`简单的当作`__alloc_traits<_Alloc>`类理解就行了。  

```
// /usr/include/c++/4.8/bits/stl_vector.h

template<typename _Tp, typename _Alloc>
struct _Vector_base {
    typedef typename __gnu_cxx::__alloc_traits<_Alloc>::template
    rebind<_Tp>::other _Tp_alloc_type;
    typedef typename __gnu_cxx::__alloc_traits<_Tp_alloc_type>::pointer pointer;

    struct _Vector_impl: public _Tp_alloc_type {
           pointer _M_start;
           pointer _M_finish;
           pointer _M_end_of_storage;

           _Vector_impl() :
                   _Tp_alloc_type(), _M_start(0), _M_finish(0), _M_end_of_storage(
                           0) {
           }
           
           _Vector_impl(_Tp_alloc_type const& __a) :
                   _Tp_alloc_type(__a), _M_start(0), _M_finish(0), _M_end_of_storage(
                           0) {
           }
           
           void _M_swap_data(_Vector_impl& __x) {
               std::swap(_M_start, __x._M_start);
               std::swap(_M_finish, __x._M_finish);
               std::swap(_M_end_of_storage, __x._M_end_of_storage);
           }
       };
};
```

### 分析

在这个类中，我们可以看到三个变量: start, finish, end.  
start和finish好理解，找到数组的开始和结束的指针(这里并没有说指向开始或者结束位置，而是说找到那个位置的指针).  
end用于预先分配内存,标记预先分配内存的大小。  

那我们有了这三个变量就可以做任何事情了。  

* `size()`  finish 减去　start就是size大小  
* `empty()` finish 是否等于　start
* `operator[n] => *(this->_M_impl._M_start + __n)`
* `capacity() => this->_M_impl._M_end_of_storage - this->_M_impl._M_start`

对于容器的修改，就涉及到容器的核心部分了，　根据这部分也可以看出这个容器的效率是否比较好。  

就那`push_back()`方法来看看vector是怎么管理内存的吧。  


```
void push_back(const value_type& __x){   
    if (this->_M_impl._M_finish != this->_M_impl._M_end_of_storage){   
        _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish,__x);
        ++this->_M_impl._M_finish;
    }else{
        _M_insert_aux(end(), __x);
    }
}
```

这个函数代码很简洁，当预留的buf还足够时，　就直接对下一个空间调用构造函数，　然后finish指针偏移即可。  
如果预留的空间不够了，　就调用insert方法，在最后插入一个值。  

关于调用构造函数的知识点，上篇文章《[stl 源码阅读之allocator配置器](http://github.tiankonguse.com/blog/2016/11/07/stl-allocator.html)》已经记录了，　这里就不多说了。  

那我们就需要来看看插入函数的实现了。  

```
template<typename _Tp, typename _Alloc>
voidvector<_Tp, _Alloc>::_M_insert_aux(iterator __position, const _Tp& __x) {
    if (this->_M_impl._M_finish != this->_M_impl._M_end_of_storage) {
        _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish,　*(this->_M_impl._M_finish　- 1));
        ++this->_M_impl._M_finish;
        _Tp __x_copy = __x;
        std::copy_backward(__position.base(),　this->_M_impl._M_finish - 2,　this->_M_impl._M_finish - 1);
        *__position = __x_copy;
    } else {
        const size_type __len =　_M_check_len(size_type(1), "vector::_M_insert_aux");
        const size_type __elems_before = __position - begin();
        pointer __new_start(this->_M_allocate(__len));
        pointer __new_finish(__new_start);

        _Alloc_traits::construct(this->_M_impl,　__new_start + __elems_before,__x);
        __new_finish = 0;

        __new_finish = std::__uninitialized_moveove(this->_M_impl._M_start, __position.base(),　__new_start, _M_get_Tp_allocator());

        ++__new_finish;

        __new_finish　= std::__uninitialized_move(__position.base(), this->_M_impl._M_finish,　__new_finish, _M_get_Tp_allocator());

        std::_Destroy(this->_M_impl._M_start, this->_M_impl._M_finish,　 _M_get_Tp_allocator());
        _M_deallocate(this->_M_impl._M_start,　this->_M_impl._M_end_of_storage　- this->_M_impl._M_start);

        this->_M_impl._M_start = __new_start;
        this->_M_impl._M_finish = __new_finish;
        this->_M_impl._M_end_of_storage = __new_start + __len;
    }
}
```

这个插入函数是个通用的插入函数，传入插入的位置和值，容器自动把值插入在对应的位置。  

我们先快速看一下这个方法的实现。  

如果容器还有buf, 则使用最后一个元素初始化buf里面的第一个元素(这里有个疑问：容器是空的怎么办呢)。  
然后指针后移，此时相当与向容器最后插入和一个元素，这个元素和最后那个元素相同。  
然后进行元素copy,由于最后一个元素已经有了，所以只需要对前面的进行copy.  
最后将指定位置的元素赋值为插入的元素，　这里有有个小疑问：　问什么先申请一个临时变量呢？难道怕没自我保护，自己给自己赋值这个问题吗?  

如果容器没有buf了，　只好二倍法重新申请内存，　对插入的那个元素在自己的位置进行构造函数，　然后将两段数据copy到新的内存，　最后对旧内存析够，释放空间。  

这里说明容器增长内存调整的时候，　数据会重复调用析够函数的，　但是貌似没有调用构造函数(只是简单的move), 这个需要后续测试一下，问题挺严重的。  


好了，　看完这个插入函数，　实际上vector这个容器的所有操作的原理应该都知道怎么实现了。

### 边界问题

我们现在来看看一些边界问题吧。  

```
void pop_back(){
    --this->_M_impl._M_finish;
    _Alloc_traits::destroy(this->_M_impl, this->_M_impl._M_finish);
}
```

`pop_back()`函数竟然没有检查是否为空，这个我也是醉了。  

```
template<typename _Tp, typename _Alloc>
typename vector<_Tp, _Alloc>::iterator
vector<_Tp, _Alloc>:: insert(iterator __position, const value_type& __x){   
    const size_type __n = __position - begin();
    if (this->_M_impl._M_finish != this->_M_impl._M_end_of_storage && __position == end()) {   
        _Alloc_traits::construct(this->_M_impl, this->_M_impl._M_finish, __x);
        ++this->_M_impl._M_finish;
    }else{   
        _M_insert_aux(__position, __x);
    }
    return iterator(this->_M_impl._M_start + __n);
}
```

`insert()`函数检查是不是最后一个，算是一个小优化，这个优化也解决了上面提到的为空问题。　假设是第一个，且为空，则命中还有空间，且位置和end相等。  
加上是第一个，不为空，则不存在上面的问题了。   


### insert测试

```
#include "stdio.h"
#include "stdlib.h"
#include "vector"

struct StUint{
    StUint():val(2016){
        printf("construct point val[%d] this[%p]\n", this->val,this );
    }
    StUint(const StUint& o):val(o.val + 1000){
        printf("construct point o[%p] val[%d] this[%p] val[%d]\n", &o, o.val,this ,this->val);
    }
    StUint& operator=(const StUint&o){
        if(&o != this){
            this->val = o.val + 1;
        }
        printf("== point o[%p] val[%d] this[%p] val[%d]\n", &o, o.val,this ,this->val);
        return *this;
   } 
    ~StUint(){
        printf("destroy point val[%d] this[%p]\n", this->val,this );
    }
    int val;
};

void testFirstInsert(){
    printf(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n");
    std::vector<StUint> vecUnit;
    StUint oneUnit;
    vecUnit.insert(vecUnit.begin(), oneUnit);
    vecUnit.clear();
    vecUnit.insert(vecUnit.begin(), vecUnit[0]);
    printf("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n");
}


int main(int argc, char**argv){


    if(argc != 2){
        printf("%s num\n", argv[0]); 
        return 0;       
    }
    int num = atoi(argv[1]);
    testConstruct(num);

    return 0;
}
```

经测试发现, 构造函数是完全匹配的，　即使重新分配内存，也是匹配的。  
这个说明__uninitialized_moveove会对内存进行初始化啦。      

```
tiankonguse:~ $ ./a.out 4
>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
construct point val[2016] this[0x7ffcf8636330]
construct point o[0x7ffcf8636330] val[2016] this[0x1a6c010] val[3016]
construct point o[0x7ffcf8636330] val[2016] this[0x1a6c030] val[3016]
construct point o[0x1a6c010] val[3016] this[0x1a6c034] val[4016]
destroy point val[3016] this[0x1a6c010]
construct point o[0x7ffcf8636330] val[2016] this[0x1a6c010] val[3016]
construct point o[0x1a6c030] val[3016] this[0x1a6c014] val[4016]
construct point o[0x1a6c034] val[4016] this[0x1a6c018] val[5016]
destroy point val[3016] this[0x1a6c030]
destroy point val[4016] this[0x1a6c034]
construct point o[0x1a6c018] val[5016] this[0x1a6c01c] val[6016]
construct point o[0x7ffcf8636330] val[2016] this[0x7ffcf8636260] val[3016]
== point o[0x1a6c014] val[4016] this[0x1a6c018] val[4017]
== point o[0x1a6c010] val[3016] this[0x1a6c014] val[3017]
== point o[0x7ffcf8636260] val[3016] this[0x1a6c010] val[3017]
destroy point val[3016] this[0x7ffcf8636260]
<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

destroy point val[2016] this[0x7ffcf8636330]
destroy point val[3017] this[0x1a6c010]
destroy point val[3017] this[0x1a6c014]
destroy point val[4017] this[0x1a6c018]
destroy point val[6016] this[0x1a6c01c]
```

好了，　vector内存管理大概就这么多啦。　明天记录hashmap的实现。


