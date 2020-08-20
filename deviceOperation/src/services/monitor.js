import request from '../utils/request';

export async function query(params) {
    return request('/dos/devices/monitor/list',{
        body:params
    });
}
export async function regist(params) {
    return request('/dos/devices/register',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function batchRegist(params) {
    return request('/dos/devices/registerbatch',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function queryProject(params) {
    return request('/dos/projects/list'
        ,{
            body:params,
        }
    );
}
export async function queryDeviceTypeByProjectId(params) {
    return request('/dos/devicetypes/down'
        ,{
            body: params,
            method:'get',
        }
    );
}
export async function queryProtocols(params){
    return request('/dos/protocols/get'
        ,{
            body:params,
        }
    );
}