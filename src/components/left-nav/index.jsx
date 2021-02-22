import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';

import logo from '../../assets/images/logo.png'
import menuList from '../../config/manuConfig'
import './index.less'

const { SubMenu } = Menu;

//左侧导航组件
class LeftNav extends Component {
    //根据menu的数据数组生成对应的标签数组
    //使用map()+递归调用
    getMenuNodes_map = (menuList) => {
        return menuList.map(item => {
            /*  每个item的结构：
            {
                title: '首页', // 菜单标题名称 
                key: '/home', // 对应的 path 
                icon: 'home', // 图标名称 
                children:[]   //可能有，也可能没有
            }  
            应该返回<Menu.item>或者 <SubMenu>
            */
           if(!item.children){
               return (
                <Menu.Item key={item.key}>
                    <Link to={item.key}>
                        <Icon type={item.icon}></Icon>
                        <span>{item.title}</span>
                    </Link>
                </Menu.Item> 
               )
           }else{
               return (
                <SubMenu key={item.key} title={
                    <span>
                        <Icon type={item.icon}/>
                        <span>{item.title}</span>
                    </span>
                }>
                    {this.getMenuNodes(item.children)}
                </SubMenu>
               )
           }
           return 
        })
    }

    //根据menu的数据数组生成对应的标签数组
    //使用reduce()+递归调用。reduce():实现累计累加
    //reduce()的第二个参数是初始值，也就是空数组
    getMenuNodes = (menuList) =>{
        const path = this.props.location.pathname

        return menuList.reduce((pre,item)=>{
            //向pre添加<Menu.item>或者<SubMenu>
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon}></Icon>
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                ))
            }else{
                //查找一个与当前请求路径匹配的子item
                const cItem = item.children.find(cItem => cItem.key === path)
                //如果存在，说明当前item的子列表需要打开
                //往this中存放openKey，this是组件对象
                if(cItem){
                    this.openKey = item.key
                }

                pre.push((
                    <SubMenu key={item.key} title={
                        <span>
                            <Icon type={item.icon}/>
                            <span>{item.title}</span>
                        </span>
                    }>
                        {this.getMenuNodes(item.children)}
                    </SubMenu>
                ))
            }
            return pre
        },[])  
    }

    //在第一次render()之前执行一次
    //为第一次render()准备数据（必须是同步的）
    componentWillMount(){
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        //先调用
        // const menuNodes = this.getMenuNodes(menuList)

        //得到当前请求的路由路径
        // console.log(this.props)
        const path = this.props.location.pathname

        //得到需要打开菜单项的key
        const openKey = this.openKey

        return (
            <div to="/" className="left-nav">
                <Link to='/' className="left-nav-header">
                    <img src={logo}></img>
                    <h1>硅谷后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                >
                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        )
    }
}

/*withRouter是高阶组件
包装非路由组件，返回一个新的组件
新的组件向非路由组件传递3个属性：history/location/match
*/
export default withRouter(LeftNav)