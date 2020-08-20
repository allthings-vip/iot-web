import React, {Component} from 'react';
import {message,Dropdown,Menu,Icon,Layout } from 'antd';
import styles from './headerCommon.less';
import {toLYSystem, isOnline, toCarrierIndex} from '../../utils/common';
import {sysMenu} from './menu';
import TfIcon from '../common/TfIcon/index';
import UserMenu from '../layout/userMenu'
const { Header, Content, Footer, Sider } = Layout;
export default class HeaderCommon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuId: '1'
        }
    }
    componentDidMount(){
        this.props.dispatch({
            type:'app/queryUserInfo',

        })
    }
    goIndex=()=>{
        const {history,app} = this.props;
        history.push('/');
    }
    menuChange(item){
        const {history,app} = this.props;
        history.push(item.menuUrl);
    }
    menuClick = (menuId) => {
        this.setState({
            menuId
        })
    }
    render() {
        const { history,updateUserInfoModal,updatePasswordModal,dispatch,userInfo} = this.props;
        const {pathname} = history.location;
        let home = false;
        pathname === '/' ? home = true : home = false;
        let defaultMenuSelected = 0
        pathname === '/monitor' ? defaultMenuSelected = 2 : '';
        pathname === '/user' ? defaultMenuSelected = 1  : '';
        let role = ''
        //用户权限
        if(userInfo.roleCode === 'admin'){
            role === 'admin'
        } else if(userInfo.roleCode === 'user'){
            role === 'user'
        }
        const userProps = {
            dispatch,
            updateUserInfoModal,
            updatePasswordModal,
            userInfo
        }
        return (
            <div>
                <Header className={styles.header}>
                    <div className={styles.logo} onClick={()=>{this.props.history.push('/')}}>
                        <img src={require('../../assets/image/newLogo9.png')} className={styles.agency}/>
                    </div>
                    <div className={styles.rightWrap}>
                        {/* <div className={styles.rightMenu}>
                            <Menu
                                mode="horizontal"
                                theme="dark"
                                defaultSelectedKeys={[defaultMenuSelected.toString()]}
                                selectedKeys={[defaultMenuSelected.toString()]}
                                className={styles.menu}
                            >
                                {
                                    userInfo.roleCode ==='admin' ?
                                    sysMenu.map(v=>{
                                        return <Menu.Item key={v.menuId} onClick={this.menuChange.bind(this,v)}>
                                            <TfIcon type={v.menuIcon}/>
                                            {v.menuName}
                                        </Menu.Item>
                                    }) :''
                                }
                                {
                                    home ? '' :  <Menu.Item key='0' onClick={this.goIndex.bind(this)} style={{textDecoration:'underline'}}>首页</Menu.Item>
                                }

                            </Menu>
                        </div> */}
                        <div style={{marginLeft:'30px'}}>
                            <UserMenu {...userProps}/>
                        </div>
                    </div>
                </Header>

                {/* <header className={styles.headerWrap}>
                    <div className={styles.leftWrap}>大千物联网<span>设备运营平台</span></div>
                    <div className={styles.rightWrap}>
                        <ul>
                            <li>
                            <TfIcon type="home"/>
                            <a href="https://iot.tf56.com/" target="_blank">门户首页</a>
                            </li>
                            <li>
                                <TfIcon type="document"/>
                                <a href="https://iot.tf56.com/document.html"  target="_blank">开发文档</a>
                            </li>
                            <li>
                                <TfIcon type="user" style={{color:'#80c4ff',fontSize:'27px',lineHeight:'16px'}}/>
                                <Dropdown overlay={menu}>
                                    <a className="ant-dropdown-link" href="#">
                                        <span className={styles.name}>欢迎您，{userName}</span>
                                        <Icon type="down" />
                                    </a>
                                </Dropdown>
                            </li>
                        </ul>
                    </div>
                </header> */}
            </div>
        )
    }
}
