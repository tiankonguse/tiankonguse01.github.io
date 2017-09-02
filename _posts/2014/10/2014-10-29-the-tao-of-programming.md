---
layout:     post
title:      编程之道阅读笔记(持续更新中)
description: 早就听说过这本书了，十一的时候，打印下来了，发现竟然是三本书，这里就记录一下第一小本《编程之道》。
keywords: 读书笔记, 计算机, 编程之道
tags: [读书笔记,计算机,编程之道,书籍阅读]
categories: [天空的生活]
---


![编程之道封面][cover]
![编程之道封面][cover-g]


## 前言


首先想说的是，现在终于明白为什么很多人会说这本书建议看看英文本原著，那本书建议看看英文版原著。  
这本书附带了英文原文，看了之后发现翻译成英文后意思竟然变化这么大，果然是看英文原文比较好。  
所以这里我就把英文原文写出来，然后说说我的类似经历或者想法吧。  



## Book One


### The Silent Void


> Thus spake the master programmer:  

> "When you have learned to snatch the error code from the trap frame, it will be time for you to leave."   


首先这里的 frame 我理解为框架，几乎所有的程序都有框架，如果不使用框架开发大型程序，那后果想都不敢想。  
"当你在框架中找到错误时" 这句话有点歧义。  
一种意思是框架本身的错误，另一种是我们使用框架时，我们的代码的错误。这里我理解为框架本身的错误。  
因为一般一个框架如果广为使用，那么若干版本后，一般都是很稳定，bug隐藏的很隐蔽的。  
所以那时，你找到了那些错误，你必定需要深入研究这个框架，然后才能知道里面是不是有错误。  


比如我在读我们公司的mysql++的内部框架时，读了几百行，然后得出结论：这个框架有问题，可以sql注入。  
于是我赶紧给组长说mysql++可能有问题，然后组长说：肯定在某个地方进行了转义，你再看看。  
后来我找了很多层后真的找到转义的地方了。  


所以说，当你从框架中找到错误时，那说明你已经深入的研究了这个框架，而且你的功底也已经很高了，此时你已经很厉害了。


### 1.1


> Something mysterious is formed, born in the silent void. Waiting alone and unmoving, it is at once still and yet in constant motion. It is the source of all programs. I do not know its name, so I will call it the Tao of Programming.  

> If the Tao is great, then the operating system is great. If the operating system is great, then the compiler is great. If the compiler is greater, then the applications is great. The user is pleased and there is harmony in the world.  

> The Tao of Programming flows far away and returns on the wind of morning.  


这个小节说的很抽象，不过我认为他说说的 tao 就是一些原则： 编程的原则，设计的原则，做人的原则。  
或者用更通俗的话说就是经验。  
或者说是理论知识。  
产生于无形之中，但是却是需要一直遵守的东西。  


### 1.2


> The Tao gave birth to machine language. Machine language gave birth to the assembler.  

> The assembler gave birth to the compiler. Now there are ten thousand languages.  

> Each language has its purpose, however humble. Each language expresses the Yin and Yang of software. Each language has its place within the Tao.  

> But do not program in COBOL if you can avoid it.  


计算机的成长就是这个样子：机器语言，汇编语言，编译器，高级语言。  
新出一个语言，肯定有他存在的意义。即存在即合理。  
但是这些语言是不完善的，仅仅是为了局部目的而创造了这个语言，在这个局部做出了强大的贡献，但是在其他地方就显得有心无力了。  
COBOL 是什么呢？商业语言。  
再说最后一句：金钱是罪恶之源。  


### 1.3 


> In the beginning was the Tao. The Tao gave birth to Space and Time. Therefore, Space and Time are the Yin and Yang of programming.  

> Programmers that do not comprehend the Tao are always running out of time and space for their programs. Programmers that comprehend the Tao always have enough time and space to accomplish their goals.  

> How could it be otherwise?  

