---
layout:     post
title:      sphinx 源码阅读之数据结构与算法
category: blog
description: 由于工作需要，使用了sphinx这个软件，但是这个软件好多年没更新了，于是想着自己看看源码，尝试改造一下。第一步是了解sphinx自己封装的一些数据结构和算法了。
tags: sphinx, 搜索引擎, 全文检索, 开源, 源代码
keywords: sphinx, 搜索引擎, 全文检索, 开源, 源代码, 快速排序, 二分查找
updateData: 19:48 2014/11/24
---

## 前言

源码在 [sphinx 官网][sphinxsearch]上就可以下载到.  
起初我下载的是最新版本，结果由于代码大约有 10W 行，我看了快 1W 行后发现这样看也不是个办法。  
于是我想着生成一个项目关系图来阅读代码，但是我这电脑只有windows, 网上介绍的大多都是 linux 上的，于是我只好取消这个念头。  
后来，我想我看sphinx源码主要是先弄明白 sphinx 的工作原理，而工作原理应该一直都是保持不变的，于是我就去下载第一个版本。  
第一个版本果然给力，只有 1W 行，于是我就开始高高兴兴的开始从 main 函数开始看源代码了。  
看了不就发现 sphinx 用了很多数据结构，而且是自己等装好的，还是先把这些数据结构弄明白了比较好。  
于是就有了这篇文章。  
为了方便读者阅读，这些数据结构和算法就从简单的慢慢罗列出来。  


大家可以看右面的目录，然后去看自己感兴趣的数据结构或算法对应的小节。  
如果对那个小节有疑问，可以随时留言。  



## 两个数的最值

sphinx 把最值封装成了一个宏。

```
#define Min(a,b)			((a)<(b)?(a):(b))
#define Max(a,b)			((a)>(b)?(a):(b))
```

## 交换两个数

为了这个通用，使用了基本的模板函数。  
而交换则使用第三个缓存变量来实现这个功能。    

```
template<typename T> 
inline void Swap(T & v1, T & v2) {
    T temp = v1;
    v1 = v2;
    v2 = temp;
}
```

## 向量vector

这个 vector 实现的功能很简单，基本的 insert，remove，get, set 等操作。  
只是附加了一个排序功能。  
具体实现方式这里就不多说了，这些都是一个类基本的操作，都很容易实现(需要谁需要这个vector的实现讲解，可以留言)。  

```
template<typename T, int INITIAL_LIMIT = 1024> 
class CSphVector {
    public:
        CSphVector(); //初始化向量
        ~CSphVector(); //回收向量
        T & Add(); //增加一个元素，返回这个元素的引用
        void Add(const T & tValue);//增加一个元素
        T & Last();//得到最后一个元素
        void Remove(int iIndex);//删除指定位置的元素
        void Grow(int iNewLimit);//扩大缓存的大小，两倍两倍的增长
        void Resize(int iNewLength);// 原先设置数组的大小
        void Reset();// 重置数组
        int GetLength();//得到数组的长度
        void Sort(int iStart = 0, int iEnd = -1);// 正常排序
        void RSort(int iStart = 0, int iEnd = -1);// 逆序
        const T & operator [](int iIndex) const;// 读指定位置的值
        T & operator [](int iIndex);// 设置指定位置的值
    private:
        int m_iLength;//数组大小
        int m_iLimit;//数组缓存大小
        T * m_pData;//数组
};
```

## string 类实现

这次 sphinx 自己实现的 string 类的功能就比较多了。  
这里我罗列出一些比较简单的功能。  

```
struct CSphString{
	CSphString (); //构造
    CSphString ( const char * sString );
	CSphString ( const CSphString & rhs ); 
    CSphString ( const char * sValue, int iLen );
	~CSphString (); //析构
	const char * cstr () const; //得到字符串
	const char * scstr() const;//得到字符串，默认未空串

	inline bool operator == ( const char * t ) const; //判断两个串是否相等
	inline bool operator == ( const CSphString & t ) const;
	inline bool operator != ( const CSphString & t ) const;
	bool operator != ( const char * t ) const;

	
	const CSphString & operator = ( const CSphString & rhs );
	CSphString SubString ( int iStart, int iCount ) const;

	bool IsEmpty () const;
	CSphString & ToLower ();
	CSphString & ToUpper ();
	int Length () const;
	bool operator < ( const CSphString & b );
};
```

