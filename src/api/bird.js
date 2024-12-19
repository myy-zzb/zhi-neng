import request from '@/utils/request'

export function getBirds(params) {
  return request({
    url: '/bird/findBirdByName',
    method: 'post',
    data: params
  })
}
