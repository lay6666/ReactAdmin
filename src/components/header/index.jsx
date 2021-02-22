import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import { Modal} from 'antd'

import LinkButton from '../link-button'
import {reqWeather} from '../../api'
import menuList from '../../config/manuConfig'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import './index.less'

//左侧导航组件
class Header extends Component {

    state = {
        currentTime:formateDate(Date.now()),  //当前时间字符串
        dayPictureUrl:'',     //天气图片url
        weather:'',       //天气的文本
    }

    getTime=()=>{
        //每隔1s获取当前时间，并更新状态数据currentTime
        this.intervalId = setInterval(()=>{
            const currentTime = formateDate(Date.now())
            this.setState({currentTime})
        },1000)
    }

    getWeather=async ()=>{
        //调用接口请求函数获取数据
        const {dayPictureUrl,weather} = await reqWeather('广州')
        this.setState({dayPictureUrl,weather})
    }

    getTitle=()=>{
        //得到当前请求路径
        const path = this.props.location.pathname
        let title
        //如果用find(),find是找到数组中的某个元素，有时我们也需要某个元素下的children下的对象。因此用find无法实现
        menuList.forEach(item =>{
            if(item.key===path){ //说明当前的item就是要显示的对象
                title = item.title
            }else if(item.children){
                const cItem = item.children.find(cItem => cItem.key===path)
                if(cItem){
                    title = cItem.title
                }
            }
        })
        return title
    }

    //退出登录
    logout =()=>{
        //显示确认框
        Modal.confirm({
            content:'确定退出吗?',
            onOk:()=>{  
                //删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}

                //跳转到login界面
                //注意：此时的this是undefine，并不是组件对象。
                //那么就可以将此函数修改为箭头函数，箭头函数就可以使用外部的this
                this.props.history.replace('/login')
            }
        })
    }

    //第一次render之后执行一次
    //一般在此执行异步操作：发ajax请求/启动定时器
    componentDidMount(){
        //获取当前时间
        this.getTime()
        //获取当前天气
        this.getWeather()
    }

    //在当前组件卸载之前调用
    componentWillUnmount(){
        //清楚定时器
        clearInterval(this.intervalId)
    }

    render() {
        const {currentTime,dayPictureUrl,weather} = this.state
        const username = memoryUtils.user.username

        const title = this.getTitle()

        return(
            <div className="header">
                <div className="header-top">
                    <span>欢迎，{username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{title}</div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <img src={dayPictureUrl}/>
                        <span>{weather}</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)