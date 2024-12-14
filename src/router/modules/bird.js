/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const birdRouter = {
  path: '/bird',
  component: Layout,
  alawysShow: true,
  name: 'Bird',
  meta: {
    title: 'Bird',
    icon: 'list'
  },
  children: [
    {
      alawysShow: true,
      path: 'query',
      component: () => import('@/views/birds/query'),
      name: 'query',
      meta: { title: 'Bird-query', noCache: true }
    },
    {
      alawysShow: true,
      path: 'list',
      component: () => import('@/views/birds/list'),
      name: 'list',
      meta: { title: 'Bird-list', noCache: true }
    }
  ]
}

export default birdRouter
