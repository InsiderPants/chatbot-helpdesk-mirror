import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

// width of side bar thing
const drawerWidth = 300;

const styles = theme => ({
    root: {
        flexGrow: 1,
        marginTop: 0,
        display: 'flex',
        minWidth: 1000,
    },
    appBar: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        height: '80px',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    toolbar: {
        height: '80px',
    },
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
    },
})

class RenderIntent extends React.Component {
    constructor() {
        super();
        this.state = {

        }
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.root}>
                <CssBaseline />
                <AppBar position="fixed" className={classes.appBar} style={{backgroundColor: '#08254f'}}>
                    <Toolbar>
                        <Typography variant="h6" color="inherit" noWrap>
                            functionality here
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    className={classes.drawer}
                    variant="permanent"
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    anchor="left"
                >
                    <div className={classes.toolbar}>
                        choo choo bitch!
                    </div>
                    <Divider />
                    <List>
                        {['Intents', 'Entities'].map((text, index) => (
                            <ListItem button key={text}>
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
                            <ListItem button key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.toolbar} />
                    shit here
                </main>
            </div>
        );
    }
}


//connecting to redux
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
    withStyles(styles)
)(RenderIntent);