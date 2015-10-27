# Deploy Seafile with Apache

## Preparation

### Install mod_fastcgi

Download [mod_fastcgi-*.dll] (http://fastcgi.com/dist/) first, and put it into the `modules/` directory of your Apache installation.

**Note**: You must download the right version of `mod_fastcgi` DLL according for your Apache. For example:

- If you are using Apache 2.2, you should download http://fastcgi.com/dist/mod_fastcgi-2.4.6-AP22.dll. The **AP22** part of the dll indicate it's for Apache **2.2**.
- If you are using Apache 2.0, you should download http://fastcgi.com/dist/old/mod_fastcgi-2.4.2-AP20.dll

## Deploy Seahub/FileServer With Apache

Seahub is the web interface of Seafile server. FileServer is used to handle raw file uploading/downloading through browsers. By default, it listens on port 8082 for HTTP request.

Here we deploy Seahub using fastcgi, and deploy FileServer with reverse proxy. We assume you are running Seahub using domain '''www.myseafile.com'''.

### Edit httpd.conf

First edit your `httpd.conf`. Add the following lines to **the end of the file**:

```
LoadModule fastcgi_module modules/mod_fastcgi-2.4.6-AP22.dll
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
Include conf/extra/httpd-vhosts.conf
```

Then add this line (substitute `YourDocumentRoot` with the value of your apache `DocumentRoot`)

```
FastCGIExternalServer "YourDocumentRoot/seahub.fcgi" -host 127.0.0.1:8000
```

Note, `seahub.fcgi` is just a placeholder, you don't need to actually have this file in your system.

### Edit your httpd-vhosts.conf

Assume you have uncompresssed seafile server into `C:/SeafileProgram/seafile-pro-server-2.1.4`.

```
<VirtualHost *:80>
  ServerName www.myseafile.com
  Alias /media  "C:/SeafileProgram/seafile-pro-server-2.1.4/seahub/media"

  RewriteEngine On

  #
  # seafile fileserver
  #
  ProxyPass /seafhttp http://127.0.0.1:8082
  ProxyPassReverse /seafhttp http://127.0.0.1:8082
  RewriteRule ^/seafhttp - [QSA,L]

  #
  # seahub
  #
  RewriteRule ^/(media.*)$ /$1 [QSA,L,PT]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteRule ^(.*)$ /seahub.fcgi$1 [QSA,L,E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
</VirtualHost>

<Directory "C:/SeafileProgram/seafile-pro-server-2.1.4/seahub/media">
    Options Indexes FollowSymLinks
    AllowOverride None
    Order allow,deny
    Allow from all
</Directory>
```

## Modify Configurations

### Modify ccnet.conf


```
SERVICE_URL = http://www.myseafile.com
```

Note: If you later change the domain assigned to seahub, you also need to change the value of  <code>SERVICE_URL</code>.

### Modify seafile-data/seafile.conf

Modify the `seahub` section of `seafile-data/seafile.conf`:

```
[seahub]
port=8000
fastcgi=true
```

### Modify seahub_settings.py

You need to add a line in <code>seahub_settings.py</code> to set the value of `FILE_SERVER_ROOT`

```
FILE_SERVER_ROOT = 'http://www.myseafile.com/seafhttp'
```

## Notes when Upgrading Seafile Server

When upgrading seafile server, besides the normal steps you should take, there is one extra step to do: '''Update the path of the static files in your apache configuration'''. For example, assume your are upgrading seafile server 2.1.4 to 2.1.5, then:

```
<VirtualHost *:80>
  ...
  Alias /media  "C:/SeafileProgram/seafile-pro-server-2.1.5/seahub/media"
  ...
</VirtualHost>

<Directory "C:/SeafileProgram/seafile-pro-server-2.1.5/seahub/media">
  ...
</Directory>
```
