import React, {Component} from 'react';

import {
    Form, Input, Button, Select, Row, Col
} from 'antd';

class SignupForm_ extends Component{
    constructor(){
        super()

        // Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault(); // prevent default action of submit event
        this.props.form.validateFieldsAndScroll((error, values) => {
            if(!error){
                console.log(values);
            }
        });
    }


    render(){
        const {getFieldDecorator} = this.props.form; 
        
        const PhoneCodeSelector = getFieldDecorator('prefix', {
            initialValue: '91'
        })(
            <Select>
                <Select.Option value="91">+91</Select.Option>
                <Select.Option value="86">+86</Select.Option>
            </Select>
        );


        return(
            <div className="login-form-wrapper">
                <Row type="flex" justify="space-around" align="middle">
                    <Col span={24} className="login-form-label">Fill the form to Signup</Col>
                    <Col span={12}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Item label="Name">
                                {
                                    getFieldDecorator('name',{
                                            rules: [{required: true, message: "Please enter you name"}]
                                        }
                                    )(<Input/>)
                                }
                            </Form.Item>
                            <Form.Item label="E-Mail">
                                {
                                    getFieldDecorator('email',{
                                            rules: [
                                                {required: true, message: "Please enter you name"},
                                                {type: 'email', message: 'Please enter valid E-Mail!'}
                                            ]
                                        }
                                    )(<Input/>)
                                }
                            </Form.Item>
                            <Form.Item label="Contact">
                                {
                                    getFieldDecorator('phone',{
                                            rules: [
                                                {required: true, message: "Please input your phone number!"}
                                            ]
                                        }
                                    )(<Input addonBefore={PhoneCodeSelector}/>)
                                }
                            </Form.Item>
                            <Form.Item label="">
                                <Button type="primary" htmlType="submit">Signup</Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                
            </div>
        );
    }
};

const SignupForm = Form.create({name: 'signup'})(SignupForm_);

export {SignupForm};