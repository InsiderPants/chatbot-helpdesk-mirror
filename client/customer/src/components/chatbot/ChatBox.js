import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import {
    Input, Button, Icon, Row, Col, Divider, Select, message
} from 'antd';
import {ChatBubble} from './ChatBoxUtility';

// Stylesheet
import './style.css';

//Actions
import {getResolution, switchMessageHandler} from '../../actions/getResolution';

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
        this.handleMessageFieldChange = this.handleMessageFieldChange.bind(this);
        this.onSendEnterPress = this.onSendEnterPress.bind(this);
        this.handleMessageReciverChange = this.handleMessageReciverChange.bind(this);
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
                    accessToken: this.props.userInfo.accessToken,
                    apiEndPoint: this.props.userInfo.apiEndPoint
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
                accessToken: this.props.userInfo.accessToken,
                apiEndPoint: this.props.userInfo.apiEndPoint
            });
            this.setState({messageText: ""});
        }
               
    }

    // When the text in message input field changes
    handleMessageFieldChange(e){
        this.setState({
            messageText: e.target.value
        });
    }

    // ----- handle Reciver Change event
    handleMessageReciverChange(value){
        let response = this.props.switchMessageHandler({handlerTag: value});
        
        if(response.success){
            message.success(response.message);
        }
        else{
            message.error(response.message);
        }
    }

	render() {

        const MessageReciverSelector = (props) => (
            <Select defaultValue={this.props.userInfo.handler} onSelect={this.handleMessageReciverChange}>
                <Select.Option value="BOT">Bot</Select.Option>
                <Select.Option value="HUMAN">Human</Select.Option>
            </Select>
        );

		return (
            <div className="chat-box-wrapper">
                <Row type="flex" justify="space-around" align="middle">
                    <Col lg={12} md={16} sm={20} xs={24}>
                        <Divider orientation="left" style={{color: '#00B0FF'}}>
                            {this.props.userInfo.handler === 'BOT'? 'Bot Richad':'Human Pappu'} -&nbsp;
                            <small style={{color: '#000'}}>
                                You are currently talking with a&nbsp; 
                                { this.props.userInfo.handler === 'BOT'?'bot':'human'}
                            </small>
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
                                <Input
                                    addonBefore={<MessageReciverSelector/>} 
                                    onChange={this.handleMessageFieldChange} 
                                    size="large"
                                    placeholder="Write a message..."
                                    value={this.state.messageText}
                                    prefix={<Icon type="right" />}
                                    onKeyPress={this.onSendEnterPress}
                                    addonAfter={<Button ghost type="primary" icon="right-square-o" onClick={this.onSend}/>}
                                />
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
        getResolution: (data) => getResolution(data, dispatch), 
        switchMessageHandler: (data) => switchMessageHandler(data, dispatch)
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ChatBox)
