import React, {Component} from 'react';
import {message,Dropdown,Menu,Icon,Layout } from 'antd';
import styles from './indexSider.less';
import {sideMenu} from './menu';
import TfIcon from '../common/TfIcon/index';
const { Header, Content, Footer, Sider } = Layout;
export default class IndexSider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuId: '1'
        }
    }
    menuClick = (menuId, menuUrl) => {
        this.setState({
            menuId
        })

        this.props.history.push(menuUrl)
    }
    render() {
        const {userInfo} = this.props;


        return (
            <div>
                <Sider className={styles.sider}>
                    <div className={styles.siderChild}>
                        {
                            sideMenu.map((item, index) => {
                                let selected = this.state.menuId === item.menuId;
                                if(userInfo.roleCode ==='admin') {
                                    return <div style={{backgroundColor: selected ? '#1092FA' : '#fff', color: selected ? '#fff' : '#333' }} onClick={() => this.menuClick(item.menuId, item.menuUrl)}>
                                        <img src={item.menuActiveIcon} style={{display: selected ? 'block' : 'none'}}/>
                                        <img src={item.menuIcon} style={{display: selected ? 'none' : 'block'}}/>
                                        <span>{item.menuName}</span>
                                    </div>
                                } else {
                                     if(index===1 || index===2 || index===4) {

                                     } else {
                                        return <div style={{backgroundColor: selected ? '#1092FA' : '#fff', color: selected ? '#fff' : '#333' }} onClick={() => this.menuClick(item.menuId, item.menuUrl)}>
                                            <img src={item.menuActiveIcon} style={{display: selected ? 'block' : 'none'}}/>
                                            <img src={item.menuIcon} style={{display: selected ? 'none' : 'block'}}/>
                                            <span>{item.menuName}</span>
                                        </div>
                                     }
                                }
                            })
                        }
                    </div>
                </Sider>
                
            </div>
        )
    }

    componentDidMount () {
        const {history} = this.props;
        if(history.location.pathname == '/') {
            this.setState({
                menuId: '1'
            })
        } else if(history.location.pathname == '/user') {
            this.setState({
                menuId: '2'
            })
        } else if(history.location.pathname == '/monitor') {
            this.setState({
                menuId: '3'
            })
        } else if(history.location.pathname == '/ops') {
            this.setState({
                menuId: '4'
            })
        } else if(history.location.pathname == '/syslog') {
            this.setState({
                menuId: '5'
            })
        }
    }
}
