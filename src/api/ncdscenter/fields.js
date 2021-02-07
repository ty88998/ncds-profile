import request from '@/utils/request'

// 查询字段信息列表
export function listFields(query) {
    return request({
        url: '/ncdscenter/fields/list',
        method: 'get',
        params: query
    })
}

// 查询字段信息详细
export function getFields(fieldsId) {
    return request({
        url: '/ncdscenter/fields/' + fieldsId,
        method: 'get'
    })
}

// 新增字段信息
export function addFields(data) {
    return request({
        url: '/ncdscenter/fields',
        method: 'post',
        data: data
    })
}

// 修改字段信息
export function updateFields(data) {
    return request({
        url: '/ncdscenter/fields',
        method: 'put',
        data: data
    })
}

// 删除字段信息
export function delFields(fieldsId) {
    return request({
        url: '/ncdscenter/fields/' + fieldsId,
        method: 'delete'
    })
}
