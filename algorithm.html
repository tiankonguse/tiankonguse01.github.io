<html lang="zh"><head>
<title>algorithm</title>
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
<meta name="title" content="algorithm">
</head>
<body style="position: static;">

<div id="preamble">

</div>

<div id="content">
<h1 class="title">algorithm</h1>


<div id="table-of-contents">
<h2>Table of Contents</h2>
<div id="text-table-of-contents">
<ul>
<li><a href="#sec-1">1 algorithm</a>
<ul>
<li><a href="#sec-1-1">1.1 工程算法</a>
<ul>
<li><a href="#sec-1-1-1">1.1.1 strlen in glibc</a></li>
<li><a href="#sec-1-1-2">1.1.2 consistent hashing</a></li>
<li><a href="#sec-1-1-3">1.1.3 rsync core algorithm</a></li>
<li><a href="#sec-1-1-4">1.1.4 simhash core algorithm</a></li>
<li><a href="#sec-1-1-5">1.1.5 HyperLogLog</a></li>
<li><a href="#sec-1-1-6">1.1.6 CONCISE</a></li>
</ul>
</li>
<li><a href="#sec-1-2">1.2 面试算法</a>
<ul>
<li><a href="#sec-1-2-1">1.2.1 树最长距离问题</a></li>
<li><a href="#sec-1-2-2">1.2.2 开门抽奖问题</a></li>
<li><a href="#sec-1-2-3">1.2.3 等概率选取链表元素问题</a></li>
<li><a href="#sec-1-2-4">1.2.4 查找非重复数字问题</a></li>
<li><a href="#sec-1-2-5">1.2.5 水池最大蓄水问题</a></li>
<li><a href="#sec-1-2-6">1.2.6 赔率系统设计问题</a></li>
<li><a href="#sec-1-2-7">1.2.7 流式计算均值和方差</a></li>
</ul>
</li>
<li><a href="#sec-1-3">1.3 TopCoder</a>
<ul>
<li><a href="#sec-1-3-1">1.3.1 安装和配置</a></li>
<li><a href="#sec-1-3-2">1.3.2 初次DIV2</a></li>
</ul>
</li>
<li><a href="#sec-1-4">1.4 计算机科学最重要的32个算法</a></li>
</ul>
</li>
</ul>
</div>
</div>

<div id="outline-container-1" class="outline-2">
<h2 id="sec-1"><span class="section-number-2">1</span> algorithm</h2>
<div class="outline-text-2" id="text-1">



</div>

<div id="outline-container-1-1" class="outline-3">
<h3 id="sec-1-1"><span class="section-number-3">1.1</span> 工程算法</h3>
<div class="outline-text-3" id="text-1-1">


</div>

<div id="outline-container-1-1-1" class="outline-4">
<h4 id="sec-1-1-1"><span class="section-number-4">1.1.1</span> strlen in glibc</h4>
<div class="outline-text-4" id="text-1-1-1">

<p>参考链接 <a href="http://www.kuqin.com/language/20071113/2308.html">http://www.kuqin.com/language/20071113/2308.html</a>. 这里和链接有点不太一样的就是，这个版本glibc实现考虑了非ASCII字符。
</p>



<pre class="src src-C++">size_t strlen(str)
const char *str;
{
  const char *char_ptr;
  const unsigned long int *longword_ptr;
  unsigned long int longword, himagic, lomagic;

  // 首先是需要对齐到unsigned long int这个长度.
  // 之后就是每个unsigned long int来进行判断.
  // 这样可以加快速度

  /* Handle the first few characters by reading one character at a time.
   * Do this until CHAR_PTR is aligned on a longword boundary.  */
  for (char_ptr = str; ((unsigned long int) char_ptr
                        &amp; (sizeof(longword) - 1)) != 0; ++char_ptr)
    if (*char_ptr == '\0')
      return char_ptr - str;

  /* All these elucidatory comments refer to 4-byte longwords,
   * but the theory applies equally well to 8-byte longwords.  */

  longword_ptr = (unsigned long int *) char_ptr;

  // 为了简化处理的话，我们可以认为sizeof(longword)==8，这样
  // himagic = 0x8080808080808080L
  // lomagic = 0x0101010101010101L

  /* Bits 31, 24, 16, and 8 of this number are zero.  Call these bits
   * the <span class="org-string">"holes."</span>  Note that there is a hole just to the left of
   * each byte, with an extra at the end:
   *
   * bits:  01111110 11111110 11111110 11111111
   * bytes: AAAAAAAA BBBBBBBB CCCCCCCC DDDDDDDD
   *
   * The 1-bits make sure that carries propagate to the next 0-bit.
   * The 0-bits provide holes for carries to fall into.  */
  himagic = 0x80808080L;
  lomagic = 0x01010101L;
  if (sizeof(longword) &gt; 4) {
    /* 64-bit version of the magic.  */
    /* Do the shift in two steps to avoid a warning if long has 32 bits.  */
    himagic = ((himagic &lt;&lt; 16) &lt;&lt; 16) | himagic;
    lomagic = ((lomagic &lt;&lt; 16) &lt;&lt; 16) | lomagic;
  }
  if (sizeof(longword) &gt; 8)
    abort();

  /* Instead of the traditional loop which tests each character,
   * we will test a longword at a time.  The tricky part is testing
   * if *any of the four* bytes in the longword in question are zero.  */
  for (;;) {
    longword = *longword_ptr++;

    // 这里原理非常简单,假设在unsigned long int里面存在一个0的话
    // 那么0-lomagic的话会造成高位为1.如果!=0的话那么至少&gt;=1就不会造成对应字节高字节为1了.
    // 当然这里还有一种情况就是这个不是一个ASCII字符.
    // 使用&amp; ~longword来判断的话,如果高位就为1的话那么就会置为0,这样就排除了非ASCII情况.
    // 然后&amp; himagic的话,来判断是否有高位为1.如果有的话说明这几个字节里面存在0.
    // 如果存在0的话那么就只是针对这8个字节进行枚举

    if (((longword - lomagic) &amp; ~longword &amp; himagic) != 0) {
      /* Which of the bytes was the zero?  If none of them were, it was
       * a misfire; continue the search.  */

      const char *cp = (const char *) (longword_ptr - 1);

      if (cp[0] == 0)
        return cp - str;
      if (cp[1] == 0)
        return cp - str + 1;
      if (cp[2] == 0)
        return cp - str + 2;
      if (cp[3] == 0)
        return cp - str + 3;
      if (sizeof(longword) &gt; 4) {
        if (cp[4] == 0)
          return cp - str + 4;
        if (cp[5] == 0)
          return cp - str + 5;
        if (cp[6] == 0)
          return cp - str + 6;
        if (cp[7] == 0)
          return cp - str + 7;
      }
    }
  }
}
</pre>


