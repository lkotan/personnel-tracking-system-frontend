
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#E53935' },
  /*
  ** Global CSS
  */
  css: [
     '../node_modules/ti-icons/css/themify-icons.css',
     '~/assets/scss/style.scss',
     '~/assets/style.css',
   ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    "~/plugins/vuetify",
    '~/plugins/serviceInstaller',
    "~/helpers/vuetify",
    "~/helpers/extensions",
    "~/Repositories/PageRepository"
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    ['bootstrap-vue/nuxt', {
      icons: true,
    }],
    '@nuxtjs/toast',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  axios: {
    baseURL: 'http://localhost:53825/api'
  },
  auth: {
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/',
    },
    strategies: {
      local: {
        scheme: 'refresh',
        token: {
          property: 'data.token',
          maxAge: 60 * 100,
        },
        refreshToken: {
          property: 'data.refreshToken',
          data: 'token',
          maxAge: 60 * 120
        },
        user: {
          property: 'data',
        },
        endpoints: {
          login: {
            url: '/auth/login',
            method: 'post'
          },
          refresh: {
            url: '/auth/loginByRefreshToken',
            method: 'post'
          },
          user: {
            url: '/auth/user',
            method: 'get',
          },
          logout: {
            url: '/auth/logout',
            method: 'post'
          }
        },
      }
    },
  },
  env: {
    title: " | Personel Takip Sistemi",
    profilePath: `http://www.pts.com/ProfilePhotos/`,
  },
}
