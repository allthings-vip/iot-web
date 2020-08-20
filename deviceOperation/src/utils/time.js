import moment from 'moment';
import 'moment/locale/zh-cn';

export const weekDays = 6;
export const oneMonthDays = 29;
export const threeMonthDays = 89;
export const sixMonthDays = 30 * 6;
export let now = new Date(); //当前日期
export let nowDayOfWeek = now.getDay(); //今天本周的第几天
export let nowDay = now.getDate(); //当前日
export let nowMonth = now.getMonth(); //当前月
export let nowYear = now.getYear(); //当前年
nowYear += (nowYear < 2000) ? 1900 : 0; //
export let lastMonthDate = new Date(); //上月日期
moment.locale('zh-cn');

export function dateFormat() {
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    return time;
}

export function getLocalTime(timestamp) {
    let time = moment.unix(timestamp / 1000).format('YYYY-MM-DD');
    return time;
}
export function getLocalTimeF(timestamp) {
    let time = moment.unix(timestamp / 1000).format('YYYY-MM-DD HH:mm:ss');
    return time;
}
export function getStampTime(time) {
    let times = new Date(time)
    return times.getTime();
}
export function oneWeekTime() {
    let fromDate = moment().subtract(weekDays, 'days').format('YYYY-MM-DD');
    let toDate = moment().format('YYYY-MM-DD');
    return {
        from: fromDate,
        to: toDate
    };
}

export function oneMonthTime() {
    let fromDate = moment().subtract(oneMonthDays, 'days').format('YYYY-MM-DD');
    let toDate = moment().format('YYYY-MM-DD');
    return {
        from: fromDate,
        to: toDate
    };
}

export function threeMonthTime() {
    let fromDate = moment().subtract(threeMonthDays, 'days').format('YYYY-MM-DD');
    let toDate = moment().format('YYYY-MM-DD');
    return {
        from: fromDate,
        to: toDate
    };
}
//获得本周的开始日期
export function getWeekDate() {
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return {
        from: weekStartDate.format('YYYY-MM-DD'),
        to: weekEndDate.format('YYYY-MM-DD')
    };
}
//获取当前时间往后推迟固定天数
export function delayTime(days){
    let currentSeconds = new Date().getTime();
    if(days){
        let daysSeconds = (days - 0) * 24 *60*60*1000;
        currentSeconds = currentSeconds + daysSeconds;
    }
    return getLocalTime(currentSeconds);
}

//获取当前天减去或增加固定天数的时间戳
export function getDayChange(days){
    if(!days){
        return moment(moment().format('YYYY-MM-DD'));
    }

    if(days < 0){
        return moment(moment().subtract('d', Math.abs(days)).format('YYYY-MM-DD'));
    }

    return moment(moment().add('d', days).format('YYYY-MM-DD'));
}

//获取当前月份减去或增加固定月份的时间戳
export function getMonthChange(months){
    if(!months){
        return moment(moment().format('YYYY-MM'));
    }

    if(months < 0){
        return moment(moment().subtract('M', Math.abs(months)).format('YYYY-MM'));
    }

    return moment(moment().add('M', months).format('YYYY-MM'));
}
