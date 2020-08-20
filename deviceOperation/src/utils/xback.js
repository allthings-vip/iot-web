// 监听手机返回键（PS：手机端一般没有前进键）

var STATE = 'x-back';
var element = document.createElement('span');

var onPopState = function(event) {
    event.state && event.state.STATE === STATE && fire();
    record({STATE});  //初始化事件时，push一下
}

var record = function(state) { 
    // 貌似react-router即使是HashRouter，也用的是history，而不是hash
    history.replaceState(state, null, location.href);
}

var fire = function() {
    var event = document.createEvent('Events');
    event.initEvent(STATE, false, false);
    element.dispatchEvent(event);
}
 
export function listen(listener) {
    window.addEventListener('popstate', onPopState);
    element.addEventListener(STATE, listener, false);
}
