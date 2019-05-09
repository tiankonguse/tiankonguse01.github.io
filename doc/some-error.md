---
layout: page
title: 程序错误集
---


## bash


### awk

#### 分隔符

默认情况下， awk 使用空格当作分隔符。分割后的字符串可以使用$1, $2等访问。  
我们可以使用 -F 来指定分隔符.  
fs 如果是一个字符，可以直接跟在`-F` 后面，比如使用冒号当作分隔符就是 `-F:` .  
如果分隔符比较复杂，就需要使用正则表达式来表示这个分隔符了。正则表达式需要使用引号引起来。  

#### 变量

* `$0`	当前记录（这个变量中存放着整个行的内容）  
* `$1~$n`	当前记录的第n个字段，字段间由FS分隔  
* `FS`	输入字段分隔符 默认是空格或Tab  
* `NF`	当前记录中的字段个数，就是有多少列  
* `NR`	已经读出的记录数，就是行号，从1开始，如果有多个文件话，这个值也是不断累加中。  
* `FNR`	当前记录数，与NR不同的是，这个值会是各个文件自己的行号  
* `RS`	输入的记录分隔符， 默认为换行符  
* `OFS`	输出字段分隔符， 默认也是空格  
* `ORS`	输出的记录分隔符，默认为换行符  
* `FILENAME`	当前输入文件的名字  

#### 脚本

```
BEGIN{ 这里面放的是执行前的语句 }  
END {这里面放的是处理完所有的行后要执行的语句 }  
{这里面放的是处理每一行时要执行的语句}  
```

#### 运算与编程

awk 是弱类型语言，变量可以是串，也可以是数字，这依赖于实际情况。  
所有的数字都是浮点型。  

```
#9
echo 5 4 | awk '{ print $1 + $2 }'

#54
echo 5 4 | awk '{ print $1 $2 }'

#"5 4"
echo 5 4 | awk '{ print $1, $2 }'

#0-1-2-3-4-5-6
echo 6 | awk '{ for (i=0; i<=$0; i++){ printf (i==0?i:"-"i); }printf "\n";}'

# 2014/03/29 => 2014-03-29
echo "2014/03/29" | awk -F/ '{printf "%s-%s-%s\n",$1,$2,$3}'

# 2014/03/27 => 2014-03-27
echo "2014/03/27" | awk -F/  '{print $1"-"$2"-"$3}'
```

## android

### HAX kernel module is not installed

```
Starting emulator for AVD 'Nexus_5_API_23_x86'
emulator: ERROR: x86 emulation currently requires hardware acceleration!
Please ensure Intel HAXM is properly installed and usable.
CPU acceleration status: HAX kernel module is not installed!
```


简单的说就是没有安装对应的依赖包.    
我当时下载的是android studio, 好几G, 安装后就以为所有的依赖包都有了.  
这个依赖包大概是Extra目录里的 "HAXM installer"吧.  


### No cached version of XXX available for offline mode
         
```
Error:A problem occurred configuring project ':app'.
> Could not resolve all dependencies for configuration ':app:_debugUnitTestCompile'.
   > Could not resolve junit:junit:4.12.
     Required by:
         AndroidTestTwo:app:unspecified
      > No cached version of junit:junit:4.12 available for offline mode.
```

Gradle需要下载依赖包, 但是设置中禁止联网了.  




### EmptyThrowable: The APK file XXX does not exist on disk


```
14:00:36 Executing tasks: [:app:assembleDebug]
14:00:47 Gradle build finished with 1 error(s) in 10s 853ms
14:00:47 EmptyThrowable: The APK file E:\AndroidStudioProjects\AndroidTestTwo\app\build\outputs\apk\app-debug.apk does not exist on disk.
```


需要先编译通过, 然后才能运行app.   


### Invalid Project JDK

```
Invalid Project JDK
Please choose a valid JDK directory
Open JDK Settings
```

需要配置jdk的路径， 点击`Open JDK Settings`， 配置即可。  

### 删除项目