</div>

</div>

<div id="outline-container-1-1-2" class="outline-4">
<h4 id="sec-1-1-2"><span class="section-number-4">1.1.2</span> consistent hashing</h4>
<div class="outline-text-4" id="text-1-1-2">

<ul>
<li><a href="http://en.wikipedia.org/wiki/Consistent_hash">http://en.wikipedia.org/wiki/Consistent_hash</a>
</li>
<li>Programmer’s Toolbox Part 3: Consistent Hashing <a href="http://www.tomkleinpeter.com/2008/03/17/programmers-toolbox-part-3-consistent-hashing/">http://www.tomkleinpeter.com/2008/03/17/programmers-toolbox-part-3-consistent-hashing/</a>
</li>
<li>libketama - a consistent hashing algo for memcache clients <a href="http://cn.last.fm/user/RJ/journal/2007/04/10/rz_libketama_-_a_consistent_hashing_algo_for_memcache_clients">http://cn.last.fm/user/RJ/journal/2007/04/10/rz_libketama_-_a_consistent_hashing_algo_for_memcache_clients</a>
</li>
<li>Consistent Hash Ring <a href="http://www.martinbroadhurst.com/Consistent-Hash-Ring.html">http://www.martinbroadhurst.com/Consistent-Hash-Ring.html</a>
</li>
<li>Tom White: Consistent Hashing <a href="http://www.tom-e-white.com/2007/11/consistent-hashing.html">http://www.tom-e-white.com/2007/11/consistent-hashing.html</a>
</li>
<li>Consistent hashing - CodeProject <a href="http://www.codeproject.com/Articles/56138/Consistent-hashing">http://www.codeproject.com/Articles/56138/Consistent-hashing</a>
</li>
<li>一致性hash算法 - consistent hashing <a href="http://blog.csdn.net/sparkliang/article/details/5279393">http://blog.csdn.net/sparkliang/article/details/5279393</a>
</li>
</ul>


