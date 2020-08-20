export default function() {
    return [
        {
            path: '/project',
            models: () => [
                import('../models/project/detail'),
            ],
            title: '项目管理',
            component: () => import('../routes/project/detail')
        }
    ]
};
