import request from '@/utils/request'

// 查询分类下的表信息列表
export function listTables(query) {
    return request({
        url: '/ncdscenter/tables/list',
        method: 'get',
        params: query
    })
}

// 查询分类下的表信息详细
export function getTables(tableId) {
    return request({
        url: '/ncdscenter/tables/' + tableId,
        method: 'get'
    })
}

// 新增分类下的表信息
export function addTables(data) {
    return request({
        url: '/ncdscenter/tables',
        method: 'post',
        data: data
    })
}

// 修改分类下的表信息
export function updateTables(data) {
    return request({
        url: '/ncdscenter/tables',
        method: 'put',
        data: data
    })
}

// 删除分类下的表信息
export function delTables(tableId) {
    return request({
        url: '/ncdscenter/tables/' + tableId,
        method: 'delete'
    })
}
