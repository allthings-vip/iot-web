export default function() {
    return [
        {
            path: '/alarm',
            models: () => [
                import('../models/alarm/index'),
            ],
            title: '项目管理',
            component: () => import('../routes/alarm/list')
        },

    ]
};
