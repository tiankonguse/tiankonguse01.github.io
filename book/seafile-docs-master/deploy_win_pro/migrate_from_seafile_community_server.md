# Migrate from Seafile Community Server

## <a id="wiki-restriction"></a>Restriction ##

It's quite likely you have deployed the Seafile Windows Community Server and want to switch to the Professional Server, or vice versa. But there is some restriction:

- You can only switch between Community Server and Professional Server of the same version.

That is, if you are using Community Server 2.1.x, and want to switch to the Professional Server 2.2.x, you must first upgrade to Community Server 2.2.x, and then follow the guides below to switch to the Professional Server 2.2.x.

## <a id="wiki-preparation"></a>Preparation ##

### Install Java

- Download and install Oracle JDK 1.7 from the [oracle website](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)
- Set the `JAVA_HOME` enviroment varaible to your java installation path. Fro example, by default you would install java to `C:/program Files/Java/jdk1.7.0_51/`, you shoudl set the value of the `JAVA_HOME` enviroment variable to `C:/program Files/Java/jdk1.7.0_51/`

To ensure you have correctly installed java, open a command line window, and execute these commands:

1. This command should print the version of your java installation:
```
java -version
```
2. This command should print the value of the `JAVA_HOME` environmental variable:
```
echo %JAVA_HOME%
```

### Install ElasticSearch Server

The search functionality of Seafile Pro depends on elasticsearch.

- Download elasticsearch server [here](http://seacloud.cc/repo/51fa38cb-a8ea-4d8a-bd08-e1940daf52b2/).

- Uncompress it to a folder. The search index size would increase as your files increase, so please choose a folder with enough free space)

- Install elasticsearch server as a windows service. First, open a command line window. Suppose you have uncompressed elasticsearch server to `D:\`

```
D:\elasticsearch\bin\service.bat install
```

- Start the elasticsearch service

```
D:\elasticsearch\bin\service.bat start
```

### Download the Seafile Server Package

You can download the latest Seafile Professional Server for windows [here](http://seacloud.cc/repo/51fa38cb-a8ea-4d8a-bd08-e1940daf52b2/)

Assume you have your seafile community server in `C:/SeafileProgram/seafile-server-3.0.4`, you should also uncompress the professional server to `C:\SeafileProgram`.

```
C:\SeafileProgram
     |_______ seafile-server-3.0.4/
     |_______ seafile-pro-server-3.0.6/
```

-----------

You should notice the difference between the names of the Community Server and Professional Server. Take the 3.0.4 version as an example:

- Seafile Community Server tarball is `seafile-server_3.0.4_win32_tar.gz`; After uncompressing, the folder is `seafile-server-3.0.0`
- Seafile Professional Server tarball is `seafile-pro-server_3.0.4_win32.tar.gz`; After uncompressing, the folder is `seafile-pro-server-3.0.0`

-----------

### Prepare the License File

Put the license file you get in the folder `C:/SeafileProgram` too. You should have:

```
C:\SeafileProgram
     |_______ seafile-server-3.0.4/
     |_______ seafile-pro-server-3.0.6/
     |_______ seafile-license.txt
```

## <a id="wiki-do-migration"></a>Do the migration ##

### Before you do the migration

* If you have installed seafile server as as service, make sure you have uninstalled the service
* If the seafile server is running, make sure to stop it by right click on the tray icon and choose "Quit and Stop seafile server"

### Do the migration ###

You should open the folder `C:/SeafileProgram/seafile-pro-server-3.0.1`, and run the `migrate_to_pro.bat` script as administator.

The migration script would do the following for you:

- ensure your have all the prerequisites met
- create necessary extra configurations
- create extra database tables

### Start Seafile Professional Server ###

Now you can start seafile professional server but double clicking `run.bat` file under `C:/SeafileProgram/seafile-pro-server-3.x`

## <a id="wiki-switch-back"></a>Switch Back to Community Server ##

To switch back to the community server, you need:

* stop Seafile Professional Server if it's running
* start the community server
