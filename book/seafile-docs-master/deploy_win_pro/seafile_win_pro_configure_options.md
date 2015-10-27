# Configurable Options

In the file `X:/seafile-server/pro-data/seafevents.conf` (where **X** is the drive you choose during Seafile Server initialization.)

```
[INDEX FILES]
# must be "true" to enable search
enabled = true

# The interval the search index is updated. Can be s(seconds), m(minutes), h(hours), d(days)
interval=10m

# If true, index the contents of office files while updating search index
# Note: If you change this option from "false" to "true", then you need to clear the search index and update the index again. See the FAQ for details.
index_office_pdf=false

[SEAHUB EMAIL]

# must be "true" to enable user email notifications when there are new messages
enabled = true

# interval of sending seahub email. Can be s(seconds), m(minutes), h(hours), d(days)
interval = 30m

```



</table>
