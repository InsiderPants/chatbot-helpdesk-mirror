import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';
import CircularProgress from '@material-ui/core/CircularProgress';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ErrorIcon from '@material-ui/icons/Error';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';


import Navbar from '../navbar/navbar';

// CSS
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
    input: {
        color: 'rgba(255,255,255,1)',
        fontWeight: 400,
    },  
    button: {
        margin: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
        padding: theme.spacing.unit,
    },
    error: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    },
    icon: {
        fontSize: 20,
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
})

class RenderIntent extends React.Component {
    constructor() {
        super();
        this.state = {
            showIntents: true,
            intentName: '',
            intentNameError: false,
            intentNames: [],
            trainingPhrasesText: '',
            trainingPhrases: [],
            actionText: '',
            actionTextError: false,
            actions: [],
            responseText: '',
            responses: [],
            sendIntentLoading: false,    //do it false
            saveSuccessSnackbar: false,  //do it false
            errorSnackbar: false,        //do it false
        }
    }

    // for Intent name value
    handleIntentNameChange = (e) => {
        this.setState({
            intentName: e.target.value,
            intentNameError: false,
        });
    }

    // for button that toggle the state (OK)
    createNewIntent = () => {
        this.setState({
            showIntents: false,
        });
    }

    // for cancelling add Intent (OK)
    cancelAddIntent = () => {
        this.setState({
            showIntents: true,
        });
    }

    // for handling text field changes (OK)
    handleTrainingPhrasesTextChange = (e) => {
        this.setState({
            trainingPhrasesText: e.target.value,
        });
    }

    // for entering(kinda submiting) the phrase (OK)
    handleTrainingPhraseSubmit = (e) => {
        if(e.key === 'Enter') {
            // checking if string only contains spaces or not
            if (this.state.trainingPhrasesText.trim().length !== 0) {
                const newString = this.state.trainingPhrasesText.trim();
                let found = false;
                for (let i = 0; i < this.state.trainingPhrases.length; i++) {
                    if (this.state.trainingPhrases[i] === newString) {
                        found = true;
                        break;
                    }
                }
                if (found !== true) {
                    this.setState(state => ({
                        trainingPhrases: state.trainingPhrases.concat(newString),
                        trainingPhrasesText: '',
                    }));
                }
                else {
                    this.setState({
                        trainingPhrasesText: '',
                    })
                }
            }
            e.preventDefault();
        }
    }

    // deletes the selected Training Phrase (OK)
    deleteSelectTrainingPhrase = (id) => {
        let newPhrases = this.state.trainingPhrases;
        newPhrases.splice(id, 1);
        this.setState({
            trainingPhrases: newPhrases,
        })
    }

    // edits selected Training Phrase (OK)
    editSelectTrainingPhrase = (e, id) => {
        let newPhrases = this.state.trainingPhrases;
        newPhrases[id] = e.target.value;
        this.setState({
            trainingPhrases: newPhrases,
        })
    } 

    // for handling text changes (OK)
    handleActionTextChange = (e) => {
        this.setState({
            actionTextError: false, 
            actionText: e.target.value,
        });
    }

    // for entering(kinda submiting) the phrase 
    handleActionSubmit = (e) => {
        if(e.key === 'Enter') {
            // checking whether string contains specific characters ony 
            if (/^[a-zA-Z_]+$/.test(this.state.actionText)) {
                const newString = this.state.actionText;
                //flag if same action is found
                let found = false;
                //checking for same stirng
                for(let i=0; i<this.state.actions.length; i++) {
                    if (this.state.actions[i] === newString) {
                        found = true;
                        break;
                    }
                }
                // if existing action name not found
                if(found !== true) {
                    this.setState(state => ({
                        actions: state.actions.concat(newString),
                        actionText: '',
                    }));
                }
                // if found
                else {
                    this.setState({
                        actionText: '',
                    })
                }
            }
            // if string contain illegal characters
            else {
                this.setState({
                    actionTextError: true,
                })
            }
            e.preventDefault();
        }
    }

    // deletes the selected Action (OK)
    deleteSelectAction = (id) => {
        let newPhrases = this.state.actions;
        newPhrases.splice(id, 1);
        this.setState({
            actions: newPhrases,
        })
    }

