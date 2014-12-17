---
layout:     post
title:      python 中的小问题(持续更新中)
category: blog
description: 刚学习python，经常会遇到一些小的问题，于是总结一下
keywords: python, 时间格式化, xml, json
tags: python 时间格式化 xml json
updateData: 16:19 2014/12/1
---

![python logo][cover]

## 前言

时间多的挺快的，从学习python到现在已经一个月了。

当时写了两篇文章 [初步学习Python][first-learn-python] 和 [初步学习Python高级语法][first-learn-python-hight-lev], 还有一篇规范文章 [Python 风格规范][python-style].

然后到现在已经写了大大小小8~9个python程序了，并且已经在正式环境跑了。

现在总结一下遇到的一些常见的问题，或者需求吧。


## 时间的年月日

```python
localtime = time.localtime(time.time())
year = localtime.tm_year
mon = localtime.tm_mon
day = localtime.tm_mday
hour = localtime.tm_hour
min = localtime.tm_min
sec = localtime.tm_sec #0 到 61 (60或61 是闰秒)
wday = localtime.tm_wday #0到6 (0是周一)
yday = localtime.tm_yday #1 到 366
```


## 格式化 字符串  

```python
time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
```

其中格式化规则如下

```text
%y 两位数的年份表示（00-99）
%Y 四位数的年份表示（000-9999）
%m 月份（01-12）
%d 月内中的一天（0-31）
%H 24小时制小时数（0-23）
%I 12小时制小时数（01-12） 
%M 分钟数（00=59）
%S 秒（00-59）

%a 本地简化星期名称
%A 本地完整星期名称
%b 本地简化的月份名称
%B 本地完整的月份名称
%c 本地相应的日期表示和时间表示
%j 年内的一天（001-366）
%p 本地A.M.或P.M.的等价符
%U 一年中的星期数（00-53）星期天为星期的开始
%w 星期（0-6），星期天为星期的开始
%W 一年中的星期数（00-53）星期一为星期的开始
%x 本地相应的日期表示
%X 本地相应的时间表示
%Z 当前时区的名称
%% %号本身
```


##  指定 日期 是 周几

```python
print datetime.datetime(2012,04,23).strftime("%w")
```

## 获取几分钟、小时、天之前的时间

```
(datetime.datetime.now()-datetime.timedelta(days=1)).strftime("%Y-%m-%d")
# days, seconds, minutes, hours, weeks 控制时间
```


## http 请求

关于 post 请求详见 [Python 下发送 post 类型的 http请求][python-http-post]


```python
try:
    req = urllib2.Request(url)
    page = urllib2.urlopen(req)
    ret_str = page.read()
    
    print ret_str
except urllib2.HTTPError, e:
    print('(%s)http request error code - %s.' % (url, e.code))
except urllib2.URLError, e:
    print('(%s)http request error reason - %s.' % (url, e.reason))
except Exception:                                                                                       
    print('(%s)http request generic exception: %s.' % (url, traceback.format_exc()))
```


## 对 url 中的val 转义

```python
name = urllib.quote(name)
```

## 对 post 数据转义

```python
postdata = {}
postdata["key"] = val
postdata = urllib.urlencode(postdata)
```

## 注册 指定 代理

```python
def installProxy():
    proxy_handler = urllib2.ProxyHandler({"http" : 'tiankonguse.com:8080'})
    opener = urllib2.build_opener(proxy_handler)
    urllib2.install_opener(opener) 
# end installProxy
```
## 临时 使用 代理

```python
proxy_handler = urllib2.ProxyHandler({"http" : 'tiankonguse.com:8080'})
opener = urllib2.build_opener(proxy_handler)

req = urllib2.Request(url)
page = opener.open(req)

ret_str = page.read()
print ret_str
```

## mysql 操作

