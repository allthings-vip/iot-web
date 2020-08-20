export default function() {
    return [
        {
            path: '/devicetype',
            models: () => [
                import('../models/devicetype/index'),
            ],
            title: '项目管理',
            component: () => import('../routes/deviceType/list')
        },

    ]
};
