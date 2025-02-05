import React, { Component } from 'react';
import Button from '@mui/material/Button';
import './dashboard.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {createTheme, styled} from '@mui/material/styles';
import {
    Box,
    Checkbox, Chip, Dialog,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid, IconButton, Switch,
    ThemeProvider,
    Tooltip,
    DialogActions, DialogContent,
    DialogTitle, Divider
} from "@mui/material";
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from 'react-router-dom';

import ErrorTab from "./views/error_tab_view/ErrorTab";
import CodeErrorGrid from "./views/code_error_grid_view/CodeErrorGrid";
import Footer from './Footer';
import TableChartIcon from "@mui/icons-material/TableChart";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";

const config = require("./config.json")
const taxonomy = require("" + config['taxonomy'])
const semantic_code = require("" + config['semantic_error_code'])
const syntactic_code = require("" + config['syntactic_error_code'])
const test_case = require("" + config['test_case'])
const failed_tasks = require("" + config['failed_tasks'])

const models = Object.keys(config['data_config'])

let data = []

let index = 1

let taskID = -1

for (let i = 0; i < models.length; i++) {
    let tmp = require("" + config['data_config'][models[i]])
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

let testData = {}
for (let i = 0; i < models.length; i++) {
    testData[models[i]] = require("" + config['test_result'][models[i]])
}


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


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
    '& .MuiDialog-scrollPaper': {
        alignItems: "flex-start"
    }
}));


