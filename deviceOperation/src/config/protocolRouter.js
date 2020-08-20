export default function() {
    return [
        {
            path: '/protocol',
            models: () => [
                import('../models/protocol/index'),
            ],
            title: '协议类型管理',
            component: () => import('../routes/protocol/list')
        },

    ]
};