```python
test_dbcfg = {'host' : 'tiankonguse.com', 'port' : 3306, 'user' : 'test', 'passwd' : 'test', 'db' : 'test'}

try:
    dbcfg=test_dbcfg
    conn = MySQLdb.connect(host=dbcfg["host"], user=dbcfg["user"], passwd=dbcfg["passwd"], db=dbcfg["db"], port=dbcfg["port"], charset='utf8')
    cur = conn.cursor()

    #查询
    sql = "SELECT id,name FROM test.test;"
    cur.execute(sql)

    results = cur.fetchall()

    for x in results:
        print x[0]," ",x[1] 
    

    sql = "INSERT INTO test.test(id,name) VALUES('1','tiankonguse');"
    cur.execute(sql)
    
    # 删除，添加，修改需要提交才会生效.
    # 一次提交代表一个事物
    conn.commit()
        
    conn.close();        
except MySQLdb.Error, e:
    print("Mysql Error %d: %s" % (e.args[0], e.args[1]))
```

比如我的这篇文章:[python mysql 更新和插入数据无效][python-update-invalid]，数据怎么也没有插件去，后来找到是没有 commit 的原因。


## 字符串 与 json 转化

详见我的另一篇文章[Python 下 json 的基本操作与转换][python-json]


```python
json_obj = json.loads(str)
str = json.dumps(json_obj)
```

## 所有类型转化为字符串

参考 [stackoverflow][converting-integer-to-string-in-python]

目前 int， long，unicode，datetime.datetime 转化为字符串有效。

对于 NoneType 需要特判。

```python
newStr = str(variable)
```


## 整数 与 字符串 转化

```python
num = int("123") # 123
str = str(123) # "123"
```

## 整数 与 ansci 编码转换

```python
num = ord("1") # 49
char = chr(48) # '1'
```

## Non-ASCII character

想输出一些变量时遇到 `SyntaxError: Non-ASCII character` 这个问题，原来默认按 ASCII 识别了，所以我们需要设置编码格式。

一般前两行是这个样子

```python
#!/usr/bin/python
# coding:UTF-8
```

## 随机数生成

```python

random.random() # 生成一个0到1的随机浮点数
random.uniform(a, b) #生成一个指定范围内的浮点数
random.randint(a, b) #生成一个指定范围内的整数
random.randrange(a, b, c) #生成一个指定等差数列内的数
random.choice(list) # 从list中随机选择一个元素
random.shuffle(list) # 将list中的元素顺序打乱
random.sample(list, n) # 从list中随机挑n个元素
```

## 判断实例类型

从数据库中导出数据，组装后再导出，但是 python 的数据库有点强大，数据库内是什么类型，取出来的数据就是什么类型。  
这样的话我还要一个一个的转换类型，好麻烦，所以我需要使用循环判断类型，统一转化为字符串然后操作。

type 与 isinstance 的区别就是，type 判断实例与基类为不相等，而 isinstance 判断为相等。

```python
num = 1
type(num) # 'int'

isinstance(num, int) #True


```

有时候数据库中取出的数据时 null, 这个时候这个变量就是 `<type 'NoneType'>` 了。

此时我们不能用 `isinstance(num, NoneType)` 来判断，也不能用 null 来判断。

只能用下面的方法判断(参考 [stackoverflow][how-to-test-nonetype-in-python])

```python
if variable is None:
```

## 判断key是否在字典中

下面两个方法都可以,但是推荐第一个.  
第二个在 python3 中将弃用.

```
key in dict
dict.has_key(key)
```

## mysql 字符串转义

```
str = conn.escape_string(str)
```


## 字符串分割

经常会遇到把指定的字符串按指定的字符分割，幸好 python 为我们提供了这么一个方法。

```
str="a b c d"
print str.split()                                                                                                 
print str.split(" ")
print str.split(" ", 2)
print str.split("b")
```

默认 split 使用空白当做分隔符，返回一个数组。  
不过我们可以用第一个参数来指定分隔符。  
指定分隔符后，也可以指定最多分多少个，分够之后剩余的会附加在最后一个元素上。  

```
skyyuan:test $ ./split.py 
['a', 'b', 'c', 'd']
['a', 'b', 'c', 'd']
['a', 'b', 'c d']
['a ', ' c d']
```

