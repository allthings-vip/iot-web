export default function() {
    return [
        {
            path: '/distribution',
            models: () => [
                import('../models/devicedistribution/index'),
            ],
            title: '项目管理',
            component: () => import('../routes/deviceDistribution/index')
        },
    ]
};
