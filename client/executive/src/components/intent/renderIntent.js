import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withRouter, Redirect } from 'react-router-dom';

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
import InputAdornment from '@material-ui/core/InputAdornment';

import Navbar from '../navbar/navbar';

// width of side bar thing
const drawerWidth = 300;

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
        padding: theme.spacing.unit * 3,
        marginLeft: 300,
    },
    input: {
        color: 'rgba(255,255,255,1)',
        fontWeight: 400,
    },  
    button: {
        margin: theme.spacing.unit,
        marginLeft: theme.spacing.unit * 3,
    },
})

class RenderIntent extends React.Component {
    constructor() {
        super();
        this.state = {
            showIntents: true,
            intentName: '',
            trainingPhrasesText: '',
            trainingPhrases: [],
        }
        this.deleteSelectTrainingPhrase = this.deleteSelectTrainingPhrase.bind(this);
    }

    // for Intent name value
    handleIntentNameChange = (e) => {
        this.setState({
            intentName: e.target.value,
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
            const newString = {
                text: this.state.trainingPhrasesText,
                id: this.state.trainingPhrases.length + 1,
            };
            this.setState(state => ({
                trainingPhrases: state.trainingPhrases.concat(newString),
                trainingPhrasesText: ''
            }));
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
        newPhrases[id].text = e.target.value;
        console.log(newPhrases[id].text);
        this.setState({
            trainingPhrases: newPhrases,
        })
    } 

    render() {
        const {classes} = this.props;

        // for Training Phrases
        const trainingPhrases = (
            <Grid container spacing={0} direction='row' justify='center' alignItems='center'>
                <Grid item xs={12}>
                    <div>
                    <Input 
                        fullWidth 
                        placeholder='Add User Expression' 
                        style={{marginRight: 8, marginTop: 8}}
                        value={this.state.trainingPhrasesText}
                        onChange={this.handleTrainingPhrasesTextChange}
                        onKeyPress={this.handleTrainingPhraseSubmit}
                    />
                    <br/>
                    <br/><br/>
                    {
                        this.state.trainingPhrases.map((item, key) => {
                            return( 
                                <Input 
                                    key={key}
                                    fullWidth 
                                    style={{ marginRight: 8, marginTop: 8 }} 
                                    value={item.text}
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

        // Component for View Intents
        const viewIntent = (
            <div>
                show intents
            </div>
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
                        <Typography>
                            shit
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant='h6' style={{ fontWeight: 300 }}>Responses</Typography>
                    </ExpansionPanelSummary>
                    <Divider />
                    <ExpansionPanelDetails>
                        <Typography>
                            shit
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
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
                        style={{ marginRight:8 }}
                        placeholder="Intent Name"
                        fullWidth
                        margin="normal"
                        label="Intent Name"
                        InputLabelProps={{
                            shrink: true,
                            className: classes.input,
                        }}
                        InputProps={{
                            className: classes.input,
                        }}
                        value={this.state.intentName}
                        onChange={this.handleIntentNameChange}
                    />
                </Grid>
                <Grid item xs={2} sm={2} md={2} lg={1}>
                    {/* Save Button */}
                    <Button variant="contained" className={classes.button}>
                        Save
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