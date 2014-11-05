---
layout:     post
title:      python 中的小问题(持续更新中)
category: blog
description: 刚学习python，经常会遇到一些小的问题，于是总结一下
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

[converting-integer-to-string-in-python]: http://stackoverflow.com/questions/961632/converting-integer-to-string-in-python
[how-to-test-nonetype-in-python]: http://stackoverflow.com/questions/23086383/how-to-test-nonetype-in-python
[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2514466730.png
[python-http-post]: http://github.tiankonguse.com/blog/2014/09/28/python-http-post/
[python-json]: http://github.tiankonguse.com/blog/2014/09/29/python-json/
[first-learn-python]: http://github.tiankonguse.com/blog/2014/09/25/first-learn-python/
[first-learn-python-hight-lev]: http://github.tiankonguse.com/blog/2014/09/25/first-learn-python-hight-lev/
[python-style]: http://github.tiankonguse.com/blog/2014/10/08/python-style/
[python-update-invalid]: http://github.tiankonguse.com/blog/2014/10/20/python-update-invalid/