<p>
The basic idea behind the consistent hashing algorithm is to hash both objects and caches using the same hash function.The reason to do this is to map the cache to an interval, which will contain a number of object hashes. If the cache is removed then its interval is taken over by a cache with an adjacent interval. All the other caches remain unchanged.
</p>
<p>
一致性hash基本思想就是将所有对象都使用同样的hash函数进行hash(包括要被分布的对象，以及分布到的位置）。如果某个分布位置被移除的话，那么原本在这个位置上的对象就会分布在临近的分布位置上，而其他的对象却不用移动自己的位置。如果分布位置之间interval间隔过大的话那么可以制作virtual node来使得interval映射足够小，而这些virtual node映射到同一个node节点上面。实际上上述文章中也进行实验证明interval小的话那么standard deviations也变小了，每个node均摊的object基本均匀了：）。
</p>
</div>

</div>

<div id="outline-container-1-1-3" class="outline-4">
<h4 id="sec-1-1-3"><span class="section-number-4">1.1.3</span> rsync core algorithm</h4>
<div class="outline-text-4" id="text-1-1-3">

<ul>
<li><a href="http://coolshell.cn/articles/7425.html">http://coolshell.cn/articles/7425.html</a>
</li>
</ul>


<p>
首先针对dst文件按照block分别求得checksum和md5.其中checksum用来进行弱校验，md5用来进行强校验。所谓弱校验就是如果checksum不等的话那么文件内容必然不相同，强校验就是如果md5相同的话那么文件内容必然相同。但是checksum还有一个好处，就是可以根据[k,k+n)的checksum,很快地计算出[k+1,k+n+1)的checksum.（非常类似于滑动窗口的工作方式）这点对于在src文件中查找相同块非常重要。将每个块的(checksum,md5)传输到源端。
</p>
<p>
源端得到每个块的(checksum,md5)之后，根据checksum作为hashcode插入到hashtable中去。这样源端就了解了目的端现在所有块的情况。然后针对src文件做下面操作：
</p><ol>
<li>k=0
</li>
<li>读取[k,k+512)字节得到checksum. 注意这个checksum可以很快地计算出来。
</li>
<li>如果这个checksum存在于hashtable中，那么说明这个块可能目的端存在，goto 3. 否则说明肯定不存在目的端，goto 5.
</li>
<li>比较md5是否相同，如果相同的话那么认为block相同，否则不同。
</li>
<li>如果这个checksum不存在于hashtable的话，那么说明肯定不存在目的端，goto 5.
</li>
<li>如果全部处理完毕的话那么退出，否则k+=1.
</li>
</ol>

<p>这里需要注意就是checksum可以很快地类似于滑动窗口的工作方式计算出来.
</p>
<p>
源端完成了上面这些操作之后，就可以知道那些块目的端是存在的（以及存在于什么地方），自己有那些块是目的端没有的，然后通过传输增量并且文件拼接来达到数据同步的目的。
</p>
</div>

</div>

<div id="outline-container-1-1-4" class="outline-4">
<h4 id="sec-1-1-4"><span class="section-number-4">1.1.4</span> simhash core algorithm</h4>
<div class="outline-text-4" id="text-1-1-4">

<ul>
<li><a href="http://blog.csdn.net/lgnlgn/article/details/6008498">http://blog.csdn.net/lgnlgn/article/details/6008498</a>
</li>
</ul>


<p>
simhash算法针对文档分析得到文档特征的一个向量表示，然后使用这个向量之间的差距就可以作为文档之间的差别大小，可以用来做文档近似判断。
</p>
<p>
simhash算法原理非常简单：
</p><ol>
<li>创建f-bit的V向量初始化为0
</li>
<li>首先针对文档提取一系列特征C{i}（比如可以抽取比较重要的特征词出现次数等），对于每个特征给定一个权重W{i}
</li>
<li>针对每个特征C{i}求出一个f-bit的hash值，遍历hash值每个bit.如果bit=1的话，那么V{i}+=W{i},否则V{i}-=W{i}
</li>
<li>如果V{i}&gt;0那么V{i}=1,否则V{i}=0.这个V{i}就作为这个文档的simhash值
</li>
</ol>


<p>
可以看到如果simhash之间的bit相差小的话，那么文档之间的相似度就更高，这里没有证明但是可以比较感性地感觉到。两个simhash之间的bit差异个数叫做海明距离。直接比较两个simhash海明距离非常简单，
</p>
<p>
但是现实中有另外一种情况是，我们已经有一组很大的文档集合S以及对应的simhash值，现在我们有一个新来的文档d以及simhash值，我们需要判断在S中是否有和d海明距离小于k的文档。
</p>
<p>
假设S是排好序的个数是N，我们simhash f=64.如果k非常小比如{1,2,3}的话，那么可以枚举和d simhash相差k的所有simhash值，然后再S里面进行检索，时间复杂度在C(64,k)*lgN.但是如果k比较大比如&gt;=10的话，那么我们可以先对S进行分段搜索：
</p><ol>
<li>我们对S进行分段，每次取出2^m个元素，我们确保2^m个元素高位有m’相同。因为S排好序所以通常m'很高。
</li>
<li>我们首先对于m'个位和d simhash高位判断有多少位存在差异，假设x存在差异.这样我们可以在2^m元素判断m-x差异的元素。
</li>
<li>总体思想来说的话就是希望可以缩小搜索集。似乎在算法复杂度上面没有啥改进，可以在实现上改进。
</li>
</ol>

<p>不过话说回来，文档近似判断应该k很小在{1,2}左右, 对应的C(64,k)={64,2016}
</p>
</div>

</div>

<div id="outline-container-1-1-5" class="outline-4">
<h4 id="sec-1-1-5"><span class="section-number-4">1.1.5</span> HyperLogLog</h4>
<div class="outline-text-4" id="text-1-1-5">

<ul>
<li><a href="http://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf">http://algo.inria.fr/flajolet/Publications/FlFuGaMe07.pdf</a>
</li>
<li>Fast, Cheap, and 98% Right: Cardinality Estimation for Big Data | Metamarkets <a href="http://metamarkets.com/2012/fast-cheap-and-98-right-cardinality-estimation-for-big-data/">http://metamarkets.com/2012/fast-cheap-and-98-right-cardinality-estimation-for-big-data/</a>
</li>
<li>Damn Cool Algorithms: Cardinality Estimation - Nick's Blog <a href="http://blog.notdot.net/2012/09/Dam-Cool-Algorithms-Cardinality-Estimation">http://blog.notdot.net/2012/09/Dam-Cool-Algorithms-Cardinality-Estimation</a>
</li>
<li>Sketch of the Day: HyperLogLog — Cornerstone of a Big Data Infrastructure – AK Tech Blog <a href="http://blog.aggregateknowledge.com/2012/10/25/sketch-of-the-day-hyperloglog-cornerstone-of-a-big-data-infrastructure/">http://blog.aggregateknowledge.com/2012/10/25/sketch-of-the-day-hyperloglog-cornerstone-of-a-big-data-infrastructure/</a>
</li>
<li><a href="http://stackoverflow.com/questions/12327004/how-does-the-hyperloglog-algorithm-work">http://stackoverflow.com/questions/12327004/how-does-the-hyperloglog-algorithm-work</a>
</li>
<li>HyperLogLog in Practice: Algorithmic Engineering of a State of The Art Cardinality Estimation Algorithm : <a href="http://research.google.com/pubs/pub40671.html">http://research.google.com/pubs/pub40671.html</a>
</li>
<li><a href="https://github.com/clearspring/stream-lib">https://github.com/clearspring/stream-lib</a> <b>note(dirlt):HyperLogLogPlus实现</b>
</li>
</ul>


<p>
这个算法主要是来进行去重的，前提是在big data下面并且内存存在限制。算法的假设和原理如下：
</p>
<p class="verse">
Given a random uniform distribution for likelihoods of N 0s and 1s, you can extract a probability distribution for the likelihood of a specific phenomenon.  The phenomenon we care about is the maximum index of a 1 bit.  Specifically, we expect the following to be true:<br>
<br>
50% of hashed values will look like this: 1xxxxxxx…x<br>
25% of hashed values will look like this: 01xxxxxx…x<br>
12.5% of hashed values will look like this: 001xxxxxxxx…x<br>
6.25% of hashed values will look like this: 0001xxxxxxxx…x<br>
<br>
So, naively speaking, we expect that if we were to hash 8 unique things, one of them will start with 001.  If we were to hash 4 unique things, we would expect one to start with 01.  This expectation can also be inverted: if the “highest” index of a 1 is 2 (we start counting with index 1 as the leftmost bit location), then we probably saw ~4 unique values.  If the highest index is 4, we probably saw ~16 unique values.  This level of approximation is pretty coarse and it is pretty easy to see that it is only approximate at best, but it is the basic idea behind HyperLogLog.<br>
<br>
The adjustment HyperLogLog makes is that it essentially takes the above algorithm and introduces multiple “buckets”.  That is, you can take the first k bits of the hashed value and use that as a bucket index, then you keep track of the max(index of 1) for the remaining bits in that bucket.  The authors then provide some math for converting the values in all of the buckets back into an approximate cardinality.<br>
<br>
Another interesting thing about this algorithm is that it introduces two parameters to adjust the accuracy of the approximation:<br>
1)   Increasing the number of buckets (the k) increases the accuracy of the approximation<br>
2)   Increasing the number of bits of your hash increases the highest possible number you can accurately approximate<br>
</p>


<p>
下面是这个算法的一个实现：
</p>


<pre class="src src-Python">def trailing_zeroes(num):
  <span class="org-string">"""Counts the number of trailing 0 bits in num."""</span>
  if num == 0:
    return 32 # Assumes 32 bit integer inputs!
  p = 0
  while (num &gt;&gt; p) &amp; 1 == 0:
    p += 1
  return p

