import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';

import Navbar from '../navbar/navbar';

//CSS
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

class Account extends React.Component {
    constructor() {
        super();
        // change every string to empty 
        this.state = {
            name: 'Manish',     // name of executive
            contact: '9876543210',    // contact of executive
            changeContact: false,   // for change contact functionality
            email: 'm@m.com',   // email of executive
            oldPassword: '',    // for old password textfield
            newPassword: '',   // actives on when change password clicked
            cnofirmNewPassword: '',     // for confirm password textfield
            changePassword: false,  // for change passowrd button and fuctions
            queryResolved: '20',    // just a counter for number of query resolved by this executive
        };
    }

    // old password textfield change
    handleOldPasswordChange = (e) => {
        this.setState({
            oldPassword: e.target.value,
        })
    }

    // new password textfield change
    handleNewPasswordChange = (e) => {
        this.setState({
            newPassword: e.target.value,
        })
    }

    // confirm password textfield change
    handleConfirmPasswordChange = (e) => {
        this.setState({
            confirmNewPassword: e.target.value,
        })
    }

    render() {
        const {classes} = this.props;

        // for navbar
        const forNav = (
            <div>

            </div>
        );

        // main component
        const mainAccountPage = (
            <Paper elevation={1} style={{height: 800, padding: 8}}>
                {/* Name or Change Password Heading*/}
                <Typography align='left' color='textPrimary' variant='display3' style={{margin:20, fontWeight: 200}}>
                    {this.state.changePassword ? "Change Password" : this.state.name}
                </Typography>
                <Divider />
                {this.state.changePassword  //conditional rendering for change password
                    ?
                    <Grid container justify='flex-start' alignItems='center' spacing={8}>
                        <Grid item xs={6}>
                            {/* for 3 password inputs for change password */}
                            <div style={{marginTop: 20, marginLeft: 20}}>
                                {/* old password */}
                                <TextField type="password" placeholder="Enter Old Password" label="Old Password" required fullWidth value={this.state.oldPassword} onChange={this.handleOldPasswordChange}/>
                                <br/>
                                <br/>
                                {/* new password */}
                                <TextField type="password" placeholder="Enter New Password" label="New Password" required fullWidth value={this.state.newPassword} onChange={this.handleNewPasswordChange}/>
                                <br/>
                                <br/>
                                {/* confirm new password */}
                                <TextField type="password" placeholder="Confirm New Password" label="Confirm New Password" required fullWidth value={this.state.confirmNewPassword} onChange={this.handleConfirmPasswordChange}/>
                            </div>
                        </Grid>
                        <Grid item xs={6}/>
                    </Grid>
                    :
                    <div>
                        {/* Email */}
                        <Typography align='left' color='textPrimary' variant='h5' style={{ margin: 20, fontWeight: 300 }}>
                            E-mail:    {this.state.email}
                        </Typography>
                        {/* Conatct */}
                        <Grid container justify='flex-start' alignItems='center' spacing={8}>
                            <Grid item xs='auto'>
                                <Typography align='left' color='textPrimary' variant='h5' style={{ marginLeft: 20, fontWeight: 300 }}>
                                    Contact: {this.state.contact}
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                {/* edit button */}
                                <IconButton>
                                    <Icon>
                                        edit
                                    </Icon>
                                </IconButton>
                            </Grid>
                        </Grid>
                        {/* query resolved */}
                        <Typography align='left' color='textPrimary' variant='h5' style={{ margin: 20, fontWeight: 300 }}>
                            Query Resolved: {this.state.queryResolved}
                        </Typography>
                    </div>
                }
            </Paper>
        );

        return (
            <div className={classes.root}>
                <Navbar renderComponent={forNav} />
                <div className={classes.content}>
                    {mainAccountPage}
                </div>
            </div>
        );
    }
}


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
)(Account);