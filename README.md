yarmd - Yet Another Recursive Multi-thread Downloader
---

A recursive downloader parsing Nginx's autoindex page, and depends on `aria2` for multi-thread downloading and easy interrupting / resuming.

Motivation
---

Recently I've set up a PT (Private Tracker) seedbox on one of my servers for better downloading / uploading speed than my local computer.

It works really well, but one problem bothers me a lot - that I could not find a great recursive downloader (`wget` supports recursive mode but it can only download with single connection.).
This is really something when I pulled a large torrent that is made up of a directory and want to download them back to my PC.

Thus, I wrote this script.

Usage
---

```
Usage: yarmd [-h] [-n count] [-d directory] URL

Yet Another Recursive Multi-thread Downloader. This program downloads recursively from an Nginx server with autoindex enabled.
If you want to resume a previous download, just make sure the parameters remain the same.
Please note that this program ONLY supports servers with NGINX autoindex, and it requires Aria2 to work!

Options:
  -n, --threads    The number of threads while downloading a file.                                                                        [default: 3]
  -d, --directory  Directory to download into. YARMD will create a new directory in that directory named with the directory to download.  [default: "/home/peter/workspace/yarmd"]
  -h, --help       Print help information                                                                                                 [default: false]
```

Why Aria2?
---

Because `aria2` has done all the stuff (except recursive download) greatly. Rewriting the download logic by myself can only bring more problems. Thus, we just call aria2c for every single file.