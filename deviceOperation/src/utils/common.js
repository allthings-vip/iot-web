
//获取当前环境
export function isDev () {
    return window.location.href.indexOf('test.tf56.com') > -1 ? true : false;
}

// 是否是线上环境
export let isOnline = window.location.href.indexOf('test.tf56.com') < 0;

let urlConfig = {};
if (isOnline) {
    urlConfig = {
        domain: 'http://iot.tf56.com/#/',
        lySys: '',
        image: 'http://image.tf56.com',
    };
} else {
    urlConfig = {
        domain: 'http://iottest.tf56.com/#/',
        lySys: '',
        image: 'http://iottest.tf56.com',
    };
}
export const imageUrl = urlConfig.image + "/image/"
// 未入驻，跳到入驻页面
export function toCertifyPage () {
    let isLocal = window.location.href.indexOf('tf56.com/carrier') < 0; // 是否是本地环境
    location.href = isLocal ? '/#/certify' : '/carrier#/certify';
}

// 跳到登录页面
export function toLoginIndex () {
    location.href = urlConfig.domain + 'login';
    //location.href = '/#/login';
}
// 跳到首页
export function toIndex () {
    location.href = urlConfig.domain
    // location.href ='/#/';
}

// 跳到链云
export function toLYSystem () {
    window.open(urlConfig.lySys);
}

//跳转到制定路由，含参数
export function redirectToRoute (pathname, params) {
    let array = []
    for (let [k, v] of Object.entries(params)) {
        array.push(`${k}=${v}`);
    }
    if (array.length > 0) {
        return {
            pathname,
            search: `?${array.join("&")}`
        }
    } else {
        return {
            pathname,
        }
    }
}

// 字符串中部分常用标点
export function stringTransform (str) {
    let tmp = "";
    if (str && str.length !== 0) {
        tmp = str.replace(/&amp;/g, "&");
        tmp = tmp.replace(/&quot;/g, '"');
        tmp = tmp.replace(/&mdash;/g, '——');
        tmp = tmp.replace(/&ndash;/g, '-');
    }

    return tmp;
}
