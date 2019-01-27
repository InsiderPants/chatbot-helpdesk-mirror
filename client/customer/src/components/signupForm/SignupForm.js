import React, {Component} from 'react';
import axios from 'axios';

import {
    Form, Input, Button, Select, Row, Col, message
} from 'antd';

class SignupForm_ extends Component{
    constructor(){
        super()

        // Bindings
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // When the SignUp form is submitted
    handleSubmit(e){
        e.preventDefault(); // prevent default action of submit event
        this.props.form.validateFieldsAndScroll((error, values) => {
            if(!error){
                const { name, email, prefix, phone } = values;

                // Send signup data to the server
                axios({
                    method: 'post',
                    url: 'auth/signup',
                    data: {
                        name: name,
                        email: email,
                        contact: `+${prefix}${phone}`
                    }
                })
                .then(res => {
                    if(res.data.success){
                        message.success(res.data.message);
                        // Redirect user to login page
                        this.props.history.push('/login');
                    }
                    else{
                        // Display the error message to the user
                        message.error(res.data.message);
                    }
                })
                .catch(error => {
                    console.log('Error sending signup request');
                    console.log(error);
                });
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
                                            rules: [{required: true, message: "Please enter you name!"}]
                                        }
                                    )(<Input/>)
                                }
                            </Form.Item>
                            <Form.Item label="E-Mail">
                                {
                                    getFieldDecorator('email',{
                                            rules: [
                                                {required: true, message: "Please enter you E-Mail!"},
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