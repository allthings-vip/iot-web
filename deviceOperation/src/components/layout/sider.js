import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {Menu, Icon, Layout} from 'antd';
import styles from './sider.less';
import {menuData,menuList} from './menu';
import TFIcon from '../../components/common/TfIcon/index';
import {HashRouter} from 'dva/router';
const {Sider} = Layout;
const SubMenu = Menu.SubMenu;
let { history } = new HashRouter();

export default class SiderBar extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        openKeys: ['2'] // 默认货单管理列表展开
    };

    onOpenChange = (openKeys) => {
        this.setState({openKeys});
    }

    onClickItem = (item) => {
        const {history} = this.props;
        // if(history.location.pathname !== item.menuUrl){
        //     history.push(item.menuUrl);
        // }
        history.push(item.menuUrl);
    }

    render() {
        const that = this;
        const {history} = this.props;
        const menuElems = menuData.map((item) => {
            return <Menu.Item key={item.menuId}>
                <div onClick={that.onClickItem.bind(that, item)}>
                    <div>
                        <img src={item.menuActiveIcon}/>
                        <img src={item.menuIcon}/>
                    </div>
                    {item.menuName}
                </div>
                </Menu.Item>
        });

        // 查找选中的目录
        let defaultSelectedArr = menuList.filter((item) => {
            return history.location.pathname === item.menuUrl;
        });

        if(defaultSelectedArr.length === 0) {
            let temp = [];
            menuList.some((item) => {
                if(item.children.length > 0 ){
                    temp = item.children.filter((v) => {
                        return history.location.pathname === v.menuUrl;
                    });
                }
                return temp.length > 0;
            });
            defaultSelectedArr = temp;
        }
        
        return (
        <Sider style={{height: '100vh', position: 'fixed', left: 0,width:'180px' }} className={styles.siderContainer}>
            <div className={styles.scrollbox}>
                <div className={styles.siderHeader}>
                    <img src={require('../../assets/image/logo.png')}/>
                </div>
                <Menu mode="inline" selectedKeys={[defaultSelectedArr[0] && defaultSelectedArr[0].menuId || '1']} openKeys={this.state.openKeys} 
                onOpenChange={this.onOpenChange}>
                    {menuElems}
                </Menu>
            </div>
        </Sider>
        );
    }
}
