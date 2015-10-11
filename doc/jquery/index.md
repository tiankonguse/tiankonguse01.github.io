---
layout: jquery
title: jquery 在线手册 | jQuery API 中文手册 | jQuery 速查表 | jQuery 参考手册 | jQuery CHM | jQuery 在线文档
description: jquery中文手册 自从 2011 第1.7版到现在，这期间进行了很多次修改，因为作者相信：只要用心，哪怕一个小玩意都可以做到极致。 若喜欢 jquery中文手册，期待小额资金捐赠以支持开源 :-)
keywords : jquery 在线手册|jQuery API 中文手册|jQuery 速查表|jQuery 参考手册|jQuery CHM
---

<div id="content" class="a1">
  <h1><<a href="{{ site.url }}/doc/jquery/" title="CSS手册">CSS手册</a> | &nbsp;&nbsp;&nbsp;&nbsp;jQuery 1.11.3 速查表&nbsp;&nbsp;--</em>作者：<a href="{{ site.url }}" target="_blank">tiankonguse</a></span><a id="fk" href='bugandUpdate.html'>反馈/更新</a></h1>
  <div class="col-1">
    <div id="core">
      <h2>核心</h2>
      <ul>
        <li>
          <h3>jQuery 核心函数</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery_selector_context.html">jQuery([sel,[context]])</a>
            <li><a href="{{ site.url }}/doc/jquery/jQuery_html_ownerDocument.html">jQuery(html,[ownerDoc])</a><sup>1.8*</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery_callback.html">jQuery(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.holdReady.html">jQuery.holdReady(hold)</a></li>
          </ul>
        </li>
        <li>
          <h3>jQuery 对象访问</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/each.html">each(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/size.html">size()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/length.html">length</a></li>
            <li><a href="{{ site.url }}/doc/jquery/selector.html">selector</a></li>
            <li><a href="{{ site.url }}/doc/jquery/context.html">context</a></li>
            <li><a href="{{ site.url }}/doc/jquery/get.html">get([index])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/index_1.html">index([selector|element])</a></li>
          </ul>
        </li>
        <li>
          <h3>数据缓存</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/data.html">data([key],[value])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/removeData.html">removeData([name|list])</a><sup>1.7*</sup></li>
            <li><del><a href="{{ site.url }}/doc/jquery/jQuery.data.html">$.data(ele,[key],[val])</a></del><sup>1.8-</sup></li>
          </ul>
        </li>
        <li>
          <h3>队列控制</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/queue.html" title="queue(element,[queueName])">queue(e,[q])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/dequeue.html" title="dequeue([queueName])">dequeue([queueName])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/clearQueue.html" title="clearQueue([queueName])">clearQueue([queueName])</a></li>
          </ul>
        </li>
        <li>
          <h3>插件机制</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.fn.extend.html">jQuery.fn.extend(object)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.extend_object.html">jQuery.extend(object)</a></li>
          </ul>
        </li>
        <li>
          <h3>多库共存</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.noConflict.html" title="jQuery.noConflict([extreme])">jQuery.noConflict([ex])</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="attributes">
      <h2>属性</h2>
      <ul>
        <li>
          <h3>属性</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/attr.html" title="attr(name|properties|key,value|fn)">attr(name|pro|key,val|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/removeAttr.html">removeAttr(name)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/prop.html" title="prop(name|properties|key,value|fn)">prop(n|p|k,v|f)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/removeProp.html">removeProp(name)</a></li>
          </ul>
        </li>
        <li>
          <h3>CSS 类</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/addClass.html">addClass(class|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/removeClass.html">removeClass([class|fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/toggleClass.html">toggleClass(class|fn[,sw])</a></li>
          </ul>
        </li>
        <li>
          <h3>HTML代码/文本/值</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/html.html">html([val|fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/text.html">text([val|fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/val.html">val([val|fn|arr])</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="css">
      <h2>CSS</h2>
      <ul>
        <li>
          <h3>CSS</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/css.html" title="css(name|properties|[,value|fn])">css(name|pro|[,val|fn])</a><sup>1.9*</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.cssHooks.html">jQuery.cssHooks</a></li>
          </ul>
        </li>
        <li>
          <h3>位置</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/offset.html">offset([coordinates])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/position.html">position()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/scrollTop.html">scrollTop([val])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/scrollLeft.html">scrollLeft([val])</a></li>
          </ul>
        </li>
        <li>
          <h3>尺寸</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/height.html">height([val|fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/width.html">width([val|fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/innerHeight.html">innerHeight()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/innerWidth.html">innerWidth()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/outerHeight.html">outerHeight([soptions])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/outerWidth.html">outerWidth([options])</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-2">
    <div id="selectors">
      <h2>选择器</h2>
      <ul>
        <li>
          <h3>基本</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/id.html">#id</a></li>
            <li><a href="{{ site.url }}/doc/jquery/element.html">element</a></li>
            <li><a href="{{ site.url }}/doc/jquery/class.html">.class</a></li>
            <li><a href="{{ site.url }}/doc/jquery/all.html">*</a></li>
            <li><a href="{{ site.url }}/doc/jquery/multiple.html">selector1,selector2,selectorN</a></li>
          </ul>
        </li>
        <li>
          <h3>层级</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/descendant.html">ancestor descendant</a></li>
            <li><a href="{{ site.url }}/doc/jquery/child.html">parent &gt;  child</a></li>
            <li><a href="{{ site.url }}/doc/jquery/next_1.html">prev + next</a></li>
            <li><a href="{{ site.url }}/doc/jquery/siblings_1.html">prev ~ siblings</a></li>
          </ul>
        </li>
        <li>
          <h3>基本</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/first_1.html">:first</a></li>
            <li><a href="{{ site.url }}/doc/jquery/not_1.html">:not(selector)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/even.html">:even</a></li>
            <li><a href="{{ site.url }}/doc/jquery/odd.html">:odd</a></li>
            <li><a href="{{ site.url }}/doc/jquery/eq_1.html">:eq(index)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/gt.html">:gt(index)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/lang.html">:lang</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/last_1.html">:last</a></li>
            <li><a href="{{ site.url }}/doc/jquery/lt.html">:lt(index)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/header.html">:header</a></li>
            <li><a href="{{ site.url }}/doc/jquery/animated.html">:animated</a></li>
            <li><a href="{{ site.url }}/doc/jquery/focus_1.html">:focus</a></li>
            <li><a href="{{ site.url }}/doc/jquery/root.html">:root</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/target.html">:target</a><sup>1.9+</sup></li>
          </ul>
        </li>
        <li>
          <h3>内容</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/contains.html">:contains(text)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/empty_1.html">:empty</a></li>
            <li><a href="{{ site.url }}/doc/jquery/has_1.html">:has(selector)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/parent_1.html">:parent</a></li>
          </ul>
        </li>
        <li>
          <h3>可见性</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/hidden_1.html">:hidden</a></li>
            <li><a href="{{ site.url }}/doc/jquery/visible.html">:visible</a></li>
          </ul>
        </li>
        <li>
          <h3>属性</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/attributeHas.html">[attribute]</a></li>
            <li><a href="{{ site.url }}/doc/jquery/attributeEquals.html">[attribute=value]</a></li>
            <li><a href="{{ site.url }}/doc/jquery/attributeNotEqual.html">[attribute!=value]</a></li>
            <li><a href="{{ site.url }}/doc/jquery/attributeStartsWith.html">[attribute^=value]</a></li>
            <li><a href="{{ site.url }}/doc/jquery/attributeEndsWith.html">[attribute$=value]</a></li>
            <li><a href="{{ site.url }}/doc/jquery/attributeContains.html">[attribute*=value]</a></li>
            <li><a href="{{ site.url }}/doc/jquery/attributeMultiple.html">[attrSel1][attrSel2][attrSelN]</a></li>
          </ul>
        </li>
        <li>
          <h3>子元素</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/firstChild.html">:first-child</a></li>
            <li><a href="{{ site.url }}/doc/jquery/firstOfType.html">:first-of-type</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/lastChild.html">:last-child</a></li>
            <li><a href="{{ site.url }}/doc/jquery/lastOfType.html">:last-of-type</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/nthChild.html">:nth-child</a></li>
            <li><a href="{{ site.url }}/doc/jquery/nthLastChild.html">:nth-last-child()</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/nthLastOfType.html">:nth-last-of-type()</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/nthOfType.html">:nth-of-type()</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/onlyChild.html">:only-child</a></li>
            <li><a href="{{ site.url }}/doc/jquery/onlyOfType.html">:only-of-type</a><sup>1.9+</sup></li>
          </ul>
        </li>
        <li>
          <h3>表单</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/input.html">:input</a></li>
            <li><a href="{{ site.url }}/doc/jquery/text_1.html">:text</a></li>
            <li><a href="{{ site.url }}/doc/jquery/password.html">:password</a></li>
            <li><a href="{{ site.url }}/doc/jquery/radio.html">:radio</a></li>
            <li><a href="{{ site.url }}/doc/jquery/checkbox.html">:checkbox</a></li>
            <li><a href="{{ site.url }}/doc/jquery/submit_1.html">:submit</a></li>
            <li><a href="{{ site.url }}/doc/jquery/image.html">:image</a></li>
            <li><a href="{{ site.url }}/doc/jquery/reset.html">:reset</a></li>
            <li><a href="{{ site.url }}/doc/jquery/button.html">:button</a></li>
            <li><a href="{{ site.url }}/doc/jquery/file.html">:file</a></li>
            <li><a href="{{ site.url }}/doc/jquery/hidden_1.html">:hidden</a></li>
          </ul>
        </li>
        <li>
          <h3>表单对象属性</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/enabled.html">:enabled</a></li>
            <li><a href="{{ site.url }}/doc/jquery/disabled.html">:disabled</a></li>
            <li><a href="{{ site.url }}/doc/jquery/checked.html">:checked</a></li>
            <li><a href="{{ site.url }}/doc/jquery/selected.html">:selected</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-3">
    <div id="manipulation">
      <h2>文档处理</h2>
      <ul>
        <li>
          <h3>内部插入</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/append.html">append(content|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/appendTo.html">appendTo(content)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/prepend.html">prepend(content|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/prependTo.html">prependTo(content)</a></li>
          </ul>
        </li>
        <li>
          <h3>外部插入</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/after.html">after(content|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/before.html">before(content|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/insertAfter.html">insertAfter(content)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/insertBefore.html">insertBefore(content)</a></li>
          </ul>
        </li>
        <li>
          <h3>包裹</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/wrap.html" title="wrap(html|element|fn)">wrap(html|ele|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/unwrap.html">unwrap()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/wrapAll.html" title="wrapall(html|element)">wrapAll(html|ele)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/wrapInner.html" title="wrapInner(html|element|fn)">wrapInner(html|ele|fn)</a></li>
          </ul>
        </li>
        <li>
          <h3>替换</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/replaceWith.html">replaceWith(content|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/replaceAll.html">replaceAll(selector)</a></li>
          </ul>
        </li>
        <li>
          <h3>删除</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/empty.html">empty()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/remove.html">remove([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/detach.html">detach([expr])</a></li>
          </ul>
        </li>
        <li>
          <h3>复制</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/clone.html">clone([Even[,deepEven]])</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="traversing">
      <h2>筛选</h2>
      <ul>
        <li>
          <h3>过滤</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/eq.html">eq(index|-index)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/first.html">first()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/last.html">last()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/hasClass.html">hasClass(class)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/filter.html" title="filter(expr|object|element|fn)">filter(expr|obj|ele|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/is.html" title="is(expr|object|element|fn)">is(expr|obj|ele|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/map.html">map(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/has.html" title="has(expr|element)">has(expr|ele)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/not.html" title="not(expr|element|fn)">not(expr|ele|fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/slice.html" title="slice(start,[end])">slice(start,[end])</a></li>
          </ul>
        </li>
        <li>
          <h3>查找</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/children.html">children([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/closest.html" title="closest(expr,[context]|object|element)">closest(e|o|e)</a><sup>1.7*</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/find.html" title="find(expr|object|element)">find(e|o|e)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/next.html">next([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/nextAll.html">nextall([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/nextUntil.html" title="nextUntil([expr|element][,filter])">nextUntil([e|e][,f])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/offsetParent.html">offsetParent()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/parent.html">parent([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/parents.html">parents([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/parentsUntil.html" title="parentsUntil([expr|element][,filter])">parentsUntil([e|e][,f])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/prev.html">prev([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/prevAll.html">prevall([expr])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/prevUntil.html" title="prevUntil([expr|element][,filter])">prevUntil([e|e][,f])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/siblings.html">siblings([expr])</a></li>
          </ul>
        </li>
        <li>
          <h3>串联</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/add.html" title="add(expr|element|html|object[,context])">add(e|e|h|o[,c])</a><sup>1.9*</sup></li>
            <li><del><a href="{{ site.url }}/doc/jquery/andSelf.html">andSelf()</a></del><sup>1.8-</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/addBack.html">addBack()</a><sup>1.9+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/contents.html">contents()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/end.html">end()</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-4">
    <div id="events">
      <h2>事件</h2>
      <ul>
        <li>
          <h3>页面载入</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/ready.html">ready(fn)</a></li>
          </ul>
        </li>
        <li>
          <h3>事件处理</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/on.html" title="on(events,[selector],[data],fn)">on(eve,[sel],[data],fn)</a><sup>1.7+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/off.html" title="off(events,[selector],[data],fn)">off(eve,[sel],[fn])</a><sup>1.7+</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/bind.html">bind(type,[data],fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/one.html">one(type,[data],fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/trigger.html">trigger(type,[data])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/triggerHandler.html">triggerHandler(type, [data])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/unbind.html" title="unbind(type,[data|fn])">unbind(t,[d|f])</a></li>
          </ul>
        </li>
        <li>
          <h3>事件委派</h3>
          <ul>
            <li><del><a href="{{ site.url }}/doc/jquery/live.html">live(type,[data],fn)</a></del><sup>1.7-</sup></li>
            <li><del><a href="{{ site.url }}/doc/jquery/die.html">die(type,[fn])</a></del><sup>1.7-</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/delegate.html" title="delegate(selector,[type],[data],fn)">delegate(s,[t],[d],fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/undelegate.html" title="undelegate([selector,[type],fn])">undelegate([s,[t],fn])</a></li>
          </ul>
        </li>
        <li>
          <h3>事件切换</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/hover.html">hover([over,]out)</a></li>
            <li><del><a href="{{ site.url }}/doc/jquery/toggle.html">toggle([spe],[eas],[fn])</a></del><sup>1.9-</sup></li>
          </ul>
        </li>
        <li>
          <h3>事件</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/blur.html">blur([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/change.html">change([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/click.html">click([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/dblclick.html">dblclick([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/error.html">error([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/focus.html">focus([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/focusin.html">focusin([data],fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/focusout.html">focusout([data],fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/keydown.html">keydown([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/keypress.html">keypress([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/keyup.html">keyup([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mousedown.html">mousedown([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mouseenter.html">mouseenter([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mouseleave.html">mouseleave([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mousemove.html">mousemove([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mouseout.html">mouseout([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mouseover.html">mouseover([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/mouseup.html">mouseup([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/resize.html">resize([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/scroll.html">scroll([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/select.html">select([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/submit.html">submit([[data],fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/unload.html">unload([[data],fn])</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="effects">
      <h2>效果</h2>
      <ul>
        <li>
          <h3>基本</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/show.html" title="show([speed,[easing],[fn]])">show([s,[e],[fn]])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/hide.html" title="hide([speed,[easing],[fn]])">hide([s,[e],[fn]])</a></li>
          </ul>
        </li>
        <li>
          <h3>滑动</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/slideDown.html" title="slideDown([speed],[easing],[fn])">slideDown([s],[e],[fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/slideUp.html" title="slideUp([speed,[easing],[fn]])">slideUp([s,[e],[fn]])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/slideToggle.html" title="slideToggle([speed],[easing],[fn])">slideToggle([s],[e],[fn])</a></li>
          </ul>
        </li>
        <li>
          <h3>淡入淡出</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/fadeIn.html" title="fadeIn([speed],[easing],[fn])">fadeIn([s],[e],[fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/fadeOut.html" title="fadeOut([speed],[easing],[fn])">fadeOut([s],[e],[fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/fadeTo.html" title="fadeTo([[speed],opacity,[easing],[fn]])">fadeTo([[s],o,[e],[fn]])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/fadeToggle.html" title="fadeToggle([speed,[easing],[fn]])">fadeToggle([s,[e],[fn]])</a></li>
          </ul>
        </li>
        <li>
          <h3>自定义</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/animate.html" title="animate(params,[speed],[easing],[fn])">animate(p,[s],[e],[fn])</a><sup>1.8*</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/stop.html" title="stop([clearQueue],[jumpToEnd])">stop([c],[j])</a><sup>1.7*</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/delay.html" title="delay(duration,[queueName])">delay(d,[q])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/finish.html" title="finish([queue])">finish([queue])</a><sup>1.9+</sup></li>
          </ul>
        <li>
          <h3>设置</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.fx.off.html">jQuery.fx.off</a></li>
            <li><a 
    href="{{ site.url }}/doc/jquery/jQuery.fx.interval.html">jQuery.fx.interval</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-5">
    <div id="ajax" >
      <h2>ajax</h2>
      <ul>
        <li>
          <h3>ajax 请求</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.ajax.html">$.ajax(url,[settings])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/load.html">load(url,[data],[callback])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.get.html">$.get(url,[data],[fn],[type])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.getJSON.html">$.getJSON(url,[data],[fn])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.getScript.html">$.getScript(url,[callback])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.post.html">$.post(url,[data],[fn],[type])</a></li>
          </ul>
        </li>
        <li>
          <h3>ajax 事件</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/ajaxComplete.html">ajaxComplete(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/ajaxError.html">ajaxError(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/ajaxSend.html">ajaxSend(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/ajaxStart.html">ajaxStart(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/ajaxStop.html">ajaxStop(callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/ajaxSuccess.html">ajaxSuccess(callback)</a></li>
          </ul>
        </li>
        <li>
          <h3>其它</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.ajaxPrefilter.html">$.ajaxPrefilter([type],fn)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.ajaxSetup.html">$.ajaxSetup([options])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/serialize.html">serialize()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/serializearray.html">serializearray()</a></li>
          </ul>
        </li>
      </ul>
    </div>
    <div id="utilities" >
      <h2>工具</h2>
      <ul>
        <li>
          <h3>浏览器及特性检测</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.support.html">$.support</a></li>
            <li><del><a href="{{ site.url }}/doc/jquery/jQuery.browser.html">$.browser</a></del><sup>1.9-</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.browser.version.html">$.browser.version</a></li>
            <li><del><a href="{{ site.url }}/doc/jquery/jQuery.boxModel.html">$.boxModel</a></del></li>
          </ul>
        </li>
        <li>
          <h3>数组和对象操作</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.each.html">$.each(object,[callback])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.extend.html">$.extend([d],tgt,obj1,[objN])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.grep.html">$.grep(array,fn,[invert])</a></li>
            <li><del><a href="{{ site.url }}/doc/jquery/jQuery.sub.html">$.sub()</a></del><sup>1.9-</sup></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.when.html">$.when(deferreds)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.makeArray.html">$.makeArray(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.map.html">$.map(arr|obj,callback)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.inArray.html">$.inArray(val,arr,[from])</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.toArray.html">$.toArray()</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.merge.html">$.merge(first,second)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.unique.html">$.unique(array)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.parseJSON.html">$.parseJSON(json)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.parseXML.html">$.parseXML(data)</a></li>
          </ul>
        </li>
        <li>
          <h3>函数操作</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.noop.html">$.noop</a>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.proxy.html">$.proxy(function,context)</a></li>
          </ul>
        <li>
          <h3>测试操作</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.contains.html" title="$.contains(container,contained)">$.contains(c,c)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.type.html">$.type(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.isArray.html">$.isarray(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.isFunction.html">$.isFunction(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.isEmptyObject.html">$.isEmptyObject(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.isPlainObject.html">$.isPlainObject(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.isWindow.html">$.isWindow(obj)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.isNumeric.html">$.isNumeric(value)</a><sup>1.7+</sup></li>
          </ul>
        </li>
        <li>
          <h3>字符串操作</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.trim.html">$.trim(str)</a></li>
          </ul>
        </li>
        <li>
          <h3>URL</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.param.html">$.param(obj,[traditional])</a></li>
          </ul>
        </li>
        <li>
          <h3>插件编写</h3>
          <ul>
            <li><a href="{{ site.url }}/doc/jquery/jQuery.error.html">$.error(message)</a></li>
            <li><a href="{{ site.url }}/doc/jquery/jquery.html">$.fn.jquery</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <div class="col-6">
    <div id="Eventobject" >
      <h2>事件对象</h2>
      <ul>
        <li><a href="{{ site.url }}/doc/jquery/event.currentTarget.html">eve.currentTarget</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.data.html">eve.data</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.delegateTarget.html">eve.delegateTarget</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/event.isDefaultPrevented.html">eve.isDefaultPrevented()</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.isImmediatePropagationStopped.html" title="event.isImmediatePropagationStopped">eve.isImmediatePropag...()</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.isPropagationStopped.html">eve.isPropagationStopped()</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.namespace.html">eve.namespace</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.pageX.html">eve.pageX</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.pageY.html">eve.pageY</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.preventDefault.html">eve.preventDefault()</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.relatedTarget.html">eve.relatedTarget</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.result.html">eve.result</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.stopImmediatePropagation.html" title="event.stopImmediatePropagation">eve.stopImmediatePro...()</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.stopPropagation.html">eve.stopPropagation()</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.target.html">eve.target</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.timeStamp.html">eve.timeStamp</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.type.html">eve.type</a></li>
        <li><a href="{{ site.url }}/doc/jquery/event.which.html">eve.which</a></li>
      </ul>
    </div>
    <div id="Deferred" >
      <h2>延迟对象</h2>
      <ul>
        <li><a href="{{ site.url }}/doc/jquery/deferred.done.html" title="deferred.done(doneCallbacks[,doneCallbacks])">def.done(d,[d])</a></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.fail.html">def.fail(failCallbacks)</a></li>
        <li><del><a href="{{ site.url }}/doc/jquery/deferred.isRejected.html">def.isRejected()</a></del><sup>1.7-</sup></li>
        <li><del><a href="{{ site.url }}/doc/jquery/deferred.isResolved.html">def.isResolved()</a></del><sup>1.7-</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.reject.html">def.reject(args)</a></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.rejectWith.html" title="deferred.rejectWith(context,[args])">def.rejectWith(c,[a])</a></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.resolve.html">def.resolve(args)</a></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.resolveWith.html" title="deferred.resolveWith(context,[args])">def.resolveWith(c,[a])</a></li>
        <li><del><a href="{{ site.url }}/doc/jquery/deferred.then.html" title="deferred.then(doneCallbacks,failCallbacks[, progressCallbacks])">def.then(d[,f][,p])</a></del><sup>1.8*</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.promise.html" title="deferred.promise([type],[target])">def.promise([ty],[ta])</a></li>
        <li><del><a href="{{ site.url }}/doc/jquery/deferred.pipe.html" title="deferred.pipe([doneFilter],[failFilter],[progressFilter])">def.pipe([d],[f],[p])</a></del><sup>1.8-</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.always.html" title="deferred.always(alwaysCallbacks,[alwaysCallbacks])">def.always(al,[al])</a></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.notify.html">def.notify(args)</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.notifyWith.html" title="deferred.notifyWith(context,[args])">def.notifyWith(c,[a])</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.progress.html" title="deferred.progress(progressCallbacks)">def.progress(proCal)</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/deferred.state.html">def.state()</a><sup>1.7+</sup></li>
      </ul>
    </div>
    <div id="Callbacks" >
      <h2>回调函数</h2>
      <ul>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.add.html">cal.add(callbacks)</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.disable.html">cal.disable()</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.empty.html">cal.empty()</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.fire.html">cal.fire(arguments)</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.fired.html">cal.fired()</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.fireWith.html" title="callbacks.fireWith([context] [, args])">cal.fireWith([c] [,a])</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.has.html">cal.has(callback)</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.lock.html">cal.lock()</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.locked.html">cal.locked()</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/callbacks.remove.html">cal.remove(callbacks)</a><sup>1.7+</sup></li>
        <li><a href="{{ site.url }}/doc/jquery/jQuery.callbacks.html">$.callbacks(flags)</a><sup>1.7+</sup></li>
      </ul>
    </div>
    <div id="about" >
      <h2>关于</h2>
      <ul>
        <li><a href="{{ site.url }}/doc/jquery/about.html">关于此jQuery中文文档</a></li>
        <li><a href="{{ site.url }}/doc/jquery/bugandUpdate.html">提交bug及获取更新</a></li>
      </ul>
    </div>
    <div id="Other" >
      <h2>其它</h2>
      <ul>
        <li><a href="{{ site.url }}/doc/jquery/cssFormat.html">CSS压缩/格式化</a></li>
        <li><a href="{{ site.url }}/doc/jquery/jsFormat.html">JS压缩/格式化</a></li>
        <li><a href="{{ site.url }}/doc/jquery/regexChe.html">正则表达式在线测试</a></li>
        <li><a href="{{ site.url }}/doc/jquery/regexp.html">正则表达式</a></li>
       <li><a href="{{ site.url }}/doc/jquery/html5.html">HTML5速查表</a></li>
      </ul>
    </div>
  </div>
  <p id="footer">Copyright &copy; <a href="{{ site.url }}/" target="_blank">tiankonguse</a> 2012-2015. All right reserved.</p>
</div>
