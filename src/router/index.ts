import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: LoginView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: () => import('../views/ForgotView.vue')
    },
    {
      path: '/reset',
      name: 'reset',
      props: (route) => ({ email: route.query.email, token: route.query.token }),
      component: () => import('../views/ResetView.vue')
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      meta: { requiresAuth: true },
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/spaces',
      name: 'spaces',
      meta: { requiresAuth: true },
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/agenda',
      name: 'agenda',
      meta: { requiresAuth: true },
      component: () => import('../views/DashboardView.vue')
    },
    {
      path: '/space/:uid',
      name: 'space',
      meta: { requiresAuth: true },
      component: () => import('../views/SpaceView.vue')
    },
    {
      path: '/space/:uid/module/:moduleId',
      name: 'space-module',
      meta: { requiresAuth: true },
      component: () => import('../views/SpaceView.vue')
    },
    {
      path: '/space/:uid/module/:moduleId/topic/:topicId',
      name: 'spaces-module-topic',
      meta: { requiresAuth: true },
      component: () => import('../views/SpaceView.vue')
    },
    {
      path: '/enroll/:uid',
      name: 'enroll',
      meta: { requiresAuth: false },
      component: () => import('../views/SpaceView.vue')
    },
    {
      path: '/forum/:uid',
      name: 'forum',
      meta: { requiresAuth: true },
      component: () => import('../views/ForumView.vue')
    },
    {
      path: '/forum/:uid/channel/:channelId',
      name: 'forum-channel',
      meta: { requiresAuth: true },
      component: () => import('../views/ForumView.vue')
    },
    {
      path: '/account',
      name: 'account',
      meta: { requiresAuth: true },
      component: () => import('../views/AccountView.vue'),
      children: [
        {
          path: 'profile',
          name: 'account-profile',
          meta: { requiresAuth: true },
          children: [
            {
              name: 'account-profile',
              path: '',
              meta: { requiresAuth: true },
              component: () => import('../components/account/Profile.vue')
            },
            {
              name: 'account-password',
              path: 'password',
              meta: { requiresAuth: true },
              component: () => import('../components/account/ChangePassword.vue')
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) next({ name: 'login' })

  next()
})

export default router
