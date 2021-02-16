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
            <AppBar position="sticky" color="default" >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    centered
                    variant="fullWidth"
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
            <Grid item xs={3}>
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
            <Grid item xs={4}>
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
        flexWrap: "wrap",
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
    resetContainer: {
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        width: '100%'
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
    },
    confirmActionInput: {
        flex: 0.7,
        marginRight: 20
    },
    actionButtonLabel: {
        fontSize: 15
    }

}));

function AdminActions (props) {
    const {setAdminPage, tournamentId, tournament} = props;
    const [loading, setLoading] = useState(false);
    const [isResettingFixtures, setResettingFixtures] = useState(false);
    const [isResettingRound, setResettingRound] = useState(false);
    const [isDeleting, setDeleting] = useState(false);

    const handleGenerateLeagueFixtures = () => {
        const onSuccess = () => window.location.href = `tournament/${tournamentId}/fixtures`
        const url = `tournament/${tournamentId}/leagueFixtures`;
        basicFetch(url, 'post',{}, setLoading, false, true, onSuccess);
    }
    const handleGenerateKnockoutFixtures = () => {
        const onSuccess = () => window.location.href = `tournament/${tournamentId}/fixtures`;
        const url = `tournament/${tournamentId}/knockoutFixtures`;
        basicFetch(url, 'post',{}, setLoading, false, true, onSuccess);
    }
    const toggleResetForm = () => {
        setResettingFixtures(prevState => !prevState);
    }
    const handleResetAllFixtures = () => {
        const reset = ['reset', 'Reset', 'RESET'];
        if (!reset.includes(document.getElementById('confirmReset').value )) {
            return alert("Type 'reset' to complete this action");
        }
        const url = `tournament/${tournamentId}/resetAllFixtures`;
        basicFetch(url, 'delete', {}, setLoading, true, true);
    }
    const toggleResetRound = () => {
        setResettingRound(prevState => !prevState);
    }
    const handleResetRound = () => {
        const reset = ['round', 'Round', 'ROUND'];
        if (!reset.includes(document.getElementById('confirmResetRound').value )) {
            return alert("Type 'round' to complete this action");
        }
        const url = `tournament/${tournamentId}/resetRound?round=${tournament.currentRound}`;
        basicFetch(url, 'delete', {}, setLoading, true, true);
    }
    const toggleDelete = () => {
        setDeleting(prevState => !prevState);
    }
    const handleDelete = () => {
        const allowedValues = ['delete', 'Delete', 'DELETE'];
        if (!allowedValues.includes(document.getElementById('confirmDelete').value)) {
            return alert("Type 'delete' to complete this action");
        }
        const url = `tournament/${tournamentId}`
        const onSuccess = () => window.location.href = "/";
        basicFetch(url, 'delete', {}, setLoading, false, true, onSuccess);
    }
    const handleAdminNavigation = (newPage) => {
        return () => setAdminPage(newPage);
    }
    const styles = useAdminActionsStyle();
    return (
        <Container className={styles.container}>
            <WaitForServer wait={loading} />
            <ActionSet primaryButtonText={"Change Tournament Settings"}
                       onClickPrimary={handleAdminNavigation('settings')}
                       useSecondary={false}
                       moreInfoComponent={<Typography className={styles.moreInfo}>
                           Modify tournament settings.
                           <br />
                           <br />
                           Some settings will be disabled if tournament is already in progress.
                       </Typography>}
            />
            <ActionSet primaryButtonText={"Update Team/Player Names"}
                       onClickPrimary={handleAdminNavigation('teams')}
                       useSecondary={false}
                       moreInfoComponent={<Typography className={styles.moreInfo}>
                           Add teams and their owners (player names).
                           <br />
                           <br />
                           All teams are required to have a name for fixtures can be generated.
                       </Typography>}
            />
            {
                tournament.isKnockout &&
                    <>
                        <ActionSet primaryButtonText={"Generate next knockout round fixtures"}
                                   onClickPrimary={handleGenerateKnockoutFixtures}
                                   useSecondary={false}
                                   disabled={!tournament.isKnockout || !!tournament.currentRound}
                                   moreInfoComponent={<Typography className={styles.moreInfo}>
                                       Create fixtures for the next round using the existing teams or winners from the last round.
                                       <br />
                                       <br />
                                       All teams are required to have a name before fixtures can be generated.
                                       <br />
                                       You will be unable to change team names after performing this action.
                                   </Typography>}
                        />
                        {/*RESETTING CURRENT ROUND*/}
                        <ActionSet primaryButtonText={"Reset Current Round"}
                                   secondaryButtonText={"Confirm Reset"}
                                   onClickPrimary={toggleResetRound}
                                   onClickSecondary={handleResetRound}
                                   color={"secondary"}
                                   useSecondary={isResettingRound}
                                   disabled={!tournament.isKnockout || !tournament.currentRound}
                                   inputId={"confirmResetRound"}
                                   inputLabel={"Type 'round' to confirm this action"}
                                   moreInfoComponent={<Typography className={styles.moreInfo}>
                                       Clear current round fixtures and go back to previous round.
                                   </Typography>}
                        />
                    </>
            }
            {
                !tournament.isKnockout &&
                <ActionSet primaryButtonText={"Generate League Fixtures"}
                           onClickPrimary={handleGenerateLeagueFixtures}
                           useSecondary={false}
                           disabled={tournament.isKnockout || tournament.hasLeagueFixturesGenerated}
                           moreInfoComponent={<Typography className={styles.moreInfo}>
                               Create league fixtures for all teams.
                               <br />
                               <br />
                               All teams are required to have a name before fixtures can be generated.
                               <br />
                               You will be unable to change team names after performing this action.
                           </Typography>}
                />
            }

            {/*RESETTING ALL FIXTURES*/}
            <ActionSet primaryButtonText={"Reset All Fixtures"}
                       secondaryButtonText={"Confirm Reset"}
                       onClickPrimary={toggleResetForm}
                       onClickSecondary={handleResetAllFixtures}
                       color={"secondary"}
                       useSecondary={isResettingFixtures}
                       disabled={!tournament.hasLeagueFixturesGenerated && !tournament.currentRound}
                       inputId={"confirmReset"}
                       inputLabel={"Type 'reset' to confirm this action"}
                       moreInfoComponent={<Typography className={styles.moreInfo}>
                           Clear all generated fixtures.
                       </Typography>}
            />
            {/*DELETING TOURNAMENT*/}
            <ActionSet primaryButtonText={"Delete Tournament"}
                       secondaryButtonText={"Confirm Delete"}
                       onClickPrimary={toggleDelete}
                       onClickSecondary={handleDelete}
                       color={"secondary"}
                       useSecondary={isDeleting}
                       inputId={"confirmDelete"}
                       inputLabel={"Type 'delete' to confirm this action"}
                       moreInfoComponent={<Typography className={styles.moreInfo}>
                           Delete tournament and data associated with it.
                       </Typography>}
            />
        </Container>
    )
}
function ActionSet (props) {
    const styles = useAdminActionsStyle();
    const {onClickPrimary, disabled, primaryButtonText, moreInfoComponent,
            useSecondary, onClickSecondary, secondaryButtonText,
            inputName, inputId, inputLabel, color} = props;
    return (
        <Paper className={styles.actionSet}>
            <div className={styles.resetContainer}>
                <Button
                    type="button"
                    variant="contained"
                    color={color || "primary"}
                    className={styles.submit}
                    onClick={onClickPrimary}
                    fullWidth={true}
                    disabled={disabled}
                >
                    <Typography className={styles.actionButtonLabel}>
                        {primaryButtonText}
                    </Typography>
                </Button>
                {moreInfoComponent}
            </div>
            {
                useSecondary &&
                <div className={styles.resetContainer}>
                    <Button
                        type="button"
                        variant="contained"
                        color={"primary"}
                        className={styles.submit}
                        onClick={onClickSecondary}
                        fullWidth={true}
                    >
                        <Typography className={styles.actionButtonLabel}>
                            {secondaryButtonText}
                        </Typography>
                    </Button>
                    <TextField
                        autoComplete="confirm reset round"
                        name={inputName}
                        variant="outlined"
                        required
                        fullWidth
                        id={inputId}
                        label={inputLabel}
                        // inputProps={{}}
                        className={styles.confirmActionInput}
                        // value={}
                        // onChange={onChange}
                    />
                </div>
            }
        </Paper>
    )
}