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
        marginRight: '5px',
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
                <Grid container spacing={8}>
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper className={classes.paper}>
                            space for options view or charts
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6}>
                        <Paper className={classes.paper}>
                            <Chat/>
                        </Paper>
                    </Grid> 
                </Grid>
            </div>
        );
    } 
}

export default withStyles(styles)(Body);
