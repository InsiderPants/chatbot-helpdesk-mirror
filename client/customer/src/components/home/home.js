import React, { Component } from 'react';

import ChatBox from '../chatbot/ChatBox';

class Home extends Component {
	render(){
        return(
            <div>
                <ChatBox />
            </div>
        );
    }
}

export {Home};