删除项目—–AS对工程删除做了保护机制，默认你在项目右键发现没有删除选项。你会发现你的module上面会有一个小手机，这是保护机制。删除的第一步就是去掉保护机制，也就是 让手机不见，具体做法就是鼠标放在工程上右键->open module setting，或者F4进入如图界面，选中你要删除的module，然后点击减号，这样就取消了保护机制，然后回到项目工程右键就 可发现删除选项。注意：删除会将源文件删除。  


### 导入jar包

选择File->Projcet Structure，在弹出的窗口中左侧找到Libraries并选中，然后点击“+”，并选择Java就能导入Jar包了。 或者直接拷贝jar文件到项目的libs文件夹下，然后运行：Sync Project with Gradle Files。然后clean project重新编译。  

### 如何将Eclipse工程导入AS使用

选择File->Import Project，在弹出的菜单中选择要导入的工程即可，选择好以后就直接next，在第二个窗口中也选择默认的第一个选项就可以。 需要注意的是，在AS中，有两种工程，一个是Project，一个是Module，上面已经细说过了。  


### AS的Product目录结构

```
.idea：//AS生成的工程配置文件，类似Eclipse的project.properties。
app：//AS创建工程中的一个Module。
gradle：//构建工具系统的jar和wrapper等，jar告诉了AS如何与系统安装的gradle构建联系。
External Libraries：//不是一个文件夹，只是依赖lib文件，如SDK等。


build：//构建目录，相当于Eclipse中默认Java工程的bin目录，鼠标放在上面右键Show in Exploer即可打开文件夹，
		编译生成的apk也在这个目录的outs子目录，不过在AS的工程里是默认不显示out目录的，就算有编译结果也
		不显示，右键打开通过文件夹直接可以看。
libs：//依赖包，包含jar包和jni等包。
src：//源码，相当于eclipse的工程。
    main：//主文件夹 
        java：//Java代码，包含工程和新建是默认产生的Test工程源码。 
        res：//资源文件，类似Eclipse。
            layout：//App布局及界面元素配置，雷同Eclipse。
            menu：//App菜单配置，雷同Eclipse。 
            values：//雷同Eclipse。
                dimens.xml：//定义css的配置文件。 
                strings.xml：//定义字符串的配置文件。 
                styles.xml：//定义style的配置文件。
				......：//arrays等其他文件。
			......：//assets等目录
        AndroidManifest.xml：//App基本信息（Android管理文件） 
        ic_launcher-web.png：//App图标 
build.gradle：//Module的Gradle构建脚本
```

### uses-sdk:minSdkVersion 7 cannot be smaller than version 9 declared in library

```
APT: /home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/res/drawable-hdpi/ic_action_search.png: libpng warning: iCCP: Not recognizing known sRGB profile that has been edited

AAPT err(Facade for 597082051) : No Delegate set : lost message:/home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/res/drawable-mdpi/ic_action_search.png: libpng warning: iCCP: Not recognizing known sRGB profile that has been edited

AAPT: /home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/res/drawable-xhdpi/ic_action_search.png: libpng warning: iCCP: Not recognizing known sRGB profile that has been edited
:app:processDebugManifest
/home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/AndroidManifest.xml:7:5-73 Error:
	uses-sdk:minSdkVersion 7 cannot be smaller than version 9 declared in library [com.google.android.gms:play-services:6.5.87] /home/tiankonguse/AndroidStudioProjects/MP3Player/app/build/intermediates/exploded-aar/com.google.android.gms/play-services/6.5.87/AndroidManifest.xml
	Suggestion: use tools:overrideLibrary="com.google.android.gms" to force usage
```

声明的minSdkVersion设置为9.  


### libpng warning: iCCP: Not recognizing known sRGB profile that has been edited

```
AAPT: /home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/res/drawable-hdpi/ic_action_search.png: libpng warning: iCCP: Not recognizing known sRGB profile that has been edited
AAPT: /home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/res/drawable-mdpi/ic_action_search.png: libpng warning: iCCP: Not recognizing known sRGB profile that has been edited
AAPT: /home/tiankonguse/AndroidStudioProjects/MP3Player/app/src/main/res/drawable-xhdpi/ic_action_search.png: libpng warning: iCCP: Not recognizing known sRGB profile that has been edited
```


