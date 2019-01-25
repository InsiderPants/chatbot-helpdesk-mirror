import React, {Component} from 'react';
import {connect} from 'react-redux';

// Components
import {Input, Button, Icon, Form, Row, Col,} from 'antd';
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
    
    onSendEnterPress(event){

        if(event.key === 'Enter'){
            if(this.state.messageText.length !== 0){
                this.props.getResolution({
                    message: this.state.messageText
                });
                this.setState({messageText: ""});
            }
        }

    }
    
    onSend(){
    
        if(this.state.messageText.length !== 0){
            this.props.getResolution({
                message: this.state.messageText
            });
            this.setState({messageText: ""});
        }
               
    }

    handelMessageFieldChange(e){
        this.setState({
            messageText: e.target.value
        });
    }

	render() {
		return (
            <div style={{ background: '#fff', padding: 24, minHeight: 380 }}>
                <Row type="flex" justify="space-around" align="middle">
                    <Col lg={12} md={16} sm={20} xs={24}  >
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
                                            suffix={<Button ghost type="primary" icon="right-square-o" onClick={this.onSend}/>}
                                            prefix={<Icon type="right" />}
                                            onKeyPress={this.onSendEnterPress}
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
    return {chat : state.chat};
}

const mapDispatchToProps = (dispatch) => {
    return {
        getResolution: (data) => getResolution(data, dispatch) 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ChatBox)
