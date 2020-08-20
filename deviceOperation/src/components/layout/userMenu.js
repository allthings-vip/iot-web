import {Row, Col,Menu,Dropdown,Icon} from 'antd';
import React, {Component} from 'react';
import TfIcon from '../common/TfIcon/index';
import UpdatePasswordModal from '../common/UpdatePasswordModal'
import UpdateUserInfo from '../common/UpdateUserInfo';
import styles from './header.less'
class UserMenu extends Component{
    constructor(props) {
        super(props);
    }
    componentDidMount() {

    }
    onClick =({ key })=> {
        const {dispatch} = this.props
        if(key === '3'){
            dispatch({
                type:'app/logout'
            })
        }
        if(key === '2'){
            dispatch({
                type:'app/updateState',
                payload:{
                    updatePasswordModal:true
                }
            })
        }
        if(key === '1'){
            dispatch({
                type:'app/updateState',
                payload:{
                    updateUserInfoModal:true
                }
            })
        }
        

    };
    render() {
        const {updateUserInfoModal,updatePasswordModal,dispatch,userInfo} = this.props;
        const menu = (
            <Menu onClick={this.onClick.bind(this)}>
                <Menu.Item key="1">个人信息</Menu.Item>
                <Menu.Item key="2">修改密码</Menu.Item>
                <Menu.Item key="3">退出</Menu.Item>
            </Menu>
        );
        const userName=window.localStorage.getItem("userName");
        const passwordProps = {
            dispatch,
        }
        const userProps = {
            dispatch,
            userInfo
        }
        return(
            <div>
                {
                    userName ? <img src={require('../../assets/image/user.png')} className={styles.agency}/> :''
                }
                
                {/* <TfIcon type="user" style={{color:'#80c4ff',fontSize:'27px',lineHeight:'16px'}}/> */}
                <Dropdown overlay={menu}>
                    <a className="ant-dropdown-link" style={{color:'#888'}}>
                        <span >{userName}</span>
                        <Icon type="down" />
                    </a>
                </Dropdown>
                {
                    updateUserInfoModal ? <UpdateUserInfo {...userProps}/> : ''
                }
                {
                    updatePasswordModal ? <UpdatePasswordModal {...passwordProps}/> : ''
                }
            </div>
        )
    }
}
export default UserMenu