---
layout: page
title: 无线Web开发经验谈
---

## 无线web开发简介

无线Web开发是基于智能手机上的游览器进行的Web开发。现在智能手机主要有Android和IOS两种操作系统的，因此基于手机Web的开发，主要是基于Android和IOS两种操作系统上的web开发。  


**基于两种操作系统的Web开发的共同点：**  

1. 两者的浏览器引擎是基于webkit的，因此基于手机上的Web开发，主要是基于webkit的游览器开发，对于其他浏览器，例如firefox、ie和opera等游览器，可以不用做兼容考虑。  
2. 两者都是按照HTML5规范开发，因此对于HTML5的特性支持性都比较好。  


**不同点：**  

1. android的厂商碎片化比较严重，加上由于webkit的开源特性，导致市面上有非常多的修改版webkit游览器， 这些修改版的webkit，厂商会根据自己的需求对webkit进行修改，导致对HTML5的特性碎片化严重。  
  同时HTML5标准不同厂商的实现不同，造成对于HTML5特性的支持度不同。 以input type=date 日期控件为例，有些厂商实现了该标准，有些厂商没有实现该标准，就算实现了标准的厂商，  
  对于日期控件的展现、交互也不尽相同。  
2. android的版本碎片化，android到本文档撰写为止，发展到了4.4的版本，对于web开发而言，主要分为两个阶段2.X和4.X的阶段，由于3.X是为TV等操作系统而做，2.X采用的webkit核心的版本是533.x版本，533的版本，是谷歌专门为当时的手机性能定制的，由于当时的手机，硬件性能不是很好，因此对于533版本的webkit游览器的实现是精简版的，因此对于HTML5标砖的实现不是非常彻底，并且对于某些实现还做了特定保留。此系列版本又可分为2.2以及以下和2.3版本，对于2.2以及下面的版本，对于html5的支持性不是很好，并且即使实现了，对于某些细节实现的比较有问题。2.3版本可以说是一次飞跃，在2.3的版本上，开始移植pc版chrome的核心代码实现，因此从2.3开始，android的web开发开始了新的旅程。  
3. ios由于其封闭性，并且苹果公司严格按照html5的规范来进行实现，因此在ios上html5的规范实现的较好。  
4. ios和android对于html5的规范实现在界面层和交互层的实现是不同的，就拿上面的列子来说 type date的日期控件，ios和android的交互实现，完全不同。虽然都按照w3c的标准进行了实现。这个也是在日常web开发中需要注意的。  



## 手机相关


在说具体的移动Web开发之前，需要先说一下手机的特点，手机的特点影响着很大方面的手机Web开发，因此在说语言钱，先需要了解一下手机的特点。  


### 手机性能

智能手机是这两年发展起来的，其硬件发展的非常迅速，不过无论其硬件发展多块，由于手机的特点，性能和功能是一个平衡点。因为谁也不会用一个性能超好，但是手机非常烫并且只能用1个小时的机器。因此在很多方面，手机上的性能是受到一定限制。web这块受这个影响叫native的方面要大很多。因此web这块不是编译型语言，只能动态在手机上运行，再加之webkit核心所占的内存较大，是单进程单线程应用，其受CPU、内存的影响更大。  

#### 页面渲染


手机Web开发在性能上影响较大的是页面渲染问题，而js脚本性能问题不再突出，这个主要归功于在android上使用了v8引擎，大大提升了脚本的执行性能。  
这个和PC上的情况完全不同，因为在PC上，由于其高性能的硬件，加上强劲的显卡，使得页面渲染的性能非常之高。  
而在手机上完全不同，有限的硬件性能，加上没有显卡这类专门处理显示的硬件，使得所有页面渲染的工作都由CPU来执行。  
加上CPU本身的执行频率有限，就会造成页面渲染缓慢。因此在手机上，会发现当页面出现大量的渲染变化的时候，会出现卡顿现象。  
比如长列表滑动，页面切换动画等等。这些条件都限制了HTML5的功能发挥，因此在涉及到动态变化的时候，更加需要小心处理。  


#### 键盘

键盘也是和PC不同之处，在刚刚做手机Web开发的时候，会经常忘记的。  
由于现在的手机使用了软键盘，因此软键盘在某些时候，会成为页面的一部分。  
键盘是一个非常特别的设备，说特别是因为，不同的手机对于键盘对于html页面的布局的实现不同。  
下面通过以下几个方面，阐述手机键盘的特点：  


* 键盘的布局 由于手机界面非常小，因此键盘会占住手机屏幕的一大部分，对于键盘对html的页面布局影响，如果从来没有做过的人，也许不会注意到，android和ios的处理方式，android中各个厂商处理的方式又有所不同。  
  ios对于从下方推出键盘的时候，如果输入控件在页面推出之后，在键盘的高度的上方的话，则键盘是以一个浮层的方式弹出，并且将那个触发的控件推到键盘的上方。  
  如果那个控件在页面底部，如果推出的键盘会覆盖该控件，系统会将整个页面向上推，直到将那个控件推到键盘上方为止。  
  而android的实现的不同，有部分的android的实现和ios一样，有些android的机型的实现却不同，如果发现触发的input控件比键盘的高度底的时候，会自动将整个document的高度增加，增加到这个控件的高度超过键盘的高度为止。  
  由于实现的不同，会造成以下两个问题:  
  - 对于某些js模拟弹窗类型，会造成定位问题。  
    一个比较经典的案例，就是toast的提示，toast会出现在手机靠底部的位置，通常使用的是fixed的属性，如果按照ios的方式，将整个文档往上推，则不会出现问题，不过如果是将整个document动态增高，就会出现toast出现在键盘的下面，位置不好的话，会正好出现在键盘的中间，由于键盘是在整个浏览器的上层，因此通过z-index的方式是无法将定位的元素覆盖在键盘之上的。解决方案是出现toast的时候，监听所有控件的事件，出现focus的时候，动态计算当前的位置，重新设置。  
  - 如果触发的input在过于复杂的布局中，某些android机在计算input的实际位置的时候，会出现计算错误，特别是通过css设置过trasnlate等高级特性的时候，曾经碰到一个机器，由于计算的错误，键盘弹起的时候，没有将input框拉伸到键盘的上方，完全被键盘盖住，造成输入问题。因此，由于各种比较龊的android的手机存在的时候，input竟可能不要嵌入过于复杂的层次中，加上比较复杂的css的位置属性，以免造成计算错误。  
* 键盘的类型 在手机上有各种键盘类型，比较常用的键盘有全键盘，数字键盘，符号键盘，email键盘，搜索键盘，金额键盘，电话键盘等。不过由于web的限制，能真正使用的可以说非常的有限，并且在ios和android上的实现不同。而且弹出的键盘类型也不禁相同。这个在下述input有详述，这个就不重复说了。总结一句话，键盘的弹起，完全依赖系统和厂商的实现。键盘的类型是无法定制的。  
* 键盘的事件 弹起和收起键盘。这个也是非常纠结的问题。在ios6之前，当控件获得focus的时候，如果不是用户触发的事件，键盘是不会弹起的，在ios6之后，设置了一个属性可以做到，在android上，只要不是用户触发的事件都无法触发。暂时还没有解决方案。键盘的收起，可以通过js的blur的方式来实现。  

#### 页面滚动

页面滚动是非常常用的功能，不过在原生手机上，无法支持局部滚动的，不过ios5之后，出现了一个支持局部滚动的CSS属性，  
`-webkit-overflow-scrolling`: touch的属性，不过里面有一定的缺陷，在某些滚动中，会失效，因此建议不使用。  
就页面需要说一个非常的规则，因为这个会直接影响web的开发。就是在页面进行惯性滑动的时候（手指松开的滑动），处于性能的考虑，浏览器是会把页面上的渲染进行锁定的状态。也就说，当页面进行滑动的时候，js动态修改上面的元素是无效的。直到页面滚动停止，这是个非常特殊的规则。在IOS和android上都会存在，在ios上显得突出。在日常评估的时候，一定需要这个特性，这个特性决定了某些滑动中的功能是无法实现的，比如说某个元素到某个位置从static编程fixed的状态，或者进行状态转换。在滑动的时候，即使js动态设置了，页面也不会响应，直到滚动结束。因此在native中很多触摸控制的效果，在web上却无法完美实现。  

> 附注：对于ios的滚动的系统细节实现可以参考此地址:
> http://www.iunbug.com/archives/2012/09/19/411.html

页面滚动有个其他的问题，就是在ios的系统里，就算网页头了，还能继续往上面拉，有一个力反馈的效果，并且这个效果是无法取消的，看上去很酷和很美。但是在实际项目中，几乎是用不到这个看上去很美的效果，反而会造成很奇怪的感觉，特别是做成webapp的时候，一个完整的界面有导航头的时候，还能在往上拉动，极其诡异的感觉对于用户而言。并且这个滚动是系统实现的，没有方法去除，因此判断一个app是web还是native的，就可以通过这种方式来判断，拉到顶，再往上拉，如果能网上拉，并且出现的不是上拉刷新，而是一个ios的默认背景，则就是web了，不过反之不一定是native，因为web可以直接禁用滚动，通过css3或js来实现模拟滚动，不过这类滚动会造成很严重的性能问题，特别是对整个长页面的滚动。  


#### 模态窗口

模态窗口在项目中也是非常常用的一种功能，模态窗口可以通过js的alert、confirm等调用，不过移动模态的窗口，有一个问题，就是在模态窗口的头部，会出现当前url的地址，并且无法去除，这个在交互的眼中，是无法接受的。因此模态窗口，在实际场景中，使用的较少。大家在今后评估项目的时候，需要注意。  


## HTML