export default class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            semanticErrors: [],
            syntacticErrors: [],
            models: models,
            semanticFiltered: [],
            syntacticFiltered: [],
            showEvalPlus: false,
            dialogueOpen: true,
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

    handleDataset = (event) => {
        this.setState({
            showEvalPlus: event.target.checked
        })
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

    handleDialogueClose = () => {
        this.setState({
            dialogueOpen: false
        })
    };

    render() {
        // console.log(this.state.semanticFiltered)
        // console.log(this.state.syntacticFiltered)
        const filteredData = this.state.showEvalPlus ? data : data.filter((row) => {return failed_tasks[row['model']].includes(row['Task ID'])})
        return (
            <ThemeProvider theme={theme}>
                <div>
                    <AppBar position="static" color="primary">
                        <Toolbar>
                            <Typography variant="h5" color="inherit" component={Link} to={"/"}>
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
                            <Grid xs={2}>
                                <ErrorTab taxonomy={taxonomy}
                                    semanticCode={semantic_code}
                                    syntacticCode={syntactic_code}
                                    semanticErrorFiltered={this.handleSemanticErrorFilter}
                                    syntacticErrorFiltered={this.handleSyntacticErrorFilter} />
                            </Grid>
                            <Grid xs={10}>
                                <Box pl={4} pr={4} ml={1}>
                                    <FormControl component="fieldset" variant="standard">
                                        <FormGroup>
                                            <div style={{ display: 'flex', flexFlow: 'wrap' }}>
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
                                                <FormControlLabel control={<Switch disabled={!config.evalplus} defaultChecked={false}
                                                                                   onChange={e => this.handleDataset(e)}/>}
                                                                  label={"EvalPlus"} />
                                            </div>
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                                {
                                    ((this.state.semanticFiltered.length > 0) || (this.state.syntacticFiltered.length > 0)) ?
                                        <Box pl={4} pr={4} ml={1}>
                                            <div style={{
                                                display: 'flex', flexFlow: 'wrap', alignItems: 'center',
                                                columnGap: '10px'
                                            }}>
                                                {
                                                    this.state.semanticFiltered.length > 0 ?
                                                        <div style={{
                                                            display: 'flex', flexFlow: 'wrap', alignItems: 'center',
                                                            columnGap: '10px'
                                                        }}>
                                                            <Typography variant="h7">
                                                                Match any of these semantic error characteristic(s):
                                                            </Typography>
                                                            {
                                                                this.state.semanticFiltered.map((error) => {
                                                                    return (
                                                                        <Chip label={error + ' ' + semantic_code[error]}
                                                                            variant="outlined"
                                                                            sx={{
                                                                                borderRadius: 2, color: 'error.light',
                                                                                borderColor: 'error.light'
                                                                            }}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </div> : null
                                                }
                                                {
                                                    this.state.syntacticFiltered.length > 0 ?
                                                        <div style={{
                                                            display: 'flex', flexFlow: 'wrap', alignItems: 'center',
                                                            columnGap: '10px'
                                                        }}>
                                                            <Typography variant="h7">
                                                                Match any of these syntactic characteristic(s):
                                                            </Typography>
                                                            {
                                                                this.state.syntacticFiltered.map((error) => {
                                                                    return (
                                                                        <Chip label={error + ' ' + syntactic_code[error]}
                                                                            variant="outlined"
                                                                            sx={{
                                                                                borderRadius: 2, color: 'warning.light',
                                                                                borderColor: 'warning.light'
                                                                            }}
                                                                        />
                                                                    )
                                                                })
                                                            }
                                                        </div> : null
                                                }
                                            </div>
                                        </Box> :
                                        null
                                }
                                <CodeErrorGrid selectedModels={this.state.models} data={filteredData}
                                               semanticCode={semantic_code}
                                               syntacticCode={syntactic_code}
                                               semanticFilter={this.state.semanticFiltered}
                                               syntacticFilter={this.state.syntacticFiltered}
                                               codeData={codeData}
                                               testCase={test_case}
                                               testResult={testData}
                                               showEvalPlus={config.evalplus}
                                />
                            </Grid>
                        </Grid>
                        <Footer />
                    </Box>
                </div>
                <BootstrapDialog
                    onClose={this.handleDialogueClose}
                    open={this.state.dialogueOpen}
                    fullWidth={true}
                    maxWidth={"xl"}
                >
                    <DialogTitle sx={{ ml: 1, p: 2 }}>
                        Towards Understanding the Characteristics of Code Generation Errors Made by Large Language Models
                    </DialogTitle>
                    <DialogContent dividers>
                        <Box m={1} mb={2}>
                            <Typography variant={"body"}>
                                This website presents the data used in the paper "<a href="http://www.arxiv.org/abs/2406.08731" target="_blank">Towards Understanding the Characteristics of Code Generation Errors Made by Large Language Models</a>"
                                It shows the coding errors made by different large language models (LLMs) on the HumanEval dataset.
                            </Typography>
                        </Box>
                        <Box m={1} mb={2} pt={2} pb={2} pl={4} pr={4} style={{backgroundColor: "#F6F5F2", borderRadius: "8px",
                            borderWidth: "0.5px", borderStyle: "solid", borderColor: "black"}}>
                            <pre>
                                {config.bibtex}
                            </pre>
                        </Box>
                        <Box m={1} mb={2}>
                            <Typography variant={"body"}>
                                You can filter the code generation errors according to the following criteria:
                            </Typography>
                            <Box ml={4}>
                                <li>
                                    Semantic Characteristics: the high-level root causes of the code generation errors.
                                </li>
                                <li>
                                    Syntactic Characteristics: which parts of the code an error occurs in.
                                </li>
                                <li>
                                    Model
                                </li>
                            </Box>
                        </Box>
                        <Box m={1} mb={2}>
                            <Typography variant={"body"}>
                                Selected errors are presented in table format in the following columns:
                            </Typography>
                            <Box ml={4}>
                                <li>
                                    Error ID: error identifier.
                                </li>
                                <li>
                                    Model: the LLM.
                                </li>
                                <li>
                                    Task ID: task number in the HumanEval dataset.
                                </li>
                                <li>
                                    Incorrect Code: code snippet generated by the LLM.
                                </li>
                                <li>
                                    Correct Code: ground truth code provided by the HumanEval dataset.
                                </li>
                                <li>
                                    Semantic Characteristics: the labeled semantic characteristic of the incorrect code block.
                                </li>
                                <li>
                                    Syntactic Characteristics: the labeled syntactic characteristic of the incorrect code block.
                                </li>
                            </Box>
                        </Box>
                        <Box m={1} mb={2}>
                            <Typography variant={"body"}>
                                On clicking in each row of the table, more details are presented, including:
                            </Typography>
                            <Box ml={4}>
                                <li>
                                    Complete LLM generated code.
                                </li>
                                <li>
                                    Complete ground truth code.
                                </li>
                                <li>
                                    Failed test cases.
                                </li>
                                <li>
                                    Shortcut &lt; : &gt; to navigate between errors.
                                </li>
                            </Box>
                        </Box>
                        <Box m={1} mb={2}>
                            <Typography variant={"body"}>
                                On clicking <BarChartIcon style={{marginBottom: "-5px"}}/>, the error distributions are displayed in charts.
                            </Typography>
                        </Box>
                        <Box m={1} mb={2}>
                            <Typography fontStyle={"italic"} variant={"caption"}>
                                Our data explorer's design is highly inspired by the <a href={"https://program-repair.org/defects4j-dissection/#!/"} target="_blank">Defects4j Dissection</a> project.
                                Kudos to them!
                            </Typography>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDialogueClose} variant={"contained"}>
                            OK
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
            </ThemeProvider>
        )
    }
}