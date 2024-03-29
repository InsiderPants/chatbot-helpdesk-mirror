//importing packages
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import io from 'socket.io-client';


//import components
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import RenderChat from './renderChat';

//action
import { sendExecutiveResponse, getCustomerQuery, getError } from '../../actions/getCustomerQuery';

var _API_ENDPOINT_FOR_SOCKET = 'http://localhost:8000/api/executiveGetResolution';

//CSS
const styles = theme => ({
    form_container: {
        display: 'flex',
        flexWrap: 'wrap',
        position: 'relative',
        bottom: 0,
        width: '100%',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    fab: {
        margin: theme.spacing.unit,
    },
    chat_container: {
        width: '100%',
        height: '80vh',
        overflow: 'auto',
    },
    iconButton: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
    },
    input: {
        marginLeft: 8,
        flex: 1,
    }
});

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#06546f',
        },
        error: {
            main: '#d1121c',
        },
    },
    typography: { useNextVariants: true },
});

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
        }
        this.chatContainer = React.createRef();
        this.socket = io(_API_ENDPOINT_FOR_SOCKET);
        this.onSendEnterPress = this.onSendEnterPress.bind(this);
        this.onSend = this.onSend.bind(this);
        this.handelMessageFieldChange = this.handelMessageFieldChange.bind(this);
    }
    
    onSendEnterPress(event){
        if(event.key === 'Enter'){
            if(this.state.message.length !== 0){
                this.props.sendExecutiveResponse({
                    message: this.state.message
                },this.socket);
                this.setState({message: ''});
            }
            event.preventDefault();
        }
    }

    onSend(event) {
        if(this.state.message.length !== 0) {
            this.props.sendExecutiveResponse({
                message: this.state.message
            },this.socket);
            this.setState({
                message: ""
            });
            event.preventDefault();
        }
    }

    handelMessageFieldChange(e){
        this.setState({
            message: e.target.value
        });
    }

    componentDidUpdate() {
        // Always scroll to the bottom of the chat
        this.chatContainer.current.scrollTop = this.chatContainer.current.scrollHeight;
    }
    
    componentDidMount(){
        // Attaching socket handlers
        // For getting customer query/response from backend
        this.socket.on('executive', (data) => {
            this.props.getCustomerQuery(data)
        })
        // For getting error from backend
        this.socket.on('error', (err) => {
            this.props.getError(err)
        })
    }

    componentWillUnmount(){
        // Removing socket handlers
        this.socket.off('executive')
    }

    render() {
        const {classes} = this.props;
        const initialMessage = "Hi there! I'm "+this.props.executive.name+", how can I help you today?";
        return (
            <div>
                <div className={classes.chat_container} ref={this.chatContainer}>
                    <RenderChat tag='executive' message={initialMessage}/>
                    {
                        this.props.chat.conversation.map((chat, i) => <RenderChat tag={chat.tag} message={chat.message} key={i}/>)
                        //rendering chats
                    }
                </div>
                <div>
                    {/* for input and sending chats */}
                    <form className={classes.form_container}>
                        <MuiThemeProvider theme={theme}>
                        <Grid container spacing={8}>
                            <Grid item xs={10} sm={11} md={11} lg={11} xl={11}>
                                <TextField
                                    id="executive-chat-input"
                                    value={this.state.message}
                                    onChange={e => this.handelMessageFieldChange(e)}
                                    style={{ margin: 8 }}
                                    placeholder="Reply"
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    onKeyPress={this.onSendEnterPress}
                                />
                            </Grid>
                            <Grid item xs={2} sm={1} md={1} lg={1} xl={1}>
                                <Fab color="primary" aria-label="Edit" className={classes.fab} onClick={this.onSend} style={{backgroundColor: '#08254f'}}>
                                    <Icon className={classes.extendedIcon} >send</Icon>
                                </Fab>
                            </Grid>
                        </Grid>
                        </MuiThemeProvider>
                    </form>
                </div>
            </div>
        )
    }
}

//connecting to redux
const mapStateToProps = (state) => {
    return {
        chat: state.chat,
        executive: state.executive
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        sendExecutiveResponse: (data, socket) => sendExecutiveResponse(data, socket, dispatch),
        getCustomerQuery: (data) => getCustomerQuery(data, dispatch),
        getError: (err) => getError(err, dispatch)
    };
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
)(Chat);