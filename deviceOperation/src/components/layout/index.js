import React, {Component} from 'react';
import {connect} from 'dva';
import Head from './header';
import SiderBar from './sider';
import styles from './index.less';
import {withRouter} from 'dva/router';
import {toCarrierIndex, toIndex} from '../../utils/common';
import {isEmpty} from 'lodash';
import { Layout, Menu, Icon,LocaleProvider,Spin,Row,Col } from 'antd';
import { getStampTime,getLocalTime } from '../../utils/time';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import HeaderCommon from './headerCommon';
import IndexSider from './indexSider';
const { Header, Content, Footer, Sider } = Layout;
function tbHeightStyle() {
    let height = 0;
    const windowHeight = document.body.offsetHeight;
    const oTop = 80+40+20;
    height = windowHeight - oTop;
    return height;
}

class LayoutC extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:true,
        }
    }
    componentDidMount() {
        const {dispatch,history,location} = this.props;
        // dispatch({
        //     type:'app/queryUserInfo',

        // })
    }
    componentWillMount() {
        
    }
    render() {
        const {children, location, dispatch, app, history} = this.props;
        const {updatePasswordModal,updateUserInfoModal,userInfo} = app;
        const Height = tbHeightStyle();
        let login = false;
        let index = false;
        //登录
        if (app.login && location.pathname == '/login') {
            login=true
        }
        let iotProjectId = localStorage.getItem('iotProjectId');
        if(isEmpty(iotProjectId)){
            if (location.pathname == '/' || location.pathname == '/home' || location.pathname == '/monitor'|| location.pathname == '/user' || location.pathname == '/login' || location.pathname == '/ops' || location.pathname == '/syslog') {
            } else {
                toIndex();
            }
        }
        
        //首页，用户管理，设备监视
        if (location.pathname == '/' || location.pathname == '/monitor'|| location.pathname == '/user' || location.pathname == '/ops' || location.pathname == '/syslog') {
            index=true
        }
        //边栏
        const siderProps = {
            history,
            userInfo,
        };
        //头部
        const headerProps = {
            history,
            dispatch,
            userInfo,
            updateUserInfoModal,
            updatePasswordModal,
            logout(){
                dispatch({
                    type:'app/logout'
                })
            }
        };
        //首页头部
        const headerCProps = {
            history,
            dispatch,
            updateUserInfoModal,
            updatePasswordModal,
            userInfo,
            logout(){
                dispatch({
                    type:'app/logout'
                })
            }
        };

        
        return !login ? (
            index ? <Layout>
            <HeaderCommon {...headerCProps}/>
            <Layout  style={{minWidth:'1080px',padding:'0px 10px 10px 10px'}}> 
                <IndexSider {...siderProps}/>
                <Content>
                <div  style={{minHeight: Height + 'px'}}>
                    <LocaleProvider locale={zhCN}>
                        {children}
                    </LocaleProvider>
                </div>
                <Row className={styles.footer}>
                    <Col span={24}>
                        <span className={styles.copyrightImg}></span>
                        <a style={{color:'#333'}} href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902000631" target="_blank">浙公网安备 33010902000631号</a>
                         | <a style={{color:'#333'}} href="http://beian.miit.gov.cn" target="_blank">浙ICP备14026855号-4</a>
                    </Col>
                    {/* <div style={{textAlign:"center",paddingTop:"15px"}}>
                        <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902000631" target="_blank">
                        <img style={{verticalAlign:'-5px',marginRight:'5px'}} src="http://www.tf56.com/style/img/copy-38783b77fb.png"/>>
                        浙公网安备 33010902000631号</a> | 
                        <a href="http://beian.miit.gov.cn" target="_blank">浙ICP备14026855号-4</a>
                    </div> */}
                </Row>

                </Content>
            </Layout> 
        </Layout>
         : <Layout>
                <SiderBar {...siderProps}/>
                <Layout style={{ marginLeft: 170,minWidth:1060 }}>
                    <Head style={{ background: '#fff', padding: 0 }} {...headerProps}/>
                    <Content style={{ padding: '0px 20px', overflow: 'initial' }} >
                        <div style={{minHeight: Height + 'px'}}>
                            <LocaleProvider locale={zhCN}  style={{minHeight:Height+20+'px'}}>
                                    {children}
                            </LocaleProvider>
                        </div>
                        <Row className={styles.footer}>
                            <Col span={24}>
                                <span className={styles.copyrightImg}></span>
                                <a style={{color:'#333'}} href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902000631" target="_blank">浙公网安备 33010902000631号</a>
                                | <a style={{color:'#333'}} href="http://beian.miit.gov.cn" target="_blank">浙ICP备14026855号-4</a>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
                
            </Layout> ) : <div style={{height:'100%',minHeight:'100%'}}>
                <div style={{minHeight: Height + 'px'}}>
                    {children}
                </div>
                {/* <Row className={styles.footer}>
                    <Col span={24}>
                        <span className={styles.copyrightImg}></span>
                        <span>浙公网安备 33010902000631号 | 浙ICP备14026855号-4</span>
                    </Col>
                </Row> */}
            </div>
    }
}

export default withRouter(connect(({app}) => ({app}))(LayoutC));