这次把道与程序的时间与空间关联在一起。  
大家都知道，时间与空间永远是矛盾的，有时候我们会用时间换取一些空间来，有时候我们也会用空间换取时间来。  
这样权衡的目的是为了让程序按预期的或者可接受的状态来运行，并达到自己的目的。  
当然这里的时间也包括死循环，时间复杂度过高；而空间则指内存不足，爆栈，内存越界等。  
这些都是初级编程人员容易遇到的问题，而有经验的人则会避免这样的问题。  

### 1.4

> The wise programmer is told about the Tao and follows it. The average programmer is told about the Tao and searches for it. The foolish programmer is told about the Tao and laughs at it.  

> If it were not for laughter, there would be no Tao.  

> The highest sounds are the hardest to hear. Going forward is a way to retreat. Greater talent shows itself late in life. Even a perfect program still has bugs.  


高级的编程者使用自己掌握到的规则，一般的编程者在学习那些规则，而初级选手会嘲笑或者无视那些规则。

就像所有需要加大括号的地方，即使只有一条语句，高级编程人员也会加的，而一般的人总是遗忘，只好尽量去加大括号。但是初级编程人员总是认为那样没有必要，还浪费自己的时间与生命来多敲哪个大括号。

或者做一件简单的事，高级编程者却实现的看起来很复杂的样子，但是这个程序会更健壮，更可靠，bug更少。


## Book Two

### The Ancient Masters

> Thus spake the master programmer:  

> "After three days without programming, life becomes meaningless."  

三天不编程，就会感觉世界上缺少了些什么东西。  
这个我不做评论。  


### 2.1

> The programmers of old were mysterious and profound. We cannot fathom their thoughts, so all we do is describe their appearance.  

> Aware, like a fox crossing the water. Alert, like a general on the battlefield. Kind, like a hostess greeting her guests. Simple, like uncarved blocks of wood. Opaque, like black pools in darkened caves.  

> Who can tell the secrets of their hearts and minds?  

> The answer exists only in the Tao.  


老的程序员，我们不能理解他们的想法，所以我们只能从他们的行为来揣测他们。  
他们在不同的地方表现不同，没有人能够描述他们内心和思想的秘密的。



### 2.2

> Grand Master Turing once dreamed that he was a machine. When he awoke he exclaimed:  

> "I don't know whether I am Turing dreaming that I am a machine, or a machine dreaming that I am Turing!"  


图灵曾经梦见自己变成了机器。  
当他醒后说：我分不清我梦到自己变成机器，还是机器梦到变成我。  
实际上这个真的没有办法判断的。  
看过《黑客帝国》的人最后都会有个疑问：最后那个世界是真是的还是虚拟的。  
看过《盗梦空间》的人也会有这样的想法。  


### 2.3

> A programmer from a very large computer company went to a software conference and then returned to report to his manager, saying: "What sort of programmers work for other companies? They behaved badly and were unconcerned with appearances. Their hair was long and unkempt and their clothes were wrinkled and old. They crashed out hospitality suites and they made rude noises during my presentation."  

> The manager said: "I should have never sent you to the conference. Those programmers live beyond the physical world. They consider life absurd, an accidental coincidence. They come and go without knowing limitations. Without a care, they live only for their programs. Why should they bother with social conventions?"  

> "They are alive within the Tao."  


大概意思是说在计算机大会上，见到的程序员行为随意，着装随意，发型随意，不关心礼仪规矩等等。  
这不就是传说中的程序员吗？  
头发很乱，衣服没有品位，夏天下身永远是短裤和拖鞋。  
这不正是说的是我吗？  

![夏天的我][me]


### 2.4

> A novice asked the Master: "Here is a programmer that never designs, documents, or tests his programs. Yet all who know him consider him one of the best programmers in the world. Why is this?"  

> The Master replies: "That programmer has mastered the Tao. He has gone beyond the need for design; he does not become angry when the system crashes, but accepts the universe without concern. He has gone beyond the need for documentation; he no longer cares if anyone else sees his code. He has gone beyond the need for testing; each of his programs are perfect within themselves, serene and elegant, their purpose self-evident. Truly, he has entered the mystery of the Tao."  

