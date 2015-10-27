# Office Web app

In pro version 4.4.0(or above), you can use Microsoft Office Web App to preview document online. Office Web App provides the best preview for all Office format files. For organizations with Microsoft Office Volume License, it's free to use Office Web App. For more information about Office Web App and how to deploy it, please refer to https://technet.microsoft.com/en-us/library/jj219456.aspx .

Seafile's own Office file preview is still the default. To use Office Web App for preview, please add following config to seahub_settings.py.

<pre>

# Enable Office Web App
ENABLE_OFFICE_WEB_APP = True

# Url of Office Web App's discovery page
# The discovery page tells Seafile how to interact with Office Web App when view file online
# You should change `http://example.office-web-app.com` to your actual Office Web App server address
OFFICE_WEB_APP_BASE_URL = 'http://example.office-web-app.com/hosting/discovery'

# Expiration of WOPI access token
# WOPI access token is a string used by Seafile to determine the file's
# identity and permissions when use Office Web App view it online
# And for security reason, this token should expire after a set time period
WOPI_ACCESS_TOKEN_EXPIRATION = 30 * 60 # seconds

# Tuple of file format that you want to view through Office Web App
# You can change this value according to your preferences
OFFICE_WEB_APP_FILE_EXTENSION = ('ods', 'xls', 'xlsb', 'xlsm', 'xlsx','ppsx', 'ppt',
    'pptm', 'pptx', 'doc', 'docm', 'docx')

</pre>

Then restart

<pre>
./seafile.sh restart
./seahub.sh restart
</pre>

After you click the document you specified in seahub_settings.py, you will see the new preview page.

![office-web-app](../images/office-web-app.png)
