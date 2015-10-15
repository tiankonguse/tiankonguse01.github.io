---
layout:     post
title:      VB 实现二分查找
description: 女朋友突然有一天给我说她编了一个二分查找，但是不对，问我怎么了，于是我看了一看。
keywords: VB, 二分查找
tags: VB 二分查找
categories: [程序人生]
---

![二分查找][cover]

## 背景

女朋友要把代码贴给我，我说把cpp文件发给我吧。

结果老婆发给我一个 vbp 文件，原来是VB编写的。我想难道 VB 代码以 vbp 结尾吗？

打开一看，是项目的配置信息，于是直接让老婆把代码贴给我吧。

作为 Linux 下的开发者，我第一次看 VB代码。

代码如下：

```
Private Sub Command1_Click()
Dim a(10) As Integer
Dim i, s, flag, left, mid, right As Integer
For i = 0 To 10
  a(i) = InputBox("总共输入10个从小到大排序的数，请输入第" & i + 1 & "个数")
  Next
s = InputBox("输入你要查找的数")

left = LBound(a)
right = UBound(a)

flag = 0

Do While left <= right

mid = (left + right) / 2

If a(mid) = s Then
flag = 1
Exit Do

ElseIf s > a(mid) Then
left = mid + 1

Else

right = mid - 1
End If

Loop

If flag = 1 Then
Print "找到了"
Else
Print "没找到"
End If

For i = 0 To 10
  Print a(i)
  
Next
   



End Sub
```



##  分析代码

### 格式化代码

分析代码的第一步是格式化代码,并加上注释  
参考资料：[LBound][],[UBound][],

```
Private Sub Command1_Click()
Dim a(10) As Integer
Dim i, s, flag, left, mid, right As Integer
For i = 0 To 10
  a(i) = InputBox("总共输入10个从小到大排序的数，请输入第" & i + 1 & "个数")
  Next
  
s = InputBox("输入你要查找的数")

s = cint(s)

left = LBound(a) '返回数组的指示维度的最小可用下标。
right = UBound(a) '返回数组的指示维度的最大可用下标。

flag = 0

Do While left <= right

mid = (left + right) / 2

If a(mid) = s Then
    flag = 1
    Exit Do
ElseIf s > a(mid) Then
    left = mid + 1
Else
    right = mid - 1
End If

Loop

If flag = 1 Then
    Print "找到了"
Else
    Print "没找到"
End If

For i = 0 To 10
  Print a(i)
  
Next
   



End Sub
```

### 二分算法分析

假设输入正确，那么我们有一个数组 a, 数组的起始位置(left)和结束位置(right).

每次取中间的值，然后判断是不是找到了。找到了标记一下找到了。

没找到来确定下个搜索区间在 mid 的左侧(left, mid-1)还是右侧(left+1, right).

然后这样循环下去，直到不满足 left <= right为止。

发现算法并没有问题，那就是输入的问题了。

### 输入 InputBox

看了 InputBox 之后，我想输入的值应该是字符串，所以这里应该转化为整数。

于是查询资料 [InputBox][], 官方文档这样说

> 在一对话框中显示提示，等待用户输入文字或单击按钮，然后返回包含文本框内容的字符串。

然后查询字符串转化整数的方法。

csdn 上一哥们很给力，给了下面的代码

```
cint("1234")=1234
val("1234")=1234
cstr(1234)="1234"
```

### 除法猜想

上面转化后还是查询错误的结果，于是再次看了一下代码，发现除法可能不是一般的除法。

微软这家伙，一直都是不按常规出牌的，你定义这么这个标准，我偏偏就不那样做。

于是搜索 VB 除法，发现这的是除法的问题。

[除法文档][25bswc76]

> 结果是 expression1 除以 expression2 的完整的商，包括任何余数。  
> \ 运算符 (Visual Basic) 返回整数商，丢掉了余数

好吧，这么坑爹。

修改完之后，再次测试，成功查询到结果了。

## 最终代码

```
Private Sub Command1_Click()
    Dim a(10) As Integer
    Dim i, s, flag, left, mid, right As Integer
    For i = 0 To 10
      s = InputBox("总共输入10个从小到大排序的数，请输入第" & i + 1 & "个数")
      a(i) = cint(s)
    Next
      
    s = InputBox("输入你要查找的数")
    s = cint(s)

    left = LBound(a) '返回数组的指示维度的最小可用下标。
    right = UBound(a) '返回数组的指示维度的最大可用下标。

    flag = 0

    Do While left <= right
        mid = (left + right) \ 2

        If a(mid) = s Then
            flag = 1
            Exit Do
        ElseIf s > a(mid) Then
            left = mid + 1
        Else
            right = mid - 1
        End If
    Loop

    If flag = 1 Then
        Print "找到了"
    Else
        Print "没找到"
    End If

    For i = 0 To 10
      Print a(i)
    Next

End Sub
```

[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2550425436.jpg
[25bswc76]: http://msdn.microsoft.com/zh-cn/library/25bswc76.aspx
[csdn]: http://bbs.csdn.net/topics/10293015
[InputBox]: http://msdn.microsoft.com/zh-cn/library/6z0ak68w(v=vs.90).aspx
[LBound]: http://msdn.microsoft.com/zh-cn/library/t9a7w1ac(v=vs.90).aspx
[UBound]: http://msdn.microsoft.com/zh-cn/library/95b8f22f(v=vs.90).aspx