<div class="entry-content">
    <h3 id="meta的viewport">
        meta的viewport
    </h3>
    <p>
        在无线Web开发中，在head头部遇到最常见的问题，就是viewport的设置
    </p>
    <pre>
        &lt;meta name="viewport" content="width=device-width, initial-scale=1.0,
        maximum-scale=1.0, minimum-scale=1.0, user-scalable=0"/&gt;
    </pre>
    <p>
        对于这里面的设置，大家可以Google一下，有非常详细的叙述，我这里不太重复,以下有几个地址，大家可以做下参考
        <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag"
        target="_blank">
            https://developer.mozilla.org/en-US/docs/Mozilla/Mobile/Viewport_meta_tag
        </a>
        <a href="https://developer.apple.com/library/safari/documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html"
        target="_blank">
            https://developer.apple.com/library/safari/documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html
        </a>
        等，其实更加具体的，大家可以再overstackflow或者google进行查询。
    </p>
    <p>
        最佳实践：
    </p>
    <ul>
        <li>
            一般情况下，在所有无线页面的头部，都要加上此viewport的设置，如果不加上此数值，会造成在某些webkit游览器中，游览器会根据自身的某些判断，自行做放大、缩小等，造成页面无法正常访问，特别是某些app中嵌入了webkit游览器来进行访问的时候，
            会出现以上所说的情况，因此为了保证你说设计的网页在所有手机中显示保持一致，加上此设置
        </li>
        <li>
            viewport中的设置数值一般不需要进行修改，因为现在的数值已经满足了绝大多数项目，当然会出现在非常特殊的页面里，需要用户进行手动缩放的操作，不过如果修改了数值，需要在不同的手机上进行详细的测试，否则会有你预期外的事情发生。
        </li>
    </ul>
    <p>
        <strong>
            HTML5的标签使用
        </strong>
    </p>
    <p>
        在无线Web的开发中，大家会经常使用HTML5的tag标签，对于HTML5的大多数标签使用起来不会遇到问题， 比如说nav、footer、article等标签，这些展示型的标签一般可以安全使用，如果不是非常确定某个HTML5标签是否可以使用，建议参考
        <a href="http://caniuse.com/。" target="_blank">
            http://caniuse.com/。
        </a>
    </p>
    <h3 id="input标签">
        input标签
    </h3>
    <p>
        此类标签是非常特殊的标签，因为这个是和用户交互最紧密的一类标签，也是问题最多的一类标签。 IOS和Android在HTML5标签上最大的区别莫过于input类型的标签，并且不同Android机对于input类型的实现也大有不同，同时不同的类型的input，会弹出不同的键盘类型，特别是ios。一般在开发过程中常常会碰到需要弹出键盘的需求，以下可以做参考。这些控件的一个比较重要的特点是交互界面由浏览器实现，无法通过css、html来进行定制，因此对于日常评审交互搞、视觉稿的需求的时候，一定要非常谨慎，可能多一个逗号，都是修改不了的。
        下面列出比较保险的几个类型：
    </p>
    <ul>
        <li>
            text:文本 此类型说明输入框为文本信息,对应的键盘而言，Android和ios都会弹出全键盘。
        </li>
        <li>
            passsword：密码 在手机上和PC上的交互有所不同，这个需要注意
        </li>
        <li>
            button、checkbox、radio、reset、submit等 这些控件都可以使用，不过需要注意在Android和ios的手机上，控件的样式会所有不同，如果想完全掌控样式，需要reset一下-webkit-appearance:none，之后在设置自己需要的样式。
        </li>
    </ul>
    <p>
        需要谨慎使用的类型：
    </p>
    <ul>
        <li>
            email、search、tel、url等类型，这些标签的外观和text类型一致，除了search，会有圆角。最主要的区别在于弹出的键盘，对于ios而言，由于其html5规范支持的较好，因此基本都能弹出其指定的键盘。不过非常遗憾，没有money类型，因此无法弹出ios的money键盘。对于Android就比较杯具，由于各个厂商对于html5的规范支持不统一，造成对于以上的类型，弹出的键盘根绝各种机型的不同而不同。
        </li>
        <li>
            file类型是相当特殊的类型标签，对于ios而言，它已经实现file，不过它唤起的文件现在只有在照片集里的图片文件，在ios7的版本里，还实现了拍照和录像功能，不过在7.0.3里有bug，程序会闪退。对于android里如果使用的是浏览器，file类型的文件选择，会唤起浏览器实现的文件选择，不过文件的选择不同的手机，具体实现不同，web无法控制。如果在android
            app里使用webkit的方式，需要android的webkit实现私有api接口，才能实现file选择上传，这个大家可以通过google查看。
        </li>
        <li>
            date类型，这个也是在手机web开发中非常常用的一个控件，对于这个控件在使用上，需要注意，在ios平台上，由于ios7进行了大规模的平面化设计，因此在ios7和之前的系统，系统弹出的控件界面和交互是不同的，这个需要注意，并且在ios3没有实现date类型。Android对于date日期控件的实现非常碎片化，一般而言4.X,大厂商的手机游览器实现的较好。
        </li>
        <li>
            range、color、month、datetime、time、week由于受平台和手机的限制太多，不推荐使用。
        </li>
    </ul>
    <h3 id="js定制控件的问题">
        <strong>
            JS定制控件的问题
        </strong>
    </h3>
    <p>
        由于上述的问题，经常会收到这种需求，就是非常渴望去完整实现某个控件，在PC端，由于发展了很多年，机制较为完整，可以用js来模拟实现，不过在手机端，由于手机、平台等各方因素，使用js来模拟某个控件并不是一个明智之举。各种经验表明，使用js来模拟的控件，在某些机型和平台上会出现非常诡异而又无法解决的问题。
        <strong>
            因此对于JS定制控件，除非你有非常大的把握，否则不要轻易触碰
        </strong>
    </p>
    <h2 id="css3">
        CSS3
    </h2>
    <p>
        手机浏览器对于CSS3的支持，总体上支持的比较好，不过由于Android的碎片化，手机碎片化以及IOS的各种版本，在很多地方需要谨慎操作。
    </p>
    <p>
        如果说起手机Web的CSS，就需要说起-webkit-的前缀的CSS的属性。这些前缀是专门为了webkit核心的浏览器设置的属性，可能很多-webkit-的属性，已经成功通用的属性了，不需要再加前缀。不过为了兼容低版本的浏览器，在设置的时候，还是需要加上-webkit-前缀
    </p>
    <p>
        CSS3有很多类型，大致可以分为以下类型，布局类型、渲染类型、选择器类型、动画类型。
    </p>
    <h3 id="css-reset">
        CSS reset
    </h3>
    <p>
        在讲以上布局之前，需要说一下关于CSS的reset的问题。关于这个问题，需要追溯到HTML4的时代，在那个时候，由于PC有各种游览器、各种标准、造成对于HTML的各个标签所带的默认样式的不同，结果造成要在各个平台统一一个样式会非常难。因此出现了reset，所谓reset的意思是把所有HTML的标签的默认样式进行重置，这样方便在所有平台进行页面制作开发。跨入无线Web的时代之后，reset是否还要存在，业界有着非常多的讨论。主要分为两派：reset派和normalize派。reset派认为就算是到了移动时代，还是有各种碎片化的问题，需要reset，而normalize的一派认为，到了无线Web，很多规范已经收到了很多厂商的支持，最出名的要属Google和苹果，因此不需要进行reset，只需要将那些标签进行统一化，即可。
    </p>
    <p>
        因此，在市面上做移动开发，有两种CSS模式，reset模式和normalize的模式。个人认为，两者没有绝对的好与坏。主要看这个项目的特性。
    </p>
    <ul>
        <li>
            reset模式 适用于严格要求所有的平台必须完全按照统一的一个形态的进行开发的项目，一般而言，对于webapp的类型的项目，可能使用reset更加适合。reset模式也适合UI控件的编写，因为UI控件有着严格的标准，使用reset，可以更加好的进行精确控制。
        </li>
        <li>
            normalize模式 此模式适用于Web特性的网站，所谓Web特性的网站，是指那种适合各种平台，并且在不同的平台需要体验各平台自己特性的网站，不需要强制要求所有平台进行统一。
        </li>
    </ul>
    <p>
        不过就大多数项目而言，一般产品经理和交互都会要求在各个平台需要有个统一的产品表现，因此在实际项目里，reset可能用的会更多一点。
    </p>
    <h3 id="布局类型">
        布局类型
    </h3>
    <p>
        布局类型的CSS，是指这些属性影响着HTML的布局方式。HTML4最经典要属position、float等这些使用频率极高的属性，对于它的使用方式，估计无数文档已经有了，我这里不在不在复述。在以下介绍一种布局类型：flex。在以前的开发过程中，可能对于前端开发者而言，最痛苦的，莫过于水平布局，在table布局遭到唾弃之后，div的布局兴起，大量开始使用float的布局，不过使用float布局，也有其痛点，就是float的实现在不同游览器的实现，特别是IE系列中的
        6、7等，表现很诡异，需要非常多的trick，才能保证没问题。进入移动时代，可以使用flex布局。
    </p>
    <h4 id="flex">
        flex
    </h4>
    <p>
        对于flex的布局，大家可以网上进行google，这里不进行描述，对于flex的使用方式，到处都有，我这里所说的，是其中隐含的潜规则。
    </p>
    <ul>
        <li>
            flex的三个版本，flex有三个版本，分别对应于display: box、display: flexbox、display: flex，对于android和ios而言，使用box这种，以下是flex的不同版本对应的兼容性,做参考，对于详细参考，可参阅此篇文档。
        </li>
    </ul>
    <table>
        <thead>
            <tr>
                <th>
                    Chrome
                </th>
                <th>
                    Safari
                </th>
                <th>
                    firefox
                </th>
                <th>
                    Opera
                </th>
                <th>
                    IE
                </th>
                <th>
                    Android
                </th>
                <th>
                    iOS
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>
                    21+ (modern) 20- (old)
                </td>
                <td>
                    3.1+ (old)
                </td>
                <td>
                    2-21 (old) 22+ (new)
                </td>
                <td>
                    12.1+ (modern)
                </td>
                <td>
                    10+ (hybrid)
                </td>
                <td>
                    2.1+ (old)
                </td>
                <td>
                    3.2+ (old)
                </td>
            </tr>
        </tbody>
    </table>
    <ul>
        <li>
            flex的属性使用，在手机端使用flex的时候，尽可能使用比较少的属性，因为不是所有手机都实现了flex的所有属性，因此在使用的时候，建议仅使用flex这个属性，此属性基本满足了绝大多数的场景需求，对于其他的各种属性，如果一定要使用，建议在stackoverflow和google搜索一把，已确定它没有兼容性问题。
        </li>
        <li>
            flex的布局限制。当前flex无法满足所有的布局需求，对于以下的布局需求，flex是无法满足的，布局描述如下，多个列表项目，每个项目在水平上平均占满屏幕的宽度，并且每个项目的宽度固定，如果多个项目的和超过屏幕的宽度，自动将超出的项目下浮到下一行，继续进行水平从左到右的排列。这种布局方式，之前使用float的方式，可以解决，不过使用float无法无法进行
            一个水平上的项目对屏幕宽度再进行平均占满。对于以上的布局方式，现在界面的做法是，使用float的布局，加上响应式的方式再每个不同宽度的设置里，每个项目加上宽度百分比，项目中的元素水平居中来实现。
        </li>
    </ul>
    <h4 id="fixed">
        fixed
    </h4>
    <p>
        固定布局fixed可以说在PC上使用的非常多的一个属性，在手机上使用fixed属性，需要非常的谨慎小心。以下专门分两个平台详叙述：
    </p>
    <ul>
        <li>
            ios系统 fixed在ios5之后，才正式开始支持fixed的布局，在ios5之前，苹果处于性能上的考虑，并没有实现，因此在使用fixed的时候，需要注意你所做的项目对ios的版本最低支持的版本，不过即使ios5之后，开始支持fixed属性，在实际使用中，还是有很多小坑在，国外专门有个网页再说ios的fixed的问题。提供以下地址，可供参考：
            <a href="http://remysharp.com/2012/05/24/issues-with-position-fixed-scrolling-on-ios/"
            target="_blank">
                http://remysharp.com/2012/05/24/issues-with-position-fixed-scrolling-on-ios/
            </a>
            。比较安全的做法是，在固定的布局里面，尽可能保持里面的结构简单，不要出现过于复杂的布局，一般app的头部和尾部可以使用fixed属性。
        </li>
        <li>
            android系统 android系统在2.1之后，就已经开始支持fixed，不过由于各个厂商对于fixed的实现不同，2.1和2.2对于fixed的支持不是很好，在滚动的时候会出现闪动，消失、位移等各种渲染问题。2.3之后的版本，fixed的问题相对少一些，不过在个别厂商的手机上也会出现各种渲染问题。从4.x开始，fixed的表现比较好。因此如果在android上需要fixed的效果，需要综合评判其效果。
        </li>
    </ul>
    <h4 id="before，after">
        before，after
    </h4>
    <p>
        before，after 可以说用的最多的可能是这两个CSS属性。其具体的含义，可以参考各种文档，这里就不详细述说。这里说的是它的一般使用场景。before和after原先在w3c的定义中，主要在节点的前面和后面插入一段内容，因此在before和after中必须要有content的属性以及数值。不过在在实际项目中，通过它自动在节点前和后面插入一个节点，通常不会插入一个文字，而是一个绝对定位的图标之类的元素。虽然这个实现在html中加个结构可以实现，不过通过before和after来插入的节点，有个好处，就是能是html的结构显得更加精简和语义化更加强。不过带来的不便之处，就是进行问题的排查，因此无法直接通过查看html结构查看before和after的元素类型。不过现代游览器自带的debugger工具，都能够进行查看，问题不是很大。因此对于这两个伪类，推荐大家使用。
    </p>
    <h3 id="渲染类型">
        渲染类型
    </h3>
    <p>
        渲染类型是指该类型的主要的功能是在渲染html结构上，说的通俗一点，就是在结构上加上各种颜色，尺寸。可以说CSS的一大部分做的都是这些事情，渲染类型按照不同的角度，可以分为很多种类型，不过以下从维度的区分，2D和3D。
    </p>
    <h4 id="2d渲染">
        2D渲染
    </h4>
    <p>
        绝大多数的CSS的属性都属于2D的渲染。由于在CSS3中加入大量的有用的2D渲染的属性，以前需要使用图片才能实现的效果，现在通过CSS的设置也可以实现，以下主要说明比较常用的属性，以及使用注意点。
    </p>
    <ul>
        <li>
            border-radius 圆角类型 这是个非常常用的CSS的类型，几乎在所有的项目多多少少都会用到，以前在html4的时代，实现圆角是一件很费劲的事情，css3带来的属性可以很好地解决圆角问题。不过在实际使用圆角的时候，需要注意，在ios上面，实现的比较完美。
            <strong>
                在Android上，需要注意，很多机型，对于圆角的渲染处理并没有达到一个理想的状态，特别是处理圆角和直线的连接，在圆角的半径设置比较小（1-3像素）的时候，不是很明显。不过当超过4像素的时候，在部分机型上，会出现明显的圆角的边缘和直接差半个像素的问题。如果半径超大（&gt;10px)的时候，圆角会有非常明显的锯齿。因此对于大半径的圆角，不推荐使用border-radius，建议使用border-image来实现
            </strong>
            。
        </li>
        <li>
            box-shadow 盒模型阴影，此属性使用一般不会太大的问题，至今还没有发现非常大的问题，可以比较放心的使用。不过有些Android低端低版本机不支持box-shadow，这个需要注意一下，不过问题不大，因为大部分对于盒阴影不会特别明显，用户一般不会特别注意。
        </li>
        <li>
            text-shadow 文字阴影 文字阴影在手机web上基本都支持，可以使用，不过有一点需要注意，在android 2.3以及之前的版本，在blur
            radious为0的时候，文字阴影会失效，需要注意。
        </li>
        <li>
            linear-gradient 线性渐变其本身不是CSS的属性，而是属性下面的数值，一般用在background的属性里比较多，使用线性渐变需要注意,有很多种线性渐变的表达方式，对于不同的手机、版本也会有所不同。在手机web上面，使用这种格式比较安全，-webkit-gradient(linear,
            left top, left bottom, from(), to())
        </li>
        <li>
            border-image 在日常的使用中，border-image是一个相当使用的属性，其主要的用途，是进行图片的拉伸，具体的使用方法，可以在网上自行搜索一下，估计里面会有这样一个问题，就是如果一个图片被拉伸到一定宽度之后，四个角的图片那里会有变形，这个在部分android机上发现的，不过此类机型不是很多，不过还是需要注意。
        </li>
    </ul>
    <h4 id="3d渲染">
        3D渲染
    </h4>
    <p>
        3D渲染是个非常cool的属性，它能将页面上的元素进行3D化的渲染，实现各种非常炫酷的效果。不过由于其非常的先进性，所以能支持3D的属性的机型、版本、厂商也会有很多的不同。因此这里说3D，并不是要使用3D里面的属性，而是使用其特性。
    </p>
    <p>
        从实践的角度来看，3D的最大的好处，它使用了硬件加速功能，虽然可能直接使用它的各种属性有困难，但是它却给我们一个很多的硬件加速特性支持。因此在做页面动画的时候，即使不是做3D的变化，却可以通过3D的设置开启硬件加速功能。使用
        translateZ(0)；可以是当前的节点开启硬件加速功能，又不会带来任何的渲染变化。
        <strong>
            这里很多人会认为使用2D的动画会开启硬件加速，其实不是，必须使用3D，才会开启，这个需要注意
        </strong>
    </p>
    <h3 id="选择器类型">
        选择器类型
    </h3>
    <p>
        CSS3提供了大量新的选择器，使得选择一个节点变得非常简单，CSS3的选择器很多，大多数在手机里都支持，不过对于日常项目的开发，以下的几种类型会非常常用的，大家可以做参考，对于其他的选择器，可以参考网上。
    </p>
    <h4 id="first-child、last-child">
        first-child、last-child
    </h4>
    <p>
        这个也是非常常用的伪类，特别是用在布局中，有一个非常的经典的场景，就是一个列表，要求一个列表项的上边和组后一个列表项的下边是圆角。之前如果需要实现的话，需要额外增加class来实现的。如果使用这些伪类的话，就非常的简单。
    </p>
    <h4 id="属性选择器">
        属性选择器
    </h4>
    <p>
        在诸多的CSS选择器中，属性选择器是个非常好用的一个类型，比较常用的一种场景是input的样式修改，因此input的属性比较丰富，针对具体某一类的input类型的样式修改，如果通过以前的方式，只能通过增加class的名字。现在使用属性选择器后，代码量和复杂度会大幅度降低。
    </p>
    <h3 id="动画类型">
        动画类型
    </h3>
    <p>
        动画类型是CSS3中一个比较有用的一种类型，它可以实现节点的动画效果，配合js，可以让其动画变得非常的丰富。不过对于如果正确使用动画上，也需要处处小心，最关键的是性能问题。
    </p>
    <p>
        很多在PC上没有的性能问题，一旦到手机上就会变得非常的明显。其中动画就是。由于网页的DOM的特性，动画是非常消耗性能的，再加上网页是单进程单线程的，因此所有的程序运行都会在一根ui线程里运行。手机上的性能还没有达到PC上的性能，因此动画的性能问题在手机上显得异常突出。
    </p>
    <p>
        就算今后手机双核、四核也不会根本改变这个现状，其主要原因是单线程，即使有多个CPU，同一个时间也只能用一个CPU，如果要彻底提高性能，现在一个可能的方案是使用webworker，建立多线程的方式。不过支持webworker的手机并不是很多。所以近阶段性能永远是动画的一个痛。
    </p>
    <p>
        不过不用过于悲观，也不是不能使用，但是在使用上，需要小心谨慎，可以准从以下标准（没有绝对也没有一定，看实际效果）
    </p>
    <ul>
        <li>
            动画触发的reflow要尽可能小
        </li>
        <li>
            动画尽可能使用absolute的方式
        </li>
        <li>
            动画的区域尽可能小，并且里面的结构要简单
        </li>
        <li>
            文字的动画性能消耗较小，图片次之，复杂结构最耗性能（比如说html嵌套n层结构，里面包含float，flex等复杂布局）
        </li>
        <li>
            不推荐使用3D动画，各种厂商的实现差异很大
        </li>
        <li>
            不推荐整个页面的动画，比如说模拟native的整页切换效果
        </li>
        <li>
            动画的话尽可能使用CSS而不是JS，如果使用JS的话，推荐使用webkitRequestAnimationFrame的方式(如果支持的话)，具体如何使用，请大家自己google
        </li>
        <li>
            对于动画的节点，开启硬件加速 translateZ(0)
        </li>
        <li>
            动画的时间不宜过长，经验来看500ms-1s，就差不多了，时间越长，其性能问题越明显
        </li>
    </ul>
    <p>
        以上是使用前的注意点，如果已经确定都没有问题的话，开始进入正题。一般使用2D动画，主要会使用以下两个属性，transition和animation。
    </p>
    <ul>
        <li>
            transition 这个属性在手机web的各个平台上支持的比较好，不过需要加上webkit的前缀，已保证在老机型上没有兼容性问题。transition可以进行动画变化的CSS的属性比较多，width，height，color，background等都可以支持。如果不是很确认的话，可以设置成all。
        </li>
    </ul>
    <p>
        不过在使用的时候，需要注意以下几点：width和height,如果设置成auto的话，动画变化会比较诡异，建议动画起始都是具体的像素或者百分比。background如果变化的是图片的话，图片切换的效果并不是非常理想，避免对不同的图片进行变化，不过可以考虑使用background
        position，进行位置的变化。
    </p>
    <ul>
        <li>
            animation 这个属性的手机浏览器基本都兼容，不过在低版本需要加上-webkit的前缀，animation适合用在需要重复触发的动画上面。
        </li>
    </ul>
    <p>
        从实践的角度来看，transition和animation使用的场景不太一样，transition适合用在短而小的动画上面，animation适合用在会不断重复的场景里。在使用动画动画的时候，需要注意几件事情：
    </p>
    <ol>
        <li>
            动画不一定触发，在css的某些设置的时候，会发现动画无法实现，特别是快速切换的时候，会发现所设置的动画强制跳过
        </li>
        <li>
            动画出现断帧的现象，即看到的动画卡，发生断帧一般处于以下几种原因
            <ol>
                <li>
                    动画期间，发生垃圾收集，这个时候整个页面会强制停顿数百毫秒，对于这种原因，没啥办法，因为页面无法控制垃圾回收机制，因此动画不要太长时间，否则遇到的几率就会变高
                </li>
                <li>
                    多段动画发生，由于单线程的原因，当一段动画在播放时，如果出现另外一段动画，势必就将当前的动画渲染暂停，因此在同一个时间段内，不适合多个地方出现不同的动画
                </li>
                <li>
                    在动画播放期间，发生了js的操作，这种情况一般出现在js之前有通过setTimeout或者setInterval的方式，进行异步的程序，特别是在ajax的场景下，会发生。想象一下，在ajax获取数据的时候，会出现一个loading图标，当remote的数据到来时，js会进行很多操作，数据格式化，组合模板，渲染部分页面，这些都会影响loading的动画，如果loading是用动画实现。
                </li>
                <li>
                    在发生动画的时候，系统发生某种事件，或者手机内其他后台程序突然使用了大量的CPU的时间，也会造成卡顿。不过这种情况，随着手机的性能的改善，发生率会降低。
                </li>
            </ol>
        </li>
        <li>
            动画需要准备时间，这个听起来好像不可思议，不过确实需要，在PC上，由于硬件性能非常强劲，准备时间非常少吗，不过在手机上，就是另外一个天地。
            举个简单的例子，对某个元素做一个45度的旋转，一般的做法是在这个元素上加上初始化class，比如说角度初始化为0，然后加上结束class，即角度为45度，由于设置了transition，渲染引擎会自动将0度转到45度。不过在某些手机上会发生这个元素，没有动画，突然跳转到45度。其原因在于，当用js设置初始化0度的时候，浏览器引擎需要将这个元素进行初始化的设置，这个时间非常短，不过还是需要时间的，比如说10ms。
            如果在js的后面的语句马上加上结束的class，如果这句语句只用了8ms，也就是说游览器还没有为前面一个元素加上动画的时候，后一个class已经到了。这个时候，就会强制将css设置为结束的属性。因此一般在使用动画的时候，会人为将结束的class通过setTimeout晚几十ms加上。具体几十ms看动画的时间而定。
        </li>
        <li>
            无论是transition还是animation在w3c里的定义里有动画结束时触发的事件，不过有时候，这个事件是不会触发的。根据实践来看，在以下几种情况下可能不会触发：
            <ol>
                <li>
                    当前节点的一个动画还没结束吗，另外一个动画马上设置，之前的动画结束事件有时候会消失，其具体原因不明
                </li>
                <li>
                    如果当前节点动画，因为准备时间太长，而结束属性已经设置，则不会触发动画结束事件
                </li>
                <li>
                    如果在动画期间，发生垃圾回收等其他事件所造成的时间超过其动画时间，动画结束事件可能不会发生
                </li>
            </ol>
        </li>
    </ol>
    <p>
        综上所述，在手机web上使用动画的时候，需要谨慎。
    </p>
    <h2 id="javascript">
        Javascript
    </h2>
    <h3 id="es5标准">
        ES5标准
    </h3>
    <p>
        智能手机对js的支持比较好，对于es5的规范支持的比较好，不过还是考虑到版本兼容性问题，以下列出一些在实践中检验通过的一些方法：
    </p>
    <ul>
        <li>
            JSON对象 JSON对象可以说是最频繁使用的一个对象，在PC时代，由于浏览器兼容性问题，常常会引用老道写的一个JOSN类库，不过在webkit的时代，除了ios3.1之外，其他版本系统都已经支持了JSON对象，ios3.1，估计只有非常小的市场，因此可以考虑忽略。因此JSON原生对象，可以直接拿来使用，在手机上。
        </li>
        <li>
            Array的一些方法 比如forEach，indexof，every，reduce等，都可以在手机web的开发中安全的使用
        </li>
        <li>
            Object对象 由于Object的es5对象方法使用的比较少，没有太多的兼容性的反馈，建议大家谨慎使用
        </li>
        <li>
            Date now是一个新方法，不过不是所有的系统版本都支持,建议谨慎使用，可以使用getTime来替代，实现的代码量很少
        </li>
    </ul>
    <h3 id="dom选择器">
        DOM选择器
    </h3>
    <p>
        html5为了我们提供了一个非常好的DOM选择器，就是document.querySelector和document.querySelectorAll这两个方法，这两个方法在android2.1+以及ios3+以后，都可以使用，其接受的参数为css选择器。在实际web开发中，有一部大部分工作会用到DOM的操作，通过这个神器，可以解决大多数的DOM的操作。建议大家使用的时候，可以多多使用这两个方法。
    </p>
    <p>
        其他的DOM的选择器的兼容性并不是太好，建议不要使用。
    </p>
    <h3 id="zepto">
        Zepto
    </h3>
    <p>
        对于jquery大家应该会非常的熟悉，在web手机上也有一个轻量级的类库工具，那就是Zepto，它的很多api接口保持和jquery的接口兼容，其体积非常小，gzip的包在10k左右，非常适合在手机上的无线环境中加载。建议大家在使用类库的时候，推荐使用，其api地址为:
        <a href="http://zeptojs.com/" target="_blank">
            http://zeptojs.com/
        </a>
    </p>
    <h3 id="click的300ms延迟响应">
        click的300ms延迟响应
    </h3>
    <p>
        说到移动开发，不得不说一下这个click事件，在手机上被叫的最多的就是点击的反应慢，就是click惹出来的事情。情况是在这样，在手机早期，浏览器有系统级的放大和缩小的功能，用户在屏幕上点击两次之后，系统会触发站点的放大/缩小功能。不过由于系统需要判断用户在点击之后，有没有接下来的第二次点击，因此在用户点击第一次的时候，会强制等待300ms，等待用户在这个时间内，是否有用户第二次的提交，如果没有的话，就会click的事件，否则就会触发放大/缩小的效果。
    </p>
    <p>
        这个设计本来没有问题，但是在绝大多数的手机操作中，用户的单击事件的概率大大大于双击的，因此所有用户的点击都必须要等300ms，才能触发click事件，造成给用户给反应迟钝的反应，这个难以解决。业界普遍解决的方案是自己通过touch的事件完成tap，替代click。不过tap事件来实际的应用中存在下面所说的问题。
    </p>
    <p>
        不过有个好消息，就是手机版chrome21.0之后，对于viewport width=device-width，并且禁止缩放的设置，click点击将取消300ms的强制等待时间，这个会是web的响应时间大大提升。ios至今还没有此类消息。不过这个还需要有一段时间。
    </p>
    <h3 id="移动事件">
        移动事件
    </h3>
    <p>
        javascript有很多用户交互相关事件，在移动上有一些比较特有的事件，大家在日常开发中，可能会接触到，这些事件的特性，这里说一下：
    </p>
    <ul>
        <li>
            orientationchange 这个事件是在当设备发生旋转的时候，发生的事件。这个在某些场合会非常的实用。
        </li>
        <li>
            touchstart、touchmove、touchend、touchcancel等四个触摸事件，在所有移动web的中，都支持这四个事件。通过这两个事件，可以模拟出各种用户的手势，不过由于其处理比较复杂，可能模拟最多的是tap事件。很多web移动类库，都有tap的事件的实现，不过从实践中，tap都不是处理的很好，tap的主要问题，有两个，一个是tap和滚动同时触发的时候，往往会触发tap事件，二是tap的敏感度，经常会失误触发tap。
        </li>
        <li>
            scroll事件 这个事件在PC上的触发时机和手机上的触发时机不同，scroll事件在手机上，只有在滚动停止的时候才会发生,因此这个事件在移动端用的比较少，因为触发的时机已经晚了。对于需要在移动中，改变页面结构的功能，用scroll是无法完成的。
        </li>
    </ul>
    <h2 id="基础知识">
        基础知识
    </h2>
    <h3 id="meta标签">
        meta标签
    </h3>
    <p>
        meta标签，这些meta标签在开发webapp时起到非常重要的作用
    </p>
    <pre>
        &lt;meta content="width=device-width; initial-scale=1.0; maximum-scale=1.0;
        user-scalable=0" name="viewport" /&gt; &lt;meta content="yes" name="apple-mobile-web-app-capable"
        /&gt; &lt;meta content="black" name="apple-mobile-web-app-status-bar-style"
        /&gt; &lt;meta content="telephone=no" name="format-detection" /&gt;
    </pre>
    <p>
        第一个meta标签表示：强制让文档的宽度与设备的宽度保持1:1，并且文档最大的宽度比例是1.0，且不允许用户点击屏幕放大浏览； 尤其要注意的是content里多个属性的设置一定要用分号+空格来隔开，如果不规范将不会起作用。
    </p>
    <p>
        注意根据
        <a href="http://www.weibo.com/avajayam" title="ava" target="_blank">
            public_00
        </a>
        提供的资料补充，content 使用分号作为分隔，在老的浏览器是支持的，但不是规范写法。
    </p>
    <p>
        规范的写法应该是使用逗号分隔，参考
        <a href="http://developer.apple.com/library/safari/#documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html"
        target="_blank">
            Safari HTML Reference - Supported Meta Tags
        </a>
        和
        <a href="http://developer.android.com/guide/webapps/targeting.html" target="_blank">
            Android - Supporting Different Screens in Web Apps
        </a>
    </p>
    <p>
        其中：
    </p>
    <ul>
        <li>
            width - viewport的宽度
        </li>
        <li>
            height - viewport的高度
        </li>
        <li>
            initial-scale - 初始的缩放比例
        </li>
        <li>
            minimum-scale - 允许用户缩放到的最小比例
        </li>
        <li>
            maximum-scale - 允许用户缩放到的最大比例
        </li>
        <li>
            user-scalable - 用户是否可以手动缩放
        </li>
    </ul>
    <p>
        第二个meta标签是iphone设备中的safari私有meta标签，它表示：允许全屏模式浏览； 第三个meta标签也是iphone的私有标签，它指定的iphone中safari顶端的状态条的样式；
        第四个meta标签表示：告诉设备忽略将页面中的数字识别为电话号码
    </p>
    <p>
        在设置了initial-scale=1 之后，我们终于可以以1:1 的比例进行页面设计了。 关于viewport，还有一个很重要的概念是：iphone
        的safari 浏览器完全没有滚动条，而且不是简单的“隐藏滚动条”， 是根本没有这个功能。iphone 的safari 浏览器实际上从一开始就完整显示了这个网页，然后用viewport
        查看其中的一部分。 当你用手指拖动时，其实拖的不是页面，而是viewport。浏览器行为的改变不止是滚动条，交互事件也跟普通桌面不一样。 (请参考：指尖的下JS
        系列文章)
    </p>
    <p>
        更详细的 viewport 相关的知识也可以参考
    </p>
    <p>
        <a href="http://www.w3cplus.com/css/A-pixel-is-not-a-pixel-is-not-a-pixel.html"
        title="pixel" target="_blank">
            此像素非彼像素
        </a>
    </p>
    <h2 id="移动开发事件">
        移动开发事件
    </h2>
    <p>
        <a href="http://wo.poco.cn/manson/post/id/268780" target="_blank">
            手机浏览器常用手势动作监听封装
        </a>
    </p>
    <h3 id="手势事件">
        手势事件
    </h3>
    <ul>
        <li>
            touchstart //当手指接触屏幕时触发
        </li>
        <li>
            touchmove //当已经接触屏幕的手指开始移动后触发
        </li>
        <li>
            touchend //当手指离开屏幕时触发
        </li>
        <li>
            touchcancel
        </li>
    </ul>
    <h3 id="触摸事件">
        触摸事件
    </h3>
    <ul>
        <li>
            gesturestart //当两个手指接触屏幕时触发
        </li>
        <li>
            gesturechange //当两个手指接触屏幕后开始移动时触发
        </li>
        <li>
            gestureend
        </li>
    </ul>
    <h3 id="屏幕旋转事件">
        屏幕旋转事件
    </h3>
    <ul>
        <li>
            onorientationchange
        </li>
    </ul>
    <h3 id="检测触摸屏幕的手指何时改变方向">
        检测触摸屏幕的手指何时改变方向
    </h3>
    <ul>
        <li>
            orientationchange
        </li>
    </ul>
    <h3 id="touch事件支持的相关属性">
        touch事件支持的相关属性
    </h3>
    <ul>
        <li>
            touches
        </li>
        <li>
            targetTouches
        </li>
        <li>
            changedTouches
        </li>
        <li>
            clientX　　　　// X coordinate of touch relative to the viewport (excludes
            scroll offset)
        </li>
        <li>
            clientY　　　　// Y coordinate of touch relative to the viewport (excludes
            scroll offset)
        </li>
        <li>
            screenX　　　 // Relative to the screen
        </li>
        <li>
            screenY 　　 // Relative to the screen
        </li>
        <li>
            pageX　　 　　// Relative to the full page (includes scrolling)
        </li>
        <li>
            pageY　　　　 // Relative to the full page (includes scrolling)
        </li>
        <li>
            target　　　　 // Node the touch event originated from
        </li>
        <li>
            identifier　　 // An identifying number, unique to each touch event
        </li>
        <li>
            屏幕旋转事件：onorientationchange
        </li>
    </ul>
    <h3 id="判断屏幕是否旋转">
        判断屏幕是否旋转
    </h3>
    <pre>
        function orientationChange() { switch(window.orientation) { 　　case 0:
        alert("肖像模式 0,screen-width: " + screen.width + "; screen-height:" + screen.height);
        break; 　　case -90: alert("左旋 -90,screen-width: " + screen.width + "; screen-height:"
        + screen.height); break; 　　case 90: alert("右旋 90,screen-width: " + screen.width
        + "; screen-height:" + screen.height); break; 　　case 180: 　　alert("风景模式
        180,screen-width: " + screen.width + "; screen-height:" + screen.height);
        　　break; };};
    </pre>
    <h3 id="添加事件监听">
        添加事件监听
    </h3>
    <pre>
        addEventListener('load', function(){ orientationChange(); window.onorientationchange
        = orientationChange; });
    </pre>
    <h3 id="双手指滑动事件：">
        双手指滑动事件：
    </h3>
    <pre>
        // 双手指滑动事件 addEventListener('load',　　function(){ window.onmousewheel =
        twoFingerScroll;}, false // 兼容各浏览器，表示在冒泡阶段调用事件处理程序 (true 捕获阶段) ); function
        twoFingerScroll(ev) { var delta =ev.wheelDelta/120; //对 delta 值进行判断(比如正负)
        ，而后执行相应操作 return true; };
    </pre>
    <h3 id="js-单击延迟">
        JS 单击延迟
    </h3>
    <p>
        click 事件因为要等待单击确认，会有 300ms 的延迟，体验并不是很好。
    </p>
    <p>
        开发者大多数会使用封装的 tap 事件来代替click 事件，所谓的 tap 事件由 touchstart 事件 + touchmove 判断
        + touchend 事件封装组成。
    </p>
    <p>
        <a href="https://developers.google.com/mobile/articles/fast_buttons?hl=de-DE"
        title="article5" target="_blank">
            Creating Fast Buttons for Mobile Web Applications
        </a>
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/12238587/eliminate-300ms-delay-on-click-events-in-mobile-safari"
        title="article5" target="_blank">
            Eliminate 300ms delay on click events in mobile Safari
        </a>
    </p>
    <h2 id="webkit-css">
        WebKit CSS:
    </h2>
    <p>
        <a href="http://ued.ctrip.com/blog/wp-content/webkitcss/index.html" target="_blank">
            携程 UED 整理的 Webkit CSS 文档
        </a>
        ，全面、方便查询，下面为常用属性。
    </p>
    <p>
        ①“盒模型”的具体描述性质的包围盒块内容，包括边界，填充等等。
    </p>
    <pre>
        -webkit-border-bottom-left-radius: radius; -webkit-border-top-left-radius:
        horizontal_radius vertical_radius; -webkit-border-radius: radius; //容器圆角
        -webkit-box-sizing: sizing_model; 边框常量值：border-box/content-box -webkit-box-shadow:
        hoff voff blur color; //容器阴影（参数分别为：水平X 方向偏移量；垂直Y 方向偏移量；高斯模糊半径值；阴影颜色值） -webkit-margin-bottom-collapse:
        collapse_behavior; 常量值：collapse/discard/separate -webkit-margin-start:
        width; -webkit-padding-start: width; -webkit-border-image: url(borderimg.gif)
        25 25 25 25 round/stretch round/stretch; -webkit-appearance: push-button;
        //内置的CSS 表现，暂时只支持push-button
    </pre>
    <p>
        ②“视觉格式化模型”描述性质，确定了位置和大小的块元素。
    </p>
    <pre>
        direction: rtl unicode-bidi: bidi-override; 常量：bidi-override/embed/normal
    </pre>
    <p>
        ③“视觉效果”描述属性，调整的视觉效果块内容，包括溢出行为，调整行为，能见度，动画，变换，和过渡。
    </p>
    <pre>
        clip: rect(10px, 5px, 10px, 5px) resize: auto; 常量：auto/both/horizontal/none/vertical
        visibility: visible; 常量: collapse/hidden/visible -webkit-transition: opacity
        1s linear; 动画效果 ease/linear/ease-in/ease-out/ease-in-out -webkit-backface-visibility:
        visibler; 常量：visible(默认值)/hidden -webkit-box-reflect: right 1px; 镜向反转 -webkit-box-reflect:
        below 4px -webkit-gradient(linear, left top, left bottom, from(transparent),
        color-stop(0.5, transparent), to(white)); -webkit-mask-image: -webkit-gradient(linear,
        left top, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)));; //CSS
        遮罩/蒙板效果 -webkit-mask-attachment: fixed; 常量：fixed/scroll -webkit-perspective:
        value; 常量：none(默认) -webkit-perspective-origin: left top; -webkit-transform:
        rotate(5deg); -webkit-transform-style: preserve-3d; 常量：flat/preserve-3d;
        (2D 与3D)
    </pre>
    <p>
        ④“生成的内容，自动编号，并列出”描述属性，允许您更改内容的一个组成部分，创建自动编号的章节和标题，和操纵的风格清单的内容。
    </p>
    <pre>
        content: “Item” counter(section) ” “; This resets the counter. First section
        &gt;two section three section counter-increment: section 1; counter-reset:
        section;
    </pre>
    <p>
        ⑤“分页媒体”描述性能与外观的属性，控制印刷版本的网页，如分页符的行为。
    </p>
    <pre>
        page-break-after: auto; 常量：always/auto/avoid/left/right page-break-before:
        auto; 常量：always/auto/avoid/left/right page-break-inside: auto; 常量：auto/avoid
    </pre>
    <p>
        ⑥“颜色和背景”描述属性控制背景下的块级元素和颜色的文本内容的组成部分。
    </p>
    <pre>
        -webkit-background-clip: content; 常量：border/content/padding/text -webkit-background-origin:
        padding; 常量：border/content/padding/text -webkit-background-size: 55px;
        常量：length/length_x/length_y
    </pre>
    <p>
        ⑦ “字型”的具体描述性质的文字字体的选择范围内的一个因素。报告还描述属性用于下载字体定义。
    </p>
    <pre>
        unicode-range: U+00-FF, U+980-9FF;
    </pre>
    <p>
        ⑧“文本”描述属性的特定文字样式，间距和自动滚屏。
    </p>
    <pre>
        text-shadow: #00FFFC 10px 10px 5px; text-transform: capitalize; 常量：capitalize/lowercase/none/uppercase
        word-wrap: break-word; 常量：break-word/normal -webkit-marquee: right large
        infinite normal 10s; 常量：direction(方向) increment(迭代次数) repetition(重复) style(样式)
        speed(速度); -webkit-marquee-direction: ahead/auto/backwards/down/forwards/left/reverse/right/up
        -webkit-marquee-incrementt: 1-n/infinite(无穷次) -webkit-marquee-speed: fast/normal/slow
        -webkit-marquee-style: alternate/none/scroll/slide -webkit-text-fill-color:
        #ff6600; 常量：capitalize, lowercase, none, uppercase -webkit-text-security:
        circle; 常量：circle/disc/none/square -webkit-text-size-adjust: none; 常量:auto/none;
        -webkit-text-stroke: 15px #fff; -webkit-line-break: after-white-space;
        常量：normal/after-white-space -webkit-appearance: caps-lock-indicator; -webkit-nbsp-mode:
        space; 常量： normal/space -webkit-rtl-ordering: logical; 常量：visual/logical
        -webkit-user-drag: element; 常量：element/auto/none -webkit-user-modify: read-
        only; 常量：read-write-plaintext-only/read-write/read-only -webkit-user-select:
        text; 常量：text/auto/none
    </pre>
    <p>
        ⑨“表格”描述的布局和设计性能表的具体内容。
    </p>
    <pre>
        -webkit-border-horizontal-spacing: 2px; -webkit-border-vertical-spacing:
        2px; -webkit-column-break-after: right; 常量：always/auto/avoid/left/right
        -webkit-column-break-before: right; 常量：always/auto/avoid/left/right –webkit-column-break-inside:
        logical; 常量：avoid/auto -webkit-column-count: 3; //分栏 -webkit-column-rule:
        1px solid #fff; style:dashed,dotted,double,groove,hidden,inset,none,outset,ridge,solid
    </pre>
    <p>
        ⑩“用户界面”描述属性，涉及到用户界面元素在浏览器中，如滚动文字区，滚动条，等等。报告还描述属性，范围以外的网页内容，如光标的标注样式和显示当您按住触摸触摸
        目标，如在iPhone上的链接。
    </p>
    <pre>
        -webkit-box-align: baseline,center,end,start,stretch 常量：baseline/center/end/start/stretch
        -webkit-box-direction: normal;常量：normal/reverse -webkit-box-flex: flex_valuet
        -webkit-box-flex-group: group_number -webkit-box-lines: multiple; 常量：multiple/single
        -webkit-box-ordinal-group: group_number -webkit-box-orient: block-axis;
        常量：block-axis/horizontal/inline-axis/vertical/orientation –webkit-box-pack:
        alignment; 常量：center/end/justify/start
    </pre>
    <p>
        动画过渡 这是 Webkit 中最具创新力的特性：使用过渡函数定义动画。
    </p>
    <pre>
        -webkit-animation: title infinite ease-in-out 3s; animation 有这几个属性： -webkit-animation-name：
        //属性名，就是我们定义的keyframes -webkit-animation-duration：3s //持续时间 -webkit-animation-timing-function：
        //过渡类型：ease/ linear(线性) /ease-in(慢到快)/ease-out(快到慢) /ease-in-out(慢到快再到慢)
        /cubic-bezier -webkit-animation-delay：10ms //动画延迟(默认0) -webkit-animation-iteration-count：
        //循环次数(默认1)，infinite 为无限 -webkit-animation-direction： //动画方式：normal(默认
        正向播放)； alternate(交替方向，第偶数次正向播放，第奇数次反向播放)
    </pre>
    <p>
        这些同样是可以简写的。但真正让我觉的很爽的是keyframes，它能定义一个动画的转变过程供调用，过程为0%到100%或from(0%)到to(100%)。简单点说，只要你有想法，你想让元素在这个过程中以什么样的方式改变都是很简单的。
    </p>
    <pre>
        -webkit-transform: 类型（缩放scale/旋转rotate/倾斜skew/位移translate） scale(num,num)
        放大倍率。scaleX 和 scaleY(3)，可以简写为：scale(* , *) rotate(*deg) 转动角度。rotateX 和
        rotateY，可以简写为：rotate(* , *) Skew(*deg) 倾斜角度。skewX 和skewY，可简写为：skew(* ,
        *) translate(*,*) 坐标移动。translateX 和translateY，可简写为：translate(* , *)。
    </pre>
    <h3 id="页面描述">
        页面描述
    </h3>
    <pre>
        &lt;link rel="apple-touch-icon-precomposed" href="http://www.xxx.com/App_icon_114.png"
        /&gt; &lt;link rel="apple-touch-icon-precomposed" sizes="72x72" href="http://www.xxx.com/App_icon_72.png"
        /&gt; &lt;link rel="apple-touch-icon-precomposed" sizes="114x114" href="http://www.xxx.com/App_icon_114.png"
        /&gt;
    </pre>
    <p>
        这个属性是当用户把连接保存到手机桌面时使用的图标，如果不设置，则会用网页的截图。有了这，就可以让你的网页像APP一样存在手机里了
    </p>
    <pre>
        &lt;link rel="apple-touch-startup-image" href="/img/startup.png" /&gt;
    </pre>
    <p>
        这个是APP启动画面图片，用途和上面的类似，如果不设置，启动画面就是白屏，图片像素就是手机全屏的像素
    </p>
    <pre>
        &lt;meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"
        /&gt;
    </pre>
    <p>
        这个描述是表示打开的web app的最上面的时间、信号栏是黑色的，当然也可以设置其它参数，详细参数说明请参照：
        <a href="https://developer.apple.com/library/safari/documentation/appleapplications/reference/SafariHTMLRef/Articles/MetaTags.html"
        target="_blank">
            Safari HTML Reference - Supported Meta Tags
        </a>
    </p>
    <pre>
        &lt;meta name="apple-touch-fullscreen" content="yes" /&gt; &lt;meta name="apple-mobile-web-app-capable"
        content="yes" /&gt;
    </pre>
    <h2 id="常见屏幕参数">
        常见屏幕参数
    </h2>
    <ul>
        <li>
            设备 分辨率 设备像素比率
        </li>
        <li>
            Android LDPI 320×240 0.75
        </li>
        <li>
            Iphone 3 &amp; Android MDPI 320×480 1
        </li>
        <li>
            Android HDPI 480×800 1.5
        </li>
        <li>
            Iphone 4 960×640 2.0
        </li>
    </ul>
    <p>
        iPhone 4的一个 CSS 像素实际上表现为一块 2×2 的像素。所以图片像是被放大2倍一样，模糊不清晰。
    </p>
    <p>
        解决办法：
    </p>
    <p>
        1、页面引用
    </p>
    <pre>
        &lt;link rel="stylesheet" media="screen and (-webkit-device-pixel-ratio:
        0.75)" href="ldpi.css" /&gt; &lt;link rel="stylesheet" media="screen and
        (-webkit-device-pixel-ratio: 1.0)" href="mdpi.css" /&gt; &lt;link rel="stylesheet"
        media="screen and (-webkit-device-pixel-ratio: 1.5)" href="hdpi.css" /&gt;
        &lt;link rel="stylesheet" media="screen and (-webkit-device-pixel-ratio:
        2.0)" href="retina.css" /&gt;
    </pre>
    <p>
        2、CSS文件里
    </p>
    <pre>
        #header { background:url(mdpi/bg.png); } @media screen and (-webkit-device-pixel-ratio:
        1.5) { /*CSS for high-density screens*/ #header { background:url(hdpi/bg.png);
        } }
    </pre>
    <h2 id="移动-web-开发技巧">
        移动 Web 开发技巧
    </h2>
    <h3 id="点击与click事件">
        点击与click事件
    </h3>
    <p>
        对于a标记的点击导航，默认是在onclick事件中处理的。而移动客户端对onclick的响应相比PC浏览器有着明显的几百毫秒延迟。
    </p>
    <p>
        在移动浏览器中对触摸事件的响应顺序应当是：
    </p>
    <pre>
        ontouchstart -&gt; ontouchmove -&gt; ontouchend -&gt; onclick
    </pre>
    <p>
        因此，如果确实要加快对点击事件的响应，就应当绑定ontouchend事件。
    </p>
    <p>
        使用click会出现绑定点击区域闪一下的情况，解决：给该元素一个样式如下
    </p>
    <pre>
        -webkit-tap-highlight-color: rgba(0,0,0,0);
    </pre>
    <p>
        如果不使用click，也不能简单的用touchstart或touchend替代，需要用touchstart的模拟一个click事件，并且不能发生touchmove事件，或者用zepto中的tap（轻击）事件。
    </p>
    <pre>
        body { -webkit-overflow-scrolling: touch; }
    </pre>
    <p>
        用iphone或ipad浏览很长的网页滚动时的滑动效果很不错吧？不过如果是一个div，然后设置
        <code>
            height:200px;overflow:auto;
        </code>
        的话，可以滚动但是完全没有那滑动效果，很郁闷吧？
    </p>
    <p>
        我看到很多网站为了实现这一效果，用了第三方类库，最常用的是iscroll（包括新浪手机页，百度等） 我一开始也使用，不过自从用了
        <code>
            -webkit-overflow-scrolling: touch;
        </code>
        样式后，就完全可以抛弃第三方类库了，把它加在body{}区域，所有的overflow需要滚动的都可以生效了。
    </p>
    <h3 id="锁定-viewport">
        锁定 viewport
    </h3>
    <pre>
        ontouchmove="event.preventDefault()" //锁定viewport，任何屏幕操作不移动用户界面（弹出键盘除外）。
    </pre>
    <h3 id="利用-media-query监听">
        利用 Media Query监听
    </h3>
    <p>
        Media Query 相信大部分人已经使用过了。其实 JavaScript可以配合 Media Query这么用：
    </p>
    <pre>
        var mql = window.matchMedia("(orientation: portrait)"); mql.addListener(handleOrientationChange);
        handleOrientationChange(mql); function handleOrientationChange(mql) { if
        (mql.matches) { alert('The device is currently in portrait orientation
        ') } else { alert('The device is currently in landscape orientation') }}
    </pre>
    <p>
        借助了 Media Query 接口做的事件监听，所以很强大！
    </p>
    <p>
        也可以通过获取 CSS 值来使用 Media Query 判断设备情况，详情请看：
        <a href="http://yujiangshui.com/use-javascript-css-media-queries-detect-device-state/"
        target="_blank">
            JavaScript 依据 CSS Media Queries 判断设备的方法
        </a>
        。
    </p>
    <h3 id="rem最佳实践">
        rem最佳实践
    </h3>
    <p>
        rem是非常好用的一个属性，可以根据html来设定基准值，而且兼容性也很不错。不过有的时候还是需要对一些莫名其妙的浏览器优雅降级。以下是两个实践
    </p>
    <ol>
        <li>
            <a href="http://jsbin.com/vaqexuge/4/edit" target="_blank">
                http://jsbin.com/vaqexuge/4/edit
            </a>
            这有个demo，发现chrome当font-size小于12时，rem会按照12来计算。因此设置基准值要考虑这一点
        </li>
        <li>
            可以用以下的代码片段保证在低端浏览器下也不会出问题
        </li>
    </ol>
    <pre>
        html { font-size: 62.5%; } body { font-size: 14px; font-size: 1.4rem;
        } /* =14px */ h1 { font-size: 24px; font-size: 2.4rem; } /* =24px */
    </pre>
    <h3 id="当前点击元素样式：">
        当前点击元素样式：
    </h3>
    <pre>
        -webkit-tap-highlight-color: 颜色
    </pre>
    <h3 id="检测判断-iphone-ipod">
        检测判断 iPhone/iPod
    </h3>
    <p>
        开发特定设备的移动网站，首先要做的就是设备侦测了。下面是使用Javascript侦测iPhone/iPod的UA，然后转向到专属的URL。
    </p>
    <pre>
        if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)))
        { 　　if (document.cookie.indexOf("iphone_redirect=false") == -1) { 　　　　window.location
        = "http://m.example.com"; 　　} }
    </pre>
    <p>
        虽然Javascript是可以在水果设备上运行的，但是用户还是可以禁用。它也会造成客户端刷新和额外的数据传输，所以下面是服务器端侦测和转向：
    </p>
    <pre>
        if(strstr($_SERVER['HTTP_USER_AGENT'],'iPhone') || strstr($_SERVER['HTTP_USER_AGENT'],'iPod'))
        { 　　header('Location: http://yoursite.com/iphone'); 　　exit(); }
    </pre>
    <h3 id="阻止屏幕旋转时字体自动调整">
        阻止屏幕旋转时字体自动调整
    </h3>
    <pre>
        html, body, form, fieldset, p, div, h1, h2, h3, h4, h5, h6 {-webkit-text-size-adjust:none;}
    </pre>
    <h3 id="模拟-hover伪类">
        模拟:hover伪类
    </h3>
    <p>
        因为iPhone并没有鼠标指针，所以没有hover事件。那么CSS :hover伪类就没用了。但是iPhone有Touch事件，onTouchStart
        类似 onMouseOver，onTouchEnd 类似 onMouseOut。所以我们可以用它来模拟hover。使用Javascript：
    </p>
    <pre>
        var myLinks = document.getElementsByTagName('a'); for(var i = 0; i &lt;
        myLinks.length; i++){ 　　myLinks[i].addEventListener(’touchstart’, function(){this.className
        = “hover”;}, false); 　　myLinks[i].addEventListener(’touchend’, function(){this.className
        = “”;}, false); }
    </pre>
    <p>
        然后用CSS增加hover效果：
    </p>
    <pre>
        a:hover, a.hover { /* 你的hover效果 */ }
    </pre>
    <p>
        这样设计一个链接，感觉可以更像按钮。并且，这个模拟可以用在任何元素上。
    </p>
    <h3 id="flexbox-布局">
        Flexbox 布局
    </h3>
    <p>
        <a href="http://jsbin.com/ibuwol/2/edit" title="article5" target="_blank">
            Flex 模板和实例
        </a>
    </p>
    <p>
        <a href="http://www.w3cplus.com/blog/666.html" title="article6" target="_blank">
            深入了解 Flexbox 伸缩盒模型
        </a>
    </p>
    <p>
        <a href="http://yehao.diandian.com/post/2013-09-15/40052216426" target="_blank">
            CSS Flexbox Intro
        </a>
    </p>
    <p>
        <a href="http://www.w3.org/TR/css3-flexbox/" target="_blank">
            http://www.w3.org/TR/css3-flexbox/
        </a>
    </p>
    <h3 id="居中问题">
        居中问题
    </h3>
    <p>
        居中是移动端跟pc端共同的噩梦。这里有两种兼容性比较好的新方案。
    </p>
    <ul>
        <li>
            <p>
                table布局法
            </p>
            <p>
                .box{ text-align:center; display:table-cell; vertical-align:middle; }
            </p>
        </li>
        <li>
            <p>
                老版本flex布局法
            </p>
            <p>
                .box{ display:-webkit-box; -webkit-box-pack: center; -webkit-box-align:
                center; text-align:center; }
            </p>
        </li>
    </ul>
    <p>
        以上两种其实分别是retchat跟ionic的布局基石。
    </p>
    <p>
        这里有更详细的更多的选择
        <a href="http://www.zhouwenbin.com/%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD%E7%9A%84%E5%87%A0%E7%A7%8D%E6%96%B9%E6%B3%95/"
        target="_blank">
            http://www.zhouwenbin.com/%E5%9E%82%E7%9B%B4%E5%B1%85%E4%B8%AD%E7%9A%84%E5%87%A0%E7%A7%8D%E6%96%B9%E6%B3%95/
        </a>
        来自周文彬的博客
    </p>
    <h3 id="处理-retina-双倍屏幕">
        处理 Retina 双倍屏幕
    </h3>
    <p>
        <a href="http://miekd.com/articles/using-css-sprites-to-optimize-your-website-for-retina-displays/"
        title="article5" target="_blank">
            （经典）Using CSS Sprites to optimize your website for Retina Displays
        </a>
    </p>
    <p>
        <a href="http://www.w3cplus.com/css/css-background-size-graphics.html"
        title="article5" target="_blank">
            使用CSS3的background-size优化苹果的Retina屏幕的图像显示
        </a>
    </p>
    <p>
        <a href="http://www.w3cplus.com/css/using-css-sprites-to-optimize-your-website-for-retina-displays.html"
        title="article5" target="_blank">
            使用 CSS sprites 来优化你的网站在 Retina 屏幕下显示
        </a>
    </p>
    <p>
        <a href="http://alexthorpe.com/uncategorized/css-sprites-for-retina-display-devices/683/"
        title="article5" target="_blank">
            （案例）CSS IMAGE SPRITES FOR RETINA (HIRES) DEVICES
        </a>
    </p>
    <h3 id="input类型为date情况下不支持placeholder（来自于江水）">
        input类型为date情况下不支持placeholder（来自于江水）
    </h3>
    <p>
        这其实是浏览器自己的处理。因为浏览器会针对此类型 input 增加 datepicker 模块。
    </p>
    <p>
        对 input type date 使用 placeholder 的目的是为了让用户更准确的输入日期格式，iOS 上会有 datepicker
        不会显示 placeholder 文字，但是为了统一表单外观，往往需要显示。Android 部分机型没有 datepicker 也不会显示 placeholder
        文字。
    </p>
    <p>
        桌面端（Mac）
    </p>
    <ul>
        <li>
            Safari 不支持 datepicker，placeholder 正常显示。
        </li>
        <li>
            Firefox 不支持 datepicker，placeholder 正常显示。
        </li>
        <li>
            Chrome 支持 datepicker，显示 年、月、日 格式，忽略 placeholder。
        </li>
    </ul>
    <p>
        移动端
    </p>
    <ul>
        <li>
            iPhone5 iOS7 有 datepicker 功能，但是不显示 placeholder。
        </li>
        <li>
            Andorid 4.0.4 无 datepicker 功能，不显示 placeholder
        </li>
    </ul>
    <p>
        解决方法：
    </p>
    <pre>
        &lt;input placeholder="Date" class="textbox-n" type="text" onfocus="(this.type='date')"
        id="date"&gt;
    </pre>
    <p>
        因为text是支持placeholder的。因此当用户focus的时候自动把type类型改变为date，这样既有placeholder也有datepicker了
    </p>
    <h3 id="viewport导致文字无故折行">
        viewport导致文字无故折行
    </h3>
    <p>
        <a href="http://www.iunbug.com/archives/2013/04/23/798.html" target="_blank">
            http://www.iunbug.com/archives/2013/04/23/798.html
        </a>
    </p>
    <h3 id="引导用户安装并打开app">
        引导用户安装并打开app
    </h3>
    <p>
        来自
        <a href="http://gallery.kissyui.com/redirectToNative/1.2/guide/index.html"
        target="_blank">
            http://gallery.kissyui.com/redirectToNative/1.2/guide/index.html
        </a>
        kissy mobile 通过iframe src发送请求打开app自定义url scheme，如taobao://home（淘宝首页） 、etao://scan（一淘扫描）);
        如果安装了客户端则会直接唤起，直接唤起后，之前浏览器窗口（或者扫码工具的webview）推入后台； 如果在指定的时间内客户端没有被唤起，则js重定向到app下载地址。
        大概实现代码如下
    </p>
    <pre>
        goToNative:function(){ if(!body) { setTimeout(function(){ doc.body.appendChild(iframe);
        }, 0); } else { body.appendChild(iframe); } setTimeout(function() { doc.body.removeChild(iframe);
        gotoDownload(startTime);//去下载，下载链接一般是itunes app store或者apk文件链接 /** * 测试时间设置小于800ms时，在android下的UC浏览器会打开native
        app时并下载apk， * 测试android+UC下打开native的时间最好大于800ms; */ }, 800); }
    </pre>
    <p>
        需要注意的是 如果是android chrome 25版本以后，在iframe src不会发送请求， 原因如下
        <a href="https://developers.google.com/chrome/mobile/docs/intents" target="_blank">
            https://developers.google.com/chrome/mobile/docs/intents
        </a>
        ，通过location href使用intent机制拉起客户端可行并且当前页面不跳转。
    </p>
    <pre>
        window.location = 'intent://' + schemeUrl + '#Intent;scheme=' + scheme
        + ';package=' + self.package + ';end';
    </pre>
    <p>
        补充一个来自三水清的详细讲解
        <a href="http://js8.in/2013/12/16/ios%E4%BD%BF%E7%94%A8schema%E5%8D%8F%E8%AE%AE%E8%B0%83%E8%B5%B7app/"
        target="_blank">
            http://js8.in/2013/12/16/ios%E4%BD%BF%E7%94%A8schema%E5%8D%8F%E8%AE%AE%E8%B0%83%E8%B5%B7app/
        </a>
    </p>
    <h3 id="active的兼容-来自薛端阳">
        active的兼容(来自薛端阳)
    </h3>
    <p>
        今天发现，要让a链接的CSS active伪类生效，只需要给这个a链接的touch系列的任意事件touchstart/touchend绑定一个空的匿名方法即可hack成功
    </p>
    <pre>
        &lt;style&gt; a { color: #000; } a:active { color: #fff; } &lt;/style&gt;
        &lt;a herf=”asdasd”&gt;asdasd&lt;/a&gt; &lt;script&gt; var a=document.getElementsByTagName(‘a’);
        for(var i=0;i&lt;a.length;i++){ a[i].addEventListener(‘touchstart’,function(){},false);
        } &lt;/script&gt;
    </pre>
    <h3 id="消除transition闪屏">
        消除transition闪屏
    </h3>
    <p>
        两个方法：使用css3动画的时尽量利用3D加速，从而使得动画变得流畅。动画过程中的动画闪白可以通过 backface-visibility
        隐藏。
    </p>
    <pre>
        -webkit-transform-style: preserve-3d; /*设置内嵌的元素在 3D 空间如何呈现：保留 3D*/ -webkit-backface-visibility:
        hidden; /*（设置进行转换的元素的背面在面对用户时是否可见：隐藏）*/
    </pre>
    <h3 id="测试是否支持svg图片">
        测试是否支持svg图片
    </h3>
    <pre>
        document.implementation.hasFeature("http:// www.w3.org/TR/SVG11/feature#Image",
        "1.1")
    </pre>
    <h2 id="“隐私模式”">
        “隐私模式”
    </h2>
    <p>
        参考地址：
        <a href="http://blog.youyo.name/archives/smarty-phones-webapp-deverlop-advance.html"
        target="_blank">
            http://blog.youyo.name/archives/smarty-phones-webapp-deverlop-advance.html
        </a>
    </p>
    <p>
        ios的safari提供一种“隐私模式”，如果你的webapp考虑兼容这个模式，那么在使用html5的本地存储的一种————localStorage时，可能因为“隐私模式”下没有权限读写localstorge而使代码抛出错误，导致后续的js代码都无法运行了。
    </p>
    <p>
        既然在safari的“隐私模式”下，没有调用localStorage的权限，首先想到的是先判断是否支持localStorage，代码如下：
    </p>
    <pre>
        if('localStorage' in window){ //需要使用localStorage的代码写在这 }else{ //不支持的提示和向下兼容代码
        }
    </pre>
    <p>
        测试发现，即使在safari的“隐私模式”下，’localStorage’ in window的返回值依然为true，也就是说，if代码块内部的代码依然会运行，问题没有得到解决。
        接下来只能相当使用try catch了，虽然这是一个不太推荐被使用的方法，使用try catch捕获错误，使后续的js代码可以继续运行，代码如下：
    </p>
    <pre>
        try{ if('localStorage' in window){ //需要使用localStorage的代码写在这 }else{ //不支持的提示和向下兼容代码
        } }catch(e){ // 隐私模式相关提示代码和不支持的提示和向下兼容代码 }
    </pre>
    <p>
        所以，提醒大家注意，在需要兼容ios的safari的“隐私模式”的情况下，本地存储相关的代码需要使用try catch包裹并降级兼容。
    </p>
    <h3 id="安卓手机点击锁定页面效果问题">
        安卓手机点击锁定页面效果问题
    </h3>
    <p>
        有些安卓手机，页面点击时会停止页面的javascript，css3动画等的执行，这个比较蛋疼。不过可以用阻止默认事件解决。详细见
        <a href="http://stackoverflow.com/questions/10246305/android-browser-touch-events-stop-display-being-updated-inc-canvas-elements-h"
        target="_blank">
            http://stackoverflow.com/questions/10246305/android-browser-touch-events-stop-display-being-updated-inc-canvas-elements-h
        </a>
    </p>
    <pre>
        function touchHandlerDummy(e) { e.preventDefault(); return false; } document.addEventListener("touchstart",
        touchHandlerDummy, false); document.addEventListener("touchmove", touchHandlerDummy,
        false); document.addEventListener("touchend", touchHandlerDummy, false);
    </pre>
    <h3 id="消除ie10里面的那个叉号">
        消除ie10里面的那个叉号
    </h3>
    <p>
        <a href="http://msdn.microsoft.com/en-us/library/windows/apps/hh767361.aspx"
        title="article4" target="_blank">
            IE Pseudo-elements
        </a>
    </p>
    <pre>
        input:-ms-clear{display:none;}
    </pre>
    <h3 id="关于ios与os端字体的优化">
        关于ios与os端字体的优化
    </h3>
    <p>
        <a href="http://blog.sina.com.cn/s/blog_6da647a601011u4v.html" title="article5"
        target="_blank">
            mac下网页中文字体优化
        </a>
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/3220662/uiwebview-font-is-thinner-in-portrait-than-landscape"
        title="article5" target="_blank">
            UIWebView font is thinner in portrait than landscape
        </a>
    </p>
    <h4 id="判断用户是否是“将网页添加到主屏后，再从主屏幕打开这个网页”的">
        判断用户是否是“将网页添加到主屏后，再从主屏幕打开这个网页”的
    </h4>
    <pre>
        navigator.standalone
    </pre>
    <h4 id="隐藏地址栏-amp-处理事件的时候，防止滚动条出现：">
        隐藏地址栏 &amp; 处理事件的时候，防止滚动条出现：
    </h4>
    <pre>
        // 隐藏地址栏 &amp; 处理事件的时候 ，防止滚动条出现 addEventListener('load', function(){ setTimeout(function(){
        window.scrollTo(0, 1); }, 100); });
    </pre>
    <h4 id="判断是否为iphone：">
        判断是否为iPhone：
    </h4>
    <pre>
        // 判断是否为 iPhone ： function isAppleMobile() { return (navigator.platform.indexOf('iPad')
        != -1); };
    </pre>
    <h3 id="localstorage">
        localStorage:
    </h3>
    <pre>
        var v = localStorage.getItem('n') ? localStorage.getItem('n') : ""; //
        如果名称是 n 的数据存在 ，则将其读出 ，赋予变量 v 。 localStorage.setItem('n', v); // 写入名称为 n、值为
        v 的数据 localStorage.removeItem('n'); // 删除名称为 n 的数据
    </pre>
    <h3 id="使用特殊链接：">
        使用特殊链接：
    </h3>
    <p>
        如果你关闭自动识别后 ，又希望某些电话号码能够链接到 iPhone 的拨号功能 ，那么可以通过这样来声明电话链接 ,
    </p>
    <pre>
        &lt;a href="tel:12345654321"&gt;打电话给我&lt;/a&gt; &lt;a href="sms:12345654321"&gt;发短信&lt;/a&gt;
    </pre>
    <p>
        或用于单元格：
    </p>
    <pre>
        &lt;td onclick="location.href='tel:122'"&gt;
    </pre>
    <h3 id="自动大写与自动修正">
        自动大写与自动修正
    </h3>
    <p>
        要关闭这两项功能，可以通过autocapitalize 与autocorrect 这两个选项：
    </p>
    <pre>
        &lt;input type="text" autocapitalize="off" autocorrect="off" /&gt;
    </pre>
    <h3 id="不让-android-识别邮箱">
        不让 Android 识别邮箱
    </h3>
    <pre>
        &lt;meta content="email=no" name="format-detection" /&gt;
    </pre>
    <h3 id="禁止-ios-弹出各种操作窗口">
        禁止 iOS 弹出各种操作窗口
    </h3>
    <pre>
        -webkit-touch-callout:none
    </pre>
    <h3 id="禁止用户选中文字">
        禁止用户选中文字
    </h3>
    <pre>
        -webkit-user-select:none
    </pre>
    <h3 id="动画效果中，使用-translate-比使用定位性能高">
        动画效果中，使用 translate 比使用定位性能高
    </h3>
    <p>
        <a href="http://paulirish.com/2012/why-moving-elements-with-translate-is-better-than-posabs-topleft/"
        target="_blank">
            Why Moving Elements With Translate() Is Better Than Pos:abs Top/left
        </a>
    </p>
    <h3 id="拿到滚动条">
        拿到滚动条
    </h3>
    <pre>
        window.scrollY window.scrollX
    </pre>
    <p>
        比如要绑定一个touchmove的事件，正常的情况下类似这样(来自呼吸二氧化碳)
    </p>
    <pre>
        $('div').on('touchmove', function(){ //.….code {});
    </pre>
    <p>
        而如果中间的code需要处理的东西多的话，fps就会下降影响程序顺滑度，而如果改成这样
    </p>
    <pre>
        $('div').on('touchmove', function(){ setTimeout(function(){ //.….code
        },0); {});
    </pre>
    <p>
        把代码放在setTimeout中，会发现程序变快.
    </p>
    <h3 id="关于-ios-系统中，web-app-启动图片在不同设备上的适应性设置">
        关于 iOS 系统中，Web APP 启动图片在不同设备上的适应性设置
    </h3>
    <p>
        <a href="http://stackoverflow.com/questions/4687698/mulitple-apple-touch-startup-image-resolutions-for-ios-web-app-esp-for-ipad/10011893#10011893"
        target="_blank">
            http://stackoverflow.com/questions/4687698/mulitple-apple-touch-startup-image-resolutions-for-ios-web-app-esp-for-ipad/10011893#10011893
        </a>
    </p>
    <h3 id="position-sticky与position-fixed布局">
        position:sticky与position:fixed布局
    </h3>
    <p>
        <a href="http://www.zhouwenbin.com/positionsticky-%E7%B2%98%E6%80%A7%E5%B8%83%E5%B1%80/"
        target="_blank">
            http://www.zhouwenbin.com/positionsticky-%E7%B2%98%E6%80%A7%E5%B8%83%E5%B1%80/
        </a>
        <a href="http://www.zhouwenbin.com/sticky%E6%A8%A1%E6%8B%9F%E9%97%AE%E9%A2%98/"
        target="_blank">
            http://www.zhouwenbin.com/sticky%E6%A8%A1%E6%8B%9F%E9%97%AE%E9%A2%98/
        </a>
    </p>
    <h3 id="关于-ios-系统中，中文输入法输入英文时，字母之间可能会出现一个六分之一空格">
        关于 iOS 系统中，中文输入法输入英文时，字母之间可能会出现一个六分之一空格
    </h3>
    <p>
        可以通过正则去掉
    </p>
    <pre>
        this.value = this.value.replace(/\u2006/g, '');
    </pre>
    <h3 id="关于android-webview中，input元素输入时出现的怪异情况">
        关于android webview中，input元素输入时出现的怪异情况
    </h3>
    <p>
        见下图
    </p>
    <p>
        <img src="http://cdn.bielousov.com/wp-content/uploads/2012/08/android-input-label-text-issue.png"
        alt="怪异图">
    </p>
    <p>
        Android Web 视图,至少在 HTC EVO 和三星的 Galaxy Nexus 中，文本输入框在输入时表现的就像占位符。情况为一个类似水印的东西在用户输入区域，一旦用户开始输入便会消失(见图片)。
    </p>
    <p>
        在 Android 的默认样式下当输入框获得焦点后，若存在一个绝对定位或者 fixed 的元素，布局会被破坏，其他元素与系统输入字段会发生重叠(如搜索图标将消失为搜索字段)，可以观察到布局与原始输入字段有偏差(见截图)。
    </p>
    <p>
        这是一个相当复杂的问题，以下简单布局可以重现这个问题:
    </p>
    <pre>
        &lt;label for="phone"&gt;Phone: *&lt;/label&gt; &lt;input type="tel" name="phone"
        id="phone" minlength="10" maxlength="10" inputmode="latin digits" required="required"
        /&gt;
    </pre>
    <p>
        解决方法
    </p>
    <pre>
        -webkit-user-modify: read-write-plaintext-only
    </pre>
    <p>
        详细参考
        <a href="http://www.bielousov.com/2012/android-label-text-appears-in-input-field-as-a-placeholder/"
        target="_blank">
            http://www.bielousov.com/2012/android-label-text-appears-in-input-field-as-a-placeholder/
        </a>
        注意，该属性会导致中文不能输入词组，只能单个字。感谢鬼哥与飞（游勇飞）贡献此问题与解决方案
    </p>
    <p>
        另外，在position:fixed后的元素里，尽量不要使用输入框。更多的bug可参考
        <a href="http://www.cosdiv.com/page/M0/S882/882353.html" target="_blank">
            http://www.cosdiv.com/page/M0/S882/882353.html
        </a>
    </p>
    <p>
        依旧无法解决（摩托罗拉ME863手机），则使用input:text类型而非password类型，并设置其设置 -webkit-text-security:
        disc; 隐藏输入密码从而解决。
    </p>
    <h3 id="js动态生成的select下拉菜单在android2-x版本的默认浏览器里不起作用">
        JS动态生成的select下拉菜单在Android2.x版本的默认浏览器里不起作用
    </h3>
    <p>
        解决方法删除了overflow-x:hidden; 然后在JS生成下来菜单之后focus聚焦，这两步操作之后解决了问题。(来自岛都-小Qi)
    </p>
    <p>
        参考
        <a href="http://stackoverflow.com/questions/4697908/html-select-control-disabled-in-android-webview-in-emulator"
        target="_blank">
            http://stackoverflow.com/questions/4697908/html-select-control-disabled-in-android-webview-in-emulator
        </a>
    </p>
    <h3 id="andriod-上去掉语音输入按钮">
        Andriod 上去掉语音输入按钮
    </h3>
    <pre>
        input::-webkit-input-speech-button {display: none}
    </pre>
    <h2 id="ie10-的特殊鼠标事件">
        IE10 的特殊鼠标事件
    </h2>
    <p>
        <a href="http://www.mansonchor.com/blog/blog_detail_73.html" title="article5"
        target="_blank">
            IE10 事件监听
        </a>
    </p>
    <h2 id="ios-输入框最佳实践">
        iOS 输入框最佳实践
    </h2>
    <p>
        <a href="http://stackoverflow.com/questions/11219242/mobile-friendly-input-of-a-digits-spaces-string-a-credit-card-number"
        target="_blank">
            Mobile-friendly input of a digits + spaces string (a credit card number)
        </a>
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/8216278/html5-input-type-number-vs-tel"
        target="_blank">
            HTML5 input type number vs tel
        </a>
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/6178556/iphone-numeric-keyboard-for-text-input"
        target="_blank">
            iPhone: numeric keyboard for text input
        </a>
    </p>
    <p>
        <a href="https://developer.apple.com/library/ios/documentation/StringsTextFonts/Conceptual/TextAndWebiPhoneOS/KeyboardManagement/KeyboardManagement.html"
        target="_blank">
            Text Programming Guide for iOS - Managing the Keyboard
        </a>
    </p>
    <p>
        <a href="http://www.miketaylr.com/code/input-type-attr.html" target="_blank">
            HTML5 inputs and attribute support
        </a>
    </p>
    <h2 id="往返缓存问题">
        往返缓存问题
    </h2>
    <p>
        点击浏览器的回退，有时候不会自动执行js，特别是在mobilesafari中。这与
        <strong>
            往返缓存(bfcache)
        </strong>
        有关系。有很多hack的处理方法，可以参考
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/24046/the-safari-back-button-problem"
        target="_blank">
            http://stackoverflow.com/questions/24046/the-safari-back-button-problem
        </a>
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/11979156/mobile-safari-back-button"
        target="_blank">
            http://stackoverflow.com/questions/11979156/mobile-safari-back-button
        </a>
    </p>
    <h2 id="计时器">
        计时器
    </h2>
    <p>
        <a href="https://www.imququ.com/post/ios-none-freeze-timer.html" target="_blank">
            https://www.imququ.com/post/ios-none-freeze-timer.html
        </a>
        还有一种利用work的方式，在写ing。。
    </p>
    <h2 id="音频跟视频">
        音频跟视频
    </h2>
    <pre>
        &lt;audio autoplay &gt;&lt;source src="audio/alarm1.mp3" type="audio/mpeg"&gt;&lt;/audio&gt;
    </pre>
    <p>
        系统默认情况下 audio的autoplay属性是无法生效的，这也是手机为节省用户流量做的考虑。 如果必须要自动播放，有两种方式可以解决。
    </p>
    <p>
        1.捕捉一次用户输入后，让音频加载，下次即可播放。
    </p>
    <pre>
        //play and pause it once document.addEventListener('touchstart', function
        () { document.getElementsByTagName('audio')[0].play(); document.getElementsByTagName('audio')[0].pause();
        });
    </pre>
    <p>
        这种方法需要捕获一次用户的点击事件来促使音频跟视频加载。当加载后，你就可以用javascript控制音频的播放了，如调用audio.play()
    </p>
    <p>
        2.利用iframe加载资源
    </p>
    <pre>
        var ifr=document.createElement("iframe"); ifr.setAttribute('src', "http://mysite.com/myvideo.mp4");
        ifr.setAttribute('width', '1px'); ifr.setAttribute('height', '1px'); ifr.setAttribute('scrolling',
        'no'); ifr.style.border="0px"; document.body.appendChild(ifr);
    </pre>
    <p>
        这种方式其实跟第一种原理是一样的。当资源加载了你就可以控制播放了，但是这里使用iframe来加载，相当于直接触发资源加载。 注意，使用创建audio标签并让其加载的方式是不可行的。
        慎用这种方法，会对用户造成很糟糕的影响。。
    </p>
    <h2 id="ios-6-跟-iphone-5">
        iOS 6 跟 iPhone 5
    </h2>
    <h3 id="ip5-的媒体查询">
        IP5 的媒体查询
    </h3>
    <pre>
        @media (device-height: 568px) and (-webkit-min-device-pixel-ratio: 2)
        { /* iPhone 5 or iPod Touch 5th generation */ }
    </pre>
    <h3 id="媒体查询，响应不同启动图片">
        媒体查询，响应不同启动图片
    </h3>
    <pre>
        &lt;link href="startup-568h.png" rel="apple-touch-startup-image" media="(device-height:
        568px)"&gt; &lt;link href="startup.png" rel="apple-touch-startup-image"
        sizes="640x920" media="(device-height: 480px)"&gt;
    </pre>
    <h3 id="拍照上传">
        拍照上传
    </h3>
    <pre>
        &lt;input type=file accept="video/*"&gt; &lt;input type=file accept="image/*"&gt;
    </pre>
    <p>
        不支持其他类型的文件 ，如音频，Pages文档或PDF文件。 也没有getUserMedia摄像头的实时流媒体支持。
    </p>
    <h3 id="可以使用的-html5-高级-api">
        可以使用的 HTML5 高级 api
    </h3>
    <ul>
        <li>
            multipart POST 表单提交上传
        </li>
        <li>
            XMLHttpRequest 2 AJAX 上传（甚至进度支持）
        </li>
        <li>
            文件 API ，在 iOS 6 允许 JavaScript 直接读取的字节数和客户端操作文件。
        </li>
    </ul>
    <h3 id="智能应用程序横幅">
        智能应用程序横幅
    </h3>
    <p>
        有了智能应用程序横幅，当网站上有一个相关联的本机应用程序时，Safari浏览器可以显示一个横幅。 如果用户没有安装这个应用程序将显示“安装”按钮，或已经安装的显示“查看”按钮可打开它。
    </p>
    <p>
        在 iTunes Link Maker 搜索我们的应用程序和应用程序ID。
    </p>
    <pre>
        &lt;meta name="apple-itunes-app" content="app-id=9999999"&gt;
    </pre>
    <p>
        可以使用 app-argument 提供字符串值，如果参加iTunes联盟计划，可以添加元标记数据
    </p>
    <pre>
        &lt;meta name="apple-itunes-app" content="app-id=9999999, app-argument=xxxxxx"&gt;
        &lt;meta name="apple-itunes-app" content="app-id=9999999, app-argument=xxxxxx,
        affiliate-data=partnerId=99&amp;siteID=XXXX"&gt;
    </pre>
    <p>
        横幅需要156像素（设备是312 hi-dpi）在顶部，直到用户在下方点击内容或关闭按钮，你的网站才会展现全部的高度。 它就像HTML的DOM对象，但它不是一个真正的DOM。
    </p>
    <p>
        CSS3 滤镜
    </p>
    <pre>
        -webkit-filter: blur(5px) grayscale (.5) opacity(0.66) hue-rotate(100deg);
    </pre>
    <p>
        交叉淡变
    </p>
    <pre>
        background-image: -webkit-cross-fade(url("logo1.png"), url("logo2.png"),
        50%);
    </pre>
    <p>
        Safari中的全屏幕
    </p>
    <p>
        除了chrome-less 主屏幕meta标签，现在的iPhone和iPod Touch（而不是在iPad）支持全屏幕模式的窗口。 没有办法强制全屏模式，它需要由用户启动（工具栏上的最后一个图标）。需要引导用户按下屏幕上的全屏图标来激活全屏效果。
        可以使用onresize事件检测是否用户切换到全屏幕。
    </p>
    <p>
        支持requestAnimationFrameAPI
    </p>
    <p>
        支持image-set,retina屏幕的利器
    </p>
    <pre>
        -webkit-image-set(url(low.png) 1x, url(hi.jpg) 2x)
    </pre>
    <p>
        应用程序缓存限制增加至25MB。
    </p>
    <p>
        Web View（pseudobrowsers，PhoneGap/Cordova应用程序，嵌入式浏览器） 上Javascript运行比Safari慢3.3倍（或者说，Nitro引擎在Safari浏览器是Web应用程序是3.3倍速度）。
    </p>
    <p>
        autocomplete属性的输入遵循DOM规范
    </p>
    <p>
        来自DOM4的Mutation Observers已经实现。 您可以使用WebKitMutationObserver构造器捕获DOM的变化
    </p>
    <p>
        Safari不再总是对用 -webkit-transform:preserve-3d 的元素创建硬件加速
    </p>
    <p>
        支持window.selection 的Selection API
    </p>
    <p>
        Canvas更新 ：createImageData有一个参数，现在有两个新的功能做好准备，用webkitGetImageDataHD和webkitPutImageDataHD提供高分辨率图像
        。
    </p>
    <p>
        更新SVG处理器和事件构造函数
    </p>
    <h2 id="ios7">
        IOS7
    </h2>
    <p>
        <a href="http://jinlong.github.io/blog/2013/09/23/safari-ios7-html5-problems-apis-review/#jtss-tsina"
        target="_blank">
            iOS 7 的 Safari 和 HTML5：问题，变化和新 API
        </a>
        (张金龙翻译)
    </p>
    <p>
        <a href="http://www.sencha.com/blog/the-html5-scorecard-the-good-the-bad-and-the-ugly-in-ios7"
        title="ios7的一些bug" target="_blank">
            iOS 7 的一些坑(英文)
        </a>
    </p>
    <p>
        <a href="http://www.mobilexweb.com/blog/safari-ios7-html5-problems-apis-review"
        title="ios7的一些bug" target="_blank">
            ios7的一些坑2(英文)
        </a>
    </p>
    <h2 id="webview相关">
        webview相关
    </h2>
    <h1 id="cache开启和设置">
        Cache开启和设置
    </h1>
    <pre>
        browser.getSettings().setAppCacheEnabled(true); browser.getSettings().setAppCachePath("/data/data/[com.packagename]/cache");
        browser.getSettings().setAppCacheMaxSize(5*1024*1024); // 5MB
    </pre>
    <h1 id="localstorage相关设置">
        LocalStorage相关设置
    </h1>
    <pre>
        browser.getSettings().setDatabaseEnabled(true); browser.getSettings().setDomStorageEnabled(true);
        String databasePath = browser.getContext().getDir("databases", Context.MODE_PRIVATE).getPath();
        browser.getSettings().setDatabasePath(databasePath);//Android　webview的LocalStorage有个问题，关闭APP或者重启后，就清楚了，所以需要browser.getSettings().setDatabase相关的操作，把LocalStoarge存到DB中
        myWebView.setWebChromeClient(new WebChromeClient(){ 　　　 @Override 　　　 public
        void onExceededDatabaseQuota(String url, String databaseIdentifier, long
        currentQuota, long estimatedSize, long totalUsedQuota, WebStorage.QuotaUpdater
        quotaUpdater) 　　　 { 　　　　　　　 quotaUpdater.updateQuota(estimatedSize * 2);
        　　　 } }
    </pre>
    <h1 id="浏览器自带缩放按钮取消显示">
        浏览器自带缩放按钮取消显示
    </h1>
    <pre>
        browser.getSettings().setBuiltInZoomControls(false);
    </pre>
    <h1 id="几个比较好的实践">
        几个比较好的实践
    </h1>
    <p>
        使用localstorage缓存html
    </p>
    <p>
        使用lazyload，还要记得lazyload占位图虽然小，但是最好能提前加载到缓存
    </p>
    <p>
        延时加载执行js
    </p>
    <p>
        主要原因就在于Android Webview的onPageFinished事件，Android端一般是用这个事件来标识页面加载完成并显示的，也就是说在此之前，会一直loading，但是Android的OnPageFinished事件会在Javascript脚本执行完成之后才会触发。如果在页面中使用JQuery，会在处理完DOM对象，执行完$(document).ready(function()
        {});事件自会后才会渲染并显示页面。
    </p>
    <h2 id="移动端调适篇">
        移动端调适篇
    </h2>
    <h3 id="手机抓包与配host">
        手机抓包与配host
    </h3>
    <p>
        在PC上，我们可以很方便地配host，但是手机上如何配host，这是一个问题。
    </p>
    <p>
        这里主要使用fiddler和远程代理，实现手机配host的操作，具体操作如下：
    </p>
    <p>
        首先，保证PC和移动设备在同一个局域网下；
    </p>
    <p>
        PC上开启fiddler，并在设置中勾选“allow remote computers to connect”
    </p>
    <ol>
        <li>
            <p>
                首先，保证PC和移动设备在同一个局域网下；
            </p>
        </li>
        <li>
            <p>
                PC上开启fiddler，并在设置中勾选“allow remote computers to connect”
                <img src="https://github.com/hoosin/mobile-web-favorites/raw/master/img/01.png"
                alt="fiddler">
            </p>
        </li>
        <li>
            <p>
                手机上设置代理，代理IP为PC的IP地址，端口为8888（这是fiddler的默认端口）。通常手机上可以直接设置代理，如果没有，可以去下载一个叫ProxyDroid的APP来实现代理的设置。
            </p>
        </li>
        <li>
            <p>
                此时你会发现，用手机上网，走的其实是PC上的fiddler，所有的请求包都会在fiddler中列出来，配合willow使用，即可实现配host，甚至是反向代理的操作。
            </p>
        </li>
    </ol>
    <p>
        也可以用CCProxy之类软件，还有一种方法就是买一个随身wifi，然后手机连接就可以了！
    </p>
    <h3 id="高级抓包">
        高级抓包
    </h3>
    <p>
        <a href="http://danqingdani.blog.163.com/blog/static/1860941952012112353515306/?suggestedreading&amp;wumii"
        title="iPhone上使用Burp Suite捕捉HTTPS通信包方法" target="_blank">
            iPhone上使用Burp Suite捕捉HTTPS通信包方法
        </a>
    </p>
    <p>
        <a href="http://danqingdani.blog.163.com/blog/static/1860941952012101331848980/"
        title="mobile app 通信分析方法小议（iOS/Android)" target="_blank">
            mobile app 通信分析方法小议（iOS/Android)
        </a>
    </p>
    <p>
        <a href="http://danqingdani.blog.163.com/blog/static/1860941952012111954741585/"
        title="实时抓取移动设备上的通信包(ADVsock2pipe+Wireshark+nc+tcpdump)" target="_blank">
            实时抓取移动设备上的通信包(ADVsock2pipe+Wireshark+nc+tcpdump)
        </a>
    </p>
    <h3 id="静态资源缓存问题">
        静态资源缓存问题
    </h3>
    <p>
        一般用代理软件代理过来的静态资源可以设置nocache避免缓存，但是有的手机比较诡异，会一直缓存住css等资源文件。由于静态资源一般都是用版本号管理的，我们以charles为例子来处理这个问题
    </p>
    <p>
        charles 选择静态的html页面文件-saveResponse。之后把这个文件保存一下，修改一下版本号。之后继续发请求， 刚才的html页面文件
        右键选择 --map local 选择我们修改过版本号的html文件即ok。这其实也是fiddler远程映射并修改文件的一个应用场景。
    </p>
    <h2 id="移动浏览器篇">
        移动浏览器篇
    </h2>
    <h3 id="微信浏览器">
        微信浏览器
    </h3>
    <p>
        因为微信浏览器屏蔽了一部分链接图片，所以需要引导用户去打开新页面，可以用以下方式判断微信浏览器的ua
    </p>
    <pre>
        function is_weixn(){ var ua = navigator.userAgent.toLowerCase(); if(ua.match(/MicroMessenger/i)=="micromessenger")
        { return true; } else { return false; } }
    </pre>
    <p>
        后端判断也很简单，比如php
    </p>
    <pre>
        function is_weixin(){ if ( strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger')
        !== false ) { return true; } return false; }
    </pre>
    <h3 id="【uc浏览器】video标签脱离文档流">
        【UC浏览器】video标签脱离文档流
    </h3>
    <p>
        场景：
        <video>
            标签的父元素(祖辈元素)设置transform样式后，
            <video>
                标签会脱离文档流。
            </video>
        </video>
    </p>
    <p>
        测试环境：UC浏览器 8.7/8.6 + Android 2.3/4.0 。
    </p>
    <p>
        Demo：
        <a href="http://t.cn/zj3xiyu" target="_blank">
            http://t.cn/zj3xiyu
        </a>
    </p>
    <p>
        解决方案：不使用transform属性。translate用top、margin等属性替代。
    </p>
    <h3 id="【uc浏览器】video标签总在最前">
        【UC浏览器】video标签总在最前
    </h3>
    <p>
        场景：
        <video>
            标签总是在最前（可以理解为video标签的z-index属性是Max）。
        </video>
    </p>
    <p>
        测试环境：UC浏览器 8.7/8.6 + Android 2.3/4.0 。
    </p>
    <h3 id="【uc浏览器】position-fixed-属性在uc浏览器的奇葩现象">
        【UC浏览器】position:fixed 属性在UC浏览器的奇葩现象
    </h3>
    <p>
        场景：设置了position: fixed 的元素会遮挡z-index值更高的同辈元素。
    </p>
    <p>
        　　　在8.6的版本,这个情况直接出现。
    </p>
    <p>
        　　　在8.7之后的版本,当同辈元素的height大于713这个「神奇」的数值时,才会被遮挡。
    </p>
    <p>
        测试环境：UC浏览器 8.8_beta/8.7/8.6 + Android 2.3/4.0 。
    </p>
    <p>
        Demo：
        <a href="http://t.cn/zYLTSg6" target="_blank">
            http://t.cn/zYLTSg6
        </a>
    </p>
    <h3 id="【qq手机浏览器】不支持httponly">
        【QQ手机浏览器】不支持HttpOnly
    </h3>
    <p>
        场景：带有HttpOnly属性的Cookie，在QQ手机浏览器版本从4.0开始失效。JavaScript可以直接读取设置了HttpOnly的Cookie值。
    </p>
    <p>
        测试环境：QQ手机浏览器 4.0/4.1/4.2 + Android 4.0 。
    </p>
    <h3 id="【miui原生浏览器】浏览器地址栏hash不改变">
        【MIUI原生浏览器】浏览器地址栏hash不改变
    </h3>
    <p>
        场景：location.hash 被赋值后，地址栏的地址不会改变。
    </p>
    <p>
        　　　但实际上 location.href 已经更新了，通过JavaScript可以顺利获取到更新后的地址。
    </p>
    <p>
        　　　虽然不影响正常访问，但用户无法将访问过程中改变hash后的地址存为书签。
    </p>
    <p>
        测试环境：MIUI 4.0
    </p>
    <h3 id="【chrome-mobile】fixed元素无法点击">
        【Chrome Mobile】fixed元素无法点击
    </h3>
    <p>
        场景：父元素设置position: fixed;
    </p>
    <p>
        　　　子元素设置position: absolute;
    </p>
    <p>
        　　　此时，如果父元素/子元素还设置了overflow: hidden 则出现“父元素遮挡该子元素“的bug。
    </p>
    <p>
        　　　视觉(view)层并没有出现遮挡，只是无法触发绑定在该子元素上的事件。可理解为：「看到点不到」。
    </p>
    <p>
        补充： 页面往下滚动，触发position: fixed;的特性时，才会出现这个bug，在最顶不会出现。
    </p>
    <p>
        测试平台： 小米1S，Android4.0的Chrome18
    </p>
    <p>
        demo：
        <a href="http://maplejan.sinaapp.com/demo/fixed_chromemobile.html" target="_blank">
            http://maplejan.sinaapp.com/demo/fixed_chromemobile.html
        </a>
    </p>
    <p>
        解决办法： 把父元素和子元素的overflow: hidden去掉。
    </p>
    <p>
        以上来源于
        <a href="http://www.cnblogs.com/maplejan/archive/2013/04/26/3045928.html"
        target="_blank">
            http://www.cnblogs.com/maplejan/archive/2013/04/26/3045928.html
        </a>
    </p>
    <h2 id="库的使用实践">
        库的使用实践
    </h2>
    <h3 id="zepto-js">
        zepto.js
    </h3>
    <p>
        <a href="http://chaoskeh.com/blog/some-experience-of-using-zepto.html"
        title="zepto" target="_blank">
            zepto的一篇使用注意点讲解
        </a>
    </p>
    <p>
        <a href="http://blog.youyo.name/archives/zepto-tap-click-through-research.html"
        title="zepto" target="_blank">
            zepto的著名的tap“点透”bug
        </a>
    </p>
    <p>
        <a href="http://www.cnblogs.com/sky000/archive/2013/03/29/2988952.html"
        title="zepto" target="_blank">
            zepto源码注释
        </a>
    </p>
    <h3 id="使用zeptojs内嵌到android-webview影响正常滚动时">
        使用zeptojs内嵌到android webview影响正常滚动时
    </h3>
    <p>
        <a href="https://github.com/madrobby/zepto/blob/master/src/touch.js" target="_blank">
            https://github.com/madrobby/zepto/blob/master/src/touch.js
        </a>
        去掉61行,其实就是使用原生的滚动
    </p>
    <h3 id="iscroll4">
        iscroll4
    </h3>
    <p>
        iscroll4 的几个bug(来自
        <a href="http://www.mansonchor.com/blog/blog_detail_64.html" target="_blank">
            http://www.mansonchor.com/blog/blog_detail_64.html
        </a>
        内有详细讲解)
    </p>
    <p>
        1.滚动容器点击input框、select等表单元素时没有响应】
    </p>
    <pre>
        onBeforeScrollStart: function (e) { e.preventDefault(); }
    </pre>
    <p>
        改为
    </p>
    <pre>
        onBeforeScrollStart: function (e) { var nodeType = e.explicitOriginalTarget
        ? e.explicitOriginalTarget.nodeName.toLowerCase():(e.target ? e.target.nodeName.toLowerCase():'');if(nodeType
        !='select'&amp;&amp; nodeType !='option'&amp;&amp; nodeType !='input'&amp;&amp;
        nodeType!='textarea') e.preventDefault(); }
    </pre>
    <p>
        2.往iscroll容器内添加内容时，容器闪动的bug
    </p>
    <p>
        源代码的
    </p>
    <pre>
        has3d = 'WebKitCSSMatrix' in window &amp;&amp; 'm11' in new WebKitCSSMatrix()
    </pre>
    <p>
        改成
    </p>
    <pre>
        has3d = false
    </pre>
    <p>
        在配置iscroll时，useTransition设置成false
    </p>
    <p>
        3.过长的滚动内容，导致卡顿和app直接闪退
    </p>
    <ol>
        <li>
            不要使用checkDOMChanges。虽然checkDOMChanges很方便，定时检测容器长度是否变化来refresh，但这也意味着你要消耗一个Interval的内存空间
        </li>
        <li>
            隐藏iscroll滚动条，配置时设置hScrollbar和vScrollbar为false。
        </li>
        <li>
            不得已的情况下，去掉各种效果，momentum、useTransform、useTransition都设置为false
        </li>
    </ol>
    <p>
        4.左右滚动时，不能正确响应正文上下拉动
    </p>
    <p>
        iscroll的闪动问题也与渲染有关系，可以参考
        <a href="http://www.iunbug.com/archives/2012/09/19/411.html" title="iscroll4"
        target="_blank">
            运用webkit绘制渲染页面原理解决iscroll4闪动的问题
        </a>
        <a href="http://blog.csdn.net/gcz564539969/article/details/9156141" title="iscroll5"
        target="_blank">
            iscroll4升级到5要注意的问题
        </a>
    </p>
    <h3 id="iscroll或者滚动类框架滚动时不点击的方法">
        iscroll或者滚动类框架滚动时不点击的方法
    </h3>
    <p>
        可以使用以下的解决方案(利用data-setapi)
    </p>
    <pre>
        &lt;a ontouchmove="this.s=1" ontouchend="this.s || window.open(this.dataset.href),this.s=0"
        target="_blank" data-href="http://www.hao123.com/topic/pig"&gt;黄浦江死猪之谜&lt;/a&gt;
    </pre>
    <p>
        也可以用这种方法
    </p>
    <pre>
        $(document).delegate('[data-target]', 'touchmove', function () { $(this).attr('moving','moving');
        }) $(document).delegate('[data-target]', 'touchend', function () { if ($(this).attr('moving')
        !== 'moving') { //做你想做的。。 $(this).attr('moving', 'notMoving'); } else {
        $(this).attr('moving', 'notMoving'); } })
    </pre>
    <h2 id="移动端字体问题">
        移动端字体问题
    </h2>
    <p>
        <a href="http://zhuanlan.zhihu.com/zhezhexiong/19565895" target="_blank">
            知乎专栏 - [无线手册-4] dp、sp、px傻傻分不清楚[完整]
        </a>
    </p>
    <p>
        <a href="http://www.sencha.com/blog/resolution-independent-mobile-ui"
        target="_blank">
            Resolution Independent Mobile UI
        </a>
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/12058574/pixel-density-retina-display-and-font-size-in-css"
        target="_blank">
            Pixel density, retina display and font-size in CSS
        </a>
    </p>
    <p>
        <a href="http://bjango.com/articles/min-device-pixel-ratio/" target="_blank">
            Device pixel density tests
        </a>
    </p>
    <h2 id="跨域问题">
        跨域问题
    </h2>
    <p>
        手机浏览器也是浏览器，在ajax调用外部api的时候也存在跨域问题。当然利用 PhoneGap 打包后，由于协议不一样就不存在跨域问题了。
        但页面通常是需要跟后端进行调试的。一般会报类似
    </p>
    <pre>
        XMLHttpRequest cannot load XXX Origin null is not allowed by Access-Control-Allow-Origin.
    </pre>
    <p>
        以及
    </p>
    <pre>
        XMLHttpRequest cannot load http://. Request header field Content-Type
        is not allowed by Access-Control-Allow-Headers."
    </pre>
    <p>
        这时候可以让后端加上两个http头
    </p>
    <pre>
        Access-Control-Allow-Origin "*" Access-Control-Allow-Headers "Origin,
        X-Requested-With, Content-Type, Accept"
    </pre>
    <p>
        第一个头可以避免跨域问题，第二个头可以方便ajax请求设置content-type等配置项
    </p>
    <p>
        这个会存在一些安全问题，可以参考这个问题的讨论
        <a href="http://www.zhihu.com/question/22992229" target="_blank">
            http://www.zhihu.com/question/22992229
        </a>
    </p>
    <h2 id="phonegap-部分">
        PhoneGap 部分
    </h2>
    <p>
        <a href="http://snoopyxdy.blog.163.com/blog/static/60117440201432491123551"
        target="_blank">
            http://snoopyxdy.blog.163.com/blog/static/60117440201432491123551
        </a>
        这里有一大堆snoopy总结的phonggap开发坑
    </p>
    <h3 id="should-not-happen-no-rect-based-test-nodes-found">
        Should not happen: no rect-based-test nodes found
    </h3>
    <p>
        在 Android 项目中的 assets 中的 HTML 页面中加入以下代码，便可解决问题
    </p>
    <pre>
        window,html,body{ overflow-x:hidden !important; -webkit-overflow-scrolling:
        touch !important; overflow: scroll !important; }
    </pre>
    <p>
        参考：
    </p>
    <p>
        <a href="http://stackoverflow.com/questions/12090899/android-webview-jellybean-should-not-happen-no-rect-based-test-nodes-found"
        target="_blank">
            http://stackoverflow.com/questions/12090899/android-webview-jellybean-should-not-happen-no-rect-based-test-nodes-found
        </a>
    </p>
    <h3 id="contactfindoptions-is-not-defined">
        ContactFindOptions is not defined
    </h3>
    <p>
        出现这个问题可能是因为 Navigator 取 contacts 时绑定的 window.onload
    </p>
    <p>
        注意使用 PhoneGap 的 API 时，一定要在 devicereay 事件的处理函数中使用 API
    </p>
    <pre>
        document.addEventListener("deviceready", onDeviceReady, false); function
        onDeviceReady() { callFetchContacts(); } function callFetchContacts(){
        var options = new ContactFindOptions(); options.multiple = true; var fields
        = ["displayName", "name","phoneNumbers"]; navigator.contacts.find(fields,
        onSuccess, onError,options); }
    </pre>
    <h2 id="ios-safari-bug-总结">
        iOS safari BUG 总结
    </h2>
    <p>
        safari对DOM中元素的冒泡机制有个奇葩的BUG，仅限iOS版才会触发~~~
    </p>
    <p>
        BUG重现用例请见线上DEMO:
        <a href="http://jsfiddle.net/e75od2bb/34/" target="_blank">
            地址
        </a>
    </p>
    <h3 id="bug表现与规避">
        bug表现与规避
    </h3>
    <p>
        在进行事件委托时，如果将未存在于DOM的元素事件直接委托到body上的话,会导致事件委托失效，调试结果为事件响应到body子元素为止，既没有冒泡到body上，也没有被body所捕获。但如果事件是DOM元素本身具有的，则不会触发bug。换而言之，只有元素的非标准事件（比如click事件之于div）才会触发此bug。
    </p>
    <p>
        因为bug是由safari的事件解析机制导致，无法修复，但是有多种手段可以规避
    </p>
    <ol>
        <li>
            <p>
                如何避免bug触发：
                <strong>
                    不要委托到body结点上
                </strong>
                ，委托到任意指定父元素都可以，或者使用原生具有该事件的元素，如使用click事件触发就用a标签包一层。
            </p>
        </li>
        <li>
            <p>
                已触发如何修补：safari对事件的解析非常特殊，如果一个事件曾经被响应过，则会一直冒泡（捕获）到根结点，所以对于已大规模触发的情况，只需要在
                <strong>
                    body元素的所有子元素绑定一个空事件
                </strong>
                就好了，如：
            </p>
            <pre>
                ("body &gt; *").on("click", function(){};);
            </pre>
            <p>
                可能会对性能有一定影响，但是使用方便，大家权衡考虑吧~~~
            </p>
        </li>
    </ol>
</div>




