import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

// Components
import {Link, withRouter} from 'react-router-dom';
import {
	Input, Button, Row, Col, message
} from 'antd';

// Actions
import {loginUser} from '../../actions/authActions';

// Styles
import './loginStyle.css';


class LoginForm extends Component {
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
		// Validate Email -----


		// Send to server ------
		axios({
			method: 'post',
			url: '/auth/customer/login',
			data: {
				email: this.state.email
			}
		})
		.then(res => {
			if(res.data.success){
				const { name, contact, email, accessToken, previousChat } = res.data.body;
				console.log(res.data.message);

				// Dispatch Action to update user state
				this.props.loginUser({
					userInfo: {
						name: name,
						email: email,
						contact: contact,
						accessToken: accessToken
					},
					previousChat: previousChat
				})

				message.success('Login Successful');
				// Redirect user to Chat box
				this.props.history.push('/chat');
			}
			else{
				// Show the error message to the user
				message.error(res.data.message)
			}
		})
		.catch(error => {
			console.log('Error Loging in the user');
			console.log(error);

			message.error('Login falied');
		});
				
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
					Or&nbsp;<Link to={`/signup`}> register now!</Link> 
				</Col>
			</Row>
		</div>
		);
    }
}


// Redux connection
const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (data) => loginUser(data, dispatch)
    };
};



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LoginForm));