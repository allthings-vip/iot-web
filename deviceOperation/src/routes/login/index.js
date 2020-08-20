import React from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Row, Col, Table, Popconfirm,Form, Icon, Input, Button, Checkbox,Layout, Modal } from 'antd';
import { getStampTime,getLocalTime } from '../../utils/time';
import RegisterModal from '../../components/register/RegisterModal';
import styles from './index.less';
import reqwest from 'reqwest';
import md5 from 'md5';
const { Header, Content, Footer, Sider } = Layout;
const CheckboxGroup = Checkbox.Group;
function tbHeightStyle() {
    let height = 0;
    const windowHeight = document.body.offsetHeight;
    const oTop = 64+40;
    height = windowHeight - oTop;
    return height;
}
const Height = tbHeightStyle();
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span:8
    },
    wrapperCol: {
        span: 12
    },
    style: {
        marginBottom: 10
    }
}
const formLayout1 = {

    style: {
        marginBottom: 0
    }
}
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.onOk = this.onOk.bind(this);
        this.state = {
            isNew: false,
            username: window.localStorage.getItem('userName') || '',
            password: window.localStorage.getItem('password') || '',
            remeber: window.localStorage.getItem('Remeber'),
            registerModal: ''
        }
    }

    onOk (){
        const {form,dispatch} = this.props;
        form.validateFields((errors, fieldsValue) => {
            if (errors) {
                return;
            }
            window.localStorage.setItem('userName', fieldsValue.username);
            fieldsValue.password = md5(fieldsValue.password); 
            // window.localStorage.setItem('Remeber', fieldsValue.remeber)
            // const remeber = window.localStorage.getItem('Remeber');
            // if(remeber){
            //     if(this.state.isNew){
            //         fieldsValue.password = md5(fieldsValue.password); 
            //     }
            //     window.localStorage.setItem('password', fieldsValue.password);
            // }else {
            //     window.localStorage.removeItem('password');
            // }
            // delete fieldsValue.remeber;
            dispatch({
                type: 'login/query',
                payload:fieldsValue
            });
          });
    }
    onChange = (e) =>  {
        window.localStorage.setItem('Remeber', e.target.checked);
    }
    onPChange = () => {
        this.setState({
            isNew: true
        })
    }
    onFocus = (e) => {
        this.setState({
            password: ''
        })
    }
    changephoto=()=>{
        const {form,dispatch} = this.props;
        // form.validateFields((errors, fieldsValue) => {
            
        // })
        dispatch({
            type: 'login/getnewphoto',
        });
    }
    onRegister = () => {
        this.setState({registerModal: {
            visible: true,
            width: '600px',
            title: '注册',
            cancelText: '取消',
            okText: '确定',
            onOk: () => {
                this.refs.registerModal.validateFields((err, values) => {
                    if (err) return;
                    values.username = values.username1;
                    values.password =values.password1;
                    //values.password2 = md5(values.password2);
                    delete values.username1;
                    delete values.password1;
                    this.props.dispatch({
                         type: 'login/register',
                         payload: values,
                         callback: (res) => {
                             if (res.code == 0) {
                                this.onCancel();
                             }
                         }
                    })
                    // this.onCancel();
                })
            },
            onCancel: this.onCancel
        }})
    }
    onCancel = () => {
        this.refs.registerModal.resetFields()
        this.setState({
            registerModal: {
                visible: false
            }
        })
    }
    render() {
        const {login, dispatch,
            form: {
                getFieldDecorator,
                setFieldsValue
            }
        } = this.props;
        const {photo} = login
    return (
        <div className={styles.container}>
            <Header className={styles.headerWrap}>
                <div className={styles.logo}>
                        <span className={styles.pic}></span>
                </div>
            </Header>
            <Row align="right" className={styles.con}  style={{height: Height + 'px'}}>

                <Col  span={6} className={styles.form} style={{marginTop: Height/2-180 + 'px'}}>
                    <div className={styles.header}>设备管理控制台</div>
                    {/* <div className={styles.arrow}></div> */}
                    <div  className={styles.loginForm}>
                        <Form >

                            <FormItem label='登录账号' {...formLayout}>
                                {getFieldDecorator('username', {
                                    rules: [{ required: true, message: '请输入用户名' }],
                                })(
                                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)'}} />} placeholder="用户名" />
                                )}
                            </FormItem>


                            <FormItem  label='登录密码' {...formLayout}>
                                {getFieldDecorator('password', {
                                    rules: [{ required: true, message: '请输入密码' }],
                                })(
                                    <Input onFocus={this.onFocus.bind(this)} onBlur={this.onPChange.bind(this)} prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                                )}
                            </FormItem>

                            {
                                photo ? <FormItem  label='验证码' {...formLayout}>
                                <Row gutter={8}>
                                    <Col span={14}>
                                        <FormItem>
                                            {getFieldDecorator('code', { 
                                                rules: [
                                                    { required: true, message: '请输入验证码' },
                                                    {max: 5, message: '最多输入5个字符'},
                                                ],
                                            })(
                                                <Input  placeholder="验证码"/>
                                            )}
                                        </FormItem>
                                    </Col>
                                    <Col span={10} style={{textAlign:'right'}}>
                                        <FormItem style={{lineHeight:'34px'}} className={styles.code}>
                                            <img onClick={this.changephoto}  src = {photo} style={{width:'100%',height:'32px',verticalAlign:'middle'}}/>
                                        </FormItem>
                                    </Col>
                                </Row> </FormItem>: ''
                            }
                            {/* <FormItem style={{textAlign:'right',marginBottom:'0px',width:'91.666%'}}>
                                {
                                    getFieldDecorator('remeber', {
                                        valuePropName: this.state.remeber === 'true' ? 'checked' : 'unchecked',
                                        initialValue: this.state.remeber  === 'true' ? true : false,
                                    })(
                                        // <Checkbox onChange={this.onChange} defaultChecked={this.state.remeber}>记住密码</Checkbox>
                                        <Checkbox onChange={this.onChange}>记住密码</Checkbox>
                                    )
                                }
                            </FormItem> */}
                            <FormItem style={{textAlign:'center',marginBottom:'10'}}>
                                <Button type="primary" onClick={this.onOk} className={styles.btn}>
                                    &nbsp;&nbsp;&nbsp;&nbsp;登录&nbsp;&nbsp;&nbsp;&nbsp;
                                </Button>
                            </FormItem>
                            <FormItem style={{textAlign:'center',marginBottom:'0'}}>
                                <span>还没有账号？<a onClick={this.onRegister}>快去注册</a>&nbsp;></span>
                            </FormItem>
                        </Form>
                    </div>
                </Col>
            </Row>
            {/* <Row className={styles.footer}>
                <Col span={24}>
                    <span className={styles.copyrightImg}></span>
			        <span>浙公网安备 33010902000631号 | 浙ICP备14026855号-4</span>
                </Col>
            </Row> */}
            <Row className={styles.footer}>
                <Col span={24}>
                    <span className={styles.copyrightImg}></span>
                    <a style={{color:'#333'}} href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=33010902000631" target="_blank">浙公网安备 33010902000631号</a>
                    | <a style={{color:'#333'}} href="http://beian.miit.gov.cn" target="_blank">浙ICP备14026855号-4</a>
                </Col>
            </Row>
            <Modal {...this.state.registerModal}>
                <RegisterModal ref='registerModal' dispatch={dispatch}/>
            </Modal>
        </div>
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }
}

export default connect(({ login }) => ({ login }))(Form.create()(Login));