虽然这样的人不存在：不用设计程序，编写文档，测试程序。  
但是当一个人水平足够高的时候，真的可以不用那些繁琐的设计，繁琐的文档，繁琐的测试。  
我曾听说过淘宝有这么一个人，一个人可以干一个部门的任务量，俗称扫地僧。  


## Book Three

### Design

> Thus spake the master programmer:  
> "When program is being tested, it is too late to make design changes."    

当程序开始测试的时候，再改设计就太晚了。  
一般情况下，现在我的风格是初期尽量设计的全面一下，然后在编码过程中边敲代码，边测试，然后还会简单的重构，从而稍微修改设计。  
唯一缺少的就是文档，我这工作不需要文档。  
当然当程序正式上线时，我会抽出一部分时间来在wiki上写一个简单的文档。  



### 3.1

> There once was a man who went to a computer trade show. Each day as he entered, the man told the guard at the door:  
> "I am a great thief, renowned for my feats of shoplifting. Be forewarned, for this trade show shall not escape unplundered."  
> This speech disturbed the guard greatly, because there were millions of dollars of computer equipment inside, so he watched the man carefully. But the man merely wandered from booth to booth, humming quietly to himself.  
> When the man left, the guard took him aside and searched his clothes, but nothing was to be found.  
> On the next day of the trade show, the man returned and chided the guard saying: "I escaped with a vast booty yesterday, but today will be even better." So the guard watched him ever more closely, but to no avail.  
> On the final day of the trade show, the guard could restrain his curiosity no longer. "Sir Thief," he said, "I am so perplexed, I cannot live in peace. Please enlighten me. What is it that you are stealing?"  
> The man smiled. "I am stealing ideas," he said.  


这个故事我不知道他想说什么。  
可能是你费尽心思想得到的东西原来是虚拟的。  



### 3.2

> There once was a master programmer who wrote unstructured programs. A novice programmer, seeking to imitate him, also began to write unstructured programs. When the novice asked the master to evaluate his progress, the master criticized him for writing unstructured programs, saying: "What is appropriate for the master is not appropriate for the novice. You must understand the Tao before transcending structure."  


一个初级程序员，做一个项目的步骤是分析，设计，文档，编码，测试，发布。
而高级的程序员就直接边编码边测试，最后发布了。  


### 3.3

> There was once a programmer who was attached to the court of the warlord of Wu. The warlord asked the programmer: "Which is easier to design: an accounting package or an operating system?"  
> "An operating system," replied the programmer.  
> The warlord uttered an exclamation of disbelief. "Surely an accounting package is trivial next to the complexity of an operating system," he said.  
> "Not so," said the programmer, "when designing an accounting package, the programmer operates as a mediator between people having different ideas: how it must operate, how its reports must appear, and how it must conform to the tax laws. By contrast, an operating system is not limited my outside appearances. When designing an operating system, the programmer seeks the simplest harmony between machine and ideas. This is why an operating system is easier to design."  
> The warlord of Wu nodded and smiled. "That is all good and well, but which is easier to debug?"  
> The programmer made no reply.  


这个故事主要是想诉苦：程序员好苦，平常的项目为什么那么难了，为什么需要那么长时间呢？  
今天产品经理来说这个项目增加一个需求，明天来说这个项目的某个需求有所变化。  
结果是原先的这个项目的设计不能适应新的需求了。  
这就是一个项目为什么总是不能按期完成的原因之一。  


### 3.4

> A manager went to the master programmer and showed him the requirements document for a new application. The manager asked the master: "How long will it take to design this system if I assign five programmers to it?"  
> "It will take one year," said the master promptly.  
> "But we need this system immediately or even sooner! How long will it take it I assign ten programmers to it?"  
> The master programmer frowned. "In that case, it will take two years."  
> "And what if I assign a hundred programmers to it?"  
> The master programmer shrugged. "Then the design will never be completed," he said.  