def estimate_cardinality(values, k):
  <span class="org-string">"""Estimates the number of unique elements in the input set values.</span>

<span class="org-string">  Arguments:</span>
<span class="org-string">    values: An iterator of hashable elements to estimate the cardinality of.</span>
<span class="org-string">    k: The number of bits of hash to use as a bucket number; there will be 2**k buckets.</span>
<span class="org-string">  """</span>
  num_buckets = 2 ** k
  max_zeroes = [0] * num_buckets
  for value in values:
    h = hash(value)
    bucket = h &amp; (num_buckets - 1) # Mask out the k least significant bits as bucket ID
    bucket_hash = h &gt;&gt; k
    max_zeroes[bucket] = max(max_zeroes[bucket], trailing_zeroes(bucket_hash))
  return 2 ** (float(sum(max_zeroes)) / num_buckets) * num_buckets * 0.79402
</pre>

<p>
这个算法上面存在一些差别，就是这个算法实现是假设末尾为0的概率为0.5,末尾为10的概率为0.25，以此类推。最后的0.79402应该是调整系数。
</p>
<p>
另外还有一个SuperLogLog针对HyperLogLog做了一些改进降低了错误的概率：
</p><ul>
<li>去掉30%的最大的bucket，只是计算剩余70%的bucket
</li>
<li>max_zeroes的计算不是使用geometric mean而是使用harmonic mean
</li>
</ul>


<p>
这个算法可以很容易地并行化。可以让每个机器各自维护各自的bucket，最后每个机器上面属于相同的bucket index的bucket进行merge即可。
</p>
</div>

</div>

<div id="outline-container-1-1-6" class="outline-4">
<h4 id="sec-1-1-6"><span class="section-number-4">1.1.6</span> CONCISE</h4>
<div class="outline-text-4" id="text-1-1-6">

<ul>
<li>Maximum Performance with Minimum Storage: Data Compression in Druid | Metamarkets <a href="http://metamarkets.com/2012/druid-bitmap-compression/">http://metamarkets.com/2012/druid-bitmap-compression/</a>
</li>
<li>CONCISE(COpressed N Composable Integer Set)  <a href="http://ricerca.mat.uniroma3.it/users/colanton/docs/concise.pdf">http://ricerca.mat.uniroma3.it/users/colanton/docs/concise.pdf</a>
</li>
</ul>


<p>
这个算法主要是解决如何压缩一个可组合的整数集合，或者可以是认为如何压缩一个稀疏的bitmap. 链接1主要是介绍了一下背景，在他们的系统里面需要保存一个稀疏bitmap。链接2是原始论文，想了解具体内容还是看看这个比较好。
</p>
<p>
这个算法应该是在WAH（Word Aligned Hybrid）上改进的。下面是WAH的简单描述
</p><ul>
<li>WAH是已31bit为一个处理单位，这里我们称为block
</li>
<li>如果block里面有0和1的话，那么使用&lt;1&gt; block表示
</li>
<li>如果block里面只有0的话，并且连续n个block都是这样的话，那么使用&lt;00&gt; &lt;n&gt;
</li>
<li>如果只有1的话，那么前缀使用&lt;01&gt;
</li>
</ul>

<p><img src="./images/concise-wah.png" alt="./images/concise-wah.png">
</p>
<p>
可以看到其实&lt;n&gt;最长为2^30-1（肯定不会为0）.但是实际上大部分到不了这么长。剩余的空间就会存在浪费。
</p>
<p>
CONCISE针对这个部分稍微改进了一下
</p><ul>
<li>the following 5 bits are the position of a “flipped” bit within the first 31-bit block of the fill（剩余的5个bit表示从在第几位存在一个反转，这个可以处理一些特殊情况）
</li>
<li>and the remaining 25 bits count the number of 31-blocks that compose the fill minus one. （剩余的25个bit表示后面存在多少个31bit blocks)
</li>
</ul>

<p>可以看到最大的范围是31 + 2^25 * 31 = 1040187423 , 如果从0开始的话，那么就是[0,1040187422]
</p>
<p>
下面是一个例子， Compressed representation of the set {3, 5, 31–93, 1024, 1028, 1 040 187 422}.
</p><ul>
<li>The word #0 is used to represent integers in the range 0–30,
</li>
<li>word #1 for integers in 31–92, （5bit为0，说明这个31bit是完全填充。25bit=1表示后面1 * 31个bit全为1，范围就是从31到31(start) + 31 + 31 - 1 = 92.
</li>
<li>word #2 for integers 93–1022, （5bit为1，说明下一个31bit的第一个元素是反转的也就是93。范围从93到93(start) + 31 + 29 * 31 - 1 = 1022
</li>
<li>word #3 for integers 1023–1053,
</li>
<li>word #4 for integers 1054–1 040 187 391,
</li>
<li>and word #5 for integers 1 040 187 392–1 040 187 422.
</li>
</ul>

<p><img src="./images/concise-concise.png" alt="./images/concise-concise.png">
</p>
<p>
论文后面还给了一些 <b>直接在这种压缩表示</b> 上面的算法。
</p>
</div>
</div>

</div>

<div id="outline-container-1-2" class="outline-3">
<h3 id="sec-1-2"><span class="section-number-3">1.2</span> 面试算法</h3>
<div class="outline-text-3" id="text-1-2">


</div>

<div id="outline-container-1-2-1" class="outline-4">
<h4 id="sec-1-2-1"><span class="section-number-4">1.2.1</span> 树最长距离问题</h4>
<div class="outline-text-4" id="text-1-2-1">

<p>树的最长距离定义为任意两个节点之间距离的最大值。咋一看这个问题，似乎就是根节点左子树高度和右子树高度之和，但是实际上可能对于子树里面可能会存在更长的距离。对于最长距离的话应该仅存在于这两者之间。
</p>



<pre class="src src-Python">#!/usr/bin/env python
#coding:utf-8
#Copyright (C) dirlt

def tree_dist(root):
    if(not root):
        return (0,-1,-1)
    (a,b,c)=tree_dist(root.left)
    (d,e,f)=tree_dist(root.right)
    ml=max(b,c)+1 # 左子树高度
    mr=max(e,f)+1 # 右子树高度
    path=ml+mr+1 # root内部最长距离
    return (max(a,d,path),ml,mr)

