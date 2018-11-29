self.onmessage = e => {
  console.log('主线程传来的信息：', e.data);
  // do something
};

self.postMessage('来自worker线程的消息');