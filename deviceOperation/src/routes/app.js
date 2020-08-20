import React from 'react';
import { connect } from 'dva';
import { Route, Redirect, withRouter } from 'dva/router';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
class App extends React.Component {
    render() {
        const {
          component: Component,
          dispatch,
          location,
          app,
          ...rest
        } = this.props;
        // 登录页面
        let toPath = '/login';
        if(location.pathname !== '/login'){
            dispatch({
                type:'app/queryUrlAuth',
                payload:{
                    route:location.pathname
                }
            })
        }
        // if (!app.login && location.pathname != toPath) {
        //     return <Redirect to={{ pathname: toPath }} />
        // }
        return (
            <Route {...rest} render={props => <Component {...props} />}/>
        )
    }
}

export default withRouter(connect(({ app }) => ({ app }))(App));
