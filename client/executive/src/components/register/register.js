import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import RenderRegisterForm from './renderRegisterForm';

const styles = theme => ({
    root: {
        flexGrow: 1,
        minHeight: '100vh',
        backgroundImage: 'linear-gradient(#065671 , #003141)',
    },
    registerBox: {
        position: 'relative',
        top: '10vh',
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        height: '60vh',
        backgroundColor: '#eceff1',
    },
    registerText: {
        position: 'relative',
        left: '0px',
    }
})

class Register extends React.Component {
    
    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <div>
                    <Grid
                        container
                        direction="row"
                        justify="space-evenly"
                        alignItems="center"
                    >
                        <Grid item xs={10} sm={8} md={6} lg={6} xl={6}>
                            <Paper className={classes.registerBox}>
                                <RenderRegisterForm />
                            </Paper>
                        </Grid>
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Register);