做一个项目需要一定的人数，但是达到这个人数后，再增加时间就会无限延长了。  
大家都听说过一个和尚有水喝，三个和尚没水喝吧。  
另外一个项目由于往往有一定的复杂性，人多后交流起来也比较困难的。  


## Book Four

### Coding

> Thus spake the master programmer:  

> "A well-written program is its own heaven; a poorly-written program is its own hell."  

### 4.1

> A program should be light and agile, its subroutines connected like a strings of pearls. The spirit and intent of the program should be retained throughout. There should be neither too little nor too much, neither needless loops nor useless variables, neither lack of structure nor overwhelming rigidity.  

> A program should follow the Law of Least Astonishment. What is this law? It is simply that the program should always respond to the user in the way that astonishes him least.  

> A program, no matter how complex, should act as a single unit. The program should be directed by the logic within rather than by outward appearances.  

> If the program fails in these requirements, it will be in a state of disorder and confusion. The only way to correct this is to rewrite the program.  

### 4.2

> A novice asked the master: "I have a program that sometimes runs and sometimes aborts. I have followed the rules of programming, yet I am totally baffled. What is the reason for this?"  

> The master replied: "You are confused because you do not understand the Tao. Only a fool expects rational behavior from his fellow humans. Why do you expect it from a machine that humans have constructed? Computers simulate determinism; only the Tao is perfect.  

> The rules of programming are transitory; only the Tao is eternal. Therefore you must contemplate the Tao before you receive enlightenment."  

> "But how will I know when I have received enlightenment?" asked the novice.  

> "Your program will then run correctly," replied the master.  

### 4.3

> A master was explaining the nature of the Tao to one of his novices, "The Tao is embodied in all software -- regardless of how insignificant, " said the master.  

> "Is the Tao in a hand-held calculator?" asked the novice.  

> "It is," came the reply.  

> "Is the Tao in a video game?" continued the novice.  

> "It is even in a video game," said the master.  

> "And is the Tao in the DOS for a personal computer?"  

> The master coughed and shifted his position slightly. "The lesson is over for today," he said.  

### 4.4

> Prince Wang's programmer was coding software. His fingers danced upon the keyboard. The program compiled without an error message, and the program ran like a gentle wind.  

> Excellent!" the Prince exclaimed, "Your technique is faultless!"  

> "Technique?" said the programmer, turning from his terminal, "What I follow is the Tao -- beyond all technique. When I first began to program I would see before me the whole program in one mass. After three years I no longer saw this mass. Instead, I used subroutines. But now I see nothing. My whole being exists in a formless void. My senses are idle. My spirit, free to work without a plan, follows its own instinct. In short, my program writes itself. True, sometimes there are difficult problems. I see them coming, I slow down, I watch silently. Then I change a single line of code and the difficulties vanish like puffs of idle smoke. I then compile the program. I sit still and let the joy of the work fill my being. I close my eyes for a moment and then log off."  

> Price Wang said, "Would that all of my programmers were as wise!"  


## Book Five


### Maintenace

> Thus spake the master programmer:  

> "Though a program be but three lines long, someday it will have to be maintained."  


### 5.1

> A well-used door needs no oil on its hinges.  

> A swift-flowing steam does no grow stagnant.  

> Neither sound nor thoughts can travel through a vacuum.  

> Software rots if not used.  

> These are great mysteries.  

### 5.2

> A manager asked a programmer how long it would take him to finish the program on which he was working. "I will be finished tomorrow," the programmer promptly replied.  

> "I think you are being unrealistic," said the manager. "Truthfully, how long will it take?"  

> The programmer thought for a moment. "I have some features that I wish to add. This will take at least two weeks," he finally said.  

> "Even that is too much to expect," insisted the manager, "I will be satisfied if you simply tell me when the program is complete."  

> The programmer agreed to this.  