def TreeDistance(root):
    return tree_dist(root)[0]
</pre>


<p>
对于返回元组来说的话(a,b,c)，a表示树的最长距离，b表示左子树的高度，c表示右子树的高度。
</p>

<hr>

<p>
leetcode上也有类似的题目，但是考虑上了树节点值 <a href="http://oj.leetcode.com/problems/binary-tree-maximum-path-sum/">http://oj.leetcode.com/problems/binary-tree-maximum-path-sum/</a> 情况就更加复杂，代码也更不容易写对。
</p>



<pre class="src src-C++">class Solution {
 public:
  int maxPathSum(TreeNode *root) {
    // Start typing your C/C++ solution below
    // DO NOT write int main() function
    if(root == NULL) {
      return 0;
    }
    int p;
    int s = side(root,&amp;p);
    return max(s,p);
  }

  // path means max sum in root, but not contains root node,
  // so it does not contribute the parent.(but if contains root node, it doesn't matter)
  // because we just get max of it.
  // function return value max sum including root node.
  int side(TreeNode* root,int* path) {
    if(root-&gt;left == NULL &amp;&amp; root-&gt;right == NULL) {
      *path = root-&gt;val;
      return root-&gt;val;
    } else if(root-&gt;left == NULL) {
      int rp;
      int r= side(root-&gt;right,&amp;rp);
      *path = max(r,rp);
      return max(0,r) + root-&gt;val;
    } else if(root-&gt;right == NULL) {
      int lp;
      int l = side(root-&gt;left,&amp;lp);
      *path = max(l,lp);
      return max(0,l) + root-&gt;val;
    } else {
      int lp,rp;
      int l = side(root-&gt;left,&amp;lp);
      int r = side(root-&gt;right,&amp;rp);
      int p = max(max(l,r),max(lp,rp));
      p = max(p, max(0,l) + max(0,r) + root-&gt;val);
      *path = p;
      return max(max(0,l), max(0,r)) + root-&gt;val;
    }
  }
};
</pre>


</div>

</div>

<div id="outline-container-1-2-2" class="outline-4">
<h4 id="sec-1-2-2"><span class="section-number-4">1.2.2</span> 开门抽奖问题</h4>
<div class="outline-text-4" id="text-1-2-2">

<p>原题是有三扇门，一扇门后面是一辆汽车，后面两扇门没有东西。主持人首先让你选择一扇门，之后主持人打开一扇后面没有任何东西的门，然后主持人问你是否需要更换你的选择？扩展一下这个问题，如果扩展到N(N&gt;=3)扇门的话，那么之前和之后中奖概率分别是多少？
</p>
<p>
第一步是随机选择那么概率是1/N.但是第二步概率可以这样考虑：
</p><ol>
<li>我当前选择中奖几率是1/N,那么在其他doors后面的几率是N-1/N.
</li>
<li>主持人打开门之后，如果我坚持当前选择的话，中奖几率是没有变化的。剩余的doors后面几率依然是N-1/N.
</li>
<li>而现在剩余的doors只有N-2扇。如果挑选那些剩余doors的话，那么几率是(N-1)/(N*(N-2)).这个几率比1/N要好.
</li>
</ol>

