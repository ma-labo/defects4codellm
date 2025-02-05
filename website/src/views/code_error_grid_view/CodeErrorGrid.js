import React from "react";
import {createElement} from "react-syntax-highlighter";
import {
    DataGrid,
    GridColDef,
    GridToolbarContainer,
    GridToolbarFilterButton,
    gridFilteredSortedRowIdsSelector,
    useGridApiContext,
    GridCsvExportMenuItem,
    GridToolbarExportContainer
} from '@mui/x-data-grid';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Grid,
    IconButton,
    MenuItem
} from "@mui/material";
import {styled} from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

import SyntaxHighlighter from 'react-syntax-highlighter';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import {GridApi} from "@mui/x-data-grid";
import {GridExportMenuItemProps} from "@mui/x-data-grid";
import {gridColumnFieldsSelector} from "@mui/x-data-grid/hooks/features/columns/gridColumnsSelector";


const getJson = (apiRef: React.MutableRefObject<GridApi>) => {
    // Select rows and columns
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridColumnFieldsSelector(apiRef);

    // Format the data. Here we only keep the value
    const data = filteredSortedRowIds.map((id) => {
        const row: Record<string, any> = {};
        visibleColumnsField.forEach((field) => {
            row[field] = apiRef.current.getCellParams(id, field).value;
        });
        return row;
    });

    // Stringify with some indentation
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#parameters
    return JSON.stringify(data, null, 2);
};

const exportBlob = (blob: Blob, filename: string) => {
    // Save the blob in a json file
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
        URL.revokeObjectURL(url);
    });
};

function JsonExportMenuItem(props: GridExportMenuItemProps<{}>) {
    const apiRef = useGridApiContext();

    const { hideMenu } = props;

    return (
        <MenuItem
            onClick={() => {
                const jsonString = getJson(apiRef);
                const blob = new Blob([jsonString], {
                    type: 'text/json',
                });
                exportBlob(blob, 'LLM_code_error.json');

                // Hide the export menu after the export
                hideMenu?.();
            }}
        >
            Export JSON
        </MenuItem>
    );
}


function CustomToolbar() {
    return (
        <GridToolbarContainer>
            <GridToolbarFilterButton />
            <GridToolbarExportContainer>
                <GridCsvExportMenuItem options={{ allColumns: true }} />
                <JsonExportMenuItem />
            </GridToolbarExportContainer>
        </GridToolbarContainer>
    );
}


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

const wrapLineRenderer = ({ rows, stylesheet, useInlineStyles}) => {
    return rows.map((row, index) => {
        const children = row.children;
        const lineNumberElement = children?.shift();

        /**
         * We will take current structure of the rows and rebuild it
         * according to the suggestion here https://github.com/react-syntax-highlighter/react-syntax-highlighter/issues/376#issuecomment-1246115899
         */
        if (lineNumberElement) {
            row.children = [
                lineNumberElement,
                {
                    children,
                    properties: {
                        className: [],
                    },
                    tagName: 'span',
                    type: 'element',
                },
            ];
        }

        return createElement({
            node: row,
            stylesheet,
            useInlineStyles,
            key: index,
        });
    });
}

function printArr(arr) {
    return '[' + arr.map(element =>
        Array.isArray(element) ? printArr(element) : element
    ).join(', ') + ']';
}


