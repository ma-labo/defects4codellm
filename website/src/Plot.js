import React, {Component} from 'react';
import Button from '@mui/material/Button';
import './dashboard.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {createTheme} from '@mui/material/styles';
import {
    Box,
    Checkbox, Chip,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid, IconButton, Switch,
    ThemeProvider,
    Tooltip
} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import { Link } from 'react-router-dom';

import ErrorTab from "./views/error_tab_view/ErrorTab";
import CodeErrorPlots from "./views/code_error_plot_view/CodeErrorPlot";
import Footer from './Footer';
import BarChartIcon from "@mui/icons-material/BarChart";

const config = require("./config.json")
const taxonomy = require( "" + config['taxonomy'])
const semantic_code = require( "" + config['semantic_error_code'])
const syntactic_code = require( "" + config['syntactic_error_code'])

const failed_tasks = require("" + config['failed_tasks'])
const models = Object.keys(config['data_config'])

let data = []

let index = 1

let taskID = -1

for (let i = 0; i < models.length; i++) {
    let tmp = require( "" + config['data_config'][models[i]])
    data = data.concat(tmp.map((item => {
        if (item['Task ID'] || item['Task ID'] === 0)
            taskID = item['Task ID']
        else
            item['Task ID'] = taskID
        item['model'] = models[i];
        item['id'] = index;
        index += 1;
        return item
    })))
}

let codeData = {}
for (let i = 0; i < models.length; i++) {
    codeData[models[i]] = require("" + config['code_file'][models[i]])
}
codeData['Ground-truth'] = require("" + config['code_file']["Ground-truth"])


const theme = createTheme({
    palette: {
        primary: {
            light: '#8D6E63',
            main: '#5D4037',
            dark: '#3E2723',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7961',
            main: '#f44336',
            dark: '#ba000d',
            contrastText: '#000',
        },
    },
});


export default class Plots extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semanticErrors: [],
            syntacticErrors: [],
            models: models,
            semanticFiltered: [],
            syntacticFiltered: [],
            displayAllData: true,
        }
    }

    handleChange = (value) => {
        let tmp = this.state.models;
        if (this.state.models.includes(value)) {
            const modelIndex = this.state.models.indexOf(value);
            tmp = tmp.slice(0, modelIndex).concat(tmp.slice(modelIndex + 1))
            this.setState({
                models: tmp
            })
        }
        else {
            tmp.push(value);
            this.setState({
                models: tmp
            })
        }
    }

    handleSemanticErrorFilter = (value) => {
        let tmp = this.state.semanticFiltered;
        if (this.state.semanticFiltered.includes(value)) {
            const errorIndex = this.state.semanticFiltered.indexOf(value);
            tmp = tmp.slice(0, errorIndex).concat(tmp.slice(errorIndex + 1))
            this.setState({
                semanticFiltered: tmp
            })
        }
        else {
            tmp.push(value);
            this.setState({
                semanticFiltered: tmp
            })
        }
    }

    handleSyntacticErrorFilter = (value) => {
        let tmp = this.state.syntacticFiltered;
        if (this.state.syntacticFiltered.includes(value)) {
            const errorIndex = this.state.syntacticFiltered.indexOf(value);
            tmp = tmp.slice(0, errorIndex).concat(tmp.slice(errorIndex + 1))
            this.setState({
                syntacticFiltered: tmp
            })
        }
        else {
            tmp.push(value);
            this.setState({
                syntacticFiltered: tmp
            })
        }
    }

    handleSwitchChange = (event) => {
        if (this.state.models.length > 0) {
            this.setState({
                displayAllData: event.target.checked,
            })
        }
        else {
            this.setState({
                models: models
            })
            this.setState({
                displayAllData: event.target.checked,
            })
        }
    }

    handleDataset = (event) => {
        this.setState({
            showEvalPlus: event.target.checked
        })
    }

    render() {
        const filteredData = this.state.showEvalPlus ? data : data.filter((row) => {return failed_tasks[row['model']].includes(row['Task ID'])})
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <Typography variant="h5" color="inherit">
                                LLM Code Error
                            </Typography>
                            <Box sx={{ flexGrow: 1 }}>
                                <Tooltip title="Table">
                                    <IconButton aria-label="table" size="large" color="inherit"
                                                component={Link} to="/">
                                        <TableChartIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Visualization">
                                    <IconButton aria-label="plots" size="large" color="inherit"
                                                component={Link} to="/plots">
                                        <BarChartIcon fontSize="inherit" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                            <Tooltip title="About">
                                <Button aria-label="about" size="large" color="inherit"
                                        component={Link} to="/about">
                                    About
                                </Button>
                            </Tooltip>
                        </Toolbar>
                    </AppBar>
                    <Box p={2} m={2} height="100vh">
                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                            {/*<Grid xs={2}>*/}
                            {/*    <ErrorTab taxonomy={taxonomy}*/}
                            {/*              semanticCode={semantic_code}*/}
                            {/*              syntacticCode={syntactic_code}*/}
                            {/*              semanticErrorFiltered={this.handleSemanticErrorFilter}*/}
                            {/*              syntacticErrorFiltered={this.handleSyntacticErrorFilter}/>*/}
                            {/*</Grid>*/}
                            <Grid xs={12}>
                                <Box pl={4} pr={4}>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormGroup>
                                            <div style={{display: 'flex', flexFlow: 'wrap', alignItems: 'center'}}>
                                                {
                                                    models.map((model => {
                                                        return (
                                                            <FormControlLabel
                                                                control={
                                                                    <Checkbox checked={this.state.models.includes(model)}
                                                                              onChange={e => this.handleChange(model)}
                                                                              name={model} />
                                                                }
                                                                label={model}
                                                            />
                                                        )
                                                    }))
                                                }
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={this.state.displayAllData}
                                                            onChange={this.handleSwitchChange}
                                                        />
                                                    }
                                                    label="Display Each Model"
                                                />
                                                <FormControlLabel control={<Switch disabled={!config.evalplus} defaultChecked={false}
                                                                                   onChange={e => this.handleDataset(e)}/>}
                                                                  label={"EvalPlus"} />
                                            </div>
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                                <Box p={4}>
                                    <CodeErrorPlots selectedModels={this.state.models} data={filteredData}
                                                    semanticCode={semantic_code}
                                                    syntacticCode={syntactic_code}
                                                    semanticFilter={this.state.semanticFiltered}
                                                    syntacticFilter={this.state.syntacticFiltered}
                                                    codeData={codeData}
                                                    displayEachModel={this.state.displayAllData}
                                                    failedTasks={failed_tasks}
                                                    showEvalPlus={this.state.showEvalPlus}
                                    />
                                </Box>
                            </Grid>
                        </Grid>
                        <Footer />
                    </Box>
                </div>
            </ThemeProvider>
        )
    }
}