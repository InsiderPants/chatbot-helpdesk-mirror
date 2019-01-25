import React, { Component } from 'react';
import {Route,Link} from 'react-router-dom';

// Components
import ChatBox from '../chatbot/ChatBox';
import {LoginForm} from '../loginForm/LoginForm';
import {SignupForm} from '../signupForm/SignupForm';
import { Layout, Button, Menu} from 'antd';

// Style Sheets
import 'antd/dist/antd.css';
import './homeStyle.css';


const { Header, Content, Footer } = Layout;

class Home extends Component {
	render(){
        return(
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">
                            <Link to="/chat">
                                Chat
                            </Link>
                        </Menu.Item>   
                        <Menu.Item key="2">
                            <Link to="/login">
                                Login
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/signup">
                                Signup
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Header>
                <Content className="content-box">
                    <Route path={`/chat`} component={ChatBox}/>
                    <Route path={`/login`} component={LoginForm}/>
                    <Route path={`/signup`} component={SignupForm}/>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Created by 6engi
                </Footer>
            </Layout>
        );
    }
}

export {Home};