## IsAlpha

判断一个字符是不是自己想要的字符。

```
inline int sphIsAlpha ( int c ){
	return ( c>='0' && c<='9' ) || ( c>='a' && c<='z' ) || ( c>='A' && c<='Z' ) || c=='-' || c=='_';
}
```

## IsSpace

判断一个字符是不是空白

```
inline bool sphIsSpace ( int iCode ){
	return iCode==' ' || iCode=='\t' || iCode=='\n' || iCode=='\r';
}
```

## 字符串trim

字符串 trim 这个功能很常用，取出前边和后边的空白。

```
static char * ltrim ( char * sLine ){
	while ( *sLine && isspace(*sLine) )
		sLine++;
	return sLine;
}
static char * rtrim ( char * sLine ){
	char * p = sLine + strlen(sLine) - 1;
	while ( p>=sLine && isspace(*p) )
		p--;
	p[1] = '\0';
	return sLine;
}
static char * trim ( char * sLine ){
	return ltrim ( rtrim ( sLine ) );
}
```

## 切割字符串

切割字符串也是很常用的函数。  
一般需要指定分隔符，默认分隔符是空白。  
具体的实现代码这里就不展示了。  


```
void sphSplit ( CSphVector<CSphString> & dOut, const char * sIn, const char * sBounds );
```


## 正则匹配

正则表达式大家都用过吧，这次 sphinx 实现了一个简单的正则表达式检验函数。  
主要用于检验一个字符串是否符合指定的格式。  

```
bool sphWildcardMatch ( const char * sString, const char * sPattern );
```

## 日志系统

做项目的时候经常会遇到一些打日志的库，其实这个功能很简单。  
基本原理都是使用和 printf 类似的方法: 变参。

```
static void StdoutLogger ( ESphLogLevel eLevel, const char * sFmt, va_list ap ){
	switch ( eLevel ){
        case SPH_LOG_FATAL: fprintf ( stdout, "FATAL: " ); break;
        case SPH_LOG_WARNING: fprintf ( stdout, "WARNING: " ); break;
        case SPH_LOG_INFO: fprintf ( stdout, "WARNING: " ); break;
        case SPH_LOG_DEBUG:  fprintf ( stdout, "DEBUG: " ); break;
	}
	vfprintf ( stdout, sFmt, ap );
	fprintf ( stdout, "\n" );
}
static SphLogger_fn g_pLogger = &StdoutLogger;

inline void Log ( ESphLogLevel eLevel, const char * sFmt, va_list ap ){
	if ( !g_pLogger ) return;
	( *g_pLogger ) ( eLevel, sFmt, ap );
}


void sphWarning ( const char * sFmt, ... ){
	va_list ap;
	va_start ( ap, sFmt );
	Log ( SPH_LOG_WARNING, sFmt, ap );
	va_end ( ap );
}
void sphInfo ( const char * sFmt, ... );
void sphLogFatal ( const char * sFmt, ... );
void sphLogDebug ( const char * sFmt, ... );
```

## 变参的实现

上面的日志系统，最后还是调用了 vfprintf 函数， 没有让我们看到变参到底怎么实现的。  
但是 sphinx 自己实现了一个 sphVSprintf 函数，和 vfprintf 类似，我不明白那个日志系统为什么不用自己的这个输出函数。  
由于是对字符串分析，可以理解为一个简单的自动机。  
遇到什么字符，期望下个字符是什么。  
这里就不多说这个自动机了。  

```
static int sphVSprintf ( char * pOutput, const char * sFmt, va_list ap );
```

## 二进制1的个数

之前我曾写过一篇文章[详解二进制数中1的个数][bit-count-more],大家可以看看。  

```
inline int sphBitCount ( DWORD n ){
	register DWORD tmp;
	tmp = n - ((n >> 1) & 033333333333) - ((n >> 2) & 011111111111);
	return ( (tmp + (tmp >> 3) ) & 030707070707) % 63;
}
```

