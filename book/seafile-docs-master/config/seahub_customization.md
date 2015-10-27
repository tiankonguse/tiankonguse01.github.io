# Seahub customization

## Customize Seahub Logo and CSS

Create a folder ``<seafile-install-path>/seahub-data/custom``. Create a symbolic link in `seafile-server-latest/seahub/media` by `ln -s ../../../seahub-data/custom custom`.

During upgrading, Seafile upgrade script will create symbolic link automatically to preserve your customization.

### Customize Logo

1. Add your logo file to `custom/`
2. Overwrite `LOGO_PATH` in `seahub_settings.py`

   <pre>
   LOGO_PATH = 'custom/mylogo.png'
   </pre>

3. Default width and height for logo is 149px and 32px, you may need to change that according to yours.

   <pre>
   LOGO_WIDTH = 149
   LOGO_HEIGHT = 32
   </pre>

### Customize Seahub CSS

1. Add your css file to `custom/`, for example, `custom.css`
2. Overwrite `BRANDING_CSS` in `seahub_settings.py`

   <pre>
   BRANDING_CSS = 'custom/custom.css'
   </pre>

## Customize footer and other Seahub Pages

**Note:** Since version 2.1.

Create a folder ``templates`` under ``<seafile-install-path>/seahub-data/custom``

### Customize footer

1. Copy ``seahub/seahub/templates/footer.html`` to ``seahub-data/custom/templates``.
2. Modify `footer.html`.

### Customize Download page

1. Copy ``seahub/seahub/templates/download.html`` to ``seahub-data/custom/templates``.
2. Modify `download.html`.

### Customize Help page

1. Copy ``seahub/seahub/help/templates/help`` to ``seahub-data/custom/templates/help``.
2. Modify pages under `help`.

### Customize the logo and name displayed on seafile desktop clients (Seafile Professional Only)

Note: The feature is only available in seafile desktop client 4.4.0 and later.

By default, the text "Seafile" is displayed in the top of seafile desktop client window, along side with the seafile logo. To customize them, set `DESKTOP_CUSTOM_LOGO` and `DESKTOP_CUSTOM_BRAND` in `seahub_settings.py`.

![desktop-customization](../images/desktop-customization.png)

The size of the image must be `24x24`, and generally you should put it in the `custom` folder.

```
DESKTOP_CUSTOM_LOGO = 'custom/desktop-custom-logo.png'
DESKTOP_CUSTOM_BRAND = 'Seafile For My Company'
```