<p>这里如果我们不是换成剩余的doors而是重新选择的话，那么几率依然是(N-1)/(N*(N-1)=1/N.和原来几率是一样的没有变化。
</p>
<p>
思考的关键在于，主持人这个行为对你当前选择的概率是没有任何影响的。因为无论如何主持人都可以打开一扇空门出来。
</p>
</div>

</div>

<div id="outline-container-1-2-3" class="outline-4">
<h4 id="sec-1-2-3"><span class="section-number-4">1.2.3</span> 等概率选取链表元素问题</h4>
<div class="outline-text-4" id="text-1-2-3">

<p>等概率选取未知长度的链表中的元素，要求是只能够遍历这个链表一次。下面是代码， <b>注意这里的wanted会不断地被更新</b>
</p>


<pre class="src src-C++">int nmatch = 0;
for ( p=list; p!=NULL; p=p-&gt;next ){
    if ( rand() % ++nmatch == 0 ){
        wanted = p;
    }
}
</pre>


<p>
这个问题可以如此考虑，假设长度为n，那么最后一个元素被选出（选中）的概率为1/n，然后我们考虑倒数第二个元素选出的概率
</p><ul>
<li>倒数第二个元素必须被 <b>选中</b> ，概率为1/(n-1)
</li>
<li>并且确保倒数第一个元素没有被 <b>选中</b> 。因为最后一个选中概率为1/n，所以最后一个元素不被选中概率为(n-1)/n
</li>
</ul>

<p>因此倒数第二个元素被选出的概率为 1/(n-1) * (n-1)/n = 1/n. 同理计算对于每一个元素的概率都是 1/n.
</p>
</div>

</div>

<div id="outline-container-1-2-4" class="outline-4">
<h4 id="sec-1-2-4"><span class="section-number-4">1.2.4</span> 查找非重复数字问题</h4>
<div class="outline-text-4" id="text-1-2-4">


<hr>
<p>
有一堆数，只有 <b>一个</b> 数出现单次，其余数都出现 <b>偶数</b> 次。
</p>
<p>
a1 a1 a2 a2 … an an X
</p>
<p>
这个问题只要将所有的值xor，那么对于a1 xor a1 = 0, 因此结果就剩下X
</p>
<p>
<a href="http://oj.leetcode.com/problems/single-number/">http://oj.leetcode.com/problems/single-number/</a>
</p>



<pre class="src src-C++">class Solution {
 public:
  int singleNumber(int A[], int n) {
    // Note: The Solution object is instantiated only once and is reused by each test case.
    int x = 0;
    for(int i=0;i&lt;n;i++) {
      x ^= A[i];
    }
    return x;
  }
};
</pre>



<hr>
<p>
有一堆数，只有 <b>两个</b> 数出现单次，其余数都出现 <b>偶数</b> 次。
</p>
<p>
a1 a1 a2 a2 … an an X Y
</p>
<p>
这个问题可以简化成为上面一个问题，同样首先将上面所有的值xor, 那么得到m = X xor Y. 然后我们找到m某一个bit为1，假设这个bit为k
</p>
<p>
然后再次遍历这堆数字，将bit k==1的元素作为一个集合，bit k==0的元素作为一个集合。这样划分的道理是可以确保X，Y肯定分属于两个集合，并且对于每个集合而言，又回到了上面那个问题。
</p>

<hr>
<p>
有一堆数，只有 <b>一个</b> 数出现单次，其余数都出现 <b>三次</b> 。
</p>
<p>
a1 a1 a1 a2 a2 a2 … an an an X
</p>
<p>
假设每个数字都是64bit的话，我们可以开辟a0(64) a1(64). 然后统计每个数每个bit上面的0，1个数，并且叠加到a0,a1上。a0(i)表示bit i上为0的个数，a1(i)表示bit i上为1的个数。
</p>
<p>
这样处理之后，遍历a0,a1.如果a0(i) % 3 == 0的话，那么说明a1(i)%3!=0，并且X在bit i上面肯定是为1的，反之亦然。
</p>
<p>
并且这个处理方法可以扩展到其余数出现 <b>任意次</b> 。
</p>
<p>
<a href="http://oj.leetcode.com/problems/single-number-ii/">http://oj.leetcode.com/problems/single-number-ii/</a>
</p>



<pre class="src src-C++">class Solution {
 public:
  int singleNumber(int A[], int n) {
    // Note: The Solution object is instantiated only once and is reused by each test case.
    int mask[32]; // sizeof(int) == 32;
    memset(mask,0,sizeof(mask));
    for(int i=0;i&lt;n;i++) {
      R(A[i],mask);
    }
    int code = S(mask);
    return code;
  }
  void R(int a,int mask[]) {
    for(int i=0;i&lt;32;i++) {
      if(a &amp; 0x1) {
        mask[i] = (mask[i] + 1) % 3;
      }
      a &gt;&gt;= 1;
    }
  }
  int S(int mask[]) {
    int code = 0;
    for(int i=31;i&gt;=0;i--) {
      code = (code &lt;&lt; 1) + mask[i];
    }
    return code;
  }
};
</pre>


</div>

</div>

<div id="outline-container-1-2-5" class="outline-4">
<h4 id="sec-1-2-5"><span class="section-number-4">1.2.5</span> 水池最大蓄水问题</h4>
<div class="outline-text-4" id="text-1-2-5">

<p>考虑一个二维直方图平面，X轴单位为1，Y轴是直方图高度。假设向这个直方图里面灌水，请问这个直方图能够容纳多少水。
</p>
<p>
举个例子，假设有下面直方图 9，4，5，10，很明显最终9，10会两侧的水，并且水面高度为9，因此对于4来说的话就会容纳5单位，5就容纳4个单位，因此一共容纳9个单位。
</p>

<hr>

<p>
这个问题我一开始的想法就是首先我们可以找出两个最高的点，这两个点之间肯定是可以存水的。然后以这两个点为划分，考虑剩余的区域。简单地说就是一个Divide and Conquer的方法。找出两个最高点时间复杂度为O（n)，然后两个点划分的话，类似于快排的时间复杂度，因此时间复杂度为O（nlgn）
</p>
<p>
另外一个比较好的办法就是只是考虑某一个直方图容纳水多少。对于这个点来说，它所容纳的高度取决于它的左右两边最大高度。因此我们可以先对这个直方图做一个预处理，求解得到left[i]表示第i个柱子左边最大高度，right[i]表示第i个柱子右边最大高度，这个预处理O（n)就可以计算完成。然后再一遍处理即可求解结果。
</p>

<hr>

<p>
@2013-10-13 今天在leetcode也看到了相似的题目，<a href="http://oj.leetcode.com/problems/container-with-most-water/">http://oj.leetcode.com/problems/container-with-most-water/</a> 虽然题目意思不一样，但是我本能地按照这个问题也编写代码了。结果发现上面的解决办法还是有很多corner case的，比如如果每个线是递增的话怎么办？今天编写leetcode的时候我重新考虑了一下这个问题，然后有个应该是可行的实现。
</p><ul>
<li>dp[i]表示xi(包括xi)的右边最大高度
</li>
<li>p = 0
<ul>
<li>如果p+1右边有比h[p]高的话，那么找到第一个比这个h[p]高的点做计算，然后下面从这个点继续
</li>
<li>如果p+1右边没有比h[p]高的话，那么选择最高点计算，然后以最高点继续。
</li>
</ul>

</li>
<li>时间空间复杂度在O(n)
</li>
</ul>





<pre class="src src-C++">class Solution {
 public:
  int n;
  int* dp;
  int maxArea(vector&lt;int&gt; &amp;height) {
    // Note: The Solution object is instantiated only once and is reused by each test case.
    n = height.size();
    if(n == 0) {
      return 0;
    }
    // dp[i] highest one since xi.
    dp = new int[n];
    dp[n-1]=n-1;
    for(int i=n-1;i&gt;=1;i--) {
      int h = height[i-1];
      if(h &gt;= height[dp[i]]) {
        dp[i-1] = i-1;
      } else {
        dp[i-1] = dp[i];
      }
    }
    // solution.
    int res = 0;
    int p = 0;
    while(p!=(n-1)) {
      int np = p+1;
      //printf(<span class="org-string">"%d %d\n"</span>,p,np);
      int nph = height[dp[np]];
      if(nph &gt;= height[p]) {
        while(np &lt; n &amp;&amp; height[np] &lt; height[p]) np++;
        res += (np - p) * height[p];
        p = np;
      } else {
        res += (dp[np] - p) * nph;
        p = dp[np];
      }
    }
    delete[] dp;
    return res;
  }
};
</pre>



<hr>

<p>
另外一个题目的变形是 <a href="http://oj.leetcode.com/problems/container-with-most-water/">http://oj.leetcode.com/problems/container-with-most-water/</a> 题目的大致要求是找到两个点，这两个点围成的container蓄水最多。似乎没有O(n^2)以下的算法了，但是可以做比较深度的减枝。假设两个点是xi,xj.有两个特性可以用来减枝。
</p><ul>
<li>如果x(i+1) &lt;= x(i)的话，那么蓄水量肯定要少。
</li>
<li>从n-1到i+1区间来选择j,  如果一旦存在x(j)&gt;=x(i)的话，那么剩余的点不用考虑。
</li>
</ul>




