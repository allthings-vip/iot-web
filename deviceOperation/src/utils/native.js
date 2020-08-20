import {HashRouter} from 'dva/router';
// import isObject from 'lodash/isObject';
import queryString from 'query-string';
import Events from 'tf-events';
import * as XBack from './xback';

let { history } = new HashRouter();

// ------------------------------------------------------------
// 是否后退
function setGobackFlag() {
    // 用popstate事件监听
    XBack.listen(function() {
        console.log('******按下了后退键******');
        localStorage.setItem('setGobackFlag', 'true');
    })
}
setGobackFlag();

// 后退
let goBackResult = false;
export function gobackFlag() {
    goBackResult = localStorage.getItem('setGobackFlag') === 'true';
    localStorage.setItem('setGobackFlag', 'false');
    return goBackResult;
}
// 是否后退
export function isGoback() {
    return goBackResult;
}

// 设置标题
export function setTitle(title) {
    document.title = title
}
// ------------------------------------------------------------ 
// 添加历史pathname，我们自己保存最近10条记录
let historyPath = [];
export function addHistoryPath(pathname) {
    historyPath.push(pathname);

    if (historyPath.length > 10) {
        historyPath.shift();
    }
}
export function getHistoryPath() {
    return historyPath;
}
// ------------------------------------------------------------
// 获取路由相关配置
let routerConfig = null;
export function getRouterConfig() {
    if (!routerConfig) {
        let req = require.context('../config', true, /^\.\/[a-zA-Z]+Router\.js$/);
        let alls = req.keys().map((key) => req(key))
            .map((v) => v());

        let results = {};
        alls.forEach((item) => item.map( ({title, path}) => { results[path] = {title, path} } ));

        routerConfig = results;
    }

    return routerConfig;
}
// 获取标题
export function getTitle(params) {
    let config = getRouterConfig();
    let obj = config[params.pathname], title;

    if (obj) {
        if (typeof(obj.title) === 'function') {
            title = obj.title(params)
        } else if (typeof(obj.title) === 'string') {
            title = obj.title
        }
    }

    return title;
}