> Several years slated, the manager retired. On the way to his retirement lunch, he discovered the programmer asleep at his terminal. He had been programming all night.  


### 5.3

> A novice programmer was once assigned to code a simple financial package.  

> The novice worked furiously for many days, but when his master reviewed his program, he discovered that it contained a screen editor, a set of generalized graphics routines, and artificial intelligence interface, but not the slightest mention of anything financial.  

> When the master asked about this, the novice became indignant. "Don't be so impatient," he said, "I'll put the financial stuff in eventually."  

### 5.4

> Does a good farmer neglect a crop he has planted?  

> Does a good teacher overlook even the most humble student?  

> Does a good father allow a single child to starve?  

> Does a good programmer refuse to maintain his code?  


## Book Six

### Management

> Thus spake the master programmer:  

> "Let the programmer be many and the managers few -- then all will be productive."  


### 6.1

> When managers hold endless meetings, the programmers write games. When accountants talk of quarterly profits, the development budget is about to be cut. When senior scientists talk blue sky, the clouds are about to roll in.  

> Truly, this is not the Tao of Programming.  

> When managers make commitments, game programs are ignored. When accountants make long-range plans, harmony and order are about to be restored. When senior scientists address the problems at hand, the problems will soon be solved.  

> Truly, this is the Tao of Programming.  


### 6.2

> Why are programmers non-productive? Because their time is wasted in meetings.  

> Why are programmers rebellious? Because the management interferes too much.  

> Why are the programmers resigning one by one? Because they are burnt out.  

> Having worked for poor management, they no longer value their jobs.  

### 6.3

> A manager was about to be fired, but a programmer who worked for him invented a new program that became popular and sold well. As a result, the manager retained his job.  

> The manager tried to give the programmer a bonus, but the programmer refused it, saying, "I wrote the program because I though it was an interesting concept, and thus I expect no reward."  

> The manager, upon hearing this, remarked, "This programmer, though he holds a position of small esteem, understands well the proper duty of an employee. Let's promote him to the exalted position of management consultant!"  

> But when told this, the programmer once more refused, saying, "I exist so that I can program. If I were promoted, I would do nothing but waste everyone's time. Can I go now? I have a program that I'm working on."  

### 6.4

> A manager went to his programmers and told them: "As regards to your work hours: you are going to have to come in at nine in the morning and leave at five in the afternoon." At this, all of them became angry and several resigned on the spot.  

> So the manager said: "All right, in that case you may set your own working hours, as long as you finish your projects on schedule." The programmers, now satisfied, began to come in a noon and work to the wee hours of the morning.  

## Book Seven

### Corporate Wisdom

> Thus spake the master programmer:  

> "You can demonstrate a program for a corporate executive, but you can't make him computer literate."  

### 7.1

> A novice asked the master: "In the east there is a great tree-structure that men call 'Corporate Headquarters'. It is bloated out of shape with vice-presidents and accountants. It issues a multitude of memos, each saying 'Go, Hence!' or 'Go, Hither!' and nobody knows what is meant. Every year new names are put onto the branches, but all to no avail. How can such an unnatural entity exist?"  

> The master replies: "You perceive this immense structure and are disturbed that it has no rational purpose. Can you not take amusement from its endless gyrations? Do you not enjoy the untroubled ease of programming beneath its sheltering branches? Why are you bothered by its uselessness?"  


### 7.2

> In the east there is a shark which is larger than all other fish. It changes into a bird whose wings are like clouds filling the sky. When this bird moves across the land, it brings a message from Corporate Headquarters. This message it drops into the midst of the program- mers, like a seagull making its mark upon the beach. Then the bird mounts on the wind and, with the blue sky at its back, returns home.  

> The novice programmer stares in wonder at the bird, for he understands it not. The average programmer dreads the coming of the bird, for he fears its message. The master programmer continues to work at his terminal, for he does not know that the bird has come and gone.  

### 7.3

