
// // 会员系统注册链接
// export const certifyUrl = {
//     "dev": 'http://sitetest.tf56.com/v2/pages/member/authentication/memberAccreditation.html',
//     "online": 'https://www.tf56.com/v2/pages/member/authentication/memberAccreditation.html'
// }
import {reqwest} from 'reqwest';

export const STATUS = {
    //承运商认证
    CERTIFY_URL_DEV: "http://sitetest.tf56.com/v2/pages/member/authentication/memberAccreditation.html",
    CERTIFY_URL_ONLINE: "http://www.tf56.com/v2/pages/member/authentication/memberAccreditation.html",
    CERTIFY_NOAPPLY: '未申请',
    CERTIFY_VERIFING: '审核中',
    CERTIFY_VERIFIED: '已审核',
    CERTIFY_RETURNED: '已退回',
    CERTIFY_OUTDATE: '已过期',
}

export const Page = {
    pageIndex: 1,
    pageSize:10,
}
export const uploadUrl = {
   uploadUrl: "/dos/upload/image"
}
export const uploadFileUrl = {
    uploadFileUrl: "/dos/devices/import"
 }
export const deviceTypeStatus = {
    
}