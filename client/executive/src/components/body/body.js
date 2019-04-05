//importing packages
import React, { Component } from 'react';

//importing components
import Chat from '../chat/chat';
import Navbar from '../navbar/navbar';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

//CSS
const styles = theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
        minWidth: 1000,
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(#91b3ea , #18417c)',
    },
    paper: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit,
        marginLeft: 300,
    },
    toolbar: {
        height: '80px',
    },
});

class Body extends Component {

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Navbar renderComponent={<div></div>}/>
                <div className={classes.content}>
                    <Grid container spacing={8} justify="space-evenly">
                        {/* <Hidden smDown>
                            <Grid item md={5} lg={5} xl={5}>
                            <Paper className={classes.paper} style={{height: '50vh', backgroundColor: '#eceff1'}}>
                            space for options view or charts 
                            </Paper>
                            </Grid>
                        </Hidden> */}
                        <Grid item xs={12}>
                            <Paper className={classes.paper} style={{backgroundColor: '#eceff1'}}>
                                <Chat/>
                            </Paper>
                        </Grid> 
                    </Grid>
                </div>
            </div>
        );
    } 
}

export default withStyles(styles)(Body);
