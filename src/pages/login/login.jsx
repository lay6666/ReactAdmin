import React, { Component } from 'react'
import {
    Form,
    Icon,
    Input,
    Button,
    message
} from 'antd'

import './login.less'
import logo from '../../assets/images/logo.png'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { Redirect } from 'react-router-dom'

const Item = Form.Item   //不能写在import之前

//登录的路由组件
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    handleSubmit=(event)=>{
        //阻止事件的默认行为
        event.preventDefault()
        //对所有表单字段进行校验
        this.props.form.validateFields(async(err,values)=>{
            //values就是表单输入的内容，是一个对象
            //校验成功
            if(!err){
                // console.log('提交登录的ajax请求',values)
                //请求登录
                const {username,password} = values
                const result = await reqLogin(username,password)
                // console.log('请求成功',response.data)
                if(result.status===0){  //登录成功
                    //提示登陆成功
                    message.success('登陆成功')
                    //保存user
                    const user = result.data;
                    memoryUtils.user = user;  //保存到内存中
                    storageUtils.saveUser(user)  //保存到local中

                    //跳转到管理界面
                    this.props.history.replace('/')
                }else{  //登陆失败  
                    //提示错误信息
                    message.error(result.msg)
                }
            }else{
                console.log('校验失败')
            }
        })

        //得到form对象
        // const form = this.props.form;
        //获取表单项的输入数据，values是对象
        // const values = form.getFieldsValue()
        // console.log(values)
    }
    //对密码进行自定义验证
    validatorPWD = (rule,value,callback) =>{
        // callback()  //验证通过
        // callback('xxxx')  //验证失败，并指定提示的文本
        if(!value){
            callback('密码必须输入')
        }else if(value.length<4){
            callback('密码长度不能小于4位')
        }else if(value.length>12){
            callback('密码长度不能大于12位')
        }else if(!/^[a-zA-Z0-9_]+$/.test(value)){
            callback('密码必须是英文、数组或下划线 组成')
        }else{
            callback();  //验证通过
        }
    }

    render() {
        //如果用户已经登录，自动跳转到管理界面
        const user = memoryUtils.user
        if(user && user._id){
            return <Redirect to='/' />
        }

        //得到强大功能的form对象
        const form = this.props.form;
        const{ getFieldDecorator } = form;

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} />
                    <h1>React项目：后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    {/* 
                    1、前台表单验证
                    2、收集表单输入数据
                     */}
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item> 
                            {
                                getFieldDecorator('username',{
                                //配置对象：属性名是特定的一些名称
                                //声明式验证：直接使用别人定义好的验证规则进行验证
                                rules: [
                                    {required: true, whitespace: true, message: '必须输入用户名'}, 
                                    {min: 4, message: '用户名必须大于 4 位'},
                                    {max: 12, message: '用户名必须小于 12 位'}, 
                                    {pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线 组成'} 
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="Username"
                                    />
                                )
                            }
                        </Item>
                        <Form.Item> 
                            {
                                getFieldDecorator('password',{
                                    rules:[
                                        {
                                            validator:this.validatorPWD
                                        }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }
                        </Form.Item>
                        <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button">
                            登陆
                        </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

/*
包装Form组件，生成一个新的组件：Form(Login)
新组件会向Form组件传递一个强大的对象属性：form
1、高阶函数 create()，因为它返回的是一个函数
    1)一类特别的函数
        a.接受函数类型的参数
        b.返回值是函数
    2)常见的高阶函数
        a.定时器：setTimeout()/setInterval()
        b.promise: Promise(() => {}) then(value =>{}, reason=>{})
        c.数组遍历相关的方法：forEach()/filter()/map()/reduce()/find()/findIndex()
        d.函数对象的bind()
        e.Form.create()()/getFieldDecorator()()
    3)高阶函数更新动态，更加具有扩展性 

2、高阶组件
    1)本质就是一个函数
    2)接受一个组件(被包装组件)，返回一个新的组件(包装组件)，包装组件会向被包装组件传入特定属性
    3)作用：扩展组件的功能
    4)高阶组件也是高阶函数：接受一个组件函数，返回的是一个新的组件函数

async 和 await
1、作用
    简化promise对象的使用：不用再使用.then()来知道成功/失败的回调函数
    以同步编码(没有回调函数了)方式实现异步流程
    await是等待请求，返回请求成功的数据
2、在哪里写await
    在返回promise的表达式左侧写await：不要promise，而是要promise异步执行成功的value数据
3、在哪里写async
    await所在函数(最近的)定义的左侧
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin