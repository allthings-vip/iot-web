export default function() {
    return [
        {
            path: '/element',
            models: () => [
                import('../models/element/index'),
            ],
            title: '项目管理',
            component: () => import('../routes/element/list')
        },

    ]
};
