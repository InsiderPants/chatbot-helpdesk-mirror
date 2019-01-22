//Libraries
import React from 'react';

//Components
import Chatbot from '../../templates/chatbot/chatbot'
import { withStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        position: 'relative',
        overflow: 'hidden',
    },
    button: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 2,
    },
    chatbot: {
        position: 'fixed',
        bottom: theme.spacing.unit * 2,
        padding: theme.spacing.unit,
        right: 100,
        width: 300,
        height: 500,
    },
})

class Home extends React.Component {
    state = {
        open: false,
    }

    openChat = () => {
        this.setState({ 
            open: true,
        })
    };

    closeChat = (state) => {
        this.setState({
            open: state
        });
    };

    render() {
        const { classes } = this.props;
        return(
            <div>
                <Button className={classes.button} onClick={this.openChat}>
                    <Fab color="primary" aria-label="Add" className={classes.fab}>
                        <Icon>chat</Icon>
                    </Fab>
                </Button>
                {this.state.open ?
                    <Paper className={classes.chatbot} elevation={10}>
                        <Chatbot
                            isOpen = {this.state.open}
                            updateState = {newState => this.closeChat(newState)}
                        />  
                    </Paper> 
                    :null
                }
            </div>
        );
    }
}

export default withStyles(styles)(Home);