<pre class="src src-C++">class Solution {
 public:
  int n;
  int maxArea(vector&lt;int&gt; &amp;height) {
    // Note: The Solution object is instantiated only once and is reused by each test case.
    n = height.size();
    if(n == 0) {
      return 0;
    }
    int res = 0;
    int lm = 0;
    for(int i=0;i&lt;n;i++) {
      if(height[i] &lt;= lm) continue; // prune.
      lm = height[i];
      for(int j=n-1;j&gt;i;j--) {
        res = max(res,(j-i) * min(height[i],height[j]));
        if(height[j] &gt;= height[i]) {
          break;
        }
      }
    }
    return res;
  }
};
</pre>


</div>

</div>

<div id="outline-container-1-2-6" class="outline-4">
<h4 id="sec-1-2-6"><span class="section-number-4">1.2.6</span> 赔率系统设计问题</h4>
<div class="outline-text-4" id="text-1-2-6">

<p>note(dirlt)：2012.6.14
</p>
<p>
昨天大家说做一个赌球赔率系统，晚上Hai教我了一些基本的东西。
</p>
<p>
所有这里讨论的赔率问题都是0-1模型的，就是众多结果中的话只有一个是成功的，其他都是失败的。好比小组赛Germany vs. Spanish,我们可以设置不同的盘口来符合0-1模型。比如：
</p><ul>
<li>win draw lose，
</li>
<li>Germany净胜球超过3个, &gt;1 &amp;&amp; &lt;=3, &lt;=1
</li>
</ul>


<p>
考虑下面有N个盘口，各个盘口的赔率分别是1:b{i}.如果庄家不抽水的话，那么赔率的倒数相加是=1的，而每个赔率的倒数就是这个盘口出现的概率。比如今天晚上意大利 vs. 克罗地亚，赔率是
</p><ul>
<li>win 2.22
</li>
<li>draw 3.16
</li>
<li>lose 3.30
</li>
</ul>

<p>折合计算概率就是
</p><ul>
<li>win 0.45
</li>
<li>draw 0.32
</li>
<li>lose 0.3
</li>
</ul>

<p>概率加起来0.45+0.32+0.3=1.07(&gt;1说明庄家在抽水，越大说明抽水越多).
</p>
<p>
如果我们知道各个盘口的金额的话，那么可以很容易地设计一个赔率让庄家抽水，可以参看这篇文章 <a href="http://bbs.178.com/viewthread.php?tid=329140">http://bbs.178.com/viewthread.php?tid=329140</a> 。方法非常简单，我们考虑两个ab球队，分别赌注N,M.假设我们希望抽水K的话，
</p><ul>
<li>如果a win,那么我们希望只是输掉(M-K).所以赔率应该是1:1+(M-K)/N
</li>
<li>如果b win,那么我们希望只是输掉(N-K).所以赔率应该是1:1+(N-K)/M
</li>
</ul>

<p>但是赔率至少应该有得赚，所以M-K&gt;0 &amp;&amp; N-K&gt;0.因此K
</p>

<hr>

<p>
但是现实中存在下面一些问题：
</p><ul>
<li>如何bootstrap呢?（设定初始赔率）。note(dirlt)：我们可以首先计算出双方获胜概率p,计算出赔率1/p.为了抽水了降低赔率比如1/p*0.9.这样最后概率计算出来就会是1/0.9了。
</li>
<li>如果某一方没有压钱的话，那么相当于是庄家自己在赌博。
</li>
<li>现实生活中是先看到赔率然后再下手的，下手之后这笔钱对应的赔率应该是不变的。而我们设计的模型是假设钱都已经到位了之后，我们再来定义赔率。
</li>
</ul>


</div>

</div>

<div id="outline-container-1-2-7" class="outline-4">
<h4 id="sec-1-2-7"><span class="section-number-4">1.2.7</span> 流式计算均值和方差</h4>
<div class="outline-text-4" id="text-1-2-7">

<ul>
<li><a href="http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance">http://en.wikipedia.org/wiki/Algorithms_for_calculating_variance</a>
</li>
<li><a href="http://www.johndcook.com/standard_deviation.html">http://www.johndcook.com/standard_deviation.html</a>
</li>
</ul>


<p>
需要注意区分如下概念。可以参见wikipedia
</p><ul>
<li><a href="http://en.wikipedia.org/wiki/Standard_deviation">http://en.wikipedia.org/wiki/Standard_deviation</a>
</li>
<li><a href="http://baike.baidu.com/view/172036.htm">http://baike.baidu.com/view/172036.htm</a>
</li>
<li>标准差(standard deviation), 方差算术平方根
</li>
<li>方差(variance, variance of an entire population)
</li>
<li>样本标准差(sample standard deviation), 样本方差算术平方根
</li>
<li>样本方差(sample variance, unbiased estimate of the population variance)
</li>
</ul>


<p>
对方差计算可以做如下简化, 其中Xi表示第i个元素，Xe表示平均值
</p>


<pre class="example">th^2 * n = (X1-Xe)^2 + (X2-Xe)^2 + (X3-Xe)^2 + ... (Xi-Xe)^2 + .. (Xn-Xe)^2
         = (X1^2 + X2^2 + ... Xi^2 + ... + Xn^2) - 2 * Xe * (X1 + X2 + ... Xi + ... Xn) + n * Xe^2
         = (X1^2 + X2^2 + ... Xi^2 + ... + Xn^2) - 2 * Xe * n * Xe + n * Xe^2
         = (X1^2 + X2^2 + ... Xi^2 + ... + Xn^2) - n * Xe^2
</pre>


</div>
</div>

</div>

<div id="outline-container-1-3" class="outline-3">
<h3 id="sec-1-3"><span class="section-number-3">1.3</span> TopCoder</h3>
<div class="outline-text-3" id="text-1-3">


</div>

<div id="outline-container-1-3-1" class="outline-4">
<h4 id="sec-1-3-1"><span class="section-number-4">1.3.1</span> 安装和配置</h4>
<div class="outline-text-4" id="text-1-3-1">

