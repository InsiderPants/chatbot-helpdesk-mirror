//importing libraries
import React from 'react';

//importimg components
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import RenderLoginForm from './renderLoginForm';

//CSS
const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(#065671 , #003141)',
    },
    loginBox: {
        position: 'relative',
        top: '15vh',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        height: '50vh',
        backgroundColor: '#eceff1',
    },
    loginText: {
        position: 'relative',
        left: '0px',
    }
})

const Login = (props) => {
    const {classes} = props;
    return(
        <div className={classes.root}>
            <div>   
            <Grid 
                container 
                direction = "row"
                justify = "space-evenly"
                alignItems = "center" 
            >
                <Grid item xs={10} sm={8} md={6} lg={6} xl={6}>
                    <Paper className={classes.loginBox}>
                        <RenderLoginForm/>
                    </Paper>
                </Grid>
            </Grid>
            </div>
        </div>
    );
}

export default withStyles(styles)(Login);
