# Seafile WebDAV Server

Make sure you have [Download and Setup Seafile Windows Professional Server](download_and_setup_seafile_win_pro_server.md)

## SeafDAV Configuration

Assume that:

* you have uncompressed seafile windows server to `C:/SeafileProgram/seafile-pro-server-2.1.4`
* you have chosen drive `D:/` during seafile server initialization

The configuration file for WebDAV is `D:/seafile-server/pro-data/seafdav.conf`

<pre>
[WEBDAV]

# Default is false. Change it to true to enable SeafDAV server.
enabled = true

port = 8080

# Change the value of fastcgi to true if fastcgi is to be used
fastcgi = false

# If you deploy seafdav behind nginx/apache, you need to modify "share_name".
share_name = /
</pre>

Every time the configuration is modified, you need to restart seafile server to make it take effect.


### Sample Configuration 1: No nginx/apache

Your WebDAV client would visit the Seafile WebDAV server at `http://example.com:8080`

<pre>
[WEBDAV]
enabled = true
port = 8080
fastcgi = false
share_name = /
</pre>

### Sample Configuration 2: With nginx/apache

Your WebDAV client would visit the Seafile WebDAV server at `http://example.com/seafdav`

<pre>
[WEBDAV]
enabled = true
port = 8080
fastcgi = true
share_name = /seafdav
</pre>

In the above config, the value of **share_name** is changed to **/seafdav**, which is the address suffix you assign to seafdav server.


#### Nginx

The corresponding Nginx configuration is (without https):

<pre>
     location /seafdav {
        fastcgi_pass    127.0.0.1:8080;
        fastcgi_param   SCRIPT_FILENAME     $document_root$fastcgi_script_name;
        fastcgi_param   PATH_INFO           $fastcgi_script_name;

        fastcgi_param   SERVER_PROTOCOL     $server_protocol;
        fastcgi_param   QUERY_STRING        $query_string;
        fastcgi_param   REQUEST_METHOD      $request_method;
        fastcgi_param   CONTENT_TYPE        $content_type;
        fastcgi_param   CONTENT_LENGTH      $content_length;
        fastcgi_param   SERVER_ADDR         $server_addr;
        fastcgi_param   SERVER_PORT         $server_port;
        fastcgi_param   SERVER_NAME         $server_name;

        access_log      logs/seafdav.access.log;
        error_log       logs/seafdav.error.log;
    }
</pre>

#### Apache

* First edit `httpd.conf` file, add this line to the end of the file: (substitute `YourDocumentRoot` with the value of your apache `DocumentRoot`)

<pre>
FastCGIExternalServer "YourDocumentRoot/seafdav.fcgi" -host 127.0.0.1:8000
</pre>

* Second, modify Apache config file `httpd-vhosts.conf`

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
  # seafile webdav
  #
  RewriteCond %{HTTP:Authorization} (.+)
  RewriteRule ^(/seafdav.*)$ /seafdav.fcgi$1 [QSA,L,e=HTTP_AUTHORIZATION:%1]
  RewriteRule ^(/seafdav.*)$ /seafdav.fcgi$1 [QSA,L]

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


## Notes on Clients

### Windows

On Windows it is recommended to use a webdav client software such as Cyberduck or BitKinex.
The implementation of webdav support in Windows explorer is not very usable since:

* Windows explorer requires to use HTTP digest authentication. But Seafile can't support this because it doesn't store plain text passwords on the server.
* HTTP basic authentication is only supported for HTTPS (which is reasonable). But explorer doesn't accept self-signed certificates.

The conclusion is if you have a valid ssl certificate, you should be able to access seafdav from Windows explorer. Otherwise you should use a client software. It's also reported that Windows XP doesn't support HTTPS webdav.

### Linux

On Linux you have more choices. You can use file manager such as Nautilus to connect to webdav server. Or you can use davfs2 from the command line.

To use davfs2

<pre>
sudo apt-get install davfs2
sudo mount -t davfs -o uid=<username> https://example.com/seafdav /media/seafdav/
</pre>

The -o option sets the owner of the mounted directory to <username> so that it's writable for non-root users.

It's recommended to disable LOCK operation for davfs2. You have to edit /etc/davfs2/davfs2.conf

<pre>
 use_locks       0
</pre>

### Mac OS X

Finder's support for WebDAV is also not very stable and slow. So it is recommended to use a webdav client software such as Cyberduck.

## Frequently Asked Questions

### Clients can't connect to seafdav sersver

By default, seafdav is disabled. Check whether you have `enabled = true` in `seafdav.conf`.
If not, modify it and restart seafile server.


### The client gets "Error: 404 Not Found"

If you deploy SeafDAV behind Nginx/Apache, make sure to change the value of `share_name` as the sample configuration above. Restart your seafile server and try again.
