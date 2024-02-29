export default {
    head: {
        title: 'Employee ERP System',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1'
            },
            {
                hid: 'description',
                name: 'description',
                content: 'System for managing employees / contracts / vacations'
            },
            { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },

    css: [],

    plugins: [
        '@/plugins/vuelidate',
        { src: '@/plugins/notify.client', mode: 'client' },
        { src: '@/plugins/notify.server', mode: 'server' }
    ],

    buildModules: ['@nuxtjs/eslint-module', '@nuxtjs/vuetify'],

    modules: ['@nuxtjs/axios', '@nuxtjs/auth-next', '@nuxtjs/device'],

    axios: {
        baseUrl: process.env.BASE_API_URL,
        credentials: true
    },

    build: {
        extend(config, { isClient }) {
            if (isClient) {
                config.devtool = 'source-map';
            }
        },
        extractCSS: true,
        optimization: {
            splitChunks: {
                name: false,
                chunks: 'all',
                cacheGroups: {},
                automaticNameDelimiter: '.'
            }
        }
    },

    auth: {
        strategies: {
            local: {
                token: {
                    required: false,
                    type: false
                },

                user: {
                    property: false
                },

                endpoints: {
                    login: { url: '/auth/login', method: 'post' },
                    logout: { url: '/auth/logout', method: 'post' },
                    user: {
                        url: '/auth/me',
                        method: 'get'
                    }
                }
            }
        }
    }
};
