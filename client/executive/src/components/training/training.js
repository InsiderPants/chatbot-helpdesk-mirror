import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';

import Navbar from '../navbar/navbar';

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 0,
        overflow: 'hidden',
        minWidth: 1000,
        backgroundColor: '#eceff1',
        minHeight: '100vh',
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginTop: 80,
        marginLeft: 300,
    },
    button: {
        marginTop: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
        padding: theme.spacing.unit,
    },
})

class Training extends React.Component {
    constructor() {
        super();
        this.state = {
            untrainedIntents: ['One', 'Two', 'Three', 'One', 'Two', 'Three', 'One', 'Two', 'Three', 'One', 'Two', 'Three', 'One', 'Two', 'Three', 'One', 'Two', 'Three', 'One', 'Two', 'Three',],
            currentPage: 1,
            numberPerPage: 20,
            isTraining: false,   // change it to false
            snackbarToggle: false   // change it to false //for snackbar showing state
        };
    }

    // for previous button click
    previousButton = () => {
        //checking if current page is 1
        if(this.state.currentPage > 1) {
            axios.post('', this.state.currentPage-1)
                .then(res => {
                    // setting state with new untrained intents
                    this.setState({
                        untrainedIntents: res.data
                    })
                })
        }
    }

    // for next button click
    nextButton = () => {
        //checking if current page is 4 (change it to max num of pages)
        if (this.state.currentPage < 4) {
            axios.post('', this.state.currentPage + 1)
                .then(res => {
                    // setting state with new untrained intents
                    this.setState({
                        untrainedIntents: res.data
                    })
                })
        }
    }

    // on training button click
    trainingButton = () => {
        //  change it according to api
        this.setState({
            isTraining: true,
            snackbarToggle: true,
        })
    }

    // for closing snackbar
    closeSnackbar = () => {
        this.setState({
            snackbarToggle: false,
        })
    }

    render() {  
        const {classes} = this.props; 

        //for nav
        const forNav = (
            <Grid container spacing={0} direction='row-reverse' justify='flex-start' alignItems='center'>
                <Grid item xs={1}>
                    <Button variant="contained" className={classes.button} onClick={this.trainingButton}>
                        {this.state.isTraining ? <CircularProgress size={20} color='inherit' /> : "Train"}
                    </Button>
                </Grid>
            </Grid>
        );
        
        // render untrained intent list
        const renderUntrainedIntents = (
            <Paper elevation={1}>
                <List>
                    {this.state.untrainedIntents.map((item, key) => {
                        return (
                            <div key={key}>
                                <ListItem>
                                    <ListItemText>
                                        {item}
                                    </ListItemText>
                                </ListItem>
                                <Divider/>
                            </div>
                        )
                    })}
                </List>
                <Grid container spacing={0} direction='row' justify='center' alignItems='center'>
                    <Grid item xs={5}/>
                    <Grid item xs={4}>
                        <Button variant="contained" size="large" disabled={this.state.currentPage === 1} style={{ marginTop: 8, marginBottom: 30, marginRight: 10 }} onClick={this.previousButton}>
                            Previous
                        </Button>
                        <Button variant="contained" size="large" style={{ marginTop: 8, marginBottom: 30 }} onClick={this.nextButton}>
                            Next
                        </Button>
                    </Grid>
                    <Grid item xs={3}/>
                </Grid>
            </Paper>
        );

        // showing Training stats
        const renderTrainingStats = (
            <div>
                Training stats
            </div>
        );

        return (
            <div className={classes.root}>
                <Navbar renderComponent={forNav}/>
                <div className={classes.content}>
                    {this.state.isTraining ? renderTrainingStats : renderUntrainedIntents}
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={this.state.snackbarToggle}
                        onClose={this.closeSnackbar}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        autoHideDuration={4000}
                        message={<span id="message-id">Training Model...</span>}
                    />
                </div>
            </div>
        );
    }
}

// connect to redux
const mapStateToProps = (state) => {
    return {

    };
}

const mapDispatchToProps = (dispatch) => {
    return {

    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
    withStyles(styles),
)(Training);