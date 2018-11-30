 #  Web Worker

##  Web Worker简介

1.  JavaScript 是单线程的，在同一时刻只能处理一个任务。

2.  Web Worker 是 HTML5 标准的一部分，这一规范定义了一套 API，它允许一段 JavaScript 程序运行在主线程之外的另外一个线程中。

##  self 代表 worker 进程自身

  worker 线程的执行上下文叫WorkerGlobalScope，跟主线程的上下文(window)不一样。
  可以使用self/WorkerGlobalScope来访问全局对象。

##  监听主线程传过来的信息

  (```)
    self.onmessage = e => {
      console.log('主线程传来的信息：', e.data);
      // do something
    };
  (```)

##  发送信息给主线程

  (```)
    self.postMessage({
      hello: [ '这条信息', '来自worker线程' ]
    });
  (```)

##  worker 线程关闭自身

  `self.close();`

##  worker 线程加载脚本：

  Worker 线程能够访问一个全局函数 imprtScripts()来引入脚本，该函数接受 0 个或者多个 URI 作为参数

  `importScripts('http~.js','http~2.js');`
    
    1.  脚本中的全局变量都能被 worker 线程使用。

    2.  脚本的下载顺序是不固定的，但执行时会按照传入 importScripts() 中的文件名顺序进行，这个过程是同步的。

##  Worker 线程限制

因为 worker 创造了另外一个线程，不在主线程上，相应的会有一些限制，我们无法使用下列对象：

1.  window 对象

2.  document 对象

3.  DOM 对象

4.  parent 对象

我们可以使用下列对象/功能：

1. 浏览器：navigator 对象

2. URL：location 对象，只读

3. 发送请求：XMLHttpRequest 对象

4. 定时器：setTimeout/setInterval，在 worker 线程轮询也是很棒！

5. 应用缓存：Application Cache

##  多个 worker 线程

1.  在主线程内可以创建多个 worker 线程。

2.  worker 线程内还可以新建 worker 线程，使用同源的脚本文件创建。

##  线程间转移二进制数据

因为主线程与 worker 线程之间的通信是拷贝关系，当我们要传递一个巨大的二进制文件给 worker 线程处理时(worker 线程就是用来干这个的)，这时候使用拷贝的方式来传递数据，无疑会造成性能问题。

**幸运的是，Web Worker 提供了一中转移数据的方式，允许主线程把二进制数据直接转移给子线程。**这种方式比原先拷贝的方式，有巨大的性能提升。

**一旦数据转移到其他线程，原先线程就无法再使用这些二进制数据了，**这是为了防止出现多个线程同时修改数据的麻烦局面

  (```)
    // 创建二进制数据
    var uInt8Array = new Uint8Array(1024*1024*32); // 32MB
    for (var i = 0; i < uInt8Array .length; ++i) {
      uInt8Array[i] = i;
    }
    console.log(uInt8Array.length); // 传递前长度:33554432
    // 字符串形式创建worker线程
    var myTask = `
      onmessage = function (e) {
          var data = e.data;
          console.log('worker:', data);
      };
    `;

    var blob = new Blob([myTask]);
    var myWorker = new Worker(window.URL.createObjectURL(blob));

    // 使用这个格式(a,[a]) 来转移二进制数据
    myWorker.postMessage(uInt8Array.buffer, [uInt8Array.buffer]); // 发送数据、转移数据

    console.log(uInt8Array.length); // 传递后长度:0，原先线程内没有这个数据了
  (```)

##  应用场景

1.  数学运算

2.  图像、影音等文件处理

3.  大量数据检索

4.  比如用户输入时，我们在后台检索答案，或者帮助用户联想，纠错等操作

5.  耗时任务都丢到 webworker 解放我们的主线程