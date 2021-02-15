import React, {useState} from "react";
import Paper from "@material-ui/core/Paper";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import PropTypes from "prop-types";
import {makeStyles} from "@material-ui/core/styles";
import {TournamentForm} from "./pages/create-new";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Slider from '@material-ui/core/Slider'
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import {fetchApi, basicFetch} from "../helpers/common";
import WaitForServer from "./loading";


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
    const {tournament, tournamentId} = props;
    const classes = useStyles();
    const [value, setValue] = React.useState("actions");

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
                Fixtures
            </TabPanel>
        </Paper>
    );
}

const useUpdateStyles = makeStyles((theme) => ({
    container: {
        padding: 20,
        justifyContent: "center",
    },
    teamSetContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'floralwhite'
    },
    root: {
        width: 250,
    },
    input: {
        width: 42,
    },
    allInput: {
        fontSize: 18
    },
    error: {
        color: 'red',
        fontSize: '1.2em',
        margin: "auto",
        textAlign: "center"
    },
    submit: {
        // marginLeft: 100,
        marginTop: 10,
        // marginRight: 100,
        height: 60,
        // width: 500,
        fontSize: 19
    },
    nameFieldsContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center"
    }
}));

function UpdateTeams (props) {
    const {tournament, tournamentId} = props;
    const styles = useUpdateStyles();
    const [loading, setLoading] = useState(false);
    const tournamentTeams = tournament.teams.length;
    const [numberOfTeams, setNumberOfTeams] = useState(tournamentTeams || 4);
    const [disableNumberChange, setDisableChange] = useState(tournament.teams.length !== 0);
    const fixturesGenerated = tournament.hasLeagueFixturesGenerated || !!tournament.currentRound;
    let defaultValues = {}
    tournament.teams.forEach((team, index) => {
        defaultValues[`teamName${index}`] = team.teamName;
        defaultValues[`playerName${index}`] = team.playerName;
    });
    const [values, setValues] = useState(defaultValues);

    const handleNames = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setValues(prevState => ({...prevState, [name]: value}));
    }

    const handleSliderChange = (event, newValue) => {
        setNumberOfTeams(newValue);
    };

    const handleInputChange = (event) => {
        setNumberOfTeams(event.target.value === '' ? '' : Number(event.target.value));
    };
    const handleApplyAndEnableButton = () => {
        setDisableChange(prevState => {
            if (prevState) {
                if (!window.confirm(
                    'Changing this will clear unsaved values. ' +
                    'Do you want to continue?')) {
                    return prevState
                }
            } else return !prevState;
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let teamNames = [];
        let playerNames = [];
        for (let i=0; i<numberOfTeams; i++) {
            teamNames.push(values[`teamName${i}`]);
            playerNames.push(values[`playerName${i}`]);
        }
        const nameValues = {teamNames, playerNames};
        basicFetch(`tournament/${tournamentId}/teams`, 'post', nameValues, setLoading, true, true);
    }
    const handleBlur = () => {
        if (numberOfTeams < 4) {
            setNumberOfTeams(4);
        } else if (numberOfTeams > 30) {
            setNumberOfTeams(30);
        }
    };
    return (
        <Grid container spacing={2} className={styles.container}>
            <WaitForServer wait={loading} />
            <Grid item xs={4}>
                <Typography>Number of Teams</Typography>
            </Grid>
            <Grid item xs={2}>
                <Input
                    className={styles.input}
                    value={numberOfTeams}
                    margin="dense"
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    inputProps={{
                        step: 1,
                        min: 4,
                        max: 30,
                        type: 'number',
                        'aria-labelledby': 'input-slider',
                        className: styles.allInput,
                        disabled: disableNumberChange
                    }}
                />
            </Grid>
            <Grid item xs={3}>
                <Slider
                    value={typeof numberOfTeams === 'number' ? numberOfTeams : 0}
                    min={4}
                    max={30}
                    onChange={handleSliderChange}
                    aria-labelledby="input-slider"
                    disabled={disableNumberChange}
                />
            </Grid>
            <Grid item xs={3}>
                <Button color="primary"
                        variant="outlined"
                        onClick={handleApplyAndEnableButton}
                        disabled={fixturesGenerated}
                >
                    {disableNumberChange ? "Enable Sliders" : "Apply"}
                </Button>
            </Grid>
            <Grid item className={styles.error}>
                {
                    fixturesGenerated &&
                    <Typography>
                        You can only change the player names as this tournament is already in progress.
                        <br />
                        <br />
                        In order to update the team names, reset the tournament's fixtures.
                    </Typography>
                }
            </Grid>
            <form className={styles.nameFieldsContainer}
                  onSubmit={handleSubmit}
            >
                {
                    !!disableNumberChange &&
                    new Array(numberOfTeams).fill(null).map((team, index) => (
                        <TeamPlayerName
                            key={index}
                            index={index}
                            values={values}
                            onChange={handleNames}
                            disabled={!disableNumberChange}
                            disableTeamNames={fixturesGenerated}
                        />
                    ))
                }
                {
                    !!disableNumberChange &&
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={styles.submit}
                        onClick={handleSubmit}
                        fullWidth={true}
                    >
                        Save
                    </Button>
                }
            </form>

        </Grid>
    )
}

function TeamPlayerName (props) {
    const styles = useUpdateStyles();
    const {index, disabled, disableTeamNames, values, onChange} = props;
    const teamNameInput = `teamName${index}`;
    const playerNameInput = `playerName${index}`;
    const isTeamNameUndefined = typeof values[teamNameInput] === 'undefined';
    const isPlayerNameUndefined = typeof values[playerNameInput] === 'undefined';
    return (
        <Paper className={styles.teamSetContainer}>
            {index+1}
            <Grid container spacing={2} >
                <Grid item xs={12} sm={6}>
                    <TextField
                        autoComplete="team name"
                        name={teamNameInput}
                        variant="outlined"
                        required
                        fullWidth
                        id={teamNameInput}
                        label="Team Name"
                        inputProps={{className: styles.allInput}}
                        disabled={disabled || disableTeamNames}
                        value={ isTeamNameUndefined ? "" :
                            values[teamNameInput]
                        }
                        onChange={onChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        variant="outlined"
                        fullWidth
                        id={playerNameInput}
                        label="Player Name"
                        name={playerNameInput}
                        autoComplete="player name"
                        inputProps={{className: styles.allInput, disabled: disabled}}
                        value={ isPlayerNameUndefined ? "" :
                            values[playerNameInput]
                        }
                        onChange={onChange}
                    />
                </Grid>
            </Grid>
        </Paper>

    )
}

const useAdminActionsStyle = makeStyles((theme) => ({
    container: {
        display: "flex",
        flexDirection: "column",
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    error: {
        color: 'red',
        fontSize: '1.2em',
        margin: "auto",
        textAlign: "center"
    },
    actionSet: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        marginTop: 10,
        marginBottom: 10,
        paddingTop: 10,
        paddingBottom: 10,
        paddingRight: 5,
        backgroundColor: "wheat"
    },
    submit: {
        margin: 15,
        height: "fit-content",
        width: "fit-content",
        padding: "10px 30px",
        fontSize: 19,
        flex: 0.3
    },
    moreInfo: {
        flex: 0.7
    }

}));

function AdminActions (props) {
    const {setAdminPage, tournamentId} = props;
    const [loading, setLoading] = useState(false);
    const handleGenerateLeagueFixtures = () => {
        basicFetch(`tournament/${tournamentId}/leagueFixtures`, 'post',{}, setLoading, true, true);
    }
    const handleResetAllFixtures = () => {
        basicFetch(`tournament/${tournamentId}/resetAllFixtures`, 'delete', {}, setLoading, true, true);
    }
    const handleAdminNavigation = (newPage) => {
        return () => setAdminPage(newPage);
    }
    const styles = useAdminActionsStyle();
    return (
        <Container className={styles.container}>
            <WaitForServer wait={loading} />
            <Paper className={styles.actionSet}>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    className={styles.submit}
                    onClick={handleGenerateLeagueFixtures}
                    fullWidth={true}
                >
                    <Typography className={styles.actionButtonLabel}>
                        Generate League Fixtures
                    </Typography>
                </Button>
                <Typography className={styles.moreInfo}>
                    Create fixtures for all teams.
                    <br />
                    All teams are required to have a name before fixtures can be generated.
                    <br />
                    If tournament is using two legs, each encounter will have a home and away match.
                    <br />
                    You will be unable to change team names after performing this action.
                </Typography>
            </Paper>

            <Paper className={styles.actionSet}>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    className={styles.submit}
                    onClick={handleResetAllFixtures}
                    fullWidth={true}
                >
                    <Typography className={styles.actionButtonLabel}>
                        Reset All Fixtures
                    </Typography>
                </Button>
                <Typography className={styles.moreInfo}>
                    Clear all generated fixtures.
                </Typography>
            </Paper>

            <Paper className={styles.actionSet}>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    className={styles.submit}
                    onClick={handleAdminNavigation('settings')}
                    fullWidth={true}
                >
                    <Typography className={styles.actionButtonLabel}>
                        Change Tournament Settings
                    </Typography>
                </Button>
                <Typography className={styles.moreInfo}>
                    Modify tournament settings.
                    <br />
                    Some settings will be disabled if tournament is already in progress.
                </Typography>
            </Paper>
            <Paper className={styles.actionSet}>
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    className={styles.submit}
                    onClick={handleAdminNavigation('teams')}
                    fullWidth={true}
                >
                    <Typography className={styles.actionButtonLabel}>
                        Update Player and Team Names
                    </Typography>
                </Button>
                <Typography className={styles.moreInfo}>
                    Add teams and their owners (player names).
                    <br />
                    All teams are required to have a name for fixtures can be generated.
                </Typography>
            </Paper>

            {/*<Box className={styles.actionSet}>*/}
            {/*    <Button*/}
            {/*        type="button"*/}
            {/*        variant="contained"*/}
            {/*        color="secondary"*/}
            {/*        className={styles.submit}*/}
            {/*        onClick={undefined}*/}
            {/*        fullWidth={true}*/}
            {/*    >*/}
            {/*        Save*/}
            {/*    </Button>*/}
            {/*    <Typography className={styles.moreInfo}>*/}
            {/*        Show real club options when adding teams*/}
            {/*    </Typography>*/}
            {/*</Box>*/}

            {/*<Box className={styles.actionSet}>*/}
            {/*    <Button*/}
            {/*        type="button"*/}
            {/*        variant="contained"*/}
            {/*        color="secondary"*/}
            {/*        className={styles.submit}*/}
            {/*        onClick={undefined}*/}
            {/*        fullWidth={true}*/}
            {/*    >*/}
            {/*        Save*/}
            {/*    </Button>*/}
            {/*    <Typography className={styles.moreInfo}>*/}
            {/*        Show real club options when adding teams*/}
            {/*    </Typography>*/}
            {/*</Box>*/}

            {/*<Box className={styles.actionSet}>*/}
            {/*    <Button*/}
            {/*        type="button"*/}
            {/*        variant="contained"*/}
            {/*        color="secondary"*/}
            {/*        className={styles.submit}*/}
            {/*        onClick={undefined}*/}
            {/*        fullWidth={true}*/}
            {/*    >*/}
            {/*        Save*/}
            {/*    </Button>*/}
            {/*    <Typography className={styles.moreInfo}>*/}
            {/*        Show real club options when adding teams*/}
            {/*    </Typography>*/}
            {/*</Box>*/}
        </Container>
    )
}