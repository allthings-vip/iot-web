import request from '../utils/request';

export async function login(params) {
    return request('/dos/login',{
        body:params,
        method:'POST'
    });
}
export async function getnewphoto(params) {
    return request('/dos/kaptcha/get',{
        body:params,
        method:'get'
    });
}
export async function register(params) {
    return request('/dos/user/save',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'POST'
    });
}

export async function getCode(params) {
    return request('/dos/code/get',{
        body:params,
        method: 'get'
    });
}