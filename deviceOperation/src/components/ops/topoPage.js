import React from 'react';
import styles from './topoPage.less';
import NullResult from '../NullResult';

import {Icon} from 'antd';

class TopoPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            moveParam: 0,
            moveParamS: 0,
            deviceHeight: 0,
            littleparam: 0
        }
    }

    serviceDetail = (v) => {
        this.props.queryDetailData(v);
        this.props.dispatch({
            type: 'opsmonitor/updateState',
            payload: {
                detailModal: true,
                detailRecord: v
            }
        })
    }

    moveContent = (direc) => {
        console.log(this.aep.clientWidth, this.aepContent.style.left)
        if(direc === 'left') {
            (this.aep.clientWidth-this.aepContent.clientWidth)<-25 && (this.aep.clientWidth-this.aepContent.clientWidth)<parseInt(this.aepContent.style.left) && this.setState({
                moveParam: (this.aepContent.clientWidth-this.aep.clientWidth+parseInt(this.aepContent.style.left)) < 200 ? (this.state.moveParam-(this.aepContent.clientWidth-this.aep.clientWidth+parseInt(this.aepContent.style.left))) : (this.state.moveParam-200)
            })
        } else {
            this.state.moveParam <0 && this.setState({
                moveParam: this.state.moveParam>=-200 ? 0 : (this.state.moveParam+200)
            })
        }
    }

    moveContentS = (direc) => {
        if(direc === 'left') {
            (this.aepS.clientWidth-this.aepSContent.clientWidth-20)<parseInt(this.aepSContent.style.left) && this.setState({
                moveParamS: (this.aepSContent.clientWidth-this.aepS.clientWidth+parseInt(this.aepSContent.style.left)) < 200 ? (this.state.moveParamS-20-(this.aepSContent.clientWidth-this.aepS.clientWidth+parseInt(this.aepSContent.style.left))) : (this.state.moveParamS-200)
            })
        } else {
            this.state.moveParamS <0 && this.setState({
                moveParamS: this.state.moveParamS>=-200 ? 0 : (this.state.moveParamS+200)
            })
        }
    }
    render() {
        console.log(this.state.moveParam)
        const hhhh = [{serviceName: 'w'},{serviceName: 'w'},{serviceName: 'r'},{serviceName: 'w'},{serviceName: 't'},{serviceName: 'r'},{serviceName: 'u'}]
        // const serarr = [{pingtai: [1,2,3,4]},{pingtai: [1,2,3]},{pingtai: [1,2,3,4]},{pingtai: [1,2,3]},{pingtai: [1,2,3,4]},{pingtai: [1,2,3,4]},{pingtai: [1,2,3,4]},{pingtai: [1,2,3,4]},{pingtai: [1,2,3,4]}]
        const { topoData } = this.props;
        // const topoData = []
        // const topoData = [
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '1', status: true},
        //     {serviceName: 'wwwwwwwwwe', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwwr', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwwr', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwwr', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     // {serviceName: 'wwwwwwwwwz', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwwz', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwwz', ip: '127.54.67.9', port: '8090', levels: '1'},
        //     {serviceName: 'wwwwwwwwwt', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     // {serviceName: 'wwwwwwwwwt', ip: '127.54.67.9', port: '8090', levels: '2'}, 
        //     // {serviceName: 'wwwwwwwwwt', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     // {serviceName: 'wwwwwwwwwt', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     {serviceName: 'wwwwwwwwwq', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     {serviceName: 'wwwwwwwwwq', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     {serviceName: 'wwwwwwwwwq', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '4'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '4'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '4'},
        //     {serviceName: 'wwwwwwwwwu', ip: '127.54.67.9', port: '8090', levels: '5'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '4'},
        //     // {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     // {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     // {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     // {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '2'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '3', dependencyService: 'wwwwwwwwww', status: true},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '3', dependencyService: 'wwwwwwwwww', status: true},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '3', dependencyService: 'wwwwwwwwww', status: true},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '3', dependencyService: 'wwwwwwwwww'},
        //     {serviceName: 'wwwwwwwwww', ip: '127.54.67.9', port: '8090', levels: '3', dependencyService: 'wwwwwwwwwt',status: false},
        // ]
        let level1 = topoData.filter(item => {
            return item.levels == '1'
        })
        let level2 = topoData.filter(item => {
            return item.levels == '2'
        })
        let level3 = topoData.filter(item => {
            return item.levels == '3'
        })
        let level4 = topoData.filter(item => {
            return item.levels == '4' || item.levels == '5'
        })
        console.log('level',level1, level2, level3, level4)
        let aepParam = [];
         let aepArr=level1.map((item, index) => {
             if(aepParam.indexOf(index)==-1) {
                return level1.filter((v, ind) => {
                    if(v.serviceName == item.serviceName) {
                          aepParam.push(ind);
                          return v;
                    }
                })
             }
        }).filter(t => {
            return t;
        })

        let dosParam = [];
        let dosArr=level4.map((item, index) => {
            if(dosParam.indexOf(index)==-1) {
               return level4.filter((v, ind) => {
                   if(v.levels == item.levels) {
                         dosParam.push(ind);
                         return v;
                   }
               })
            }
        }).filter(t => {
            return t;
        })

       let dcsParam = [];
       let dcsArr=level2.map((item, index) => {
            if(dcsParam.indexOf(index)==-1) {
            return level2.filter((v, ind) => {
                if(v.serviceName == item.serviceName) {
                        dcsParam.push(ind);
                        return v;
                }
            })
            }
        }).filter(t => {
            return t;
        })

        let outArr=dcsArr.map((item, index) => {
            return level3.filter((v, ind) => {
                if(v.dependencyService == item[0].serviceName) {
                        return v;
                }
            })
        })

        console.log('arrcheck',aepArr, dosArr, dcsArr, outArr)
        
        return (
            <div className = {styles.topo}>
                {
                    topoData.length ? (
                    <React.Fragment> 
                    <div className={styles.div1}>
                    <div className={styles.head}><span>AEP</span><span>应</span><span>用</span><span>使</span><span>用</span><span>平</span><span>台</span></div>
                    <div id='aep' className={styles.aep} ref={node => this.aep = node}>
                        <div id='aepleft' className={styles.butLeft} onClick={()=>this.moveContent('right')}><Icon type='left'/></div>
                        <div id='aepcon' className={styles.aepContent} style={{left: `${this.state.moveParam}px`}} ref={node => this.aepContent = node}>
                        {
                            aepArr.map((item, idex) => {
                                return (
                                    <div className={styles.aepChild}>
                                        {
                                            item.map(v => {
                                                return (
                                                    <div className={styles.child} onClick={()=>this.serviceDetail(v)}>
                                                        <div className={styles.childIcon} style={{background: v.status ? `url(${require('../../assets/image/ops/inline.png')})` : `url(${require('../../assets/image/ops/outline.png')})`, backgroundSize: '100% 100%'}}><span title={v.serviceName}>{v.serviceName}</span></div>
                                                        <span title={v.ip + ":"+v.port}>{v.ip + ":"+v.port}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div id='aepright' className={styles.butRight} onClick={()=>this.moveContent('left')}><Icon type='right'/></div>
                    </div>
                    </div>

                    <div className={styles.dos}>
                        {
                            dosArr.map((item, index) => {
                                return (
                                    <React.Fragment>
                                    <div className={styles.dosCon}>
                                        
                                                <div className={styles.recIcon} style={{visibility: item[0].levels == '5' ? 'visible' : 'hidden'}}>
                                                    <div className={styles.recSpot}></div>
                                                    <div className={styles.recLine}></div>
                                                    <div className={styles.recSpot2}></div>
                                                </div>
                                            
                                        <div className={styles.dosChild}>
                                            {
                                                item.map(v => {
                                                    return(
                                                    <div className={styles.child} onClick={()=>this.serviceDetail(v)}>
                                                        <div className={styles.childIcon} style={{background: v.status ? `url(${require('../../assets/image/ops/inline.png')})` : `url(${require('../../assets/image/ops/outline.png')})`, backgroundSize: '100% 100%'}}><span title={v.serviceName}>{v.serviceName}</span></div>
                                                        <span title={v.ip + ":"+v.port}>{v.ip + ":"+v.port}</span>
                                                    </div>)
                                                })
                                            }
                                            
                                        </div>
                                        <div className={styles.recIcon}>
                                            <div className={styles.recSpot}></div>
                                            <div className={styles.recLine}></div>
                                            <div className={styles.recSpot2}></div>
                                        </div>
                                    </div>
                                    {
                                        index == (dosArr.length - 1) ? ('') : (
                                            <React.Fragment>
                                                <div className={styles.recLeft}></div>
                                                <div className={styles.recCross}></div>
                                                <div className={styles.recRight}></div>
                                            </React.Fragment>
                                        )
                                    }
                                    </React.Fragment>
                                )
                            })
                        }
                    </div>
                    <div className={styles.div1}>
                    <div className={styles.head}><span>DCS</span><span>设</span><span>备</span><span>接</span><span>入</span></div>
                    <div className={styles.aep} ref={node => this.aepS = node}>
                        {/* <div className={styles.head}><span>DCS设备接入</span></div> */}
                        
                        <div id='dcsleft' className={styles.butLeft} onClick={()=>this.moveContentS('right')}><Icon type='left'/></div>
                        <div id='dcscon' className={styles.aepContent} style={{left: `${this.state.moveParamS}px`}} ref={node => this.aepSContent = node}>
                        {
                            dcsArr.map((item, idex) => {
                                return (
                                    <div className={styles.aepChild}>
                                        {
                                            item.map(v => {
                                                return (
                                                    <div className={styles.child} onClick={()=>this.serviceDetail(v)}>
                                                        <div className={styles.childIcon} style={{background: v.status ? `url(${require('../../assets/image/ops/inline.png')})` : `url(${require('../../assets/image/ops/outline.png')})`, backgroundSize: '100% 100%'}}><span title={v.serviceName}>{v.serviceName}</span></div>
                                                        <span title={v.ip + ':'+v.port}>{v.ip +':'+ v.port}</span>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                        </div>
                        <div id='dcsright' className={styles.butRight} onClick={()=>this.moveContentS('left')}><Icon type='right'/></div>
                    </div>
                    </div>
                    {
                        level3.length ? (
                        <div className={styles.aepLine}>
                            <div id='aepline' className={styles.aepLineCon} style={{left: `${this.state.moveParamS}px`}} >
                            {
                                dcsArr.map((item, index) => {
                                        return (
                                            <div className={styles.aepLineChild} style={{width: `${item.length*100+100}px`}}>
                                            {outArr[index].length > 0 ? (
                                                <React.Fragment>
                                                    <div className={styles.aepSpot} style={{backgroundColor: '#93C553'}}></div>
                                                    <div className={styles.lineChild} style={{backgroundColor: '#93C553'}}></div>
                                                </React.Fragment>
                                            ) : ('')
                                            }
                                            </div>
                                        )
                                })
                            }
                            </div>
                        </div> ) : ('')
                    }

                    {
                        level3.length ? (
                            <div className={styles.div2}>
                            <div className={styles.head2} style={{height: this.state.deviceHeight + 'px', minHeight: '150px'}}><span>外</span><span>部</span><span>设</span><span>备</span><span>与</span><span>平</span><span>台</span></div>
                            <div className={styles.device} style={{height: this.state.deviceHeight + 'px', minHeight: '150px'}}>
                                <div id='devicecon' className={styles.deviceCon} style={{left: `${this.state.moveParamS}px`}} >
                                {
                                    outArr.map((item, index) => {
                                        return (
                                            <div className={styles.deviceCon2} style={{width: `${dcsArr[index].length*100+100}px`}}>
                                                {
                                                    item.map((v, ind) => {
                                                        return (
                                                            <div className={styles.deviceDiv} style={{marginLeft: `${(dcsArr[index].length*100+100-2)/2-this.state.littleparam}px`}}>
                                                                <div className={styles.lineChild} style={{backgroundColor: '#93C553'}}></div>
                                                                <div className={styles.lineAcross} style={{backgroundColor: v.status ? '#93C553' : '#D0021B'}}></div>
                                                                <div className={styles.lineSpot} style={{backgroundColor: v.status ? '#93C553' : '#D0021B'}}></div>
                                                                <div className={styles.deviceDiv2} style={{top: `${(ind+1)*40-15}px`, backgroundColor: v.status ? '#93C553' : '#E2E9EE'}}><img src={require('../../assets/image/device.png')}/><span title={v.serviceName}>{v.serviceName}</span></div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                            </div>
                        ) : ('')
                    }
                </React.Fragment>) : (<NullResult/>)
                }
            </div>
        )
    }

    componentDidMount() {
        if(this.props.topoData.length == 0) return

        const aepEl = document.getElementById('aep');
        const aepconEl = document.getElementById('aepcon');
        const aepButtonLeft = document.getElementById('aepleft');
        const aepButtonRight = document.getElementById('aepright');
        const dcscon = document.getElementById('dcscon');
        const aepline = document.getElementById('aepline');
        const devicecon = document.getElementById('devicecon');
        const dcsleft = document.getElementById('dcsleft');
        const dcsright = document.getElementById('dcsright');

        console.log('width', aepconEl.clientWidth, aepEl.clientWidth);

        devicecon && this.setState({deviceHeight: devicecon.clientHeight + 40})

        this.listenFunc = () => {
            if(aepconEl.clientWidth > aepEl.clientWidth){
                aepconEl.style.left = 0;
                this.setState({moveParam: 0})
                aepconEl.style.marginLeft = 0;
                aepButtonLeft.style.display = '';
                aepButtonRight.style.display = '';
            } else {
                aepconEl.style.left = '50%';
                aepconEl.style.marginLeft = -aepconEl.clientWidth/2 + 'px';
                aepButtonLeft.style.display = 'none';
                aepButtonRight.style.display = 'none';
            }
            if(dcscon) {
                if(dcscon.clientWidth + 20 > aepEl.clientWidth) {
                    dcscon.style.left = 0;
                    dcscon.style.marginLeft = 0;
                    dcsleft.style.display = '';
                    dcsright.style.display = '';
                    
                    aepline && (aepline.style.left = 0);
                    aepline && (aepline.style.marginLeft = 0);

                    devicecon && (devicecon.style.left = 0);
                    devicecon && (devicecon.style.marginLeft = 0);

                    this.setState({moveParamS: 0})

                    this.setState({littleparam: 2})
                } else {
                    dcscon.style.left = '50%';
                    dcscon.style.marginLeft = -dcscon.clientWidth/2 + 'px';
                    dcsleft.style.display = 'none';
                    dcsright.style.display = 'none';
                    
                    aepline && (aepline.style.left = '50%');
                    aepline && (aepline.style.marginLeft = -aepline.clientWidth/2 + 'px');
                    
                    devicecon && (devicecon.style.left = '50%');
                    devicecon && (devicecon.style.marginLeft = -devicecon.clientWidth/2 + 'px');

                    this.setState({littleparam: 0})
                }
            }
        }

        this.listenFunc();

        window.addEventListener('resize', this.listenFunc);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.listenFunc)
    }
}

export default TopoPage;