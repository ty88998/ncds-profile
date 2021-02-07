import request from '@/utils/request'

// 查询患者基本信息列表
export function listPersoninfo(query) {
    return request({
        url: '/ncdscenter/personinfo/list',
        method: 'get',
        params: query
    })
}

// 查询患者基本信息详细
export function getPersoninfo(id) {
    return request({
        url: '/ncdscenter/personinfo/' + id,
        method: 'get'
    })
}

// 新增患者基本信息
export function addPersoninfo(data) {
    return request({
        url: '/ncdscenter/personinfo',
        method: 'post',
        data: data
    })
}

// 修改患者基本信息
export function updatePersoninfo(data) {
    return request({
        url: '/ncdscenter/personinfo',
        method: 'put',
        data: data
    })
}

// 删除患者基本信息
export function delPersoninfo(id) {
    return request({
        url: '/ncdscenter/personinfo/' + id,
        method: 'delete'
    })
}
