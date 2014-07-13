---
    layout : default 
    category : blog
    description : 最近wordpress站点打开缓慢，抓包后发现是google fonts的缘故，因此需要删掉那个东西。 
    date : 2014-07-13
    title : 删除wordpress中的googleapis字体 
---

# {{ page.title  }} 


最近 google 完全被墙了，　然后我的　wordpress 站点打开缓慢，　开了代理就不存在这种现象。

于是猜测某个外部引用的资源加载缓慢，　抓包后发现是　googleapi fonts　的缘故。

在天朝还是把这个字体保存在本地或者不用这个字体吧。


## 引用位置

要删除或修改这个　googleapi fonts, 就需要找到引用它的位置了。

去主题的　header.php　里找了找，发现没有。

后来想想肯定没有了，　这个主题是[]自己编写]({{site.prelinkpath}})的，自己肯定不会使用别人的资源了，多么不可靠呀。





(待续)
