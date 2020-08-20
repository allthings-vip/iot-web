import {message} from 'antd';
import fetch from 'dva/fetch';
import queryString from 'query-string';
import fetchJsonp from 'fetch-jsonp';
import isObject from 'lodash/isObject';
import {toLoginIndex} from './common';
import { URLSearchParams } from 'url';

let errortip = false;

let isOnline = location.href.indexOf('test.tf56.com') == -1
const csrfUrl = '/dos/csrfTokenServlet';

/*
    一些需要特殊处理的code:
    MALL-1002   未认证，跳到认证页面
 */
const specialCode = ['3036', 'MALL-1005', 'MALL-1006'];

let defaultOpts = {
    method: 'get',
    credentials: 'same-origin',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
};

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

// 支持fiddler返回不太规则的数据
function parseData(data) {
    if (!data || typeof data !== 'string') {
        return data;
    }
    data = data.trim();

    try {
        data = JSON.parse(data);
    } catch (e) {
        data = (new Function('return ' + data))();
    }

    return data;
}

// 抛出错误信息
function throwException(url, data, code) {
    // 未登录，跳到好专线首页
    if (code === -10400) {
        toLoginIndex();
    } else if  (code === 5001) {
    }

    let msg = data.msg || '未知错误，请联系系统管理员';
    // 在effects里的请求，这里抛出错误，会在index.js中捕获；
    // 不在effects里的(直接调用request方法)就不会在index.js中捕获，所以统一在这里提示，不在index.js中
    if(code === -10400){}else{message.error(`${msg}`, 2);}
    // throw new Error(msg);
    if (code === -10400) {
        errortip = true;
    }
}

function checkResult(url, data) {
    
    data = parseData(data) || {};
    const code = data.code;
    // 抛出错误，会被catch捕获到
    // if(code !== '0' && !specialCode.includes(code)) {
    //     throwException(url, data, code);
    // }
    if (code !== 0 || specialCode.includes(code) ) {
        throwException(url, data, code);
    }
    errortip = false;
    return data;
}

function createSecret() {
    return +new Date() + '-' + Math.floor(Math.random() * Math.pow(10, 18)).toString(16);
}

function stitchUrlParam(url, param,requestType) {
    // let iotProjectId = localStorage.getItem('iotProjectId')
    // if(requestType === 1){
    //     return url + '/' + param+'?iotProjectId='+iotProjectId;
    // } else {
    //     let mark = url.indexOf('?') === -1 ? '?' : '&';
    //     return url + mark + param+'&iotProjectId='+iotProjectId;
    // }
    if(requestType === 1){
        return url + '/' + param;
    } else {
        let mark = url.indexOf('?') === -1 ? '?' : '&';
        return url + mark + param;
    }
    
}

function requestJsonp(url, options = {}) {

    url = stitchUrlParam(url, options.body,options.requestType);

    return fetchJsonp(url, options)
        .then(parseJSON)
        .then((data) => data);
}

function reuqestJson(url, options = {}) {
    return fetch(url, options)
        .then(checkStatus)
        .then((res) => res.text())
        .then((data) => checkResult(url, data));
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options = {}) {
   // let iotProjectId = localStorage.getItem('iotProjectId')
   // options.body.iotProjectId = iotProjectId || '';
    if (options.type === 'json') {
        options.headers = {
            'Content-Type': 'application/json;charset=UTF-8'
        }

        if (isObject(options.body)) {
            options.body = JSON.stringify(options.body)
        }
    }

    if (isObject(options.body)) {
        options.body = queryString.stringify(options.body) || '';
    }

    // jsonp
    if ((options.dataType || '').toLowerCase() === 'jsonp') {
        return requestJsonp(url, options);
    }

    options = Object.assign({}, defaultOpts, options);

    // get方式不能有body，所以拼接到url上
    if (options.method.toLowerCase() === 'get') {
        if(options.body){
            url = stitchUrlParam(url, options.body,options.requestType);
            delete options.body;
        }
    }
    // return reuqestJson(url, options);

    let csrfType = createSecret();
    if(options.csrfToken && options.csrfToken === '1'){
        return reuqestJson(url, options);
    } else {
        return fetch(csrfUrl, Object.assign(
            {}, defaultOpts, {
                method: 'POST',
                body: queryString.stringify({
                    csrfType,
                    t: +new Date()
                })
    
            }))
            .then(checkStatus)
            .then(parseJSON)
            .then((data) => {
                
                if (data.code === 0 && data.data) {
                    url = stitchUrlParam(url, `csrfType=${csrfType}&csrfToken=${data.data}`);
                }
    
                return reuqestJson(url, options);
            });
    
    }
}

export function requestCsrfToken(url) {
    console.log('uuuuu')
    let csrfType = createSecret();
    return fetch(csrfUrl, Object.assign(
        {}, defaultOpts, {
            method: 'POST',
            body: queryString.stringify({
                csrfType,
                t: +new Date()
            })

        }))
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => {
            
            if (data.code === 0 && data.data) {
                return stitchUrlParam(url, `csrfType=${csrfType}&csrfToken=${data.data}`);
            }

        });
}
