export default function() {
    return [
        {
            path: '/log',
            models: () => [
                import('../models/log/index'),
            ],
            title: '设备日志',
            component: () => import('../routes/log/list')
        },{
            path: '/datashow',
            models: () => [
                import('../models/datashow/index'),
            ],
            title: '数据查看',
            component: () => import('../routes/datashow/list')
        },{
            path: '/login',
            models: () => [
                import('../models/login/index'),
            ],
            title: '登录',
            component: () => import('../routes/login')
        }

    ]
};
