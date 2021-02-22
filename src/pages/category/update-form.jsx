import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Select,
    Input
} from 'antd'

const Item = Form.Item
const Option = Select.Option
//添加分类的form组件
class UpdateForm extends Component {
    static propTypes = {
        categoryName:PropTypes.string.isRequired
    }

    render() {
        const {categoryName} = this.props
        //要获得表单对象，就要把此非路由封装成高阶组件
        const { getFieldDecorator } = this.props.form
        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('categoryName', {
                            initialValue: categoryName //初始值
                        })(
                            <Input placeholder="请输入分类名称" />
                        )
                    }
                </Item>
            </Form>
        )

    }
}

export default Form.create()(UpdateForm)