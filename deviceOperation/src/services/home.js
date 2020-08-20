import request from '../utils/request';
export async function queryOverview(params) {
    return request('/dos/homepage/overview');
}
export async function query(params) {
    return request('/dos/projects/list',{
        body:params
    });
}
export async function add(params) {
    return request('/dos/projects/save',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function edit(params) {
    return request('/dos/projects/update',{
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body:JSON.stringify(params),
        method:'post'
    });
}
export async function deleteProject(params) {
    return request('/dos/projects/delete',{
        body:params,
        method:'post'
    });
}
export async function detail(params) {
    return request('/dos/projects'
        ,{
            body:params,
            method:'get',
            requestType: 1
        }
    );
}
export async function queryDevices(params) {
    return request('/dos/devices'
        ,{
            body:params,
            method:'get',
        }
    );
}
export async function queryStatus(params) {
    return request('/dos/devices/counts/status'
        ,{
            body:params,
            method:'get',
        }
    );
}
export async function queryDeviceType(params) {
    return request('/dos/devicetypes',{
        body:params
    });
}
export async function confirmProject(params) {
    return request('/dos/projects/review',{
        body:params,
        method:'post'
    });
}
export async function queryCollaborators(params) {
    return request('/dos/user/collaborators',{
        body:params
    });
}
