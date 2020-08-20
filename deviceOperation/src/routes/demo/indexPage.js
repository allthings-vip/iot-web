import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { getRouterConfig } from '../../utils/native';
import styles from './indexPage.less';

class IndexPage extends React.Component {
    render() {
        let menusConfig = getRouterConfig();
        let menus = Object.keys(menusConfig)

        return (
            <div className={styles.container}>
                {
                    menus.map(v => {
                        let obj = menusConfig[v];
                        let path = obj.path;

                        if(path.indexOf('createWaybill') > -1
                            || path.indexOf('createOrder') > -1) {
                            path = path + '?mode=init'
                        }
                        return <Link to={path} key={path}>{typeof obj.title === 'function' ? obj.title() : obj.title}</Link>
                    })
                }
            </div>
        );
    }
}

export default connect()(IndexPage);