## 数据库


### 设置编码


```
set names utf8;
```


### 数据库 表大小

* TABLE_SCHEMA : 数据库名  
* TABLE_NAME：表名   
* ENGINE：所使用的存储引擎  
* TABLES_ROWS：记录数  
* DATA_LENGTH：数据大小  
* INDEX_LENGTH：索引大小  


### 表大小

```
SELECT 
    TABLE_NAME, DATA_LENGTH + INDEX_LENGTH, TABLE_ROWS
FROM
    information_schema.TABLES
WHERE
    TABLE_SCHEMA = '数据库名'
        AND TABLE_NAME = '表名'
```
 
### 库大小

```
SELECT 
    sum(DATA_LENGTH) + sum(INDEX_LENGTH)
FROM
    information_schema.TABLES
where
    TABLE_SCHEMA = '数据库名'
```

### 字符个数

```
select 
    c_tid,
    length(c_fields) - length(replace(c_fields, ',', '')) as c_count
from
    t_data_cgi_config
order by c_count desc;

select 
    c_groupid,
    length(c_fieldid) - length(replace(c_fieldid, ',', '')) as c_count
from
    t_field_group
where
    c_tableid = '2001'
order by c_count desc;
```

### REPLACE 


REPLACE works exactly like INSERT, except that if an old row in the table has the same value as a new row for a PRIMARY KEY or a UNIQUE index, the old row is deleted before the new row is inserted.   


REPLACE is a MySQL extension to the SQL standard.     
It either inserts, or deletes and inserts.   
For another MySQL extension to standard SQL—that either inserts or updates  


>  REPLACE makes sense only if a table has a PRIMARY KEY or UNIQUE index.   
>  Otherwise, it becomes equivalent to INSERT, because there is no index to be used to determine whether a new row duplicates another.  


Values for all columns are taken from the values specified in the REPLACE statement.   
Any missing columns are set to their default values, just as happens for INSERT.   
You cannot refer to values from the current row and use them in the new row.   
If you use an assignment such as SET col_name = col_name + 1, the reference to the column name on the right hand side is treated as   DEFAULT(col_name), so the assignment is equivalent to SET col_name = DEFAULT(col_name) + 1.  


To use REPLACE, you must have both the INSERT and DELETE privileges for the table.  

The REPLACE statement returns a count to indicate the number of rows affected.   
This is the sum of the rows deleted and inserted.   
If the count is 1 for a single-row REPLACE, a row was inserted and no rows were deleted.   
If the count is greater than 1, one or more old rows were deleted before the new row was inserted.   
It is possible for a single row to replace more than one old row if the table contains multiple unique indexes and the new row duplicates values for different old rows in different unique indexes.  

The affected-rows count makes it easy to determine whether REPLACE only added a row or whether it also replaced any rows: Check whether the count is 1 (added) or greater (replaced).  

If you are using the C API, the affected-rows count can be obtained using the mysql_affected_rows() function.  

Currently, you cannot replace into a table and select from the same table in a subquery.  

MySQL uses the following algorithm for REPLACE (and LOAD DATA ... REPLACE):  

Try to insert the new row into the table  

While the insertion fails because a duplicate-key error occurs for a primary key or unique index:  

Delete from the table the conflicting row that has the duplicate key value  

Try again to insert the new row into the table  

It is possible that in the case of a duplicate-key error, a storage engine may perform the REPLACE as an update rather than a delete plus insert, but the semantics are the same.   
There are no user-visible effects other than a possible difference in how the storage engine increments Handler_xxx status variables.  


### 整除和取余函数

```
整除:div
5 div 2 = 2;
取余:mod
5 mod 2 = 1;
四舍五入:round
round(1.5) = 2;
```

### 日期格式化


MySQL 日期、时间转换函数： `date_format(date,format)`, `time_format(time,format)`能够把一个日期/时间转换成各种各样的字符串格式。  
它是 `str_to_date(str,format)` 函数的 一个逆转换。  

