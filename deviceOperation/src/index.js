// 文档：https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md
//      https://github.com/sorrycc/blog/issues/48#issue-254950560
//      https://github.com/dvajs/dva/blob/master/README_zh-CN.md

// 关于dva1.x升级到2.x: https://github.com/programmer-yang/blog/issues/1

// import  'babel-polyfill';
import dva from 'dva';
import createLoading from 'dva-loading';
import './index.less';

// 1. Initialize
const app = dva({
    onError(e) { // 屏蔽报错，避免影响后续执行
        // e.preventDefault();
    }
});

// 2. Plugins
// effects自动的loading效果
app.use(createLoading({effects: true}));

// 3. Model
app.model(require('./models/app'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
