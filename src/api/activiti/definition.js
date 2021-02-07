import request from '@/utils/request'

// 查询modeler列表
export function listDefinition(query) {
  return request({
    url: '/ncdscenter/processDefinition/list',
    method: 'get',
    params: query
  })
}

// 查询请假详细
export function getDefinitionsByInstanceId(instanceId) {
  return request({
    url: '/ncdscenter/processDefinition/getDefinitions/' + instanceId,
    method: 'get'
  })
}

// 挂起激活转换
export function suspendOrActiveApply(data) {
  return request({
    url: '/ncdscenter/processDefinition/suspendOrActiveApply',
    method: 'post',
    data:data
  })
}


// 删除Modeler
export function delDefinition(id) {
  return request({
    url: '/ncdscenter/processDefinition/remove/' + id,
    method: 'delete'
  })
}


