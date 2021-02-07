import request from '@/utils/request'

// 查询系统配置信息列表
export function listInfocfg(query) {
    return request({
        url: '/system/infocfg/list',
        method: 'get',
        params: query
    })
}

// 查询系统配置信息详细
export function getInfocfg(configId) {
    return request({
        url: '/system/infocfg/' + configId,
        method: 'get'
    })
}

// 新增系统配置信息
export function addInfocfg(data) {
    return request({
        url: '/system/infocfg',
        method: 'post',
        data: data
    })
}

// 修改系统配置信息
export function updateInfocfg(data) {
    return request({
        url: '/system/infocfg',
        method: 'put',
        data: data
    })
}

// 删除系统配置信息
export function delInfocfg(configId) {
    return request({
        url: '/system/infocfg/' + configId,
        method: 'delete'
    })
}
