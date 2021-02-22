import React, { Component } from 'react'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
//添加分类的form组件
class AddForm extends Component {

    render() {
        //要获得表单对象，就要把此非路由封装成高阶组件
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId', {
                            initialValue: '0'  //初始值
                        })(
                            <Select>
                                <Option value='0'>一级分类</Option>
                                <Option value='1'>电脑</Option>
                                <Option value='2'>一级分类</Option>
                            </Select>
                        )
                    }

                </Item>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: ''  //初始值
                        })(
                            <Input placeholder="请输入分类名称" />
                        )
                    }
                </Item>
            </Form>
        )

    }
}

export default Form.create()(AddForm)