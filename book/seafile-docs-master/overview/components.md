# Components Overview

Seafile server consists of following components:

- **Seahub** (django)：the website. Seafile server package contains a light-weight Python HTTP server gunicorn that serves the website. Seahub runs as an application within gunicorn.
- **Seafile server** (``seaf-server``)：data service daemon, handles raw file upload/download/syncing
- **Ccnet server** (``ccnet-server``)： RPC service daemon to enable communication among multiple components. 

The picture below shows how Seafile clients access files when you configure Seafile behind Nginx/Apache. 

![Seafile Sync](../images/seafile-arch-new-http.png)