    // for handling text field changes (OK)
    handleResponseTextChange = (e) => {
        this.setState({
            responseText: e.target.value,
        });
    }

    // for entering(kinda submiting) the phrase (OK)
    handleResponseSubmit = (e) => {
        if(e.key === 'Enter') {
            // checking if string contains only spaces or not
            if(this.state.responseText.trim().length !== 0) {
                const newString = this.state.responseText.trim();
                let found = false;
                for (let i = 0; i < this.state.responses.length; i++) {
                    if (this.state.responses[i] === newString) {
                        found = true;
                        break;
                    }
                }
                if (found !== true) {
                    this.setState(state => ({
                        responses: state.responses.concat(newString),
                        responseText: '',
                    }));
                }
                else {
                    this.setState({
                        responseText: '',
                    })
                }
            }
            e.preventDefault();
        }
    }

    // deletes the selected Response (OK)
    deleteSelectResponse = (id) => {
        let newPhrases = this.state.responses;
        // deletes particular id in array
        newPhrases.splice(id, 1);
        this.setState({
            responses: newPhrases,
        })
    }

    // edits selected Response (OK)
    editSelectResponse = (e, id) => {
        let newPhrases = this.state.responses;
        newPhrases[id] = e.target.value;
        this.setState({
            responses: newPhrases,
        })
    }

    // for saving the intent and send to backend server
    handleSaveButton = (e) =>{
        e.preventDefault();
        if (/^[a-zA-Z_]+$/.test(this.state.intentName)) {
            if (this.state.sendIntentLoading === false) {
                let data = {};
                data.intentName = this.state.intentName;
                data.trainingPhrases = this.state.trainingPhrases;
                data.actionsArray = this.state.actions;
                data.responses = this.state.responses;

                // setting state of loading circle = true
                this.setState({
                    sendIntentLoading: true,
                });
                axios.post('/api/executiveSaveIntent', data)
                    .then(res => {
                        /*
                            success: ,
                            message: 
                        */
                        // loading circle = false
                        this.setState({
                            sendIntentLoading: false,
                        })
                        let { success, message } = res.data
                        if (success) {
                            console.log(message);
                            // snackbar comes up
                            this.setState({
                                saveSuccessSnackbar: true,
                            })
                            this.updateIntentNames();
                            // redirect to view intent 
                            setTimeout(() => {
                                this.setState({
                                    showIntents: true,
                                    intentName: [],
                                    trainingPhrases: [],
                                    responses: [],
                                    actions: [],
                                })
                            }, 3000);
                        }
                        else {
                            console.log(message);
                            this.setState({
                                errorSnackbar: true,
                            })
                        }
                    })
                    .catch(err => {
                        console.log('Error sending save request');
                    });
            }
        }
        else {
            this.setState({
                intentNameError: true,
            })
        }
    }

    // for closing of snackbar
    handleSnackbarClose = () => {
        this.setState({
            saveSuccessSnackbar: false,
            errorSnackbar: false,
        });
    }

    // for deleting intent
    deleteIntent = (key, item) => {
        // object to be send to backend contains name of intent as string
        const obj = {
            intentName: item
        }

        axios.post('/api/executiveDeleteIntent', obj)
            .then(res => {
                const { success, message } = res.data;
                if (success) {
                    let newIntentNames = this.state.intentNames;
                    newIntentNames.splice(key, 1);
                    this.setState({
                        intentNames: newIntentNames
                    });
                }
                else {
                    console.log(message);
                }
            })
            .catch(err => console.log(err))
    }

