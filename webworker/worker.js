var fibonacci = function(n) {
    return n < 2 ? n : arguments.callee(n - 1) + arguments.callee(n - 2);
}
onmessage = function(event) {
    var n = parseInt(event.data, 10);
    postMessage(fibonacci(n));//将获取到的数据发送到主线程
}