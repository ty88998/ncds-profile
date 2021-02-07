import request from '@/utils/request'

// 查询就诊记录列表
export function listDiagnosis(query) {
  return request({
    url: '/ncdscenter/diagnosis/list',
    method: 'get',
    params: query
  })
}

// 查询就诊记录详细
export function getDiagnosis(id) {
  return request({
    url: '/ncdscenter/diagnosis/' + id,
    method: 'get'
  })
}

// 新增就诊记录
export function addDiagnosis(data) {
  return request({
    url: '/ncdscenter/diagnosis',
    method: 'post',
    data: data
  })
}

// 修改就诊记录
export function updateDiagnosis(data) {
  return request({
    url: '/ncdscenter/diagnosis',
    method: 'put',
    data: data
  })
}

// 删除就诊记录
export function delDiagnosis(id) {
  return request({
    url: '/ncdscenter/diagnosis/' + id,
    method: 'delete'
  })
}
