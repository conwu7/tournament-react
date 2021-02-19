import {makeStyles} from "@material-ui/core/styles";
import React, {useState} from "react";
import {basicFetch} from "../../helpers/common";
import Grid from "@material-ui/core/Grid";
import WaitForServer from "../loading";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import {IconButton} from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import InputAdornment from '@material-ui/core/InputAdornment';
import TeamSearch from "./team-search";

const useUpdateStyles = makeStyles(() => ({
    container: {
        padding: 20,
        justifyContent: "center",
    },
    teamSetContainer: {
        padding: 10,
        margin: 10,
        backgroundColor: 'floralwhite',
        width: "45%",
        minWidth: 300
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
    },
    teamNameForm: {
        width: "100%",
        margin: 0,
        padding: 0,
        border: "none"
    }
}));

export default function UpdateTeams (props) {
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
        defaultValues[`teamLogo${index}`] = team.teamLogo;
        defaultValues[`playerName${index}`] = team.playerName;
    });
    const [values, setValues] = useState(defaultValues);

    const handleValueChange = (e) => {
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
        let teamLogos = [];
        let playerNames = [];
        for (let i=0; i<numberOfTeams; i++) {
            teamNames.push(values[`teamName${i}`]);
            teamLogos.push(values[`teamLogo${i}`]);
            playerNames.push(values[`playerName${i}`]);
        }
        const teamDetails = {teamNames, teamLogos, playerNames};
        basicFetch(`tournament/${tournamentId}/teams`, 'post', teamDetails, setLoading, true, true);
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
            <div className={styles.nameFieldsContainer}>
                {
                    !!disableNumberChange &&
                    new Array(numberOfTeams).fill(null).map((team, index) => (
                        <TeamPlayerName
                            key={index}
                            index={index}
                            values={values}
                            onChange={handleValueChange}
                            disabled={!disableNumberChange}
                            disableTeamNames={fixturesGenerated}
                            useRealTeams={tournament.useRealTeams}
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
            </div>

        </Grid>
    )
}

function TeamPlayerName (props) {
    const styles = useUpdateStyles();
    const {index, disabled, disableTeamNames, values, onChange, useRealTeams} = props;
    const teamNameInput = `teamName${index}`;
    const teamLogoInput = `teamLogo${index}`;
    const playerNameInput = `playerName${index}`;

    const [isSearching, setSearching] = useState(false);

    const handleOpenSearch = (e) => {
        if (e) e.preventDefault();
        if (!useRealTeams) return
        setSearching(true);
    }
    const handleCloseSearch = () => {
        setSearching(false);
    }
    const handleSelectedTeam = (inputName, logoInputName, teamName, teamLogo) => {
        const teamNameEvent = {
            target: {
                name: inputName,
                value: teamName
            }
        };
        const teamLogoEvent = {
            target: {
                name: logoInputName,
                value: teamLogo
            }
        }
        onChange(teamNameEvent);
        if (teamLogo) {
            onChange(teamLogoEvent);
        }
    }

    return (
        <Paper className={styles.teamSetContainer}>
            <TeamSearch useActivity={isSearching}
                        handleClose={handleCloseSearch}
                        inputName={teamNameInput}
                        logoInputName={teamLogoInput}
                        handleSelectedTeam={handleSelectedTeam}
            />
            {index+1}
            <Grid container spacing={2} >
                <Grid item xs={12} sm={6}>
                    <form onSubmit={handleOpenSearch}
                          className={styles.teamNameForm}
                    >
                        <TextField
                            autoComplete="team name"
                            name={teamNameInput}
                            variant="outlined"
                            required
                            fullWidth
                            id={teamNameInput}
                            label="Team Name"
                            onSubmit={handleOpenSearch}
                            inputProps={{
                                className: styles.allInput,
                            }}
                            InputProps={{
                                endAdornment: useRealTeams? (
                                    <InputAdornment position="end">
                                        <IconButton onClick={handleOpenSearch}
                                                    disabled={disabled || disableTeamNames}
                                        >
                                            <SearchOutlinedIcon />
                                        </IconButton>
                                    </InputAdornment>
                                ) : undefined
                            }}
                            disabled={disabled || disableTeamNames}
                            value={values[teamNameInput] || ""}
                            onChange={onChange}
                        />
                    </form>
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
                        value={values[playerNameInput] || ""}
                        onChange={onChange}
                    />
                </Grid>
            </Grid>
        </Paper>

    )
}