---
layout: post
title: lisp 方言之 Scheme 简单学习
description:  之前只知道 lisp 是门很古老的语言，想着没有机会接触了。现在看 SICP 这本书时，发现还是有必要学一下这类语言的。  
tags:  lisp Scheme
keywords: lisp,Scheme
updateData:  22:10 2015/1/27
categories: [程序人生]
---



## lisp 背景  

Lisp 语言的历史已经很久了，几乎与 Fortran 一样长。  
二十世纪五十年代，计算机科学家先是发明了针对数字计算的 Fortran 语言，后来针对符号计算，由MIT 的John McCarthy于1960年开发出了Lisp(List processing)语言。  
该语言原来是为表处理而设计的编程语言，后来广泛用于处理人工智能问题。  
Lisp 程序中充满了一对对嵌套的小括号，这些嵌套的符号表达式体现着递归。  
递归是数学上的基本概念之一，从递归理论出发，一切可以计算的函数最终都可以划归为几种基本的递归函数的种种组合。  


Lisp 重要的特征就是：  
第一，基于 Lambda 演算的计算模型；  
第二，加上 List processing，这也是 Lisp 名称的由来；  
第三，直接在抽象语法里面工作， 这是非常特别的。  
前两个重要特征，是 McCarthy 天才的设计，第三个特征则是有趣的巧合。  



1994年时众多 Lisp 版本又得到了相当的统一，统一之后的版本称为Common LISP。  
Common Lisp 含有非常丰富的库，仅仅语言的规范就长达千页以上，包括面向对象的 CLOS。  


Scheme 语言是 Lisp 的一个现代变种、方言，诞生于1975年，由 MIT 的 Gerald J. Sussman and Guy L. Steele Jr. 完成。  
Scheme语言的规范很短，总共只有50页，甚至连Common Lisp 规范的索引的长度都不到，但是却被称为是现代编程语言王国的皇后。  
它与以前和以后的 Lisp 实现版本都存在一些差异，但是却易学易用。  

Scheme遵循极简主义哲学，以一个小型语言核心作为标准，加上各种强力语言工具（语法糖）来扩展语言本身。  

语法糖（Syntactic sugar），也译为糖衣语法，是由英国计算机科学家彼得·约翰·兰达（Peter J. Landin）发明的一个术语，指计算机语言中添加的某种语法，这种语法对语言的功能并没有影响，但是更方便程序员使用。  
通常来说使用语法糖能够增加程序的可读性，从而减少程序代码出错的机会。  


语法盐（英语：syntactic salt）是指在计算机语言中为了降低程式设计师撰写出不良程式码的设计，但其中仍会有潜藏错误存在的可能。  
例如，C语言或C++语言中Switch指令的case中若不加break编译器并不会产生错误讯息，部分程式设计师认为宣告变量型态也是语法盐的一种。  




## Scheme 特点  


Scheme语言具有它独特的魅力，看看Scheme的语法特点：  

* 括号嵌套  
    Lisp 程序中充满了一对对嵌套的小括号，这些嵌套的符号体现了最基本的数学思想——递归。  
* 语法简洁  
    Scheme语言的规范很短，总共只有50页。  
* 函数编程语言  
    一个函数（Function）是这个编程语言中所谓的第一等的公民。  
    也就是说函式可以像一个 int 或者 float 一样被很方便的传递来传递去。  
    这也就是所谓"Functional 编程语言"中，Functional 一词的由来。  
* 自动内存管理  
    自动内存管理可不是JAVA的专利呦。  
* 可移植性好  
    Scheme开发的程序有很好的可移植性，这是由于Scheme是一种解释语言，在不同的平台都可以有相应的解释器。  
* 适合于作为脚本语言和嵌入语言  
    语法简洁，这使得Scheme的实现可以非常的经济，一个Scheme解释器可以非常的小巧。  
    Scheme可以作为脚本语言而内嵌于一些工具之中，如：GNU Emacs。  
* 其他特点  
    关键字对大小写不敏感。  



## Scheme 数据结构  

* 数字  
    下面都是合法的数字表示方法：47，1/3，2.3，4.3e14，1+3i。  
* 字符  
    字符前面需要用#\做前缀。如下面都是合法字符：  
    `#\a #\A #\b #\B #\space #\newline`
* 字符串  
    由双引号括起来的字符组成字符串。如："A little string"  
* 布尔值  
    布尔值True和False分别用 #t 和 #f 表示。  
* 列表  
    用圆括号括起来的，可以包含任何数据类型的称为列表。如： (a little (list of) (lists))  
* 数组（vector）  
    用#为前缀，如： #(1 2 "string" #\x 5)  
* 函数（或称为过程）  
    把函数作为一种数据类型，是Scheme语言的特色。  
* 符号  
    符号除了不能够以数字开头的任何字符可组成符号。  
    如：`Symbols: this-is-a-symbol foo a32 c$23*4&7+3-is-a-symbol-too!`


## Scheme 语法  


### 注释  

分号开始一段注释。  

```
;this is a comment  
```


### 常量  

常量表达式返回本身的值。  

```
3.14	; 返回 3.14  
#t	; 返回布尔值 #t  
#\c	; 返回字符 #\c  
"Hi!"	; 返回字符串 "Hi!"  
```

### 表达式记法  

Scheme的表达式的写法有些特别，表达式用括号括起来。  
括号里面的第一个出线的是函数名或者操作符，其它是参数。  
Scheme的这种表达式写法可以叫做前置式。  

