//importing packages
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';

//importing components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

//actions
import { signOutUserButton } from '../../actions/auth';

//CSS
const drawerWidth = 300;

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#ffffff',
        },
        error: {
            main: '#d1121c',
        },
    },
    typography: { useNextVariants: true },
});

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 0,
        display: 'flex',
    },
    title: {
        display: 'block',
        paddingTop: theme.spacing.unit * 2,
    },
    list: {
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: {
        height: '80px',
        paddingLeft: theme.spacing.unit * 2,
        cursor: 'pointer',
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        height: '80px',
        backgroundColor: '#104087',
    }
});

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            
        };
    }

    logoutExecutive = () => {
        this.props.signOutUserButton();
    }

    homeRoute = () => {
        console.log("secure this route");
        this.props.history.push('/');
    }

    addIntentRoute = () => {
        if(localStorage.getItem('AccessToken') !== null) {
            this.props.history.push('/intent');
        }
    }
    
    render(){
        const { classes } = this.props;

        const sideList = (
        <div>
            <div className={classes.toolbar} onClick={this.homeRoute}>
                <Typography className={classes.title} variant="headline" color="inherit" noWrap>
                    Executive Dashboard
                </Typography>
            </div>
            <Divider />
            <List>
                {['Intents', 'Entities'].map((text, index) => (
                    <ListItem button key={text} onClick={index === 0 ? this.addIntentRoute : null}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Training', 'Analytics'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
            <Divider />
            <List>
                {['Account', 'Log Out'].map((text, index) => (
                    <ListItem button key={text} onClick={index === 1 ? this.logoutExecutive : null}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
        );
        
        return(
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                <Toolbar>
                    <MuiThemeProvider theme={theme}>
                        {this.props.renderComponent}
                    </MuiThemeProvider>
                </Toolbar>
                </AppBar>
                <Drawer 
                className={classes.list}
                variant="permanent" 
                classes={{paper: classes.drawerPaper,}}
                anchor="left"
                >
                    {sideList}
                </Drawer>
            </div>
        );
    }
}

//connecting to redux
const mapStateToProps = (state) => {
    return {
        executive: state.executive,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        signOutUserButton: () => signOutUserButton(dispatch)
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
    withStyles(styles),
)(Navbar);
