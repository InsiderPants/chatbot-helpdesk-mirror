import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import {Link} from 'react-router-dom';
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
		console.log(this.state.email);

		// Sending Login Action for testing [Assuming success Login]
		this.props.loginUser({
			userInfo: {
				name: 'Prashant',
				email: 'prash.kumar047@gmail.com',
				contact: '+919856457875'
			},
			previousChat: [{mtag:'SERVER', message: "your previous chat"}]
		})
		message.success('Login Successful')
		// Redirect to Chat when user logged in
		this.props.history.push('/chat');
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



export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);