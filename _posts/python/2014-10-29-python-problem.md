---
layout:     post
title:      python 中的小问题(持续更新中)
description: 刚学习python，经常会遇到一些小的问题，于是总结一下
keywords: python, 时间格式化, xml, json
tags: python 时间格式化 xml json
updateData: 16:19 2014/12/1
categories: [python]
---

![python logo][cover]

前言的前言

一年前写下这个记录, 陆陆续续的增加新东西, 虽然很多东西都没有来得及加进来, 但是这些足够初学者当作文档来查询了.  
这篇记录建议当作文档来使用, 以后可以快速查找.  
不建议直接阅读这篇记录, 应该也没有人有耐心来完整的阅读这篇记录.  
如果谁阅读完了, 应该会发现不少错误, 请告诉我. 谢谢.  

## 前言

时间多的挺快的，从学习python到现在已经一个月了。

当时写了两篇文章 [初步学习Python][first-learn-python] 和 [初步学习Python高级语法][first-learn-python-hight-lev], 还有一篇规范文章 [Python 风格规范][python-style].

然后到现在已经写了大大小小8~9个python程序了，并且已经在正式环境跑了。

现在总结一下遇到的一些常见的问题，或者需求吧。


## 日期时间相关

### 得到时间戳



#### 得到当前时间戳.  

`time.time()` 可以得到一个浮点数, 单位秒.  

```
>>> import time
>>> time.time()
1444919694.33675
```

#### 时间元组转时间戳  

```
>>> time.mktime(time.localtime(time.time()))
1444920189.0
```

#### 字符串转时间戳  

我们可以先把字符串转化为时间元组, 然后再从时间元组转化为时间戳  

```
>>> t=time.strptime("2015-10-15 22:47:45", "%Y-%m-%d %H:%M:%S")
>>> t
time.struct_time(tm_year=2015, tm_mon=10, tm_mday=15, tm_hour=22, tm_min=47, tm_sec=45, tm_wday=3, tm_yday=288, tm_isdst=-1)
>>> time.mktime(t)
1444920465.0
```



### 得到时间元组


#### 时间戳转换为时间元组  

```
>>> time.localtime(time.time())
time.struct_time(tm_year=2015, tm_mon=10, tm_mday=15, tm_hour=22, tm_min=40, tm_sec=33, tm_wday=3, tm_yday=288, tm_isdst=0)
```

#### 字符串转时间元组  

```
>>> time.strptime("2015-10-15 22:47:45", "%Y-%m-%d %H:%M:%S")
time.struct_time(tm_year=2015, tm_mon=10, tm_mday=15, tm_hour=22, tm_min=47, tm_sec=45, tm_wday=3, tm_yday=288, tm_isdst=-1)
```


### 时间格式化为字符串  


#### 元组转化为字符串

```
>>> time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()) 
'2015-10-15 22:55:23'
```

#### 时间戳转化为字符串  

我们可以先把时间戳转化为时间元组, 然后再转化为字符串


