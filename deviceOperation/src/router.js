import React from 'react';
import { Switch, Route, routerRedux } from 'dva/router';
import dynamic from './utils/dynamic';
import App from './routes/app';
import LayoutC from './components/layout';
// import { Icon } from 'antd';

const { ConnectedRouter } = routerRedux;

// 路由改变的时候，可以加上这个loading
// dynamic.setDefaultLoadingComponent(() => {
//     return <Icon type="loading"/>;
// });

function RouterConfig({ history, app }) {
    const error = dynamic({
        app,
        component: () => import('./routes/error')
    })

    // 获取config目录下面以Router.js结尾的路由
    const routes = ((req) => {
        let alls = req.keys().map((key) => req(key)).map((v) => v());

        let results = [];
        alls.forEach((item) => item.map((v) => results.push(v)));

        return results;
    })(require.context('./config', true, /^\.\/[a-zA-Z]+Router\.js$/));

    const AppComponent = () => (
        <LayoutC>
            <Switch>
                {
                    routes.map((config, key) => (
                    <Route
                        key={key}
                        exact
                        path={config.path}
                        component={dynamic({
                            app,
                            ...config // models and component
                        })}
                    />
                    ))
                }
                <Route component={error} />
            </Switch>
        </LayoutC>
    );

    return (
        <ConnectedRouter history={history}>
            <App path="/" component={AppComponent} />
        </ConnectedRouter>
    );
}

export default RouterConfig;
