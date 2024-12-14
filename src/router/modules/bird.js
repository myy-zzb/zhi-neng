/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const birdRouter = {
  path: '/bird',
  component: Layout,
  alwaysShow: true,
  name: 'Bird',
  meta: {
    title: '鸟类明细',
    icon: 'list'
  },
  children: [
    {
      alwaysShow: true,
      path: 'query',
      component: () => import('@/views/birds/query'),
      name: 'query',
      meta: { title: '鸟类识别', noCache: true }
    },
    {
      alwaysShow: true,
      path: 'list',
      component: () => import('@/views/birds/list'),
      name: 'list',
      meta: { title: '鸟类查询', noCache: true }
    }
  ]
}

export default birdRouter
