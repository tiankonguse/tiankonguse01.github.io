# Add memcached

Seahub caches items (avatars, profiles, etc) on the file system in /tmp/seahub_cache/ by default. You can replace it with Memcached. You need to install

* memcached
* python memcached module (python-memcache or python-memcached)

Then add the following lines to **seahub_settings.py**.

```
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.memcached.MemcachedCache',
        'LOCATION': '127.0.0.1:11211',
    }
}
```