> The Magician of the Ivory Tower brought his latest invention for the master programmer to examine. The magician wheeled a large black box into the master's office while the master waited in silence.  

> "This is an integrated, distributed, general-purpose workstation," began the magician, "ergonomically designed with a proprietary operating system, sixth generation languages, and multiple state of the art user interfaces. It took my assistants several hundred man years to construct. Is it not amazing?"  

> The master raised his eyebrows slightly. "It is indeed amazing," he said.  

> "Corporate Headquarters has commanded," continued the magician, "that everyone use this workstation as a platform for new programs. Do you agree to this?"  

> "Certainly," replied the master, "I will have it transported to the data center immediately!" And the magician returned to his tower, well pleased.  

> Several days later, a novice wandered into the office of the master programmer and said, "I cannot find the listing for my new program. Do you know where it might be?"  

> "Yes," replied the master, "the listings are stacked on the platform in the data center."  



### 7.4

> The master programmer moves from program to program without fear. No change in management can harm him. He will not be fired, even if the project is canceled. Why is this? He is filled with the Tao.  

## Book Eight

### Hardware and Software

> Thus spake the master programmer:  

> "Without the wind, the grass does not move. Without software, hardware is useless."  


### 8.1

> A novice asked the master: "I perceive that one computer company is much larger than all others. It towers above its competition like a giant among dwarfs. Any one of its divisions could comprise an entire business. Why is this so?"  

> The master replied, "Why do you ask such foolish questions? That company is large because it is so large. If it only made hardware, nobody would buy it. If it only maintained systems, people would treat it like a servant. But because it combines all of these things, people think it one of the gods! By not seeking to strive, it conquers without effort."  


### 8.2

> A master programmer passed a novice programmer one day. The master noted the novice's preoccupation with a hand-held computer game. "Excuse me", he said, "may I examine it?"  

> The novice bolted to attention and handed the device to the master. "I see that the device claims to have three levels of play: Easy, Medium, and Hard", said the master. "Yet every such device has another level of play, where the device seeks not to conquer the human, nor to be conquered by the human."  

> "Pray, great master," implored the novice, "how does one find this mysterious setting?"  

> The master dropped the device to the ground and crushed it under foot. And suddenly the novice was enlightened.  


### 8.3

> There was once a programmer who worked upon microprocessors. "Look at how well off I am here," he said to a mainframe programmer who came to visit, "I have my own operating system and file storage device. I do not have to share my resources with anyone. The software is self-consistent and easy-to-use. Why do you not quit your present job and join me here?"  

> The mainframe programmer then began to describe his system to his friend, saying: "The mainframe sits like an ancient sage meditating in the midst of the data center. Its disk drives lie end-to-end like a great ocean of machinery. The software is a multi-faceted as a diamond and as convoluted as a primeval jungle. The programs, each unique, move through the system like a swift-flowing river. That is why I am happy where I am."  

> The microcomputer programmer, upon hearing this, fell silent. But the two programmers remained friends until the end of their days.  

### 8.4

> Hardware met Software on the road to Changtse. Software said: "You are the Yin and I am the Yang. If we travel together we will become famous and earn vast sums of money." And so the pair set forth together, thinking to conquer the world.  

> Presently, they met Firmware, who was dressed in tattered rags, and hobbled along propped on a thorny stick. Firmware said to them: "The Tao lies beyond Yin and Yang. It is silent and still as a pool of water. It does not seek fame, therefore nobody knows its presence. It does not seeks fortune, for it is complete within itself. It exists beyond space and time."  

> Software and Hardware, ashamed, returned to their homes.  


## Book Nine

### Epilogue


> Thus spake the master programmer:  

> "Time for you to leave."  


## 历史

* 2014-10-29 记录第一章节中我的理解
* 2014-10-31 记录第二章节中我的理解


[cover]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/2481785402.jpg
[cover-g]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3911178094.jpg
[me]: http://tiankonguse.com/lab/cloudLink/baidupan.php?url=/1915453531/3933663332.jpg
