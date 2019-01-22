//Libraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

//Components
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chats from './chats';

//Actions
import {getResolution} from '../../actions/getResolution';

const styles = theme => ({
    textField: {
        margin: theme.spacing.unit,
    },
    root: {
        flexGrow: 1,
    },
    textArea: {
        position: 'absolute',
        bottom: 0,
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 0,
        zIndex: -1,
    },
    loadingBar: {
        margin: 0,
    }
});

class Chatbot extends Component {
    state = {
        open: this.props.isOpen,
        text: '',
        item: []
    }

    handleTextChange = (e) => {
        this.setState({
            text: e.target.value
        })
    }

    closeChat = () => {
        this.setState({
            open: false,
        });
        this.props.updateState(false);
    }

    sendChat = () => {
        let networkReq = {
            text: this.state.text
        }
        this.props.getResolution(networkReq)
        const newItem = {
            text: this.state.text,
            reply: this.props.reply,
        }
        this.setState(state => ({
            item: this.state.item.concat(newItem),
            text: '',
        }))
    }

    render() {
        const { classes } = this.props
        return(
            <div className={classes.root}>
                <Button className={classes.closeIcon} onClick={this.closeChat}>
                    <Icon color='primary'>close</Icon>
                </Button> 
                {this.props.isLoading ? 
                    <LinearProgress className={classes.loadingBar}/> 
                    : null
                }
                <Chats item={this.state.item}/>
                <div className={classes.textArea}>
                    <Grid container spacing={8}>
                        <Grid item xs={10}>
                            <TextField
                                className = {classes.textField}
                                value={this.state.name}
                                onChange={this.handleTextChange}
                                placeholder="Enter Your Query"
                                fullWidth
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <Button onClick={this.sendChat}>
                                <Icon color='primary'>send</Icon>
                            </Button> 
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    isLoading: state.resolution.isLoading,
    reply: state.resolution.reply
});

export default compose(
    connect(mapStateToProps, {
        getResolution
    }),
    withRouter,
    withStyles(styles)
)(Chatbot);

