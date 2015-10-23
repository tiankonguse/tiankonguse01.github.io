

## 简介


RequireJS is a JavaScript file and module loader.   
It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node.   
Using a modular script loader like RequireJS will improve the speed and quality of your code.  


## HOW TO GET STARTED WITH REQUIREJS

### ADD REQUIREJS

This setup assumes you keep all your JavaScript files in a "scripts" directory in your project.   
For example, if you have a project that has a project.html page, with some scripts, the directory layout might look like so:  

```
project-directory/
    project.html
    scripts/
        main.js
        helper/
            util.js
```

Add require.js to the scripts directory, so it looks like so:  

```
project-directory/
    project.html
    scripts/
        main.js
        require.js
        helper/
            util.js
```

To take full advantage of the optimization tool, it is suggested that you keep all inline script out of the HTML, and only reference require.js with a requirejs call like so to load your script:  

```
<!DOCTYPE html>
<html>
    <head>
        <title>My Sample Project</title>
        <!-- data-main attribute tells require.js to load
             scripts/main.js after require.js loads. -->
        <script data-main="scripts/main" src="scripts/require.js"></script>
    </head>
    <body>
        <h1>My Sample Project</h1>
    </body>
</html>

```


You could also place the script tag end of the <body> section if you do not want the loading of the require.js script to block rendering.  
For browsers that support it, you could also add an [async attribute](https://developer.mozilla.org/en/docs/Web/HTML/Element/script#Attributes) to the script tag.  

Inside of `main.js`, you can use `requirejs()` to load any other scripts you need to run.   
This ensures a single entry point, since the data-main script you specify is loaded asynchronously.  


```
requirejs(["helper/util"], function(util) {
    //This function is called when scripts/helper/util.js is loaded.
    //If util.js calls define(), then this function is not fired until
    //util's dependencies have loaded, and the util argument will hold
    //the module value for "helper/util".
});
```

That will load the `helper/util.js` script.   
To get full advantage of RequireJS, see the API docs to learn more about defining and using modules.  



### OPTIMIZE


Once you are finished doing development and want to deploy your code for your end users, you can use the optimizer to combine the JavaScript files together and minify it.   
In the example above, it can combine `main.js` and `helper/util.js` into one file and minify the result.  


### EXAMPLES

If you want a starting project to use to try out RequireJS, here are some options:  


## DOWNLOAD REQUIREJS

### LATEST RELEASE

[require.js 2.1.20](http://requirejs.org/docs/release/2.1.20/comments/require.js)  


### PLUGINS

These are useful loader plugins that have the same license terms as `require.js` itself.   
Download the plugin file and place it as a sibling to your "data-main" `main.js` script.  

* text Load text files and treat them as dependencies.   
  Great for loading templates.   
  The text strings can be inlined in an optimized build when the optimizer is used.  
* domReady Wait for the DOM is ready. 
  Useful for pausing execution of top level application logic until the DOM is ready for querying/modification.  
* cs (CoffeeScript)
  Load files written in CoffeeScript. With this plugin, it is easy to code in CoffeeScript in the browser, it can participate in the optimizer optimizations, and it works in Node and Rhino/Nashorn via the RequireJS adapter.   
  This is the best way to do cross-environment, modular CoffeeScript.   
  The project home has more information on how to install and use it.  
* i18n  
  Load string bundles used in internationalization (i18n) that are made up of separate `country/language/locale-specific` bundles.  

## OTHER

[requirejs HOME](http://requirejs.org/)




















