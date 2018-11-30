self.onmessage = e => {
  console.log('主线程传来的信息：', e.data);
  // console.log($)
  // console.log(e);
};

// self.addEventListener('data',function(){
//   console.log('data')
// })

self.postMessage('来自worker线程的消息');