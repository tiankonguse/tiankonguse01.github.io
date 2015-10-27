# Setup With Amazon S3
## Prepare

To setup Seafile Professional Server with Amazon S3:

- Setup the basic Seafile Professional Server following the guide on [Download and setup Seafile Professional Server](download_and_setup_seafile_professional_server.md)
- Install the python `boto` library. It's needed to access S3 service.
```
sudo easy_install boto
```
- Install and configure memcached. For best performance, Seafile requires install memcached and enable memcache for objects. We recommend to allocate 128MB memory for memcached. Edit /etc/memcached.conf

```
# Start with a cap of 64 megs of memory. It's reasonable, and the daemon default
# Note that the daemon will grow to this size, but does not start out holding this much
# memory
# -m 64
-m 128
```

## Modify Seafile.conf

Edit `/data/haiwen/seafile-data/seafile.conf`, add the following lines:

```
[commit_object_backend]
name = s3
# bucket name can only use lowercase characters, numbers, periods and dashes
bucket = my.commit-objects
key_id = your-key-id
key = your-secret-key
memcached_options = --SERVER=localhost --POOL-MIN=10 --POOL-MAX=100

[fs_object_backend]
name = s3
# bucket name can only use lowercase characters, numbers, periods and dashes
bucket = my.fs-objects
key_id = your-key-id
key = your-secret-key
memcached_options = --SERVER=localhost --POOL-MIN=10 --POOL-MAX=100

[block_backend]
name = s3
# bucket name can only use lowercase characters, numbers, periods and dashes
bucket = my.block-objects
key_id = your-key-id
key = your-secret-key
memcached_options = --SERVER=localhost --POOL-MIN=10 --POOL-MAX=100
```

It's recommended to create separate buckets for commit, fs, and block objects.
The key_id and key are required to authenticate you to S3. You can find the key_id and key in the "security credentials" section on your AWS account page.

When creating your buckets on S3, please first read [S3 bucket naming rules][1]. Note especially not to use **UPPERCASE** letters in bucket names (don't use camel style names, such as MyCommitOjbects).

### Use S3 in newer regions

After Januaray 2014, new regions of AWS will only support authentication signature version 4 for S3. At this time, new region includes Frankfurt and China.

To use S3 backend in these regions, add following options to commit_object_backend, fs_object_backend and block_backend section in seafile.conf

```
use_v4_signature = true
# eu-central-1 for Frankfurt region
aws_region = eu-central-1
```

For file search and webdav to work with the v4 signature mechanism, you need to add following lines to ~/.boto

```
[s3]
use-sigv4 = True
```

### Using memcached cluster

In a cluster environment, you may want to use a memcached cluster. In the above configuration, you have to specify all the memcached server node addresses in seafile.conf

```
memcached_options = --SERVER=192.168.1.134 --SERVER=192.168.1.135 --SERVER=192.168.1.136 --POOL-MIN=10 --POOL-MAX=100
```

## Run and Test ##

Now you can start Seafile by `./seafile.sh start` and `./seahub.sh start` and visit the website.

  [1]: http://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html "the bucket naming rules"