下面是一些Scheme的表达式的例子以及其对应的C语言的写法。  

```
 Scheme                               C
------------------------------------------------------------------  
(+ 2 3 4)                       (2 + 3 + 4) 
(< low x high)                  ((low < x) && (x < high)) 
(+ (* 2 3)                      (* 4 5)) ((2 * 3) + (4 * 5)) 
(f x y)                         f(x, y) 
(define (sq x) (* x x))         int sq(int x) { return (x * x) } 
```

### 赋值  


** let 表达式 **  
let 表达式的赋值只在表达式内部有效。  

```
(let ((x 2) (y 3)) (+ x y))  

; ==>  

(let 
    (
        (x 2) 
        (y 3)  
    )
    (+ x y)  
)
; 先赋值： x=2, y=3，再计算x+y的值，结果为5。  
; 注意 (x 2) 和 (y 3) 外还有一层括号, 即和 let 同一级  
```

** define 和 set! 赋值 **  

define和 set! 表达式的赋值在全局有效。  


> define 和 set! 的区别是define既能赋值又能定义变量，而set!只能对已经定义的变量赋值。  


```
(define a 1)	 
a				
; return 1

(set! a 2)  
a				
; return 2

(set! b 1)			
; 错误，b尚未定义  
```


### 函数  


** lambda 表达式 ** 



```
(lambda (var ...) exp1 exp2 ...)  
```

lambda 表达式用于定义函数。var ... 是参数，exp1 exp2 ...是函数的执行 部分。  

```
((lambda (x) (+ x x)) (* 3 4))  
; return 24  
```

我们可以把 lambda 表达式理解为匿名函数即可。  


** define  定义函数 **  

```
(define (double x) (+ x x))  

; double is function name  
; x is 参数  
```

实际上上面个的 define 定义函数等价于 

```
(define double (lambda (x) (+ x x)) 
```

然后我们可以看到， 我们可以把函数赋值给一个变量。  

所以也可以这样做。  

```
(let ( 
        (double (lambda (x) (+ x x))) 
    ) 
    (double 12) 
)
```


### 顺序计算  

`(begin exp1 exp2 ...)` 顺序执行表达式 exp1, exp2, ...，返回最后一个表达式的结果  

### 条件表达式  


** 关系运算符 **  

```
(< -1 0)  		#t  
(> -1 0)  		#f 
(eqv? 'a 'a) 	#t  
```

** 逻辑运算 **  

```
(not #t)  		#f  
(not #f) 		#t 

(not 1)  		#f  
(not '(a b c))  #f 


(or)  			#f  
(or #f)  		#f  
(or #f #t)  	#t  
(or #f 'a #f)  	a 

(and)  			#t  
(and #f)  		#f  
(and #f #t)  	#f  
(and #f 'a #f)  #f  
(and 'a #t 'b)	'b  
```

** if 表达式 **  

`(if test consequent alternative)` 如果test表达式为真，返回 consequent，否则返回 alternative。  

```
(define (abs n)  
    (if (< n 0)  
        (- 0 n)  
        n)) 
```

** else 表达式 **  

`(cond (test exp) ... (else exp))` 多路分支判断表达式，类似于C语言的 "if ... else if ... else"。  


```
(define abs  
  (lambda (n)  
    (cond  
      ((= n 0) 0)  
      ((< n 0) (- 0 n))  
      (else n)))) 
```


** case 表达式 **  

```
(let ((x 4) (y 5))  
  (case (+ x y)  
    ((1 3 5 7 9) 'odd)  
    ((0 2 4 6 8) 'even)  
    (else 'out-of-range)))  
; 返回 odd  
```

### 循环  

** do 表达式 **  

`(do ((var1 val1 update1) ...) (test res ...) exp ...)`  类似于C语言的for循环。先将val1赋值给var1，...，之后循环开始，在每次循环的开始，先执行表达式 test，如果返回布尔值真，则循环终止，并返回结果 res，如果表达式 test返回布尔值#f，则运行表达式 exp...，之后依次用 update1 ... 的值来为变量 var1 ... 重新赋值。  

```
;计算阶乘 n! = n*(n-1)!  

(define factorial  
  (lambda (n)  
    (do ((i n (- i 1)) (a 1 (* a i)))  
        ((zero? i) a)))) 

(factorial 10)  
; 返回 3628800 
```

** map 表达式 ** 

`(map procedure list1 list2 ...)` 列表 list1 list2 ... 必须具有同样的长度；过程 procedure 接受的参数个数同列表的个数，各个列表中对应的变量分别作为过程 procedure 的参数被执行， 将每次的运算结果以列表形式返回。  


```
(map abs '(1 -2 3 -4 5 -6)) 	
; 返回 (1 2 3 4 5 6)，abs接受一个参数  

(map (lambda (x y) (* x y))  
     '(1 2 3 4)  
     '(8 7 6 5))		
;返回(8 14 18 20) ，lambda (x y) 接收两个参数  
```

** for-each 表达式 **  

`(for-each procedure list1 list2 ...)` 同 map表达式， 但是不返回结果列表。  


[mit-scheme]: http://www.gnu.org/software/mit-scheme/  
[wikipedia-Scheme]: http://zh.wikipedia.org/wiki/Scheme  
[tiankonguse-yast-cn]: http://tiankonguse.com/manual/yast-cn/  
[worldhello-ar01s04s06]: http://www.worldhello.net/doc/docbook_howto/ar01s04s06.html  