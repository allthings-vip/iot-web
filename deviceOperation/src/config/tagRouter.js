export default function() {
    return [
        {
            path: '/tag',
            models: () => [
                import('../models/tag/index'),
            ],
            title: '项目管理',
            component: () => import('../routes/tag/index')
        },
    ]
};
