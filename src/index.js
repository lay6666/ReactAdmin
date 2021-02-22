//入口js
import React from 'react'
import ReactDOM from 'react-dom'
import 'antd/dist/antd.css'

//引入自定义模块一定要加点
import App from './App'
import storageUtils from './utils/storageUtils' 
import memoryUtils from './utils/memoryUtils' 

//读取local中保存的user，保存到内存中
const user = storageUtils.getUser();
memoryUtils.user = user;

//将App组件标签渲染到index页面的div上
ReactDOM.render(<App/>,document.getElementById('root'))