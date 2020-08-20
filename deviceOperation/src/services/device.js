import request from '../utils/request';

export async function query (params) {
    return request('/dos/devices/list', {
        body: params
    });
}
export async function changeStatus (params) {
    return request('/dos/devices/status/update', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body: JSON.stringify(params),
        method: 'post'
    });
}
export async function add (params) {
    return request('/dos/devices/save', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body: JSON.stringify(params),
        method: 'post'
    });
}
export async function edit (params) {
    return request('/dos/devices/update', {
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json, text/javascript, */*;'
        },
        body: JSON.stringify(params),
        method: 'post'

    });
}
export async function deleteType (params) {
    return request('/dos/devices', {
        body: params,
        method: 'delete'
    });
}
export async function projectsName (params) {
    return request('/dos/projects/name', {
        body: params,
        method: 'get'
    });
}
export async function deviceType (params) {
    return request('/dos/devices', {
        body: params,
        method: 'get'
    });
}
export async function getalarm (params) {
    return request('/dos/alarms/latest', {
        body: params,
        method: 'get'
    });
}
export async function detail (params) {
    return request('/dos/devices'
        , {
            body: 'd' + params,
            method: 'get',
            requestType: 1
        }
    );
}
export async function detailQuery (params) {
    return request('/dos/devices/get'
        , {
            body: params,
            method: 'get',
        }
    );
}
export async function queryDeviceType (params) {
    return request('/dos/devicetypes/down'
        , {
            body: params,
        }
    );
}
export async function queryProject (params) {
    return request('/dos/projects'
        , {
            body: params,
        }
    );
}
export async function queryDeviceTypeByProjectId (params) {
    console.log(params)
    return request('/dos/devicetypes/projects'
        , {
            body: params,
            method: 'get',
            requestType: 1
        }
    );
}
export async function getFactorValues (params) {

    return request('/dos/points/latest', {
        body: params,
        method: 'get'
    });
}

//获取实时数据
export async function queryPointslatest (params) {

    return request('/dos/points/latest', {
        body: params,
        method: 'get'
    });
}
//获取因子列表
export async function queryFactorList (params) {

    return request('/dos/devices/factors/list', {
        body: params,
        method: 'get'
    });
}
//获取因子数据
export async function querykvsPoints (params) {

    return request('/dos/kvs/points', {
        body: params,
        method: 'get'
    });
}
//获取设备事件列表
export async function queryevents (params) {

    return request('/dos/events/list', {
        body: params,
        method: 'get'
    });
}
//获取设备日志列表
export async function querylogs (params) {

    return request('/dos/device/logger/list', {
        body: params,
        method: 'get'
    });
}
//事件处理
export async function handleEvent (params) {

    return request('/dos/events/update', {
        body: params,
        method: 'post'
    });
}
//在线离线数据
export async function queryDeviceCounts (params) {

    return request('/dos/devices/counts/status', {
        body: params
    });
}

export async function queryevent (params) {
    return request('/dos/device/event/list', {
        body: params,
        method: 'get'
    });
}

export async function queryChannel (params) {
    return request('/dos/device/pass/list', {
        body: params,
        method: 'get'
    })
}
export async function queryAllByIotDeviceType (params) {
    return request('/dos/passtype/getAllByIotDeviceType', {
        body: params,
        method: 'get'
    })
}

export async function eventDetail (params) {
    return request('/dos/device/event/detail', {
        body: params,
        method: 'get'
    })
}

export async function getLiveStream (params) {
    return request('/dos/device/pass/live/stream', {
        body: params,
        method: 'get'
    })
}

export async function cameraCtrl (params) {
    return request('/dos/device/pass/control', {
        body: params,
        method: 'get'
    })
}

export async function cameraStop (params) {
    return request('/dos/device/pass/control/stop', {
        body: params,
        method: 'get'
    })
}

export async function getPlayBack (params) {
    return request('/dos/device/pass/play/back', {
        body: params,
        method: 'get'
    })
}


