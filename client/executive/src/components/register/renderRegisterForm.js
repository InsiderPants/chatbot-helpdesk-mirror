import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
        top: '3vh',
    },
    registerHeading: {
        marginTop: theme.spacing.unit,
    },
});

class RenderRegisterForm extends React.Component {
    constructor() {
        super();
        this.state = {
            name: '',
            contact: '',
            email: '',
            password: '',
            nameEmpty: false,
            nameHelperText: '', 
            contactValidInfo: false,
            contactHelperText: '',
            emailValidInfo: true,
            emailHelperText: '',
            passwordEmpty: false,
            passwordHelperText: '',
            registeredFlag: false,
        }
        this.handleRegisterFormSubmit = this.handleRegisterFormSubmit.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleContactChange = this.handleContactChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleRegisterFormSubmit(e) {
        e.preventDefault();
        if (this.state.name.length === 0) {
            this.setState({
                nameEmpty: true,
                nameHelperText: 'Name Required',
            })
        }
        if (this.state.contact.length === 0) {
            this.setState({
                contactValidInfo: true,
                contactHelperText: 'Contact cannot be empty',
            })
        }
        if (isNaN(this.state.contact)) {
            this.setState({
                contactValidInfo: true,
                contactHelperText: 'Contact cannot contain characters',
            })
        }
        if (this.state.password.length === 0) {
            this.setState({
                passwordEmpty: true,
                passwordHelperText: 'Password cannot be empty',
            })
        }
        if (this.state.email.length === 0) {
            this.setState({
                emailValidInfo: false,
                emailHelperText: 'Email cannot be empty',
            })
        }
        if (this.state.email.length !== 0 && this.state.password.length !== 0 && this.state.name.length !== 0 && this.state.contact.length !== 0 && !isNaN(this.state.contact)) {
            let data = {
                name: this.state.name,
                contact: this.state.contact,
                email: this.state.email,
                password: this.state.password,
            }
            axios.post('/auth/executive/signup', data)
                .then(res => {
                    /*  {
                            success: true,
                            message: SIGNUP_SUCCESS
                        }
                    */
                    if(res.data.success){
                        // Redirect user to login page
                        this.props.history.push('/login');
                    }
                    else{
                        // Error from server side
                        console.log(res.data.message)
                    }
                })
                .catch(err => {
                    console.log('Error sending signup request');
                })
        }
    }

    handleNameChange(e) {
        e.preventDefault();
        this.setState({
            name: e.target.value,
            nameEmpty: false, //to disable red box
            nameHelperText: '', //to remove warning
        })
    }

    handleContactChange(e) {
        e.preventDefault();
        this.setState({
            contact: e.target.value,
            contactValidInfo: false, //to disable red box
            contactHelperText: '', //to remove warning
        })
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

    componentDidMount() {
        if(this.props.executive.isAuthenticated) {
            this.props.history.push('/');
        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <form className={classes.formContainer} onSubmit={this.handleRegisterFormSubmit}>
                    <MuiThemeProvider theme={theme}>
                        <TextField
                            id="executive-register-name"
                            label="Name *"
                            error={this.state.nameEmpty}
                            className={classes.textField}
                            value={this.state.name}
                            onChange={this.handleNameChange}
                            type="text"
                            margin="normal"
                            helperText={this.state.nameHelperText}
                        />
                        <TextField
                            id="executive-register-contact"
                            label="Contact *"
                            error={this.state.contactValidInfo}
                            className={classes.textField}
                            value={this.state.contact}
                            onChange={this.handleContactChange}
                            type="text"
                            margin="normal"
                            helperText={this.state.contactHelperText}
                        />
                        <TextField
                            id="executive-register-email"
                            label="E-Mail *"
                            error={!this.state.emailValidInfo}
                            className={classes.textField}
                            value={this.state.email}
                            onChange={this.handleEmailChange}
                            type="email"
                            autoComplete="username"
                            margin="normal"
                            helperText={this.state.emailHelperText}
                        />
                        <TextField
                            id="executive-register-password"
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
                    <br/>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size='large' 
                        type='submit'
                        className={classes.button} 
                        style={{backgroundColor: '#08254f'}}
                    >
                        Register
                    </Button>
                </form>
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
    return {};
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
    withStyles(styles),
)(RenderRegisterForm);