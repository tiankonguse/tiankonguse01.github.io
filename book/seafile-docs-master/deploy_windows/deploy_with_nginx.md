# Deploy Seafile with Nginx

## Deploy Seahub/FileServer with Nginx

Seahub is the web interface of Seafile server. FileServer is used to handle raw file uploading/downloading through browsers. By default, it listens on port 8082 for HTTP request.

Here we deploy Seahub using fastcgi, and deploy FileServer with reverse proxy. We assume you are running Seahub using domain '''www.myseafile.com'''.

This is a sample Nginx config file.

```
server {
    listen 80;
    server_name www.myseafile.com;

    proxy_set_header X-Forwarded-For $remote_addr;

    location / {
        fastcgi_pass    127.0.0.1:8000;
        fastcgi_param   SCRIPT_FILENAME     $document_root$fastcgi_script_name;
        fastcgi_param   PATH_INFO           $fastcgi_script_name;

        fastcgi_param	SERVER_PROTOCOL	    $server_protocol;
        fastcgi_param   QUERY_STRING        $query_string;
        fastcgi_param   REQUEST_METHOD      $request_method;
        fastcgi_param   CONTENT_TYPE        $content_type;
        fastcgi_param   CONTENT_LENGTH      $content_length;
        fastcgi_param	SERVER_ADDR         $server_addr;
        fastcgi_param	SERVER_PORT         $server_port;
        fastcgi_param	SERVER_NAME         $server_name;
        fastcgi_param   REMOTE_ADDR         $remote_addr;

        access_log      logs/seahub.access.log;
        error_log       logs/seahub.error.log;
    }

    location /seafhttp {
        rewrite ^/seafhttp(.*)$ $1 break;
        proxy_pass http://127.0.0.1:8082;
        client_max_body_size 0;
    }

    location /media {
        root C:/SeafileProgram/seafile-pro-server-2.1.4/seahub;
    }
}
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

When upgrading seafile server, besides the normal steps you should take, there is one extra step to do: '''Update the path of the static files in your nginx configuration'''. For example, assume your are upgrading seafile server 2.1.0 to 2.1.1, then:

```
    location /media {
        root C:/SeafileProgram/seafile-pro-server-2.1.1/seahub;
    }
```
