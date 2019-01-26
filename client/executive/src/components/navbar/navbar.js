//importing packages
import React, { Component } from 'react';

//importing components
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

//CSS
const styles = theme => ({
    root: {
        width: '100%',
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        paddingTop: theme.spacing.unit,
        paddingRight: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 10,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 200,
        },
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('xs')]: {
            display: 'flex',
        },
    },
    list: {
            width: 250,
        },
});

class Navbar extends Component {
    constructor() {
        super();
        this.state = {
            anchorEl: null,
            sideMenu: false,
        };
        this.handleProfileMenuOpen = this.handleProfileMenuOpen.bind(this);
        this.toggleDrawer = this.toggleDrawer.bind(this);
        this.handleMenuClose = this.handleMenuClose.bind(this);
    }

    handleProfileMenuOpen = event => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    toggleDrawer = (open) => () => {
        this.setState({
            sideMenu: open,
        });
    };

    handleMenuClose = () => {
        this.setState({
            anchorEl: null
        });
    };
    
    render(){
        const { anchorEl, } = this.state;
        const { classes } = this.props;
        const isMenuOpen = Boolean(anchorEl);


        const sideList = (
        <div className={classes.list}>
            <List>
            {['One', 'Two', 'Three', 'Four'].map((text, index) => (
                <ListItem button key={text}>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
            <Divider />
            <List>
            {['Five', 'Six', 'Seven'].map((text, index) => (
                <ListItem button key={text}>
                <ListItemText primary={text} />
                </ListItem>
            ))}
            </List>
        </div>
        );
        
        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
                <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
            </Menu>
        );
        
        return(
            <div className={classes.root}>
                <AppBar position="static" style={{backgroundColor: '#08254f'}}>
                <Toolbar>
                    <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer" onClick={this.toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Drawer open={this.state.sideMenu} onClose={this.toggleDrawer(false)}>
                        <div style={{backgroundColor: '#eceff1', minHeight: '100vh'}}>
                        <div
                            tabIndex={0}
                            role="button"
                            onClick={this.toggleDrawer(false)}
                            onKeyDown={this.toggleDrawer(false)}
                        >
                            {sideList}
                        </div>
                        </div>
                    </Drawer>
                    <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                        Executive Dashboard
                    </Typography>
                    <div className={classes.search}>
                    <div className={classes.searchIcon}>
                        <SearchIcon />
                    </div>
                    <InputBase
                        placeholder="Search…"
                        classes={{
                        root: classes.inputRoot,
                        input: classes.inputInput,
                        }}
                    />
                    </div>
                    <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                    <IconButton
                        aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleProfileMenuOpen}
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    </div>
                </Toolbar>
                </AppBar>
                {renderMenu}
            </div>
        );
    }
}

export default withStyles(styles)(Navbar);
