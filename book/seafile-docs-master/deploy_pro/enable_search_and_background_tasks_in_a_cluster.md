# Enable search and background tasks in a cluster

In the seafile cluster, only one server should run the background tasks, including:

- indexing files for search
- email notification
- office documents converts service

Let's assume you have three nodes in your cluster: A, B, and C.

* Node A is backend node that run background tasks.
* Node B and C are frontend nodes that serving requests from clients.

![cluster-nodes](../images/cluster-nodes.png)


## Configuring Node A (the backend node)

If you following the steps on settings up a cluster, node B and node C should have already be configed as frontend node. You can copy the configuration of node B as a base for node A. Then do the following steps:

### Install Dependencies (Java, LibreOffice, poppler)

On Ubuntu/Debian:
```
sudo apt-get install openjdk-7-jre libreoffice poppler-utils python-uno # or python3-uno for ubuntu 14.04+
```

On CentOS/Red Hat:
```
sudo yum install java-1.7.0-openjdk
sudo yum install libreoffice libreoffice-headless libreoffice-pyuno
sudo yum install poppler-utils
```


Edit **pro-data/seafevents.conf** and ensure this line does NOT exist:

```
external_es_server = true
```

Edit **seahub_settings.py** and add a line:

```
OFFICE_CONVERTOR_NODE = True
```

### Edit the firewall rules

In your firewall rules for node A, you should open the port 9500 (for search requests).

## Configure Other Nodes

On nodes B and C, you need to:

* Edit pro-data/seafevents.conf, add the following lines:
```
[INDEX FILES]
external_es_server = true
es_host = <ip of node A>
es_port = 9500
```

Edit **seahub_settings.py** and add a line:

```
OFFICE_CONVERTOR_ROOT = http://<ip of node A>
```

## Start the background tasks

Before starting background tasks, you have to start seafile and seahub on the backend node, too.

```
./seafile.sh start
./seahub.sh start-fastcgi
```

On node A (the background tasks node), you can start/stop background tasks by:

```
./seafile-background-tasks.sh { start | stop | restart }
```
