import React, { Component } from 'react';

import ChatBox from '../chatbot/ChatBox';
import { Layout, Menu, Row, Col } from 'antd';
import 'antd/dist/antd.css';
import './homeStyle.css';


const { Header, Content, Footer } = Layout;

class Home extends Component {
	render(){
        return(
            <Layout>
                <Header style={{ position: 'fixed', zIndex: 1, width: '100%' }}>
                    <div className="logo" />
                    <Menu
                        theme="dark"
                        mode="horizontal"
                        defaultSelectedKeys={['2']}
                        style={{ lineHeight: '64px' }}
                    >
                        <Menu.Item key="1">nav 1</Menu.Item>
                        <Menu.Item key="2">nav 2</Menu.Item>
                        <Menu.Item key="3">nav 3</Menu.Item>
                    </Menu>
                </Header>
                <Content className="content-box">
                    <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                        <Row type="flex" justify="space-around" align="middle">
                            <Col lg={12} md={16} sm={20} xs={24}  >
                                <ChatBox/>
                            </Col>
                        </Row>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Created by 6engi
                </Footer>
            </Layout>
        );
    }
}

export {Home};
