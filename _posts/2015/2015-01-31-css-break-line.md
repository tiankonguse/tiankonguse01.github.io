---
layout : post
title : css 强制换行与不换行 
description : 经常会遇到让一行文本强制换行或者强制不换行，现在记录一下。 
keywords : css, 换行
tag : css
updateData:  12:23 2015/1/31 
categories: [前端技术]
---

## 强制不换行

当我们的内容是在一个列表中展现的时候， 如果出现换行， 那样式看起来将会特别难看。  
这个时候强制不换行就可以派上用场了。  

```css
div{
    white-space:nowrap;
}
```

当然， 使用这个样式之后你可能发现有时候右面的文本跑到外面去了。  

这样样式又不好看了， 这个时候我们就需要把多出来的隐藏掉就行了。  

```
div{
    white-space:nowrap;
    overflow-x: hidden;
}
```



## 强制换行

对于一段文本， 我们当然希望自动换行了， 这是就可以使用 break-word 了。  

```
div{
    word-wrap: break-word; 
    word-break: normal; 
}
```


## 强制英文单词换行


我们发现， 有时候即使我们使用了强制换行， 对于英文单词有的长有的短， 换行之后看起来不美观了， 这个时候可以使用单词断行。  

```
div{
    word-break:break-all;
}
```

[tiankonguse]:    http://tiankonguse.com  "tiankonguse"
