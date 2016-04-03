
## 静态网站

这里是 tiankonguse 的静态网站

## 启动本地服务器

启动服务器并生成网站

```
sudo jekyll serve --watch --config _config.yml,_config_dev.yml,_config_dev2.yml
```

访问地址

```
http://127.0.0.1
http://192.168.31.137
```

## 备份提交

```
git push gitcafe master:gitcafe-pages
```


## 其他

使用通用的链接引用： `[文字]({{ site.data.link.xxxx }})`  
使用通用的链接引用： `![文字][{{ site.data.link.xxxx }}]`  



