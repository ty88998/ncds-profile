import request from '@/utils/request'

// 查询随访信息列表
export function listAccess(query) {
    return request({
        url: '/ncdscenter/access/list',
        method: 'get',
        params: query
    })
}

// 查询随访信息详细
export function getAccess(id) {
    return request({
        url: '/ncdscenter/access/' + id,
        method: 'get'
    })
}

// 新增随访信息
export function addAccess(data) {
    return request({
        url: '/ncdscenter/access',
        method: 'post',
        data: data
    })
}

// 修改随访信息
export function updateAccess(data) {
    return request({
        url: '/ncdscenter/access',
        method: 'put',
        data: data
    })
}

// 删除随访信息
export function delAccess(id) {
    return request({
        url: '/ncdscenter/access/' + id,
        method: 'delete'
    })
}
