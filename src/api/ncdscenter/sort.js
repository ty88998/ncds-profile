import request from '@/utils/request'

// 查询分类信息列表
export function listSort(query) {
    return request({
        url: '/ncdscenter/sort/list',
        method: 'get',
        params: query
    })
}

// 查询分类信息详细
export function getSort(sortId) {
    return request({
        url: '/ncdscenter/sort/' + sortId,
        method: 'get'
    })
}

// 新增分类信息
export function addSort(data) {
    return request({
        url: '/ncdscenter/sort',
        method: 'post',
        data: data
    })
}

// 修改分类信息
export function updateSort(data) {
    return request({
        url: '/ncdscenter/sort',
        method: 'put',
        data: data
    })
}

// 删除分类信息
export function delSort(sortId) {
    return request({
        url: '/ncdscenter/sort/' + sortId,
        method: 'delete'
    })
}
