import {useState} from "react";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {makeStyles} from "@material-ui/core/styles";
import {TournamentForm} from "./pages/create-new";
import AdminActions from "./admin-dir/admin-actions";
import UpdateTeams from "./admin-dir/update-teams";
import UpdateResults from "./admin-dir/update-results";
import TabPanel from "./tab-panel";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    tabPanelContainer: {
        marginTop: 10
    },
    appBarContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    }
}));

export default function Admin (props) {
    const {tournament, tournamentId, fixtures} = props;
    const styles = useStyles();
    const [value, setValue] = useState("actions");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper className={styles.root}>
            <AppBar position="sticky" color="default" className={styles.appBarContainer}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                >
                    <Tab label="actions" value="actions" />
                    <Tab label="Settings" value="settings"/>
                    <Tab label="Teams" value="teams"/>
                    <Tab label="Fixtures" value="fixtures"/>
                </Tabs>
            </AppBar>
            <TabPanel index="actions"
                      value={value}
            >
                <AdminActions tournament={tournament}
                              tournamentId={tournamentId}
                              setAdminPage={setValue}

                />
            </TabPanel>
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
                <UpdateTeams tournament={tournament}
                             tournamentId={tournamentId}
                />
            </TabPanel>
            <TabPanel value={value}
                      index="fixtures"
            >
                <UpdateResults fixtures={fixtures}
                               tournament={tournament}
                               tournamentId={tournamentId}
                />
            </TabPanel>
        </Paper>
    );
}

