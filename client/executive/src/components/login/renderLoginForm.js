//imorting packages
import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Redirect, Link, withRouter  } from 'react-router-dom';
import axios from 'axios';

//importing components
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

//actions
import { loginUser, invalidLogin } from '../../actions/auth';

//CSS
const styles = theme => ({
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: '80%',
    },
    button: {
        margin: theme.spacing.unit,
    },
    formContainer: {
        position: 'relative',
        top: '5vh',
    },
    registerTextContainer: {
        position: 'relative',
        right: '10%',
    },
    registerText: {
        textDecoration: 'none',
    }, 
    error: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    },
})

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#06546f',
        },
        error: {
            main: '#d1121c',
        },
    },
    typography: { useNextVariants: true },
});

class RenderLoginForm extends React.Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            emailValidInfo: true,
            emailHelperText: '',
            passwordEmpty: false,
            passwordHelperText: '',
            snackbarToggle: false,
            snackbarMessage: ''
        }
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
    }

    handleEmailChange(e) {
        e.preventDefault();
        this.setState({
            email: e.target.value,
            emailValidInfo: true,   //to disable red box
            emailHelperText: '',    //to remove warning
        })
    }

    handlePasswordChange(e) {
        e.preventDefault();
        this.setState({
            password: e.target.value,
            passwordEmpty: false, //to disable red box
            passwordHelperText: '', //to remove warning
        })
    }

    handleLoginFormSubmit(e){
        e.preventDefault();
        if (this.props.executive.isAuthenticated) {
            return <Redirect to='/'/>
        }
        if (this.state.email.length === 0) {
            this.setState({
                emailValidInfo: false,
                emailHelperText: 'Email cannot be empty',
            })
        }
        if(this.state.password.length === 0){
            this.setState({
                passwordEmpty: true,
                passwordHelperText: 'Password cannot be empty',
            })
        }
        if(this.state.email.length !== 0 && this.state.password.length !==0){
            let data = {
                email: this.state.email,
                password: this.state.password,
            }
            axios.post('/auth/executive/login',data)
                .then(res => {
                    /*
                        success: true,
                        message: LOGIN_SUCCESS,
                        body: {
                            name: executive.name,
                            contact: executive.contact,
                            accessToken: accessToken
                        }
                    */
                    let {success,message,body} = res.data
                    if(success){
                        // Dispatch Action to update user state
                        this.props.loginUser({
                            name: body.name,
                            email: data.email,
                            success: success,
                            accessToken: body.accessToken
                        });
                        this.props.invalidLogin({
                            error: ''
                        });
                        // Redirect user to Chat box
                        this.props.history.push('/');
                    }
                    else{
                        // Show the error message to the user
                        this.props.invalidLogin({
                            error: message
                        });
                        this.setState({
                            snackbarToggle: true,
                            snackbarMessage: message
                        })
                    }
                })
                .catch(err => {
                    this.setState({
                        snackbarToggle: true,
                        snackbarMessage: '  Error sending login axios request'
                    })
                });
        }
    }

    componentDidMount() {
        if(this.props.executive.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    // for closing snackbar
    closeSnackbar = () => {
        this.setState({
            snackbarToggle: false,
            snackbarMessage: ''
        })
    }

    render() {
        const {classes} = this.props;
        return(
            <div>
                <form className={classes.formContainer} onSubmit={this.handleLoginFormSubmit}>
                    <MuiThemeProvider theme={theme}>
                    <TextField
                        id="executive-login-email"
                        label="E-Mail *"
                        error={!this.state.emailValidInfo}
                        className={classes.textField}
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        type="email"
                        autoComplete = "username"
                        margin="normal"
                        helperText={this.state.emailHelperText}
                    />
                    <TextField
                        id="executive-login-password"
                        label="Password *"
                        error={this.state.passwordEmpty}
                        className={classes.textField}
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        type="password"
                        autoComplete="current-password"
                        margin="normal"
                        helperText={this.state.passwordHelperText}
                    />
                    </MuiThemeProvider>
                    <br/>
                    <Typography className={classes.registerTextContainer} align='right' variant='body1'>
                        <Link className={classes.registerText} to='/register'>New User? Click here to register.</Link>
                    </Typography>
                    <br/>
                    <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size='large' 
                        type='submit'
                        className={classes.button} 
                        style={{backgroundColor: '#08254f'}}
                    >
                        Login
                    </Button>
                </form>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.snackbarToggle}
                    autoHideDuration={4000}
                    onClose={this.closeSnackbar}
                >
                    <SnackbarContent
                        className={classes.error}
                        message={
                            <span id="client-snackbar" style={{ display: 'flex', alignItems: 'center' }}>
                                <ErrorIcon className={classes.icon}/>
                                {this.state.snackbarMessage}
                            </span>
                        }
                    />
                </Snackbar>
            </div>
        );
    }
}

//connecting to redux
const mapStateToProps = (state) => {
    return {
        executive: state.executive,
        errors: state.errors
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        loginUser: (data) => loginUser(data, dispatch),
        invalidLogin: (data) => invalidLogin(data, dispatch)
    };
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
    withStyles(styles),
)(RenderLoginForm);
