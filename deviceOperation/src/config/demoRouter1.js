export default function() {
    return [
        {
            path: '/',
            /* models: () => [
                import('./models/index'),
            ], */
            title: '菜单',
            component: () => import('../routes/demo/indexPage.js')
        },
        {
            path: '/demo/example',
            title: '示例',
            models: () => [
                import('../models/demo/example'),
            ],
            component: () => import('../routes/demo/example')
        }
    ]
};
