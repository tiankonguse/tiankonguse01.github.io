---
layout: post
title: 时间戳转换工具 
categories: [project]
---

<p style="padding: 0px;margin: 0px;">
<style type="text/css">
.timestamp input{
    height: 32px;
}

.fa-img{
    color: #222222;
    line-height: 32px;
    height: 32px;
    padding: 5px;
    border-radius: 4px;
    cursor: pointer;
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

.block-demo{
    margin: 20px;
}
</style>
</p>


<div class="timestamp">


<h2>实时时间</h2>


<div class="block-demo">
	现在的Unix时间戳(Unix timestamp)是&nbsp;&nbsp;&nbsp;
    <input type="text" id="currentunixtime"> &nbsp; 
    <span class="fa-img" onclick="startTimer();"><i class="fa fa-play"></i></span>&nbsp;
	<span class="fa-img" onclick="stopTimer();"><i class="fa fa-stop"></i></span>&nbsp;
	<span class="fa-img" onclick="currentTime();"><i class="fa fa-refresh"></i></span>&nbsp;
</div>


<h2>时间戳转日期</h2>

<div class="block-demo"> 
    时间戳<input type="text" id="input-timestamp" size="30"> 
    <span class="fa-img" onclick="unix2human();"><i class="fa fa-undo"></i></span>&nbsp;
    日期<input type="text" size="30" id="turn-result-date" readonly="readonly">
</div>


<h2>日期转时间戳</h2>


<div class="block-demo"> 
    日期<input type="text" id="input-date" size="30" placeholder="YYYY-MM-DD hh-mm-ss">
    <span class="fa-img" onclick="human2unix();"><i class="fa fa-repeat"></i></span>&nbsp;
    时间戳<input type="text" size="30" id="turn-result-timestam" readonly="readonly">
</div>

</div>


<script>
function unix2human() {
    var val = +$("#input-timestamp").val();
    var dateObj = new Date(val * 1000);
    var UnixTimeToDate = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + dateObj.getDate() + ' ' + dateObj.getHours() + ':' + dateObj.getMinutes() + ':' + dateObj.getSeconds();
    $("#turn-result-date").val(UnixTimeToDate);
}
function human2unix() {
    var val = $("#input-date").val();
    var time = parseInt((new Date(val)).getTime()/1000);
	$("#turn-result-timestam").val(time);
}
var currentTimeActive = 0; 
var unixTimer = null;
function startTimer() {
    currentTimeActive = 1;
    currentTime();
}
function currentTime() {
    var timeNow = new Date();
    $("#currentunixtime").val(Math.round(timeNow.getTime()/1000));
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
