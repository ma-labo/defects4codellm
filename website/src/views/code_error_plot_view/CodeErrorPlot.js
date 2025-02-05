import React from "react";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import CloseIcon from '@mui/icons-material/Close';
import {Box, Grid} from "@mui/material";
import { BarChart } from '@mui/x-charts/BarChart';


export default function CodeErrorPlot(props) {
    const semantic_code = props.semanticCode
    const syntactic_code = props.syntacticCode

    const data = props.data;
    const selectedModels = props.selectedModels;
    // filter model
    let data_filtered = data.filter((row) => {return selectedModels.includes(row['model'])})

    let semantic_data_filtered = data_filtered;
    // filter semantic errors
    // if (props.semanticFilter.length > 0) {
    //     const searchRegex = new RegExp('(' + props.semanticFilter.join('|') + ')', 'i');
    //     semantic_data_filtered = data_filtered.filter((row) => {return searchRegex.test(row['Semantic Error ID'])})
    // }

    let syntactic_data_filtered = data_filtered;
    // filter syntactic errors
    // if (props.syntacticFilter.length > 0) {
    //     const searchRegex = new RegExp('(' + props.syntacticFilter.join('|') + ')', 'i');
    //     syntactic_data_filtered = data_filtered.filter((row) => {return searchRegex.test(row['Syntactic Error ID'])})
    // }

    let semantic_error_count = {}
    let num_data_instance = 0
    for (let i = 0; i < semantic_data_filtered.length; i++) {
        if (Object.keys(semantic_error_count).includes(semantic_data_filtered[i]["Semantic Error ID"])) {
            semantic_error_count[semantic_data_filtered[i]["Semantic Error ID"]] += 1
            num_data_instance += 1
        }
        else if (semantic_data_filtered[i]["Semantic Error ID"].length > 0) {
            semantic_error_count[semantic_data_filtered[i]["Semantic Error ID"]] = 1
            num_data_instance += 1
        }
    }

    let semantic_error_num = []
    for (let i = 0; i < Object.keys(semantic_error_count).length; i++) {
        let key = Object.keys(semantic_error_count)[i]
        if (props.showEvalPlus) {
            semantic_error_num.push({'error': key + ' ' + semantic_code[key],
                "frequency": semantic_error_count[key] / num_data_instance})
        }
        else {
            semantic_error_num.push({'error': key + ' ' + semantic_code[key],
                "frequency": semantic_error_count[key] / Object.values(props.failedTasks).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0)})
        }
    }

    semantic_error_num.sort((a, b) => {return a['frequency'] < b['frequency'] ? 1 : (a['frequency'] > b['frequency'] ? -1 : 0)})

    num_data_instance = 0
    let syntactic_error_count = {}
    for (let i = 0; i < syntactic_data_filtered.length; i ++) {
        if (Object.keys(syntactic_error_count).includes(syntactic_data_filtered[i]["Syntactic Error ID"])) {
            syntactic_error_count[syntactic_data_filtered[i]["Syntactic Error ID"]] += 1
            num_data_instance += 1
        }
        else if (syntactic_data_filtered[i]["Syntactic Error ID"].length > 0) {
            syntactic_error_count[syntactic_data_filtered[i]["Syntactic Error ID"]] = 1
            num_data_instance += 1
        }
    }

    let syntactic_error_num = []
    for (let i = 0; i < Object.keys(syntactic_error_count).length; i++) {
        let key = Object.keys(syntactic_error_count)[i]
        if (props.showEvalPlus) {
            syntactic_error_num.push({'error': key + ' ' + syntactic_code[key], "frequency": syntactic_error_count[key] / num_data_instance})
        }
        else {
            syntactic_error_num.push({'error': key + ' ' + syntactic_code[key],
                "frequency": syntactic_error_count[key] /  Object.values(props.failedTasks).reduce((sum, list) => sum + (Array.isArray(list) ? list.length : 0), 0)})
        }
    }
    syntactic_error_num.sort((a, b) => {return a['frequency'] < b['frequency'] ? 1 : (a['frequency'] > b['frequency'] ? -1 : 0)})

    const getPerModelError = (data, errorKey, model, code) => {
        let count = {}
        let num_data_instance = 0
        for (let i = 0; i < data.length; i++) {
            if (data[i]['model'] !== model) {
                continue;
            }
            if (Object.keys(count).includes(data[i][errorKey])) {
                count[data[i][errorKey]] += 1
                num_data_instance += 1
            }
            else if (data[i][errorKey].length > 0) {
                count[data[i][errorKey]] = 1
                num_data_instance += 1
            }
        }

        let num = []
        for (let i = 0; i < Object.keys(count).length; i++) {
            let key = Object.keys(count)[i]
            if (props.showEvalPlus)
            {
                num.push({'error': key + ' ' + code[key], "frequency": count[key] / num_data_instance})
            }
            else {
                num.push({'error': key + ' ' + code[key], "frequency": count[key] / num_data_instance})
            }
        }

        return num.sort((a, b) => {return a['frequency'] < b['frequency'] ? 1 : (a['frequency'] > b['frequency'] ? -1 : 0)})
    }


    return (
        <div>
            {/*<Box m={2} >*/}
            {/*    <Grid container spacing={2}>*/}
            {/*        <Grid xs={6}>*/}
            {/*            <Typography variant={"h5"}>*/}
            {/*                Number of bug per semantic error type*/}
            {/*            </Typography>*/}
            {/*            <div id='barChartView1' style={{ backgroundColor: 'white', paddingTop: 10 }}>*/}
            {/*                <BarChart id='barChartView1' width={800} height={800} data={semantic_error_num} code={semantic_code}/>*/}
            {/*            </div>*/}
            {/*        </Grid>*/}
            {/*        <Grid xs={6}>*/}
            {/*            <Typography variant={"h5"}>*/}
            {/*                Number of bug per syntactic error type*/}
            {/*            </Typography>*/}
            {/*            <div id='barChartView2' style={{ backgroundColor: 'white', paddingTop: 10 }}>*/}
            {/*                <BarChart id='barChartView2' width={800} height={800} data={syntactic_error_num} code={syntactic_code}/>*/}
            {/*            </div>*/}
            {/*        </Grid>*/}
            {/*    </Grid>*/}
            {/*</Box>*/}
            <Box m={2} >
                {props.displayEachModel ?
                    ( selectedModels.length > 0 ?
                        <div>
                            <Typography variant={"h5"}>
                                Distribution of semantic characteristics of code generation errors
                            </Typography>
                            <div style={{display: 'flex', flexFlow: 'wrap', alignItems: 'center'}}>
                                {
                                    selectedModels.map((model => {
                                        return (
                                            <BarChart dataset={getPerModelError(semantic_data_filtered, 'Semantic Error ID', model, semantic_code)}
                                                      yAxis={[{ scaleType: 'band', dataKey: 'error', valueFormatter:  (value) => value.slice(4) }]}
                                                      series={[{ dataKey: 'frequency', label: 'Percentage', color: '#8D6E63', valueFormatter: (value) => `${Math.round(value*10000)/100}%` }]}
                                                      xAxis={[{ label: model, valueFormatter:  (value) => `${Math.round(value*10000)/100}%`}]}
                                                      layout="horizontal"
                                                      width={500}
                                                      height={400}
                                                      margin={{ left: 200, right: 0}}
                                            />
                                        )
                                    }))
                                }
                            </div>
                            <Typography variant={"h5"}>
                                Distribution of syntactic characteristics of code generation errors
                            </Typography>
                            <div style={{display: 'flex', flexFlow: 'wrap', alignItems: 'center'}}>
                                {
                                    selectedModels.map((model => {
                                        return (
                                            <BarChart dataset={getPerModelError(syntactic_data_filtered, 'Syntactic Error ID', model, syntactic_code)}
                                                      yAxis={[{ scaleType: 'band', dataKey: 'error', valueFormatter:  (value) => value.slice(4) }]}
                                                      series={[{ dataKey: 'frequency', label: 'Percentage', color: '#8D6E63', valueFormatter: (value) => `${Math.round(value*10000)/100}%` }]}
                                                      xAxis={[{ label: model, valueFormatter:  (value) => `${Math.round(value*10000)/100}%`}]}
                                                      layout="horizontal"
                                                      width={500}
                                                      height={400}
                                                      margin={{ left: 200, right: 0}}
                                            />
                                        )
                                    }))
                                }
                            </div>
                        </div> : null ) :
                    (
                        selectedModels.length > 0 ?
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <Typography variant={"h5"}>
                                        Distribution of semantic characteristics of code generation errors
                                    </Typography>
                                    <BarChart dataset={semantic_error_num}
                                              yAxis={[{ scaleType: 'band', dataKey: 'error', valueFormatter:  (value) => value.slice(4) }]}
                                              series={[{ dataKey: 'frequency', label: 'Percentage', color: '#8D6E63', valueFormatter: (value) => `${Math.round(value*10000)/100}%` }]}
                                              xAxis={[{ label: 'All data', valueFormatter:  (value) => `${Math.round(value*10000)/100}%`}]}
                                              layout="horizontal"
                                              height={500}
                                              margin={{ left: 200}}
                                    />
                                </Grid>
                                <Grid xs={6}>
                                    <Typography variant={"h5"}>
                                        Distribution of syntactic characteristics of code generation errors
                                    </Typography>
                                    <BarChart dataset={syntactic_error_num}
                                              yAxis={[{ scaleType: 'band', dataKey: 'error', valueFormatter:  (value) => value.slice(4) }]}
                                              series={[{ dataKey: 'frequency', label: 'Percentage', color: '#8D6E63', valueFormatter: (value) => `${Math.round(value*10000)/100}%` }]}
                                              xAxis={[{ label: 'All data', valueFormatter:  (value) => `${Math.round(value*10000)/100}%`}]}
                                              layout="horizontal"
                                              height={500}
                                              margin={{ left: 200}}
                                    />
                                </Grid>
                            </Grid> : null
                    )
                }
            </Box>
        </div>
    );
}