## 整数二进制的位数

```
/// how much bits do we need for given int
inline int sphLog2 ( uint64_t uValue )
{
#if USE_WINDOWS
	DWORD uRes;
	if ( BitScanReverse ( &uRes, (DWORD)( uValue>>32 ) ) )
		return 33+uRes;
	BitScanReverse ( &uRes, DWORD(uValue) );
	return 1+uRes;
#elif __GNUC__ || __clang__
	if ( !uValue )
		return 0;
	return 64 - __builtin_clzl(uValue);
#else
	int iBits = 0;
	while ( uValue )
	{
		uValue >>= 1;
		iBits++;
	}
	return iBits;
#endif
}
```

## 模板 堆排序



```
/// generic accessor
template < typename T > struct SphAccessor_T{
	T & Key ( T * a ) const; //得到指针的值
	void CopyKey ( T * pMed, T * pVal ) const;
	void Swap ( T * a, T * b ) const;
	T * Add ( T * p, int i ) const;//第i个位置的指针
	int Sub ( T * b, T * a ) const;//指针偏移量
};


/// heap sort helper
// 自底向上进行堆排序
//pData 带排序数组
//iStart 开始位置
//iEnd 结束位置
//COMP 比较函数
//ACC 访问指针的类
template < typename T, typename U, typename V >
void sphSiftDown ( T * pData, int iStart, int iEnd, U COMP, V ACC );


/// heap sort
//奇葩的是先求出最大堆，然后反转，还边反转边维护堆。  
//最终是个最小堆。  
template < typename T, typename U, typename V >
void sphHeapSort ( T * pData, int iCount, U COMP, V ACC );
```

## 快速排序

sphinx 的快速排序也很奇葩。  
一般的快速排序是递归，sphinx使用栈模拟递归。  
这样栈的大小大概就是 log(n) 了。  
而且栈为空的时候共有 log(n) 次。  
结果 sphinx 的二分写的有问题，有些时候会死循环。  
死循环时栈为空的次数就会逐渐增加了。  
于是 sphinx 加了个修复， 当栈为空的次数大于 2.5 * log(n)， 就是用上面那个奇葩的堆排序。  
算法不好真是好可怕呀。  

另外这个快排加了一个小优化：当需要排序的数量小于32时，使用插入排序。  

```
template < typename T, typename U, typename V >
void sphSort ( T * pData, int iCount, U COMP, V ACC );
```

## 二分查找

sphinx 的这个二分查找没有问题，但是和我们平常的二分查找还是有点不同的。  
它的左右边界都是开放的，即(a,b).

```
/// generic binary search
template < typename T, typename U, typename PRED >
T * sphBinarySearch ( T * pStart, T * pEnd, const PRED & tPred, U tRef ){
	if ( tPred(*pStart)==tRef )return pStart;
	if ( tPred(*pEnd)==tRef )return pEnd;

	while ( pEnd-pStart>1 ){
		if ( tRef<tPred(*pStart) || tPred(*pEnd)<tRef )break;
		T * pMid = pStart + (pEnd-pStart)/2;
		if ( tRef==tPred(*pMid) )return pMid;
		if ( tRef<tPred(*pMid) )pEnd = pMid;
		else pStart = pMid;
	}
	return NULL;
}
```


## 数组去重

要想去重，首先需要排序，所以这里假设容器是已经排完序的了。  
然后假设 iDst 的上一个就是目前比较的值。  
如果和上一个相等，则iSrc后移。  
如果和上一个不相等，则找到一个新的值，将iDst位置置为新值，个数加1即可。  

```
/// generic uniq
template < typename T, typename T_COUNTER >
T_COUNTER sphUniq ( T * pData, T_COUNTER iCount ){
	if ( !iCount )return 0;

	T_COUNTER iSrc = 1, iDst = 1;
	while ( iSrc<iCount ){
		if ( pData[iDst-1]==pData[iSrc] )iSrc++;
		else pData[iDst++] = pData[iSrc++];
	}
	return iDst;
}

```




[bit-count-more]: http://github.tiankonguse.com/blog/2014/11/16/bit-count-more/
[sphinxsearch]: http://sphinxsearch.com/