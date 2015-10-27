# Virus Scan

In Seafile Pro Edition 4.4.0 (or above), Seafile can scan virus for uploaded files in the background. When configured to run periodically, the scan process scans all existing libraries on the server. In each scan, the process only scans newly uploaded/updated files since the last scan. For each file, the process executes a user-specified virus scan command to check whether the file is a virus or not. Most anti-virus programs provide command line utility for Linux.

To enable this feature, add the following options to seafile-data/seafile.conf:

```
[virus_scan]
scan_command = (command for checking virus)
virus_code = (command exit codes when file is virus)
nonvirus_code = (command exit codes when file is not virus)
scan_interval = (scanning interval, in unit of minutes, default to 60 minutes)
```

More details about the options:

* On Linux/Unix, most virus scan commands returns specific exit codes for virus and non-virus. You should consult the manual of your anti-virus program for more information.

An example for ClamAV (http://www.clamav.net/) is provided below:

```
[virus_scan]
scan_command = clamscan
virus_code = 1
nonvirus_code = 0
```

To test whether your configuration works, you can trigger a scan manually:

```
cd seafile-server-latest
./pro/pro.py virus_scan
```

If virus is detected, you can see scan records and delete infected files in Virus Scan page.
![virus-scan](../images/virus-scan.png)
