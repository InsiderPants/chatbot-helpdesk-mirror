import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import {
    Input, Button, Icon, Form, Row, Col, Divider
} from 'antd';
import {ChatBubble} from './ChatBoxUtility';

// Stylesheet
import './style.css';

//Actions
import {getResolution} from '../../actions/getResolution';

class ChatBox extends Component{
    constructor(){
        super();
        this.state = {
            messageText: ""
        }

        // refs
        this.chatContainer = React.createRef();

        // Function binding to component
        this.onSend = this.onSend.bind(this);
        this.handelMessageFieldChange = this.handelMessageFieldChange.bind(this);
        this.onSendEnterPress = this.onSendEnterPress.bind(this);
    }
    
    componentDidUpdate(){
        // Always scroll to the bottom of the chat
        this.chatContainer.current.scrollTop = this.chatContainer.current.scrollHeight;
    }
    
    // Activated when Enterkey is pressed in message input box
    onSendEnterPress(event){

        if(event.key === 'Enter'){
            if(this.state.messageText.length !== 0){
                this.props.getResolution({
                    message: this.state.messageText,
                    accessToken: this.props.userInfo.accessToken
                });
                this.setState({messageText: ""});
            }
        }

    }
    
    // Activated when send button is pressed
    onSend(){
    
        if(this.state.messageText.length !== 0){
            this.props.getResolution({
                message: this.state.messageText,
                accessToken: this.props.userInfo.accessToken
            });
            this.setState({messageText: ""});
        }
               
    }

    // When the text in message input field changes
    handelMessageFieldChange(e){
        this.setState({
            messageText: e.target.value
        });
    }

	render() {
		return (
            <div className="chat-box-wrapper">
                <Row type="flex" justify="space-around" align="middle">
                    <Col lg={12} md={16} sm={20} xs={24}>
                        <Divider orientation="left" style={{color: '#00B0FF'}}>
                            Bot Richard - <small style={{color: '#000'}}>You are currently talking with the bot</small>
                        </Divider>
                    </Col>
                </Row>
                <Row type="flex" justify="space-around" align="middle">
                    <Col lg={12} md={16} sm={20} xs={24} >
                        <div className="chat-box">
                            <div className="chat-container" ref={this.chatContainer}>
                                {
                                    this.props.chat.conversation.map((conv, index) => (
                                        <ChatBubble mtag={conv.mtag} message={conv.message} key={index}/>)
                                    )
                                }
                            </div>
                            <div className="chat-sender">
                                <Form>
                                    <Form.Item>
                                        <Input 
                                            onChange={this.handelMessageFieldChange} 
                                            size="large"
                                            placeholder="Write a message..."
                                            value={this.state.messageText}
                                            prefix={<Icon type="right" />}
                                            onKeyPress={this.onSendEnterPress}
                                            addonAfter={<Button ghost type="primary" icon="right-square-o" onClick={this.onSend}/>}
                                        />
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
			 
		);
	}
};

// Redux connection to component
const mapStateToProps = (state) => {
    return {
        chat : state.chat,
        userInfo: state.userInfo
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getResolution: (data) => getResolution(data, dispatch) 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ChatBox)
