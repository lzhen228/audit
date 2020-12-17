import { get ,post } from '../axios/request'
//今日数据总容量
export const totalSize = (data) => get('/api/api/totalSize',data)
//今日审计数量
export const totalSjNum = (data) => get('/api/api/totalSjNum',data)
//统计合格率
export const totalPassRate = (data) => get('/api/api/totalPassRate',data)
//统计近七日
export const totalWeekSjNum = (data) => get('/api/api/totalWeekSjNum',data)
//审计员表格
export const sjMsj = (count,pageNum ,data) => post(`/api/api/sjMsg?count=${count}&pageNum=${pageNum}`,data)
//合格修改
export const sjOpion = (data) => post("/api/api/SjOpion",data)
//返回调用接口
export const delData = (data) => get("/api/api/delData",data)
// 审计员查看答题详情展示
export const auditorList = (data) => get('/api/api/sjDetailMsg',data)
// 审计员审计答题是否合格
export const sjDetailOpion = (params,data) => post('/api/api/sjDetailOpion?submitUser='+params,data)
// 发送邮件
export const sendMail = (data) => get('/api/api/sendMail',data)
