//importing packages
import React, { Component } from 'react';

//importing components
import Chat from '../chat/chat';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

//CSS
const styles = theme => ({
    root: {
        flexGrow: 1,
        overflow: 'hidden',
    },
    paper: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
    },
});

class Body extends Component {
    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={8} justify="space-evenly">
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper className={classes.paper} style={{height: '50vh', backgroundColor: '#eceff1'}}>
                            space for options view or charts
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper className={classes.paper} style={{backgroundColor: '#eceff1'}}>
                            <Chat/>
                        </Paper>
                    </Grid> 
                </Grid>
            </div>
        );
    } 
}

export default withStyles(styles)(Body);
