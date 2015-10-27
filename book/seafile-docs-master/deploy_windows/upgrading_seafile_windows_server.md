# Upgrading Seafile Windows Server

- Minor Upgrade
- Major Upgrade
- Upgrade Windows Service

**Note**：You must shutdown seafile server before you upgrade.
## Uncompress the new version of Seafile Server

Before you upgrade, assume you have:
```
C:/SeafileProgram
             |______ seafile-server-3.0.0/
```
Then the first step is to download the new version of Seafile Server and uncompress it to ``C:/SeafileProgram``. After this you should have:
```
C:/SeafileProgram
             |______ seafile-server-3.0.0/
             |______ seafile-server-3.1.0/
```
## Minor upgrade (like upgrade from 3.0.0 to 3.0.1)

Now assume you are upgrading from Seafile Windows Server 3.0.0 to 3.0.1
### Move the contents of the avatars folder

Go to the folder ``seafile-server-3.0.0/seahub/media/avatars``

The ``avatars`` folder contains all the avatars uploaded by seafile users.

If you have a user ``foo@foo.com``, then in this folder, you will find a subfolder ``foo@foo.com``. This subfolder contains the avatar pictures of the user ``foo@foo.com``.

Copy all subfolders like ``foo@foo.com`` to ``seafile-server-3.0.1/seahub/media/avatars``. So that when you start the new seafile 3.0.1 server, these avatars can be load correctly.
## Major upgrade (like upgrade from 3.0.0 to 3.1.0)

Now assume you are upgrading from Seafile Windows Server 3.0.x to 3.1.y:

### Run the major upgrade script

Run the database upgrade script

- Go to seafile-server-3.1.y/upgrade
- Right click the file `upgrade_3.0_3.1.bat`
- Choose "run as administrator"

If you're using MySQL, you need to manually upgrade the database yourself:

- Go to the folder seafile-server-3.1.y/upgrade/sql/3.1.0/mysql/
- If there are a file `ccnet.sql`, run it with the `ccnet-db` database
```
mysql ccnet-db < ccnet.sql
```
- If there are a file `seafile.sql`, run it with the `seafile-db` database
```
mysql ccnet-db < seafile.sql
```
- If there are a file `seahub.sql`, run it with the `seahub-db` database
```
mysql seahub-db < seafile.sql
```

### Copy avatars

Copy all subfolders of ``seafile-server-3.0.0/seahub/media/avatars`` to ``seafile-server-3.1.0/seahub/media/avatars``
## Upgrading Windows Service

If you have installed Seafile server as a Windows Service, you need to:

- Run the old version of seafile windows server, right click the tray icon, and choose uninstall windows service in the menu
- Exit the old version of seafile windows server
- Start the new version of seafile windows server, right click the tray icon, and choose install as windows service in the menu