```
time_format('22:23:01', '%H.%i.%s')  #22.23.01 
date_format('2008-08-08 22:23:01', '%Y%m%d%H%i%s') #20080808222301 
date_format('2008-08-08 22:23:00', '%W %M %Y') #Friday August 2008

SELECT UNIX_TIMESTAMP() ; 1249524739 
SELECT UNIX_TIMESTAMP('2009-08-06') ;  1249488000 

FROM_UNIXTIME( 1249488000, '%Y%m%d' )  20071120 
SELECT FROM_UNIXTIME( 1249488000, '%Y年%m月%d' )  2007年11月20 
```

### blob转ascii

有些文本使用blob方式储存,这时候需要转化为文本形式才方便使用.  

```
select  CAST('a' AS CHAR) ;
```


## 优化

### TcMalloc优化内存


TcMalloc是一个针对多线程并发做了优化的高性能内存分配器。主要通过对每个线程有自己的缓存及无锁的数据结构实现了高性能，官方提供了相应的性能测试结果，但由于生产环节不同（CPU架构、编译器版本），各项指标也会略有不同以及业务特点不同多为小内存分配，所以我们在使用前最好也先做性能测试，做到一切尽在掌握。  

在单线程的情况下glibc自带的内存分配在小内存的情况相比TcMalloc还要相对有优势，分配到了1MB时TcMalloc才开始比glibc快。  
而在多线程的情况，TcMalloc性能完全是碾压glibc，glibc增长几乎随着分配字节大小近指数增长  

tcmalloc是gperftools套装之一，是作为一个lib存在，编译时只要将这个lib链接进去，就能有效提高内存分配性能。在小内存分配频繁的业务场景下，带来的性能提升非常明显。  


tomalloc本质是一个内存池，不过它是直接替换malloc,free函数，在这点上比起普通内存池要更高效。  
对小内存,tcmalloc按8的整数次倍分配内存，对于大内存，按4k的整数次倍分配内存。线程中有各自每种尺寸的分配器。一个线程的空闲内存较多时会交还给进程，进程可以调配给其他线程使用。  
作为内存池就必然会带来空间利用率方面的损失。不过对于我们大多数后台服务来说，使用100M内存和110M内存，对服务器来说没有太大区别。  
tcmalloc的意义是不需要任何开发代价(只需要在makefile中链上这个库)，就能提高内存分配效率。  

使用:  

将编译好的两个动态库(libunwind.so.8、libtcmalloc.so)放到指定位置, 然后配置文件配置一下.    




## 规范


```
一、带项目	

最近一年内，参与过部门级的项目，并承担关键任务;		
最近一年内，成功主导过部门级关键项目，或参与过跨部门项目,承担过关键任务			
最近一年内，成功主导过跨部门的重大项目;		


二、写文档	

最近一年内，参与过本岗位或部门内的流程优化或制度/文档建设工作;		
最近一年内，主导过部门内的流程优化或制度/文档建设工作；或参与过公司级的流程优化或制度/文档建设工作;	
最近一年内，主导过公司级或本专业领域内的流程优化或制度/文档建设工作		


三、讲课程

至少讲授过一门内部课程（不限内容），最近一年的授课时数在4小时以上(包括部门内部培训)		
至少讲授或者开发过一门本通道内的专业课程，最近一年的授课时数在4小时以上(包括部门内部培训)			
至少开发过一门本通道内的专业课程，并且最近一年的公司级授课时数在7小时以上		


四、轮岗位

参加工作以来,至少在本专业领域做过两个以上模块工作,且每个时间不少于半年			
参加工作以来,至少在本专业领域做过三个以上岗位工作,且每个岗位时间不少于半年		


五、培养人

担任过至少一次新员工导师或辅导过在职员工，时间至少三个月			
担任过至少三次新员工导师或辅导过在职员工，时间每人至少三个月
```


## 语言

> 后台系统里没有什么事是一层中间层不能解决的，如果有，那就两层  


> 看不惯别人，是否说明自己修养不够？  


> 我确信已发现了一种美妙的架构，同时满足CAP，可惜这里空白的地方太小，写不下。  


> Less is more.  






