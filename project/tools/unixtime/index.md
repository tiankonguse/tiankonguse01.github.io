---
layout: post
title: 时间戳转换工具 
category: project
---



<p style="padding: 0px;margin: 0px;">
<style type="text/css">
.fa-img{
    display: block;
    color: #222222;
    line-height: 32px;
    height: 32px;
    padding-left: 10px;
    border-radius: 4px;
}
#currentunixtime{
    color: #FF3300;
    background-color: #ECF5FB;
    border: 1px solid #D4E9F7;
    padding: 6px;
    font-weight: bold;
}
#input-timestamp, #turn-result-time{
    border: 1px solid #94c6e1;
    background: #fff;
    color: #22ac38;
    font-weight: bold;
    padding: 5px;
    margin-bottom: 5px;
}
</style>
</p>

<div>
	现在的Unix时间戳(Unix timestamp)是&nbsp;&nbsp;&nbsp;
    <input type="text" id="currentunixtime"> &nbsp; 
    <span class="fa-img" onclick="startTimer();"><i class="fa fa-play"></i></span>&nbsp;
	<span class="fa-img" onclick="stopTimer();"><i class="fa fa-stop"></i></span>&nbsp;
	<span class="fa-img" onclick="currentTime();"><i class="fa fa-refresh"></i></span>&nbsp;
</div>

Unix时间戳(Unix timestamp)转北京时间    

<div> 
    Unix时间戳(Unix timestamp) 
    <input type="text" id="input-timestamp" size="30">
    <input type="button" value="转换" onclick="unix2human();">
    北京时间
    <input type="text" size="30" id="turn-result-time" readonly="readonly">
<div>


北京时间转Uix时间戳(Unix timestamp)  



<script>
    var $ = (function(){
        var $obj = {};
        var fun = {
            val : function(v){
                if(v){
                    $obj.value = v;
                }else{
                    return  $obj.value;
                }
            }
        };
        return (function(id){
            $obj = document.getElementById(id);
            return fun;
        });
    }());

    function unix2human() {
        var val = +$("input-timestamp").val();
        var dateObj = new Date(val * 1000);
        var UnixTimeToDate = dateObj.getFullYear() + '/' + (dateObj.getMonth() + 1) + '/' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
        $("turn-result-time").val(UnixTimeToDate);
    }
    var currentTimeActive = 0; 
    var unixTimer = null;
    function startTimer() {
        currentTimeActive = 1;
        currentTime();
    }
    function currentTime() {
        var timeNow = new Date();
        $("currentunixtime").val(Math.round(timeNow.getTime()/1000));
        if (currentTimeActive) {
            unixTimer = setTimeout("currentTime()", 1000);
        }
    }
    function stopTimer() {
        currentTimeActive = 0;
        clearTimeout(unixTimer);
    }
    currentTime();
</script>