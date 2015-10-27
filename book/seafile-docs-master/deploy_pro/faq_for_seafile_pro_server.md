# FAQ
## <a id="wiki-search-faq"></a>FAQ about Search ##

- However I tried, files in an encrypted library aren't listed in the search results 

  This is because the server can't index encrypted files, since, they are encrypted.

- I switched to Professional Server from Community Server, but whatever I search, I get no results

  The search index is updated every 10 minutes by default. So before the first index update is performed, you get nothing no matter what you search.

  To be able to search immediately,

  - Make sure you have started seafile server
  - Update the search index manually:
  ```
  cd haiwen/seafile-pro-server-1.7.0
  ./pro/pro.py search --update
  ```

  If you have lots of files, this process may take quite a while.

- I want to enable full text search for office/pdf documents, so I set `index_office_pdf` to `true` in the configuration file, but it doesn't work.

  In this case, you need to:
  1. Edit the value of `index_office_pdf` option in `/data/haiwen/pro-data/seafevents.conf` to `true`
  2. Restart seafile server
  ```
  cd /data/haiwen/seafile-pro-server-1.7.0/
  ./seafile.sh restart
  ```
  3. Delete the existing search index
  ```
  ./pro/pro.py search --clear
  ```
  4. Create and update the search index again
  ```
  ./pro/pro.py search --update
  ```

