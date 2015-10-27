# Deploy Seafile Windows Server With MySQL

## Preparation

- [Download and Setup Seafile Windows Server](download_and_setup_seafile_windows_server.md)
- Stop seafile windows server
  - Right click the seafile server tray icon
  - Choose "Quit and shutdown Seafile Server"
- Make sure your MySQL server is running

### Install MySQL-python Library

- download the windows installer from https://pypi.python.org/pypi/MySQL-python/1.2.4
- install it by double clicking the downloaded exe file

## Create MySQL Databases

You need to create:

- databases for ccnet/seafile/seahub
- a new user to access these databases

Open a termial (cmd, Win + R, cmd) and login to mysql with a privileged user:
```
mysql -u root -p
```

Execute these SQL setences on your mysql server:

```
create database `ccnet-db` character set = 'utf8';
create database `seafile-db` character set = 'utf8';
create database `seahub-db` character set = 'utf8';

create user 'seafile'@'localhost' identified by 'your secure password';

GRANT ALL PRIVILEGES ON `ccnet-db`.* to `seafile`;
GRANT ALL PRIVILEGES ON `seafile-db`.* to `seafile`;
GRANT ALL PRIVILEGES ON `seahub-db`.* to `seafile`;
```

## Modify Your Seafile Configuations

* Append the following lines to **ccnet/ccnet.conf**:

```
[Database]
ENGINE=mysql
HOST=localhost
USER=seafile
PASSWD=your secure password
DB=ccnet-db
```

* Edit the `database` section of **seafile-data/seafile.conf**:

```
[database]
type=mysql
host=localhost
user=seafile
password=your secure password
db_name=seafile-db
```

* Append following lines to **seahub_settings.py**

```
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME' : 'seahub-db',
        'USER' : 'seafile',
        'PASSWORD' : 'your secure password',
        'HOST' : 'localhost',
    }
}
```

### Create Database Tables for Seahub

Now we create the database tables for seahub.

Assume you have uncompressed seafile server to `C:/SeafileProgram/seafile-pro-server-3.1.3`,

Open a window command line prompt, and execute the following command:

```
mysql -u seafile -p seahub-db < C:/SeafileProgram/seafile-server-3.1.3/seahub/sql/mysql.sql
```

## Done

Now you can start your seafile server.
