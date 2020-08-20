import React, {Component} from 'react';
import {connect} from 'dva';
import {message,Dropdown,Menu,Icon} from 'antd'
import styles from './header.less';
import TfIcon from '../common/TfIcon/index';
import UserMenu from '../layout/userMenu'
import {toLYSystem, isOnline, toCarrierIndex, imageUrl} from '../../utils/common';

class Header extends Component {
    constructor(props) {
        super(props);
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
    render() {
        const { history,updateUserInfoModal,updatePasswordModal,dispatch,userInfo, projectDetail} = this.props;
        const { detailData } = projectDetail || {detailData: {imageUrl: ''}}
        const { createOperator, projectName } = detailData || {}
        const creatPeople = localStorage.getItem('createOperator')
        const iconUrl = detailData.imageUrl || localStorage.getItem('iconUrl');
        const itemName = localStorage.getItem('projectName');

        const {pathname} = history.location;
        const userName=window.localStorage.getItem("userName")
        const userProps={
            dispatch,
            userInfo,
            updateUserInfoModal,
            updatePasswordModal,
        }
        let role = ''
        //用户权限
        if(userInfo.roleCode&&userInfo.roleCode === 'admin'){
            role === 'admin'
        } else if(userInfo.roleCode&&userInfo.roleCode === 'user'){
            role === 'user'
        }
        return (
            <header className={styles.headerWrap}>
                <div className={styles.leftWrap}>
                    <div className={styles.logo}>
                        {/* <img src={require('../../assets/image/logoLetterA.png')}/> */}
                        <span className={styles.title} onClick={()=>{this.props.history.push('/')}}>设备运营平台</span>
                    </div>
                </div>
                <div className={styles.rightWrap}>
                    <ul>
                        <li>
                            <a onClick={this.goIndex.bind(this)} style={{color:'#0385ff',textDecoration:'underline',lineHeight:'30px'}}>首页</a>
                        </li>
                        <li>
                            {userName ?  <img src={ iconUrl !=="" ? imageUrl+iconUrl :  require('../../assets/image/project/project1.png')} className={styles.agency}/> :''}
                            <a onClick={()=>{this.props.history.push('/project')}}>{(createOperator || creatPeople)+'/'+(projectName || itemName)}</a>
                        </li>
                        <li>
                            <UserMenu {...userProps}/>
                        </li>
                    </ul>
                </div>
            </header>
        )
    }
}

export default  connect(({projectDetail}) => ({projectDetail}))(Header)
