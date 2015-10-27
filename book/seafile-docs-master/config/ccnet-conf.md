# Seafile Network Configurations (ccnet.conf)

You may change Seafile's network options by modifying `ccnet/ccnet.conf` file. Let's walk through the options by an example.

<pre>
[General]

# Not used anymore 
USER_NAME=example

# Not used anymore
ID=eb812fd276432eff33bcdde7506f896eb4769da0

# This is the name of this Seafile server. Currenlty it is only used in Seafile client's log.
NAME=example

# This is outside URL for Seahub(Seafile Web). 
# The domain part (i.e., www.example.com) will be used in generating share links and download/upload file via web.
# Note: Outside URL means "if you use Nginx, it should be the Nginx's address"
SERVICE_URL=http://www.example.com:8000


[Network]
# Not used anymore
PORT=10001

[Client]
# Not used anymore
PORT=13419

</pre>

**Note**: You should restart seafile so that your changes take effect.

<pre>
cd seafile-server
./seafile.sh restart
</pre>
