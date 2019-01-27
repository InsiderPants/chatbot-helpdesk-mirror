import React, { Component } from 'react';
import {Route, Link, Redirect, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

// Components
import ChatBox from '../chatbot/ChatBox';
import LoginForm from '../loginForm/LoginForm';
import {SignupForm} from '../signupForm/SignupForm';
import { 
    Layout, Menu, Button
} from 'antd';

// Style Sheets
import 'antd/dist/antd.css';
import './homeStyle.css';

// Actions
import {signOutUser} from '../../actions/authActions';


const { Header, Content, Footer } = Layout;

class Home extends Component {
    constructor(){
        super();

        // Bindings
        this.handleSignOut = this.handleSignOut.bind(this);
    }
    
    handleSignOut(){
        this.props.signOutUser();
    }

	render(){
        const AuthenticatedNavItems = (props) => {
            return (
                <Button ghost type="primary" onClick={this.handleSignOut}>Sign Out</Button>
            );
        };

        const UnAuthenticatedNavItems = (props) =>{
            return (
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    style={{ lineHeight: '64px' }}
                > 
                    <Menu.Item key="1">
                        <Link to="/login">
                            Login
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/signup">
                            Signup
                        </Link>
                    </Menu.Item>
                </Menu>
            );
        }

        return(
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    {this.props.userInfo.isAuthenticated ? <AuthenticatedNavItems/>: <UnAuthenticatedNavItems/>}  
                </Header>
                <Content className="content-box">
                    {/* This is a protected route ------ Only accessible when user is authenticated */}
                    <Route path='/chat' render={(props) => {
                        return this.props.userInfo.isAuthenticated ? (
                            <ChatBox {...props}/>
                        ):(
                            <Redirect to={{
                                    pathname: '/login',
                                    state: {from: props.location}
                                }}
                            />
                        )
                    }}/>
                    <Route exact path={`/login`} component={LoginForm}/>
                    <Route path={`/signup`} component={SignupForm}/>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Created by 6engi
                </Footer>
            </Layout>
        );
    }
}

// Redux connection
const mapStateToProps = (state) => {
    return {
        userInfo: state.userInfo
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        signOutUser: () => signOutUser(dispatch)
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