<p>安装topcoder非常简单：
</p><ul>
<li>确认安装好javaws，因为topcoder客户端是一个java applet
</li>
<li>下载topcoder的客户端 # wget  <a href="http://www.topcoder.com/contest/arena/ContestAppletProd.jnlp">http://www.topcoder.com/contest/arena/ContestAppletProd.jnlp</a>
</li>
<li>启动这个applet之后就就可以进入arena了。
</li>
</ul>


<p>
为了方便地使用topcoder（比如将一些testcase下载下来的话），可以使用一些插件。个人觉得下面这个组合不错
</p><ul>
<li>code processor
</li>
<li>file edit
</li>
<li>TZTester
</li>
</ul>

<p>这些插件都可以在这里找到 <a href="http://community.topcoder.com/tc?module=Static&amp;d1=applet&amp;d2=plugins">http://community.topcoder.com/tc?module=Static&amp;d1=applet&amp;d2=plugins</a>
</p>
<p>
三个插件的下载地址分别是：
</p><ul>
<li><a href="http://community.topcoder.com/contest/classes/TZTester/TZTester.jar">http://community.topcoder.com/contest/classes/TZTester/TZTester.jar</a>
</li>
<li><a href="http://community.topcoder.com/contest/classes/CodeProcessor/CodeProcessor.jar">http://community.topcoder.com/contest/classes/CodeProcessor/CodeProcessor.jar</a>
</li>
<li><a href="http://community.topcoder.com/contest/classes/FileEdit/FileEdit.jar">http://community.topcoder.com/contest/classes/FileEdit/FileEdit.jar</a>
</li>
</ul>


<p>
下载完成之后在topcoder客户端里面的options-&gt;Editor里面进行配置
</p><ul>
<li>Add增加一个Editor
</li>
<li>EntryPoint填写 codeprocessor.EntryPoint
</li>
<li>ClassPath将前面三个jar选择上
</li>
<li>然后选择这个为Default Editor
</li>
<li>然后点击Configure
</li>
<li>EntryPoint填写 fileedit.EntryPoint
</li>
<li>processor class填写 tangentz.TZTester
</li>
</ul>


<p>
继续点击Configure选项，在General这个部分基本上没有什么需要修改的：
</p><ul>
<li>read/write problem to ./topcoder # 将题目保存到topcoder目录里面
</li>
<li><b>todo(dirlt):more</b>
</li>
</ul>

<p>然后就是配置Code Template。如果使用C++的话，那么可以考虑使用下面的模板
</p>


<pre class="src src-C++">/* coding:utf-8
 * Copyright (C) dirlt
 */
#include &lt;cstdlib&gt;
#include &lt;cctype&gt;
#include &lt;cstring&gt;
#include &lt;cstdio&gt;
#include &lt;cmath&gt;
#include &lt;ctime&gt;
#include &lt;iostream&gt;
#include &lt;sstream&gt;
#include &lt;vector&gt;
#include &lt;string&gt;
#include &lt;map&gt;
#include &lt;set&gt;
#include &lt;algorithm&gt;
#include &lt;queue&gt;
#include &lt;stack&gt;
using namespace std;
typedef long long ll;

class $CLASSNAME$ {
 public:
  $RC$ $METHODNAME$($METHODPARMS$) {
  }
  $TESTCODE$
};

// BEGIN CUT HERE
int main() {
  $CLASSNAME$ ___test;
  ___test.run_test(-1);
  return 0;
}
// END CUT HERE
</pre>


<p>
以后每次打开题目都会在本地保存一份代码，并且里面附带测试用例，本地完成之后直接load即可保存到远程。nice!!!
</p>
</div>

</div>

<div id="outline-container-1-3-2" class="outline-4">
<h4 id="sec-1-3-2"><span class="section-number-4">1.3.2</span> 初次DIV2</h4>
<div class="outline-text-4" id="text-1-3-2">

<p><img src="./images/virgin-topcoder-div2.jpg" alt="./images/virgin-topcoder-div2.jpg">
</p>
</div>
</div>

</div>

<div id="outline-container-1-4" class="outline-3">
<h3 id="sec-1-4"><span class="section-number-3">1.4</span> 计算机科学最重要的32个算法</h3>
<div class="outline-text-3" id="text-1-4">

<p><a href="http://www.infoq.com/cn/news/2012/08/32-most-important-algorithms">http://www.infoq.com/cn/news/2012/08/32-most-important-algorithms</a>
</p>
<ol>
<li>A* 搜索算法
</li>
<li>集束搜索(又名定向搜索，Beam Search)
</li>
<li>二分查找(Binary Search)
</li>
<li>分支界定算法(Branch and Bound)
</li>
<li>Buchberger算法
</li>
<li>数据压缩(Data Compression)
</li>
<li>Diffie-Hellman密钥交换算法
</li>
<li>Dijkstra算法
</li>
<li>离散微分算法(Discrete differentiation)
</li>
<li>动态规划算法(Dynamic Programming)
</li>
<li>欧几里得算法(Euclidean algorithm)
</li>
<li>期望-最大算法(Expectation-maximization algorithm, EM-Training)
</li>
<li>快速傅里叶变换(FFT, Fast Fourier Transform)
</li>
<li>梯度下降(Gradient descent)
</li>
<li>哈希算法(Hashing)
</li>
<li>堆排序(Heaps)
</li>
<li>Karatsuba乘法
</li>
<li>LLL算法(Lenstra-Lenstra-Lovasz lattice reduction)
</li>
<li>最大流量算法(Maximum flow)
</li>
<li>合并排序(Merge Sort)
</li>
<li>牛顿法(Newton's method)
</li>
<li>Q-learning学习算法
</li>
<li>两次筛法(Quadratic Sieve)
</li>
<li>RANSAC
</li>
<li>RSA
</li>
<li>Schonhage-Strassen算法
</li>
<li>单纯型算法(Simplex Algorithm)
</li>
<li>奇异值分解(SVD, Singular Value Decomsition)
</li>
<li>求解线性方程组(Solving a system of linear equations)
</li>
<li>Strukturtensor算法
</li>
<li>合并查找算法(Union-find)
</li>
<li>维特比算法(Viterbi)
</li>
</ol>

</div>
</div>
</div>
</div>




</body></html>
