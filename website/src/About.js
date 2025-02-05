import React, {Component} from 'react';
import Button from '@mui/material/Button';
import './dashboard.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {createTheme} from '@mui/material/styles';
import {
    Box,
    IconButton,
    ThemeProvider,
    Tooltip
} from "@mui/material";
import TableChartIcon from '@mui/icons-material/TableChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link } from 'react-router-dom';

import Footer from './Footer';

const config = require("./config.json")


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


export default class About extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
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
                    <Box m={2} style={{textAlign: "center"}}>
                        <Typography variant="h4" m={1}>
                            Towards Understanding the Characteristics of Code Generation Errors Made by Large Language Models
                        </Typography>
                        <Typography variant="h6" m={1}>
                            Zhijie Wang<sup>1*</sup>, Zijie Zhou<sup>2*</sup>, Da Song<sup>1*</sup>, Yuheng Huang<sup>3</sup>, Shengmai Chen<sup>4</sup>, Lei Ma<sup>3,1</sup>, Tianyi Zhang<sup>4</sup>
                        </Typography>
                        <Typography variant="h6" m={1}>
                            <sup>1</sup>University of Alberta, <sup>2</sup>University of Illinois Urbana-Champaign,
                        </Typography>
                        <Typography variant="h6" m={1}>
                            <sup>3</sup>The University of Tokyo, <sup>4</sup>Purdue University
                        </Typography>
                    </Box>
                    <div style={{ margin: '20px' }}>
                        <Typography variant="h5" paragraph>
                            Introduction:
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This website presents the data used in the paper "<a href="http://www.arxiv.org/abs/2406.08731" target="_blank">Towards Understanding the Characteristics of Code Generation Errors Made by Large Language Models</a>" It shows the coding errors made by different large language models (LLMs) on the HumanEval dataset. Each LLM contains at most 164 incorrect code snippets. Each incorrect code snippet may contain multiple error. For each error, we analyzed its semantic and syntactic characteristics.
                        </Typography>
                        <Typography variant="h5" paragraph>
                            Instructions for Use:
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The website provides a data table to present detailed information on each error task of different LLMs. In addition, the website also uses visualization to allow users to observe the difference in the proportion of different bugs in different models.
                        </Typography>
                        <Typography variant="subtitle1">
                            Data Table Page
                                <IconButton aria-label="table" size="large" color="inherit"
                                            component={Link} to="/">
                                    <TableChartIcon fontSize="inherit" />
                                </IconButton>
                        </Typography>
                        <Typography variant="body1" component="ul">
                            <li>
                                The side bar on the left allows users to select single or multiple bugs for observation. When the user does not select anything, all bugs are displayed by default.
                            </li>
                            <li>
                                The side bar at the top shows the LLMs that were analyzed. Users can check error tasks in single or multiple models by selecting the model provided. The default is to display error tasks for all LLMs.
                            </li>
                            <li>
                                The middle table shows the error tasks. Users can find more detailed information by clicking on a single error task.
                            </li>
                        </Typography>
                        <Typography variant="subtitle1">
                            Visualization Page
                                <IconButton aria-label="plots" size="large" color="inherit"
                                            component={Link} to="/plots">
                                    <BarChartIcon fontSize="inherit" />
                                </IconButton>
                        </Typography>
                        <Typography variant="body1" component="ul">
                            <li >
                                The middle part of the page shows the proportional difference between the observed bugs. Users can touch the bar in the chart to view the percentage number. Displayed by default is the percentage of all bugs for all analyzed models.
                            </li>
                            <li>
                                The side bars on the left and top allow users to select the bugs and models they want. The default is to display all bugs and models.
                            </li>
                        </Typography>
                    </div>
                    <Footer />
                </div>
            </ThemeProvider>
        )
    }
}