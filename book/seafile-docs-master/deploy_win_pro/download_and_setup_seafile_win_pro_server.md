# Download and Setup Seafile Windows Professional Server

## Requirements

A windows machine with at least 2GB memory.

## Install Java

- Download and install Oracle JDK 1.7 from the [oracle website](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html)
- Set the `JAVA_HOME` enviroment varaible to your java installation path. Fro example, by default you would install java to `C:/program Files/Java/jdk1.7.0_51/`, you shoudl set the value of the `JAVA_HOME` enviroment variable to `C:/program Files/Java/jdk1.7.0_51/`

To ensure you have correctly installed java, open a command line window, and execute these commands:

1. This command should print the version of your java installation:
    ````
    java -version
    ````
2. This command should print the value of the `JAVA_HOME` environmental variable:
    ````
    echo %JAVA_HOME%
    ````



## Install ElasticSearch Server

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


## Prepare the License File

If you prepare to extract seafile server to `C:/SeafileProgram`, then you should put the license file you get in the folder `C:/SeafileProgram` too.

You should have:

```
C:\SeafileProgram
     |_______ seafile-pro-server-2.1.4/
     |_______ seafile-license.txt
```

## Setup Seafile Server

Except for the Java program and the license, the setup of pro server is the same as setup of community edition.
Please follow the [document on setup community edition](../deploy_windows/deploy_with_windows.md)
