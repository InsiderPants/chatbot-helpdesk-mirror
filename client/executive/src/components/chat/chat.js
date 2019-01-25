//importing packages
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

//import components
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Fab from '@material-ui/core/Fab';
import RenderChat from './renderChat';

//action
import {getResolution} from '../../actions/getResolution';

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
        height: '650px',
        width: '100%',
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

class Chat extends Component {
    constructor() {
        super();
        this.state = {
            message: '',
        }

        this.chatContainer = React.createRef();

        this.onSendEnterPress = this.onSendEnterPress.bind(this);
        this.onSend = this.onSend.bind(this);
        this.handelMessageFieldChange = this.handelMessageFieldChange.bind(this);
    }
    
    onSendEnterPress(event){
        if(event.key === 'Enter'){
            if(this.state.message.length !== 0){
                this.props.getResolution({
                    message: this.state.message
                });
                this.setState({message: ''});
            }
            event.preventDefault();
        }
    }

    onSend(event) {
        if(this.state.message.length !== 0) {
            this.props.getResolution({
                message: this.state.message
            });
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
    
    render() {
        const {classes} = this.props;
        return (
            <div>
                <div className={classes.chat_container} ref={this.chatContainer}>
                    {this.props.chat.conversation.map((chat, i) => <RenderChat tag={chat.tag} message={chat.message} key={i}/>)}
                </div>
                <div>
                    <form className={classes.form_container}>
                        <Grid container spacing={8}>
                            <Grid item sm={10}>
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
                            <Grid item sm={2}>
                                <Fab variant="extended" color="primary" aria-label="Edit" className={classes.fab} onClick={this.onSend}>
                                    <Icon className={classes.extendedIcon}>send</Icon>
                                    Send
                                </Fab>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        chat: state.chat
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getResolution: (data) => getResolution(data, dispatch)
    };
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(styles),
)(Chat);