```python
>>> time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(time.time())) 
'2015-10-15 22:56:05'
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

###  日期

日期就是传入年月日时分秒, 可以得到一个日期对象.  

```
>>> datetime.datetime(2015,10,15)
datetime.datetime(2015, 10, 15, 0, 0
```


#### 日期转时间元组

```
>>> t=datetime.datetime(2015,10,15)
>>> t
datetime.datetime(2015, 10, 15, 0, 0)
>>> t.timetuple()
time.struct_time(tm_year=2015, tm_mon=10, tm_mday=15, tm_hour=0, tm_min=0, tm_sec=0, tm_wday=3, tm_yday=288, tm_isdst=-1)
```


####  日期格式化输出


```python
>>> datetime.datetime(2015,10,15).strftime("%Y-%m-%d %H:%M:%S %w")
'2015-10-15 00:00:00 4'
```


### 获取几分钟、小时、天之前的时间

第一种方式是使用日期操作.  

```
(datetime.datetime.now()-datetime.timedelta(days=1)).strftime("%Y-%m-%d")
# days, seconds, minutes, hours, weeks 控制时间
```

第二个方式是时间戳操作.  

可以参考上面的时间戳操作.  


### 得到年月日

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


### 常用的有转换日期

```
array = "2014-11-26"
print "/".join(array.split("-"))
# 2014/11/26
```

### sleep 操作

有时我们需要让程序等待一会，c 语言中有 sleep 函数， python 中应该也有的。  

简单的说 python 使用 sleep 函数来等待， 指定的时间以秒为一个单位，想表示更小的单位需要使用小数。  

#### sleep 秒级

```
t = 1
time.sleep(t)
```

#### sleep 毫秒级

```
t = 0.001
time.sleep(t)
```


## 网络相关


### http get 请求


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

### http post 请求

关于 post 请求详见 [Python 下发送 post 类型的 http请求][python-http-post]  


```python
try:

    item = {}
    item["value"] = "测试"
    
    postdata = {}
    postdata["data"] = json.dumps(item, ensure_ascii=False)
    postdata["username"] = "tiankonguse"
    
    encodedata = urllib.urlencode(postdata)
    
    req = urllib2.Request(url, encodedata)
    
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


### 对 url 中的val 转义

```python
name = urllib.quote(name)
```

### 对 post 数据转义

```python
postdata = {}
postdata["key"] = val
postdata = urllib.urlencode(postdata)
```

### http请求永久代理

```python
def installProxy():
    proxy_handler = urllib2.ProxyHandler({"http" : 'tiankonguse.com:8080'})
    opener = urllib2.build_opener(proxy_handler)
    urllib2.install_opener(opener) 
# end installProxy
```
### http请求临时代理

```python
proxy_handler = urllib2.ProxyHandler({"http" : 'tiankonguse.com:8080'})
opener = urllib2.build_opener(proxy_handler)

req = urllib2.Request(url)
page = opener.open(req)

ret_str = page.read()
print ret_str
```

### http 下载文件


Python中最流行的方法就是通过Http利用urllib或者urllib2模块。  
当然你也可以利用ftplib从ftp站点下载文件。  
此外Python还提供了另外一种方法[requests][docs-python-requests]。


#### urllib 下载

```
import urllib
urllib.urlretrieve(url, "code.zip")
```

#### urllib2 下载

```
import urllib2
f = urllib2.urlopen(url)
data = f.read()

file = open("code2.zip", "wb")
file.write(data)
file.close()
```

#### requests 下载

```
r = requests.get(url)

file = open("code2.zip", "wb")
file.write(r.content)
file.close()
```

>  
> We use the with statement because it will automatically close a file and simplifies the code.     
> Note that just using "read()" can be dangerous if the file is large.     
> It would be better to read it in pieces by passing read a size.  
>  


### http 代理下载文件

简单的说就是先设置永久代理，再使用下载函数下载。  

```
#设置代理  
proxy_handler = urllib2.ProxyHandler({"http" : 'tiankonguse.com:8080'}) 
opener = urllib2.build_opener(proxy_handler,urllib2.HTTPHandler)  
urllib2.install_opener(opener)  
          
#下载       
urllib.urlretrieve(url,local,urlcallback)  
```


那我们想临时下载一个东西，设置成永久代理不太好吧。  
是的，所以我们也可以使用临时代理下载文件。  


```
proxy_handler = urllib2.ProxyHandler({"http" : 'tiankonguse.com:8080'}) 
page = urllib2.urlopen(url, proxies=proxy_handler)
data = page.read()

file = open("code2.zip", "wb")
file.write(data)
file.close()
```



### FTP上传

```
ftp=FTP() 

#打开调试级别2，显示详细信息;0为关闭调试信息 
ftp.set_debuglevel(2)

#连接 
ftp.connect(ip, port)

#登录，如果匿名登录则用空串代替即可 
ftp.login(username, password)

#显示ftp服务器欢迎信息 
#print ftp.getwelcome()

#选择操作目录 
ftp.cwd(path) 

#以读模式在本地打开文件
file_handler = open(filename,'rb')

# bufsize 设置缓冲块大小
ftp.storbinary('STOR %s' % os.path.basename(filename),file_handler,bufsize)#上传文件 
ftp.set_debuglevel(0) 
file_handler.close() 

ftp.quit() 
```


### FTP下载


```
ftp=FTP() 
ftp.set_debuglevel(2) 
ftp.connect('192.168.0.1','21') 
ftp.login('admin','admin') 
#print ftp.getwelcome()#显示ftp服务器欢迎信息 
#ftp.cwd('xxx/xxx/') #选择操作目录 
bufsize = 1024 
filename = "20120904.rar" 

file_handler = open(filename,'wb').write #以写模式在本地打开文件 
ftp.retrbinary('RETR %s' % os.path.basename(filename),file_handler,bufsize)#接收服务器上文件并写入本地文件 
ftp.set_debuglevel(0) 
file_handler.close() 
ftp.quit() 
```


## mysql数据库操作


### 打开关闭数据库


```python
test_dbcfg = {'host' : 'tiankonguse.com', 'port' : 3306, 'user' : 'test', 'passwd' : 'test', 'db' : 'test'}

try:
    dbcfg=test_dbcfg
    conn = MySQLdb.connect(host=dbcfg["host"], user=dbcfg["user"], passwd=dbcfg["passwd"], db=dbcfg["db"], port=dbcfg["port"], charset='utf8')
    cur = conn.cursor()
        
    conn.close();        
except MySQLdb.Error, e:
    print("Mysql Error %d: %s" % (e.args[0], e.args[1]))
```

### 增删改查样例


比如我的这篇文章:[python mysql 更新和插入数据无效][python-update-invalid]，数据怎么也没有插件去，后来找到是没有 commit 的原因。


```python
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
```


### mysql blob 二进制数据

```
sql = "INSERT INTO test (theblobcolumn) VALUES (%s)"
cursor.execute(sql, (blobdata,))
```


### mysql 字符串转义

```
str = conn.escape_string(str)
```

## 类型


### 所有类型转化为字符串

参考 [stackoverflow][converting-integer-to-string-in-python]

目前 int， long，unicode，datetime.datetime 转化为字符串有效。

对于 NoneType 需要特判。

```python
newStr = str(variable)
```


### 整数 与 字符串 转化

```python
num = int("123") # 123
str = str(123) # "123"
```


### 判断实例类型

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



## 字符串


### 字符串 与 json 转化

详见我的另一篇文章[Python 下 json 的基本操作与转换][python-json]


```python
json_obj = json.loads(str)
str = json.dumps(json_obj)
```



### 字符串分割

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

### 字符串合并

有时候我们又一个字符串数组，想要用指定的字符串连接起来，这时候 join 就派上用场了。  

```
array = ['a', 'b', 'c', 'd']
print " ".join(array);
# a b c d


print "-".join(array);
# a-b-c-d
```

### 删除两端空白

在其他语言中，一般都有删除两端空白的函数， 比如 trim, ltrim, rtrim 等。  
但是在python 中发现名字换了， 换成 strip 了。  

```
trip   => trim 删除两边的空白。
lstrip => trim 删除左边的空白
rstrip => trim 删除右边的空白
```


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

## 正则表达式

正则表达式是什么, 以及语法这里不做介绍, 这里只记录怎么使用以及注意事项.  


### 导入正则模块

```
import re
```

### search

匹配并找到文本中的位置


### match

匹配文本

```
# a-b(岁)?
result = re.search(r'^(\d+)-(\d+).*', data)
if result:
    first = int(result.group(1))
    second = int(result.group(2))
    while first <= second:
        print first
        first = first + 1
    
result = re.search(r'^(\d+)岁以上$', data)
if result:
    first = int(result.group(1))
    print first
```

### split

分割字符串




## 编码相关


### 程序编码


```
import sys
import re
reload(sys)
sys.setdefaultencoding('utf8')
```



### 编码检测 与转换编码


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


### 整数 与 ansci 编码转换

```python
num = ord("1") # 49
char = chr(48) # '1'
```

### Non-ASCII character

想输出一些变量时遇到 `SyntaxError: Non-ASCII character` 这个问题，原来默认按 ASCII 识别了，所以我们需要设置编码格式。

一般前两行是这个样子

```python
#!/usr/bin/python
# coding:UTF-8
```



## 文件操作

对于文件操作，常用的有两种：读，写。  
其中读可能一次性读完，也可能按某个规则一个一个的读。  
而写则有覆盖写和文件末尾追加两种方式。  

### 打印日志


#### 日志级别

* CRITICAL 危险级别
* ERROR    错误级别
* WARNING  警告级别
* INFO     信息级别
* DEBUG    调试级别
* NOTSET   说明信息


#### 文件模式

* a 在文件指定位置追加写
* w 写之前会先清空文件
* b 以二进制的方式写

#### 打印格式

* `%(asctime)s` 时间
* `%(filename)s` 文件名
* `%(funcName)s` 函数名
* `%(levelname)s` 日志级别
* `%(lineno)d` 行号
* `%(message)s` 错误信息
* `%(pathname)s` 路径名
* `%(process)d` 进程ID
* `%(processName)s` 进程名
* `%(thread)d` 线程ID
* `%(threadName)s` 线程名


#### 样例

设置系统日志

```
today = datetime.date.today()
logfilepath = "./log/" + os.path.splitext(os.path.basename(__file__))[0] + "_" + today.strftime('%Y%m%d') + ".log"
logging.basicConfig(filename=logfilepath, level=logging.ERROR, filemode='w', format='%(asctime)s - %(levelname)s: %(message)s')

logging.debug("sql:%s" % ("select * from test;"))
```

设置私有日志

```
import logging
import logging.handlers

LOG_FILENAME = 'logging_rotatingfile_example.out'

# Set up a specific logger with our desired output level
my_logger = logging.getLogger('MyLogger')
my_logger.setLevel(logging.DEBUG)

# Add the log message handler to the logger
handler = logging.handlers.RotatingFileHandler(LOG_FILENAME, maxBytes=20, backupCount=5)

my_logger.addHandler(handler)

my_logger.debug('i = %d' % i)
```



### 只运行一个实例

有时候我们想让程序在同一个时间只运行一个，简称为程序只运行一个实例。  
现在是2015年3月23日，我在网上搜了很多很多教程，都是千篇一律的一个方法。  

我使用万能的粘贴复制代码，然后运行，同一个程序还是可以再同一时间运行多个。  

最后，我终于在一个[老外的博客][how-can-i-avoid-running-a-python-script-multiple-times-implement-file-locking]的评论中找到了方法。  

无效的方法是这个 lockFile 代码。  

```
import fcntl
def lockFile(lockfile):
    fp = open(lockfile, 'w')
    try:
        fcntl.lockf(fp, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except IOError:
        return False

    return True

if not lockFile(".lock.pod"):
        sys.exit(0)
```


对我有效的代码

```
import fcntl
def lockFile(lockfile):
    #fd = open(lockfile, 'w')
    fd = os.open(lockfile, os.O_CREAT | os.O_TRUNC | os.O_WRONLY)
    try:
        # Request exclusive (EX) non-blocking (NB) advisory lock.
        fcntl.lockf(fd, fcntl.LOCK_EX | fcntl.LOCK_NB)
    except IOError:
        return False

    return True

if not lockFile(".lock.pod"):
        sys.exit(0)
```

评论的原话：  


>  
> The problem is that the nuilt-in open() function was used which return a file object.   
> You need to use os.open instead which return an integer file descriptor.  
>  




什么意思呢？  
lockf 函数需要第一个参数是文件描述符，也就是所谓的fd.  

而open的官网文档是这样说的  


>  
> Open a file, returning an object of the file type described in section .  
>  


所以我们需要得到fd,查看一下 bltin-file-objects 的文档，发现 fileno 函数可以返回fd.  


>  
> Return the integer “file descriptor” that is used by the underlying implementation to request I/O operations from the operating system.   
> This can be useful for other, lower level interfaces that use file descriptors, such as the fcntl module or os.read() and friends.  
>  
>  Note File-like objects which do not have a real file descriptor should not provide this method!  
>  

什么意思呢？ 这个函数返回的‘文件描述符’只能用来io操作，他并不是真实的文件描述符。  
于是我尝试了下面的代码，果然还是不能实现只运行一个实例的目的。  

```
import fcntl
def lockFile(lockfile):
    fp = open(lockfile, 'w')
    try:
        fcntl.lockf(fp.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except IOError:
        return False

    return True

if not lockFile(".lock.pod"):
        sys.exit(0)
```

好了， 不管怎样，我们以 os.open 的方式成功的实现了只运行一个实例的目的。  
很多东西还是自己跑一下才知道。  



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

### 得到一个目录下的文件


这里的文件指的是目录和文件。  

```
dir="/hone/tiankonguse/github/"
files = os.listdir(dir)  
for f in files:  
    print f  
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

## 执行shell命令

有时候我们需要执行 shell 命令还简化工作，C 语言中由 system 命令，那python 中呢？  
发现还是 system 命令。  


### system 命令

这个命令的缺点是不能得到命令的输出结果。  

```
os.system("ls")
```

### popen 命令

popen 命令将结果当做字符串返回。  

```
print os.popen('cat /proc/cpuinfo').read()
```


### commands 命令  

```
commands.getstatusoutput(cmd)  #返回（status,output)
commands.getoutput(cmd)  #只返回输出结果
commands.getstatus(file) #返回`ls -ld file `的执行结果字符串，调用了getoutput。
```

### subprocess  命令 

使用subprocess模块可以创建新的进程，可以与新建进程的输入/输出/错误管道连通，并可以获得新建进程执行的返回状态。  
使用subprocess模块的目的是替代os.system()、os.popen()、commands等旧的函数或模块。  



##  其他


### 随机数生成

```python

random.random() # 生成一个0到1的随机浮点数
random.uniform(a, b) #生成一个指定范围内的浮点数
random.randint(a, b) #生成一个指定范围内的整数
random.randrange(a, b, c) #生成一个指定等差数列内的数
random.choice(list) # 从list中随机选择一个元素
random.shuffle(list) # 将list中的元素顺序打乱
random.sample(list, n) # 从list中随机挑n个元素
```

### 数组去重


使用set去重

```
l1 = ['b','c','d','b','c','a','a']
l2 = list(set(l1))
print l2
```



使用map去重

```
l1 = ['b','c','d','b','c','a','a']
l2 = {}.fromkeys(l1).keys()
print l2
```





### 判断key是否在字典中

下面两个方法都可以,但是推荐第一个.  
第二个在 python3 中将弃用.

```
key in dict
dict.has_key(key)
```


### 小数转百分比

```
a = 0.12345
print "%.2f%%" % (a * 100)
```

### 程序实例

```
def main():
    pass
    
if __name__ == "__main__": 
    main()
```



### 异常

```
try:
   pass
except urllib2.HTTPError, e:
    print ('(%s)http request error code - %s. \n' % (url, e.code))
except urllib2.URLError, e:
    print ('(%s)http request error reason - %s.\n' % (url, e.reason))
except Exception:
    print ('(%s)http request generic exception: %s.\n' % (url, traceback.format_exc()))   
```

### 图片

```
import urllib
import urllib2
import traceback

import cStringIO
import Image

req = urllib2.Request(url, headers=useragent)
page = opener.open(req, timeout=10)
tmpIm = cStringIO.StringIO(page.read())
im = Image.open(tmpIm)
width = im.size[0]
height = im.size[1]
```


## 模块

###  模块导入

模块有两种导入方法：　import 和　from.  

```
import mod1
from mod1 import *
```

### 同目录导入

如果程序和要导入的模块在同一个目录，直接导入即可．  
注意，文件的后缀名忽略不写．  


```
`-- src
    |-- mod1.py
    `-- test1.py
```

例如这样  

```
import mod1
```

### 子目录导入


如果要导入的模块是当前程序所在目录下其中的一个子目录下，可以使用路径导入．  
注意，需要在需要导入的目录下创建一个　`__init__.py`文件．  


```
`-- src
    |-- mod1.py
    |-- mod2
    |   `-- mod2.py
    |   `-- __init__.py
    `-- test1.py
```


例如这样  

```
from mod2.mod2 import * 
# 或者
import mod2.mod2
```


## 



## 修改历史

* 23:45 2015/10/15 丰富了python时间的操作
* 20:45 2015/5/6 增加执行shell命令小节
* 16:34 2014/12/17 添加 时间的 sleep 操作
* 14:57 2014/12/8 添加 字符串操作 条目
* 16:19 2014/12/1 添加 编码检测 与转换编码 条目
* 19:11 2014/11/28 谢谢 Maslino 提醒我， readlines 是读取多有行而不是一行。与我赶紧检查我项目中的代码，然后发现使用正确。我使用的是 `for line in f.readlines`.




[python-101-how-to-download-a-file]: http://www.blog.pythonlibrary.org/2012/06/07/python-101-how-to-download-a-file/
[docs-python-requests]: http://docs.python-requests.org/en/latest/ 
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
[how-can-i-avoid-running-a-python-script-multiple-times-implement-file-locking]: http://linux.byexamples.com/archives/494/how-can-i-avoid-running-a-python-script-multiple-times-implement-file-locking/#comment-100304
