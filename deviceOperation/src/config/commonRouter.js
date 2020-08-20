export default function() {
    return [
        // {
        //     path: '/',
        //     models: () => [
        //         import('../models/home'),
        //     ],
        //     title: '首页',
        //     component: () => import('../routes/home/index.js')
        // },
        {
            path: '/',
            models: () => [
                import('../models/home'),
            ],
            title: '首页',
            component: () => import('../routes/home/index.js')
        },
        {
            path: '/monitor',
            models: () => [
                import('../models/monitor/index'),
            ],
            title: '设备监控',
            component: () => import('../routes/monitor/index.js')
        },
        {
            path: '/user',
            models: () => [
                import('../models/usermanage/index'),
            ],
            title: '用户管理',
            component: () => import('../routes/usermanage/index.js')
        },
        {
            path: '/ops',
            models: () => [
                import('../models/ops/index'),
            ],
            title: '运维监控',
            component: () => import('../routes/ops/index.js')
        },
        {
            path: '/syslog',
            models: () => [
                import('../models/sysLog/index'),
            ],
            title: '系统日志',
            component: () => import('../routes/sysLog/index.js')
        }
    ]
};