    // for updating intentNames everytime a new intent is saved
    updateIntentNames = () => {
        axios.get('/api/executiveViewIntents')
            .then(res => {
                /*
                    success:
                    message:
                    intentNames: (array)
                */
                const { success, message, intentNames } = res.data
                if (success) {
                    // set state to the array of intent names
                    this.setState({
                        intentNames: intentNames,
                    })
                }
                else {
                    console.log(message)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    // this function called when a inetnt name is selected and it renders the add intent page wit pre loaded info
    editSelectedIntent = (item) => {
        const obj = {
            intentName: item
        };

        axios.post('/api/executiveGetIntentInfo', obj)
            .then(res => {
                // const { intentName, trainingPhrases, responses, actionsArray } = res.data;
                const { success, message, data } = res.data;
                if(success) {
                    this.setState({
                        intentName: data.intentName,
                        trainingPhrases: data.trainingPhrases,
                        responses: data.responses,
                        actions: data.actionsArray,
                    })
                    setTimeout(() => {
                        this.setState({
                            showIntents: false
                        })
                    }, 1000);
                }
                else {
                    console.log(message);                    
                }
            })
            .catch(err => console.log(err))
    }

    // for setting the state
    componentDidMount() {
        axios.get('/api/executiveViewIntents')
            .then(res => {
                /*
                    success:
                    message:
                    intentNames: (array)
                */
                const { success, message, intentNames } = res.data
                if (success) {
                    // set state to the array of intent names
                    this.setState({
                        intentNames: intentNames,
                    })
                }
                else {
                    console.log(message)
                }
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        const {classes} = this.props;

        // for Training Phrases
        const trainingPhrases = (
            <Grid container spacing={0} direction='row' justify='center' alignItems='center'>
                <Grid item xs={12}>
                    <Input 
                        fullWidth 
                        placeholder='Add User Expression' 
                        style={{marginRight: 8, marginTop: 8}}
                        value={this.state.trainingPhrasesText}
                        onChange={this.handleTrainingPhrasesTextChange}
                        onKeyDown={this.handleTrainingPhraseSubmit}
                    />
                    <br/><br/>
                    <div style={{maxHeight: 300, overflowX: 'hidden', overflowY: 'auto'}}>
                    <br/>
                    {/* Renders the Phrases */}
                    {
                        this.state.trainingPhrases.map((item, key) => {
                            return( 
                                <Input 
                                    key={key}
                                    fullWidth 
                                    style={{ marginRight: 8, marginTop: 8 }} 
                                    value={item}
                                    onChange={(e) => this.editSelectTrainingPhrase(e, key)}
                                    endAdornment={
                                        <IconButton onClick={() => this.deleteSelectTrainingPhrase(key)}>
                                            <Icon>
                                                deletes
                                            </Icon>
                                        </IconButton>
                                    }
                                />
                            );
                        })
                    }
                    </div>
                </Grid>
            </Grid>
        );

        // for Actions
        const actions = (
            <Grid container spacing={0} direction='row' justify='center' alignItems='center'>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        error={this.state.actionTextError} // checking if action name is valid or not
                        helperText={this.state.actionTextError ? "Action Name can only contain alphabets(caps ok) and underscore(_) only" : null}
                        placeholder='Enter Action Name'
                        style={{marginRight: 8, marginTop: 8}}
                        value={this.state.actionText}
                        onChange={this.handleActionTextChange}
                        onKeyDown={this.handleActionSubmit}
                    />
                    <br/><br/>
                    <div style={{maxHeight: 300, overflowX: 'hidden', overflowY: 'auto'}}>
                    <br/>
                    {/* Renders the action names */}
                    {
                        this.state.actions.map((item, key) => {
                            return( 
                                <Input 
                                    key={key}
                                    fullWidth 
                                    readOnly
                                    style={{ marginRight: 8, marginTop: 8, cursor: 'default' }} 
                                    value={item}
                                    endAdornment={
                                        <IconButton onClick={() => this.deleteSelectAction(key)}>
                                            <Icon>
                                                deletes
                                            </Icon>
                                        </IconButton>
                                    }
                                />
                            );
                        })
                    }
                    </div>
                </Grid>
            </Grid>
        );

        // for responses
        const responses = (
            <Grid container spacing={0} direction='row' justify='center' alignItems='center'>
                <Grid item xs={12}>
                    <Input 
                        fullWidth 
                        placeholder='Add Responses' 
                        style={{marginRight: 8, marginTop: 8}}
                        value={this.state.responseText}
                        onChange={this.handleResponseTextChange}
                        onKeyDown={this.handleResponseSubmit}
                    />
                    <br/><br/>
                    <div style={{maxHeight: 300, overflowX: 'hidden', overflowY: 'auto'}}>
                    <br/>
                    {/* Renders the Phrases */}
                    {
                        this.state.responses.map((item, key) => {
                            return( 
                                <Input 
                                    key={key}
                                    fullWidth 
                                    style={{ marginRight: 8, marginTop: 8 }} 
                                    value={item}
                                    onChange={(e) => this.editSelectResponse(e, key)}
                                    endAdornment={
                                        <IconButton onClick={() => this.deleteSelectResponse(key)}>
                                            <Icon>
                                                deletes
                                            </Icon>
                                        </IconButton>
                                    }
                                />
                            );
                        })
                    }
                    </div>
                </Grid>
            </Grid>
        );

        // Component for View Intents
        const viewIntent = (
            <Paper elevation={1}>
                <List component="nav">
                    {this.state.intentNames.map((item, key) => {
                        return (
                            <div key={key}>
                                <ListItem button onClick={() => this.editSelectedIntent(item)}>
                                    <ListItemText >
                                        {item}
                                    </ListItemText>
                                    <ListItemIcon>
                                        <IconButton onClick={() => this.deleteIntent(key, item)}>
                                            <Icon>
                                                deletes
                                            </Icon>
                                        </IconButton>
                                    </ListItemIcon>
                                </ListItem>
                                <Divider />
                            </div>
                        );
                    })}
                </List>
            </Paper>
        );
        
        //Components for adding intents
        const addIntents = (
            <div>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' style={{ fontWeight: 300}}>Training Phrases</Typography>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails>
                        {trainingPhrases}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' style={{ fontWeight: 300 }}>Actions</Typography>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails>
                        {actions}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' style={{ fontWeight: 300 }}>Responses</Typography>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails>
                        {responses}
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={this.state.saveSuccessSnackbar}
                    onClose={this.handleSnackbarClose}
                    ContentProps={{
                        'aria-describedby': 'message-id',
                    }}
                    autoHideDuration={4000}
                    message={<span id="message-id">Intent Successfully Saved. Redirecting....</span>}
                />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.errorSnackbar}
                    autoHideDuration={6000}
                    onClose={this.handleSnackbarClose}
                >
                    <SnackbarContent
                        className={classes.error}
                        message={
                            <span id="client-snackbar" style={{display: 'flex', alignItems: 'center'}}>
                                <ErrorIcon className={classes.icon} />
                                Error from Backend, please try again. 
                            </span>
                        }
                    />
                </Snackbar>
            </div>
        );
        
        // component to be rendered in navbar for show intents
        const viewIntentForNav = (
            <Grid container spacing={8} direction='row' justify='space-evenly' alignItems='center'>
                <Grid item xs={10} sm={10} md={10} lg={11}>
                    <Typography variant='h5' color='primary'>Intents</Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    {/* Add Intent Button */}
                    <Button variant="contained" className={classes.button} onClick={this.createNewIntent}>
                        Add Intent
                    </Button>
                </Grid>
            </Grid>
        );

        // Component to be rendered in navbar for add Intent
        const addIntentForNav = (
            <Grid container spacing={8} direction='row' justify='space-around' alignItems='center'>
                <Grid item xs={1} sm={1} md={1} lg={1}>
                    {/* Cancel Button */}
                    <IconButton color='primary' onClick={this.cancelAddIntent}>
                        <Icon>
                            close
                        </Icon>
                    </IconButton>
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={10}>
                    {/* Intent Name */}
                    <TextField
                        id="add-intent-nav-textfield"
                        style={{ marginRight: 8, color: '#ffffff' }}
                        placeholder="Intent Name"
                        fullWidth
                        required
                        margin="normal"
                        label={this.state.intentNameError ? " Intent Name only contain a-z(caps ok) and Underscore(_) only" : "Intent Name"}
                        InputLabelProps={{
                            shrink: true,
                            className: classes.input,
                        }}
                        InputProps={{
                            className: classes.input,
                        }}
                        error={this.state.intentNameError}
                        value={this.state.intentName}
                        onChange={this.handleIntentNameChange}
                    />
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    {/* Save Button */}
                    <Button variant="contained" onClick={this.handleSaveButton}  className={classes.button}>
                        {this.state.sendIntentLoading ? <CircularProgress size={20} color='inherit'/> : "Save"}
                    </Button>
                </Grid>
            </Grid>
        );

        return (
            <div className={classes.root}>
                {/*Navbar and Sidelist with component ot be rendered in navbar as props */}
                <Navbar renderComponent={this.state.showIntents ? viewIntentForNav : addIntentForNav}/>
                {/* Body */}
                <div className={classes.content}>
                    {this.state.showIntents ? viewIntent : addIntents}
                </div>
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