import { func } from "prop-types";

/*
要求：能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是promise
必须要返回，才可以拿到让调用者拿到结果
*/
import jsonp from 'jsonp'
import ajax from './ajax'
import { message } from "antd";

//登录
// export function reqLogin(username,password){
//     return ajax('/login',{username,password},'POST')
// }
export const reqLogin = (username,password) => ajax('/login',{username,password},'POST')

//添加用户
export const reqAddUser = (user) => ajax('/manage/user/add',user,'POST')

//获取一级/二级分类列表
export const reqCategorys = (parentId) => ajax('/manage/category/list',{parentId})
//添加分类
export const reqAddCategorys = (CategoryName,parentId) => ajax('/manage/category/add',{CategoryName,parentId},'POST')
//更新分类
export const reqUpdateCategory = ({categoryId, categoryName}) => ajax('/manage/category/update', {categoryId, categoryName}, 'POST')

//json请求的接口请求函数
export const reqWeather = (city) =>{
    return new Promise((resolve,reject)=>{
        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
        // jsonp()是一个函数。参数：url,options(有默认值),回调函数
        //这里使用回调函数，说明不是用es6语法
        jsonp(url,{},(err,data)=>{     //第三参数使用箭头回调函数
            console.log('jsonp',err,data)
            //如果成功了
            if(!err && data.status === 'success'){
                const{dayPictureUrl,weather} = data.results[0].weather_data[0]
                resolve({dayPictureUrl,weather})
            }else{
                //如果失败了
                message.error('获取天气信息失败！')
            }
        })
    })

   
}
// reqWeather('北京')