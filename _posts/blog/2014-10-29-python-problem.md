---
layout:     post
title:      python 中的小问题(持续更新中)
category: blog
description: 刚学习python，经常会遇到一些小的问题，于是总结一下
---


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

```python
try:
    req = urllib2.Request(url, postdata)
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

## 字符串 转化 json

```python
json_obj = json.loads(str)
```

## json 对象 转 字符串

```python
str = json.dumps(json_obj)
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



