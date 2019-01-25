import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {
	Input, Button, Row, Col
} from 'antd';

import './loginStyle.css';

class LoginForm extends React.Component {
	constructor(){
		super();
		this.state = {
			email: ''
		}

		// Binding
		this.handleLogin = this.handleLogin.bind(this);
		this.handleEmailFieldChange = this.handleEmailFieldChange.bind(this);
	}

	handleLogin(){
		console.log(this.state.email);
	}

	handleEmailFieldChange(e){
		// Change the state email when th value changes
		this.setState({
			email: e.target.value
		});
	}

    render() {
      return (
		<div className="login-form-wrapper">
			<Row type="flex" justify="space-around" align="middle" style={{paddingTop: "30px"}}>
				<Col span={24} className="login-form-label">
					Please enter your email address to continue
				</Col>
				<Col span={18}>
					<Input placeholder="Email" size="large" onChange={this.handleEmailFieldChange}/>
				</Col>
				<Col span={24} style={{display:"flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>
					<Button type="primary" onClick={this.handleLogin}>Continue</Button>
				</Col>
				<Col span={24} style={{display:"flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>
					Or&nbsp;<Link to="/signup"> register now!</Link> 
				</Col>
			</Row>
		</div>
		);
    }
}
  


export {LoginForm};