## 字符串合并

有时候我们又一个字符串数组，想要用指定的字符串连接起来，这时候 join 就派上用场了。  

```
array = ['a', 'b', 'c', 'd']
print " ".join(array);
# a b c d


print "-".join(array);
# a-b-c-d
```

常用的有转换日期

```
array = "2014-11-26"
print "/".join(array.split("-"))
# 2014/11/26
```

## 文件操作

对于文件操作，常用的有两种：读，写。  
其中读可能一次性读完，也可能按某个规则一个一个的读。  
而写则有覆盖写和文件末尾追加两种方式。  

### 判断文件是否存在

操作文件首先需要判断文件是否存在了。  

```
if not os.path.exists(filePath):
    print "not exit"
```

### 判断文件是不是目录


有人可能会问：文件怎么会是目录呢？  
这是因为在 Linux 系统下， 目录也算是文件的。  
所以上面的只是判断了那个路径存在，但是不能判断就是文件。  
所以就有了下面的命令

```
if os.path.isfile(filePath):
    print "file"
else:
    print "directory"
```


### 打开文件

```
f = open(filepath, 'r')
```

打开文件可以指定三个参数，第一个参数的位置,第二个参数以什么方式打开文件，最后一个指定编码。   
主要讲讲第一个参数  

```
r  读
w  写之前会先清空文件
a  在文件指定位置追加写，默认文件末尾
b 以二进制的方式写
r+, w+, a+ 可以读也可以写
```

### 文件关闭

文件打开了，肯定需要关闭了。  

```
f.close()
```



###  打开文件失败

有时候会打开文件失败，比如文件不存在，这个时候就需要使用异常捕捉了。  

```
try:
    f = open(youkuFilePath, 'r')
    # do some thing
    
    f.close()
except IOError, e:
    logging.error("Error %d: %s" % (e.args[0], e.args[1]))
```

### 读取文件


```
# 读取全部内容
f.read() 

# 读取一行内容
f.readline()


# 读取所有行内容,返回一个 list
f.readlines()
 
 
# 读取指定大小的内容
f.read(size)
```

### 写文件

写文件比较简单，直接写即可。

```
f.write('Hello, world!')
```

## 删除两端空白

在其他语言中，一般都有删除两端空白的函数， 比如 trim, ltrim, rtrim 等。  
但是在python 中发现名字换了， 换成 strip 了。  

```
trip   => trim 删除两边的空白。
lstrip => trim 删除左边的空白
rstrip => trim 删除右边的空白
```

## 小数转百分比

```
a = 0.12345
print "%.2f%%" % (a * 100)
```

## 编码检测 与转换编码

有时候我们会有多个数据源，然后在一起操作时，发现明明相同的数据却不相等。  
这个时候就要考虑是不是编码不同的原因了。  

最简单的判断方法可以先用上面的 [判断实例类型][python-problem-check-type] 中的type 判断是 str 类型还是 unicode 类型就行了。  
如果是 str 类型， 则输出可以看到 "\xXX\xXX" 的编码格式，这个是十六进制的编码格式，储存的是二进制，需要转码为 unicode. 
如果是 unicode 类型， 则输出可以看到 "\uxxxx\uxxxx" 的编码格式，这个就是 unicode 的编码格式,不需要转码。 

于是我们现在就需要对 str 类型的串进行转码了。  
其中最简单的是不管什么编码，直接转码为 utf8 即可。  

```
data = data.decode("utf8")
# or
data = unicode(data, "utf8")
```

又是我们想判断一个串的编码具体是什么，这个时候就需要下面的方法了。  

```
import chardet 
chardet.detect(data)
```

不过，这样的话，原先就是 unicode 的串再次进行 detect 的话，有个 警告。  

```
chardet/universaldetector.py:90: UnicodeWarning: Unicode equal comparison failed to convert both arguments to Unicode - interpreting them as being unequal
```

于是我们需要加个特殊判断了。  

