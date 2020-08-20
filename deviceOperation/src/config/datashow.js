export default function() {
    return [{
            path: '/datashow',
            models: () => [
                import('../models/datashow/index'),
            ],
            title: '数据查看',
            component: () => import('../routes/datashow/list')
        }
    ]
};
