import request from '@/utils/request'

// 查询请假列表
export function listLeave(query) {
  return request({
    url: '/ncdscenter/workflow/leave/list',
    method: 'get',
    params: query
  })
}
// 查询请假列表
export function listLeaveAll(query) {
  return request({
    url: '/ncdscenter/workflow/leave/listAll',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getLeave(id) {
  return request({
    url: '/ncdscenter/workflow/leave/' + id,
    method: 'get'
  })
}


// 新增请假
export function addLeave(data) {
  return request({
    url: '/ncdscenter/workflow/leave',
    method: 'post',
    data: data
  })
}

// 修改请假
export function updateLeave(data) {
  return request({
    url: '/ncdscenter/workflow/leave',
    method: 'put',
    data: data
  })
}

// 删除请假
export function delLeave(id) {
  return request({
    url: '/ncdscenter/workflow/leave/' + id,
    method: 'delete'
  })
}

// 导出请假
export function exportLeave(query) {
  return request({
    url: '/ncdscenter/workflow/leave/export',
    method: 'get',
    params: query
  })
}