export default function CodeErrorGrid(props) {
    const semantic_code = props.semanticCode
    const syntactic_code = props.syntacticCode

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'Error ID', width: 90 },
        {
            field: 'model',
            headerName: 'Model',
            width: 150,
            sortable: false
        },
        {
            field: 'Task ID',
            headerName: 'Task ID',
            width: 100,
        },
        {
            field: 'Incorrect Code',
            headerName: 'Incorrect Code',
            width: 200,
            sortable: false,
            disableExport: true
        },
        {
            field: 'Correct Code',
            headerName: 'Correct Code',
            width: 200,
            sortable: false,
            disableExport: true
        },
        // {
        //     field: "Are the correct and incorrect answers similar",
        //     headerName: 'Similar?',
        //     width: 100,
        //     sortable: false
        // },
        {
            field: 'Semantic Error ID',
            headerName: 'Semantic Characteristics',
            width: 300,
            valueFormatter: (params) =>
                params.value + " " + semantic_code[params.value],
            sortable: false
        },
        {
            field: 'Syntactic Error ID',
            headerName: 'Syntactic Characteristics',
            width: 300,
            valueFormatter: (params) =>
                params.value + " " + syntactic_code[params.value],
            sortable: false
        },
        {
            field: 'Incorrect Code (Complete)',
            headerName: 'Incorrect Code (Complete)',
            valueGetter: (params) => {
                return props.codeData[params.row['model']][params.row['Task ID']]
            },
            filterable: false
        },
        {
            field: 'Ground Truth Code (Complete)',
            headerName: 'Ground Truth Code (Complete)',
            valueGetter: (params) => {
                return props.codeData["Ground-truth"][params.row['Task ID']]
            },
            filterable: false
        }
    ];

    const [open, setOpen] = React.useState(false);

    const [dialogData, setDialogData] = React.useState(null);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const handlePrevError = () => {
        const prevId = data_filtered.findIndex(item => item.id === dialogData['id'])
        if (prevId > 0) {
            setDialogData(data_filtered[prevId - 1]);
        }
    }

    const handleNextError = () => {
        const nextId = data_filtered.findIndex(item => item.id === dialogData['id'])
        if (nextId < data_filtered.length - 1) {
            setDialogData(data_filtered[nextId + 1]);
        }
    }

    const data = props.data;
    const selectedModels = props.selectedModels;
    // filter model
    let data_filtered = data.filter((row) => {return selectedModels.includes(row['model'])})

    // filter semantic errors
    if (props.semanticFilter.length > 0) {
        const searchRegex = new RegExp('(' + props.semanticFilter.join('|') + ')', 'i');
        data_filtered = data_filtered.filter((row) => {return searchRegex.test(row['Semantic Error ID'])})
    }

    // filter syntactic errors
    if (props.syntacticFilter.length > 0) {
        const searchRegex = new RegExp('(' + props.syntacticFilter.join('|') + ')', 'i');
        data_filtered = data_filtered.filter((row) => {return searchRegex.test(row['Syntactic Error ID'])})
    }

    return (
        <div>
            <Box p={4} sx={{ height: "100%", width: '100%' }}>
                <DataGrid
                    rows={data_filtered}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {
                                pageSize: 15,
                            },
                        },
                    }}
                    pageSizeOptions={[5, 10, 15, 25, 50]}
                    disableRowSelectionOnClick
                    onRowClick={(params, event)=> {
                        setDialogData(params.row)
                        handleClickOpen();
                        console.log(params.row)
                    }}
                    sx={{
                        // disable cell selection style
                        '.MuiDataGrid-cell:focus': {
                            outline: 'none'
                        },
                        // pointer cursor on ALL rows
                        '& .MuiDataGrid-row:hover': {
                            cursor: 'pointer'
                        }
                    }}
                    slots={{ toolbar: CustomToolbar }}
                    columnVisibilityModel={{'Incorrect Code (Complete)': false, 'Ground Truth Code (Complete)': false}}
                />
            </Box>
            {
                dialogData === null ? null :
                    <BootstrapDialog
                        onClose={handleClose}
                        open={open}
                        fullWidth={true}
                        maxWidth={"xl"}
                    >
                        <DialogTitle sx={{ m: 0, p: 2 }}>
                            {"Error ID: " + dialogData['id'] + " | HumanEval Task ID: " + dialogData['Task ID'] + " | Model: " + dialogData['model']}
                            <Box>
                                <Button variant="text" startIcon={<KeyboardArrowLeftIcon />} onClick={handlePrevError}>Prev</Button>|
                                <Button variant="text" endIcon={<KeyboardArrowRightIcon />} onClick={handleNextError}>Next</Button>
                            </Box>
                        </DialogTitle>
                        <IconButton
                            aria-label="close"
                            onClick={handleClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <CloseIcon />
                        </IconButton>
                        <DialogContent dividers>
                            <Box mb={0.5}>
                                <Typography variant="h6" color="inherit">
                                    Semantic Error
                                </Typography>
                            </Box>
                            <Box mb={0.5}>
                                <Typography variant="h7" color="secondary">
                                    {dialogData['Semantic Error ID'] + " " + semantic_code[dialogData['Semantic Error ID']]}
                                </Typography>
                            </Box>
                            <Box mb={0.5}>
                                <Typography variant="h6" color="inherit">
                                    Syntactic Error
                                </Typography>
                            </Box>
                            <Box mb={0.5}>
                                <Typography variant="h7" color="secondary">
                                    {dialogData['Syntactic Error ID'] + " " + syntactic_code[dialogData['Syntactic Error ID']]}
                                </Typography>
                            </Box>
                            <Divider/>
                            <Grid container spacing={0} sx={{ flexGrow: 1 }}>
                                <Grid xs={6}>
                                    <Box p={2} mt={2} mb={2}>
                                        <Typography variant="h6" color="inherit">
                                            LLM Generated Code
                                        </Typography>
                                        <SyntaxHighlighter language="python" style={github}
                                                           showLineNumbers={true} wrapLines={true}
                                                           wrapLongLines={true}
                                                           renderer={wrapLineRenderer}
                                                           lineProps={(lineNumber) => {
                                                               const style: any = { display: "block", width: "fit-content" };
                                                               if (dialogData['highlight_llm'].split(",").map(function(item) {
                                                                   return parseInt(item, 10);
                                                               }).includes(lineNumber)) {
                                                                   style.backgroundColor = "#FFDB81";
                                                               }
                                                               return { style };
                                                           }}
                                        >
                                            {props.codeData[dialogData['model']][dialogData['Task ID']]}
                                        </SyntaxHighlighter>
                                    </Box>
                                </Grid>
                                <Grid xs={6}>
                                    <Box p={2} mt={2} mb={2}>
                                        <Typography variant="h6" color="inherit">
                                            Ground Truth Code
                                        </Typography>
                                        <SyntaxHighlighter language="python" style={github}
                                                           showLineNumbers={true} wrapLines={true}
                                                           wrapLongLines={true}
                                                           renderer={wrapLineRenderer}
                                                           lineProps={(lineNumber) => {
                                                               const style: any = { wordBreak: "break-word", whiteSpace: "pre-wrap" };
                                                               if (dialogData['highlight_gt'].split(",").map(function(item) {
                                                                   return parseInt(item, 10);
                                                               }).includes(lineNumber)) {
                                                                   style.backgroundColor = "#FFDB81";
                                                               }
                                                               return { style };
                                                           }}
                                        >
                                            {props.codeData["Ground-truth"][dialogData['Task ID']]}
                                        </SyntaxHighlighter>
                                    </Box>
                                </Grid>
                            </Grid>
                            <Divider/>
                            <Box mt={1} mb={0.5}>
                                <Typography variant="h6" color="inherit">
                                    Failing Test
                                </Typography>
                            </Box>
                            <Box mb={0.5}>
                                <Typography variant="h7" color="secondary">
                                    HumanEval
                                </Typography>
                            </Box>
                            <Box mb={0.5}>
                                <div style={{display: 'flex', flexFlow: 'wrap', columnGap: '10px'}}>
                                    {props.testResult[dialogData['model']][dialogData['Task ID']]['base'].length > 0 ?
                                        props.testResult[dialogData['model']][dialogData['Task ID']]['base'].map((test) => {
                                        return (
                                            <code>
                                                {printArr(props.testCase[dialogData['Task ID']]['base_input'][test])}
                                            </code>
                                        )
                                        }) :
                                        (
                                            props.testResult[dialogData['model']][dialogData['Task ID']]['plus'].length > 0 ?
                                                <code>
                                                    None
                                                </code> :
                                                <code>
                                                    Incomplete code / Unparsable
                                                </code>
                                        )
                                    }
                                </div>
                            </Box>
                            {
                                props.showEvalPlus ?
                                    <div>
                                        <Box mb={0.5}>
                                            <Typography variant="h7" color="secondary">
                                                HumanEvalPlus
                                            </Typography>
                                        </Box>
                                        <Box mb={0.5}>
                                            <div style={{display: 'flex', flexFlow: 'wrap', columnGap: '10px'}}>
                                                {props.testResult[dialogData['model']][dialogData['Task ID']]['plus'].length > 0 ?
                                                    props.testResult[dialogData['model']][dialogData['Task ID']]['plus'].slice(0, 10).map((test) => {
                                                        return (
                                                            <code>
                                                                {printArr(props.testCase[dialogData['Task ID']]['plus_input'][test])}
                                                            </code>
                                                        )
                                                    }) :
                                                    <code>
                                                        None
                                                    </code>
                                                }
                                            </div>
                                        </Box>
                                    </div>:
                                    null
                            }
                        </DialogContent>
                        <DialogActions>
                            <Button autoFocus onClick={handleClose}>
                                OK
                            </Button>
                        </DialogActions>
                    </BootstrapDialog>
            }
        </div>
    );
}