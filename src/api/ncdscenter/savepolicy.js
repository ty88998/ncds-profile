import request from '@/utils/request'

// 查询存储策略信息列表
export function listSavepolicy(query) {
    return request({
        url: '/ncdscenter/savepolicy/list',
        method: 'get',
        params: query
    })
}

// 查询存储策略信息详细
export function getSavepolicy(savepolicyId) {
    return request({
        url: '/ncdscenter/savepolicy/' + savepolicyId,
        method: 'get'
    })
}

// 新增存储策略信息
export function addSavepolicy(data) {
    return request({
        url: '/ncdscenter/savepolicy',
        method: 'post',
        data: data
    })
}

// 修改存储策略信息
export function updateSavepolicy(data) {
    return request({
        url: '/ncdscenter/savepolicy',
        method: 'put',
        data: data
    })
}

// 删除存储策略信息
export function delSavepolicy(savepolicyId) {
    return request({
        url: '/ncdscenter/savepolicy/' + savepolicyId,
        method: 'delete'
    })
}
