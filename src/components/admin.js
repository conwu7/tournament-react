import React from "react";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
// import Box from "@material-ui/core/Box";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {TournamentForm} from "./pages/create-new";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`scrollable-force-tabpanel-${index}`}
            aria-labelledby={`scrollable-force-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

// function a11yProps(index) {
//     return {
//         id: `scrollable-force-tab-${index}`,
//         'aria-controls': `scrollable-force-tabpanel-${index}`,
//     };
// }

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    tabPanelContainer: {
        marginTop: 10
    }
}));

export default function Admin (props) {
    const {teams, tournament} = props;
    const classes = useStyles();
    const [value, setValue] = React.useState("settings");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper className={classes.root}>
            <AppBar position="static" color="default">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                >
                    <Tab label="Settings" value="settings"/>
                    <Tab label="Teams" value="teams"/>
                    <Tab label="Fixtures" value="fixtures"/>
                </Tabs>
            </AppBar>
            <TabPanel value={value}
                      index="settings"
                      >
                {
                    tournament.name &&
                    <TournamentForm isCreating={false}
                                    tournament={tournament}
                    />
                }
            </TabPanel>
            <TabPanel value={value}
                      index="teams"
            >
                Teams
            </TabPanel>
            <TabPanel value={value}
                      index="fixtures"
            >
                Fixtures
            </TabPanel>
        </Paper>
    );
}