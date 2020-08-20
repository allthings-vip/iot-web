export default function() {
    return [
        {
            path: '/device',
            models: () => [
                import('../models/device/index'),
            ],
            title: '项目管理',
            component: () => import('../routes/device/list')
        },
        {
            path: '/device/detail',
            models: () => [
                import('../models/device/detail'),
            ],
            title: '项目管理',
            component: () => import('../routes/device/detail')
        },
    ]
};
