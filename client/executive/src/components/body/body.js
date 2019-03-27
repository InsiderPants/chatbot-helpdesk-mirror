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
    },
    paper: {
        margin: theme.spacing.unit,
        padding: theme.spacing.unit,
        color: theme.palette.text.secondary,
    },
});

class Body extends Component {

    componentDidMount() {
        console.log(localStorage.getItem('AccessToken'));
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root} style={{minHeight: '100vh', backgroundImage: 'linear-gradient(#7390b8 , #003141)',}}>
                <Navbar/>
                <Grid container spacing={8} justify="space-evenly">
                    {/* <Hidden smDown>
                        <Grid item md={5} lg={5} xl={5}>
                            <Paper className={classes.paper} style={{height: '50vh', backgroundColor: '#eceff1'}}>
                                space for options view or charts 
                            </Paper>
                        </Grid>
                    </Hidden> */}
                    <Grid item xs={12} sm={12} md={11} lg={11} xl={11}>
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
