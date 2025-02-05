import React from "react";

import Typography from "@mui/material/Typography";
import {Checkbox, Collapse, List, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {ExpandLess, ExpandMore} from "@mui/icons-material";
import SearchIcon from '@mui/icons-material/Search';

export default function ErrorTab(props) {
    const taxonomy = props.taxonomy

    const semantic_code = props.semanticCode
    const syntactic_code = props.syntacticCode

    const [semanticOpen, setSemanticOpen] = React.useState({})

    const handleSemanticClick = (value) => {
        let tmp = {...semanticOpen}
        tmp[value] = semanticOpen[value] !== true;
        console.log(tmp)
        setSemanticOpen(tmp)
    }

    const [semanticChecked, setSemanticChecked] = React.useState({})

    const handleSemanticToggle = (value) => {
        let tmp = {...semanticChecked}
        tmp[value] = semanticChecked[value] !== true;
        console.log(tmp)
        setSemanticChecked(tmp)
        props.semanticErrorFiltered(value)
    }

    const [syntacticOpen, setSyntacticOpen] = React.useState({})

    const handleSyntacticClick = (value) => {
        let tmp = {...syntacticOpen}
        tmp[value] = syntacticOpen[value] !== true;
        console.log(tmp)
        setSyntacticOpen(tmp)
    }

    const [syntacticChecked, setSyntacticChecked] = React.useState({})

    const handleSyntacticToggle = (value) => {
        let tmp = {...syntacticChecked}
        tmp[value] = syntacticChecked[value] !== true;
        console.log(tmp)
        setSyntacticChecked(tmp)
        props.syntacticErrorFiltered(value)
    }

    return (
        <div>
            <Typography variant="h6" color="primary">
                Semantic Characteristics
                <List>
                    {
                        Object.keys(taxonomy["Semantic Errors"]).map((error_type => {
                            return (
                                <div>
                                    <ListItemButton onClick={e => {handleSemanticClick(error_type)}}>
                                        <ListItemIcon>
                                            <SearchIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={error_type} sx={{color: "#212121"}}/>
                                        {semanticOpen[error_type] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={semanticOpen[error_type]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                taxonomy['Semantic Errors'][error_type].map((sub_error_type => {
                                                    return (
                                                        <ListItemButton role={undefined} onClick={e => {handleSemanticToggle(sub_error_type)}} dense>
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={semanticChecked[sub_error_type] === true}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={sub_error_type + " " + semantic_code[sub_error_type]} sx={{color: "#212121"}}/>
                                                        </ListItemButton>
                                                    )
                                                }))
                                            }
                                        </List>
                                    </Collapse>
                                </div>
                            )
                        }))
                    }
                </List>
            </Typography>
            <Typography variant="h6" color="primary">
                Syntactic Characteristics
                <List>
                    {
                        Object.keys(taxonomy["Syntactic Errors"]).map((error_type => {
                            return (
                                <div>
                                    <ListItemButton onClick={e => {handleSyntacticClick(error_type)}}>
                                        <ListItemIcon>
                                            <SearchIcon />
                                        </ListItemIcon>
                                        <ListItemText primary={error_type} sx={{color: "#212121"}}/>
                                        {syntacticOpen[error_type] ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={syntacticOpen[error_type]} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            {
                                                taxonomy['Syntactic Errors'][error_type].map((sub_error_type => {
                                                    return (
                                                        <ListItemButton role={undefined} onClick={e => {handleSyntacticToggle(sub_error_type)}} dense>
                                                            <ListItemIcon>
                                                                <Checkbox
                                                                    edge="start"
                                                                    checked={syntacticChecked[sub_error_type] === true}
                                                                    tabIndex={-1}
                                                                    disableRipple
                                                                />
                                                            </ListItemIcon>
                                                            <ListItemText primary={sub_error_type + " " + syntactic_code[sub_error_type]} sx={{color: "#212121"}}/>
                                                        </ListItemButton>
                                                    )
                                                }))
                                            }
                                        </List>
                                    </Collapse>
                                </div>
                            )
                        }))
                    }
                </List>
            </Typography>
        </div>
    )
}