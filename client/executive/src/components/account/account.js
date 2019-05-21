import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from "@material-ui/core/Divider";
import Fab from '@material-ui/core/Fab';
import Icon from '@material-ui/core/Icon';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import classNames from 'classnames';

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
        backgroundColor: '#104087',
        color: 'white',
        '&:hover': {
            backgroundColor: '#08254f'
        }
    },
    fab: {
        margin: theme.spacing.unit,
        backgroundColor: '#104087',
        '&:hover': {
            backgroundColor: '#08254f'
        }
    },
    leftIcon: {
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20,
    },
})

class Account extends React.Component {
    constructor() {
        super();
        // change every string to empty 
        this.state = {
            contact: '12345789',    // contact of executive
            changeContact: false,   // for change contact functionality
            oldPassword: '',    // for old password textfield
            newPassword: '',   // actives on when change password clicked
            confirmNewPassword: '',     // for confirm password textfield
            changePassword: false,  // for change passowrd button and fuctions
            queryResolved: '',    // just a counter for number of query resolved by this executive
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

    // contact textfield change
    handleContactChange = (e) => {
        this.setState({
            contact: e.target.value,
        })
    }

    // edit contact
    editContact = (e) =>{
        this.setState({
            changeContact: true,
        })
    }

    // save contact
    saveContact = (e) =>{
        this.setState({
            changeContact: false,
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
                    {this.state.changePassword ? "Change Password" : this.props.executive.name}
                </Typography>
                <Divider />
                    <div>
                        {/* Email */}
                        <Typography align='left' color='textPrimary' variant='h5' style={{ margin: 20, fontWeight: 300 }}>
                            E-mail:    {this.props.executive.email}
                        </Typography>
                        {/* Contact */}
                        <Grid container justify='flex-start' alignItems='center' spacing={8}>
                            <Grid item xs='auto'>
                                {this.state.changeContact //conditional rendering for change contact
                                    ?
                                    <div>
                                    <Typography align='left' color='textPrimary' variant='h5' style={{ marginLeft: 20, fontWeight: 300 }}>
                                        Contact: 
                                    </Typography>
                                    <TextField type="text" placeholder={this.state.contact} label="Contact" required fullWidth value={this.state.contact} onChange={this.handleContactChange}/>    
                                    </div>
                                    :
                                    <Typography align='left' color='textPrimary' variant='h5' style={{ marginLeft: 20, fontWeight: 300 }}>
                                        Contact: {this.state.contact}
                                    </Typography>
                                }
                            </Grid>
                            <Grid item xs={2}>
                                {this.state.changeContact //conditional rendering for change contact
                                    ?
                                    <Fab size="medium" color="secondary" aria-label="Edit" onClick={this.saveContact} className={classes.fab}>
                                        <Icon>done_all</Icon>
                                    </Fab>
                                    :
                                    <Fab size="medium" color="secondary" aria-label="Edit" onClick={this.editContact} className={classes.fab}>
                                        <Icon>edit_icon</Icon>
                                    </Fab>
                                }
                            </Grid>
                        </Grid>
                        <Grid container justify='flex-start' alignItems='center' spacing={8}>
                            <Grid item xs={6}>
                                <Typography align='left' color='textPrimary' variant='h5' style={{ margin: 20, fontWeight: 300 }}>
                                    Change Password:
                                </Typography>
                                {/* for 3 password inputs for change password */}
                                <div style={{marginTop: 20, marginLeft: 20}}>
                                    {/* old password */}
                                    <TextField type="password" label="Old Password" required fullWidth value={this.state.oldPassword} onChange={this.handleOldPasswordChange}/>
                                    <br/>
                                    <br/>
                                    {/* new password */}
                                    <TextField type="password" label="New Password" required fullWidth value={this.state.newPassword} onChange={this.handleNewPasswordChange}/>
                                    <br/>
                                    <br/>
                                    {/* confirm new password */}
                                    <TextField type="password" label="Confirm New Password" required fullWidth value={this.state.confirmNewPassword} onChange={this.handleConfirmPasswordChange}/>
                                </div>
                                <br/>
                                <Button variant="contained" size="small" className={classes.button}>
                                    <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
                                        Save New Password
                                </Button>
                                <br/>
                            </Grid>
                            <Grid item xs={6}/>
                        </Grid>
                        {/* query resolved */}
                        <Typography align='left' color='textPrimary' variant='h5' style={{ margin: 20, fontWeight: 300 }}>
                            Query Resolved: {this.state.queryResolved}
                        </Typography>
                    </div>
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
        executive: state.executive
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