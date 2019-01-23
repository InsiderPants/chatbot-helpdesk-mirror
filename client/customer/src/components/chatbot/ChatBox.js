import React, {Component} from 'react';
import {connect} from 'react-redux';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import './style.css';

//Actions
import {getResolution} from '../../actions/getResolution';


class ChatBox extends Component{
    constructor(){
        super();
        this.state = {
            messageText: ""
        }


        // Function binding to component
        this.onSend = this.onSend.bind(this);
        this.handelMessageFieldChange = this.handelMessageFieldChange.bind(this);
    }
    
    
    componentDidMount() {
        axios.post('/api/getResolution',{some:"John doe"})
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    }
    
    onSend(){
        console.log(this.state.messageText);
        console.log(this.props.chat.conversation)
        this.props.getResolution({
            message: this.state.messageText
        })
    }

    handelMessageFieldChange(e){
        this.setState({
            messageText: e.target.value
        });
    }

	render() {
		return (
			<div className="chat-box">
				<div className="chat-container">
					{
                        this.props.chat.conversation.map((conv, index) => {
                            if(conv.mtag == 'CLIENT'){
                                return (
                                    <div className='bubble me' key={index}>
                                        {conv.message}
                                    </div>
                                );
                            }
                            else{
                                return (
                                    <div className='bubble you' key={index}>
                                        {conv.message}
                                    </div>
                                );
                            }
                        })
                    }
				</div>
				<div className="chat-sender">
					<Grid container spacing={24} alignItems="center" justify="center">
						<Grid item xs={10}>
							<TextField
								fullWidth={true}
								defaultValue=""
								margin="normal"
                                variant="outlined"
                                onChange={this.handelMessageFieldChange}
							/>	
						</Grid>
						<Grid item xs={2}>
							<Button variant="contained" color="primary" onClick={this.onSend}>
								Send
							</Button>
						</Grid>
					</Grid>
								
				</div>
			</div> 
		);
	}
};

// Redux comection to component ----------
const mapStateToProps = (state) => {
    return {chat : state.chat};
}

const mapDispatchToProps = (dispatch) => {
    return {
        getResolution: (data) => getResolution(data, dispatch) 
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(ChatBox)
