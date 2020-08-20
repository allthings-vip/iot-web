import React, {Component} from 'react';
import styles from './NullResult.less';

/**
 * 默认页面
 * @author zhouhui
 * @since 2017.11.08
 */
class NullResult extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const value = this.props.locale || '暂无数据';
        const imageName ='noresult';
        const imgSrc = require('../assets/image/'+ imageName+'.png');

        return (
            <div className={styles.defaultPageWrap}>
                <img src={imgSrc} alt=''/>
                {/* <div>{value}</div> */}
            </div>
        );
    }
}

export default NullResult;
