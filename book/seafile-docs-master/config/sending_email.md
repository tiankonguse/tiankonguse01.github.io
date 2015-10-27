# Sending Email Notifications on Seahub

## Types of email sending in Seafile

There are currently five types of emails sent in Seafile:

- User reset his/her password
- System admin add new member
- System admin reset user password
- User send file/folder share link
- Reminder of unread notifications (It is sent by a background task which is pro edition only)


## Options of email sending

Please add the following lines to seahub_settings.py to enable Email sending.

<pre>
EMAIL_USE_TLS = False
EMAIL_HOST = 'smtp.example.com'        # smpt server
EMAIL_HOST_USER = 'username@example.com'    # username and domain
EMAIL_HOST_PASSWORD = 'password'    # password
EMAIL_PORT = '25'
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL = EMAIL_HOST_USER
</pre>

If you are using Gmail as email server, use following lines:

<pre>
EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'username@gmail.com'
EMAIL_HOST_PASSWORD = 'password'
EMAIL_PORT = 587
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER
SERVER_EMAIL = EMAIL_HOST_USER
</pre>

**Note**: If your Email service still can not work, you may checkout the log file <code>logs/seahub.log</code> to see what may cause the problem. For complete email notification list, please refer to [Email notification list](customize_email_notifications.md).

**Note2**: If you want to use the Email service without authentication leaf <code>EMAIL_HOST_USER</code> and <code>EMAIL_HOST_PASSWORD</code> **blank** (<code>''</code>). (But notice that the emails then will be sent without a <code>From:</code> address.)

## Change the `sender` and `reply to` of email

You can change the sender and reply to field of email by add the following settings to seahub_settings.py. This only affects email sending for file/folder share link.

<pre>
# Replace default from email with user's email or not, defaults to ``False``
REPLACE_FROM_EMAIL = True

# Set reply-to header to user's email or not, defaults to ``False``. For details,
# please refer to http://www.w3.org/Protocols/rfc822/
ADD_REPLY_TO_HEADER = True
</pre>