```
if not isinstance(data, unicode):
    print chardet.detect(data)
``` 

一般执行 decode 或者 unicode 后的串就会变成 python 内部统一的编码格式。  
我们输出的时候想要变回原先指定的格式，于是就需要下面的 encode 操作了。  

```
data = data.encode("utf8")
```

## 执行shell命令

有时候我们需要执行 shell 命令还简化工作，C 语言中由 system 命令，那python 中呢？  
发现还是 system 命令。  

```
print os.popen('cat /proc/cpuinfo').read()
```


## 字符串 常见操作


### 字符串连接

最简单就是 + 号连接符了，但是大家都说这样的效率很低。  

```
print "hello " + "word!"
```

然后有人使用数组转化为字符串的方法  

```
array = ["hello", "word"]
print " ".join(array)
```

当然，也有人使用格式化字符串的方法来连接字符串  

```
print ("%s %s" % ("hello", "word"))
```


### 字符串截取

这个需要先知道具体的位置。  

比如得到某个位置的字符  

```
str = "hello word"
print str[2] # l
```

当然可以得到连续的一个子串，如果是范围不包含上界。  

```
str = "hello word"
print str[0,4]
print str[1,-1]
```

### 字符串替换

有两种替换方法。  
一种是平常的字符串替换，另一种是正则表达式。   


```
str = "hello word"
print str.replace('word','python')
```


### 字符串比较

字符串比较也有两种方法。  

一种直接比较，一种使用函数比较  

```
print "hello" == "word"
print cmp("hello", "word")
```

### 字符串查找

字符串的查找又是有两个方法  

```
str = "hello word"
print str.find('word')  # 未找到就返回 -1  
print str.find('word', 2) # 从指定位置开始查找  
print str.index('word') # 没有找到抛出异常
```


### 字符串分割

大多数语言都有这个方法，split 即可分割字符串。  

```
str = "hello word"
print str.split(' ') # 返回一个数组
```

### 字符串翻转

特有语法，记住即可。  

```
str = "hello word"
print str[::-1]
```

### 字符串长度

python 所有的得到长度的方法都是这个函数。  

```
str = "hello word"
print len(str)
```


## sleep 操作

有时我们需要让程序等待一会，c 语言中有 sleep 函数， python 中应该也有的。  

简单的说 python 使用 sleep 函数来等待， 指定的时间以秒为一个单位，想表示更小的单位需要使用小数。  

### sleep 秒级

```
t = 1
time.sleep(t)
```

### sleep 毫秒级

```
t = 0.001
time.sleep(t)
```




## 修改历史

* 16:34 2014/12/17 添加 时间的 sleep 操作
* 14:57 2014/12/8 添加 字符串操作 条目
* 16:19 2014/12/1 添加 编码检测 与转换编码 条目
* 19:11 2014/11/28 谢谢 Maslino 提醒我， readlines 是读取多有行而不是一行。与我赶紧检查我项目中的代码，然后发现使用正确。我使用的是 `for line in f.readlines`.





[python-problem-check-type]: http://github.tiankonguse.com//blog/2014/10/29/python-problem/#content-h2-判断实例类型
[converting-integer-to-string-in-python]: http://stackoverflow.com/questions/961632/converting-integer-to-string-in-python
[how-to-test-nonetype-in-python]: http://stackoverflow.com/questions/23086383/how-to-test-nonetype-in-python
[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2514466730.png
[python-http-post]: http://github.tiankonguse.com/blog/2014/09/28/python-http-post/
[python-json]: http://github.tiankonguse.com/blog/2014/09/29/python-json/
[first-learn-python]: http://github.tiankonguse.com/blog/2014/09/25/first-learn-python/
[first-learn-python-hight-lev]: http://github.tiankonguse.com/blog/2014/09/25/first-learn-python-hight-lev/
[python-style]: http://github.tiankonguse.com/blog/2014/10/08/python-style/
[python-update-invalid]: http://github.tiankonguse.com/blog/2014/10/20/python-update-invalid/