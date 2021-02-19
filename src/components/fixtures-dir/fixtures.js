import React, {useState, useEffect} from "react";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import {basicFetch} from "../../helpers/common";
import WaitForServer from "../loading";
import SportsSoccerOutlinedIcon from "@material-ui/icons/SportsSoccerOutlined";
import Avatar from "@material-ui/core/Avatar";

const useResults = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    resultsContainer: {
        paddingTop: 15,
        paddingLeft: 5,
        paddingRight: 5,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    resultSet: {
        minWidth: "40%",
        marginBottom: 15,
        backgroundColor: "whitesmoke"
    },
    resultBox: {
        display: "flex",
        minHeight: 45,
        padding: "10px 0",
        justifyContent: "center",
        alignItems: "center"
    },
    tieBreaker: {
        backgroundColor: "pink",
    },
    tieBreakerText: {
        textAlign: "center",
        fontWeight: "bold",
        color: "purple"
    },
    goals: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: 40,
        width: 40,
        marginLeft: 2,
        marginRight: 2,
        borderRadius: 4,
        backgroundColor: "#C71585",
        color: "whitesmoke",
        fontFamily: "'Rubik Mono One', sans-serif !important"
    },
    team: {
        width: 95,
        minWidth: 95,
        alignSelf: "center",
        fontWeight: "bold",
        fontSize: 15,
        wordBreak: "break-word",
        textAlign: "center"
    },
    homeTeam: {
        // textAlign: "right",
        paddingRight: 10
    },
    awayTeam: {
        // textAlign: "left",
        paddingLeft: 10
    },
    advanced: {
        color: "seagreen"
    },
    submit: {
        marginTop: 10,
        marginBottom: 20,
        width: "80%"
    },
    error: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: "1.2em",
        margin: "auto",
        textAlign: "center"
    },
    resultInput: {
        textAlign: "center",
        fontWeight: "bolder",
        backgroundColor: "white"
    },
    closed: {
        fontWeight: "bold"
    },
    teamBadge: {
        width: 25,
        height: 25,
        margin: "0 5px",
        '& svg, & path': {
            width: 20,
            height: 20
        }
    }
}));
function handleInputResults (updateFunc) {
    return (e) => {
        const name = e.target.name;
        const value = e.target.value;
        e.target.style.backgroundColor = "white";
        if (value !== "" && (isNaN(parseInt(value)) || parseFloat(value) % 1 !== 0)) {
            e.target.style.backgroundColor = "#f4c7c7";
            return
        }
        updateFunc(prevState => ({...prevState, [name]: value}));
    }
}
function getScoreString (score) {
    if (score === 0 || score === "0") return "0"
    if (!score) return ""
    return score;
}
function addResult(goalsFor, goalsAgainst, results) {
    if (isNaN(goalsFor) || isNaN(goalsAgainst)) results.push(null);
    else results.push([goalsFor, goalsAgainst]);
}
function addTieBreaker(goalsFor, goalsAgainst, results) {
    // don't do anything if tie breaker match isn't complete
    if (isNaN(goalsFor) || isNaN(goalsAgainst)) return;
    const homeResultArray = results[results.length -1];
    if (homeResultArray) {
        homeResultArray.push(goalsFor, goalsAgainst);
    }
}
// only integers or Nan is passed as value to this function
function isInvalidScore (inputName, value, opposingInputId) {
    if (value < 0) {
        document.getElementById(inputName).style.backgroundColor = "#f4c7c7";
        return true
    }
    const opposingInput = document.getElementById(opposingInputId);
    // for same team matches. value should not be a number anyways - input will be null
    if (!isNaN(value) && !opposingInput.value) {
        opposingInput.style.backgroundColor = "#f4c7c7";
        return true
    }
    return false;

}

export function KnockoutTeamResults (props) {
    const {roundFixtures, teams, useTwoLegs, tournamentId, isUpdatingResults,
            isCurrentRound, isFinal, useOneFinal} = props;
    const [loading, setLoading] = useState(false);
    const styles = useResults();
    const setTeamNames = (fixture, teams) => {
        let firstTeam, secondTeam, automaticWinner, firstTeamLogo, secondTeamLogo;
        if (fixture.isEmpty) {
            firstTeam = secondTeam = "(empty)";
        } else if (roundFixtures[fixture.opponentIndex].isEmpty) {
            firstTeam = teams[fixture.teamIndex].teamName;
            firstTeamLogo = teams[fixture.teamIndex].teamLogo;
            secondTeam = "(empty)";
            automaticWinner = true;
        } else {
            firstTeam = teams[fixture.teamIndex].teamName;
            firstTeamLogo = teams[fixture.teamIndex].teamLogo;
            secondTeam = teams[roundFixtures[fixture.opponentIndex].teamIndex].teamName;
            secondTeamLogo = teams[roundFixtures[fixture.opponentIndex].teamIndex].teamLogo;

        }
        return {firstTeam, secondTeam, automaticWinner, firstTeamLogo, secondTeamLogo};
    }
    const [updatedResults, setUpdatedResults] = useState({});
    const handleResults = handleInputResults(setUpdatedResults);
    const setInitialValues = (inputName, value) => {
        setUpdatedResults(prevState => ({...prevState, [inputName]: value}));
    }
    const handleSubmit = () => {
        const numberOfTeamsLeft = roundFixtures.length;
        const results = [];
        for (let i=0; i<numberOfTeamsLeft; i++) {
            if (!useTwoLegs && i%2 === 1) return results.push(null);
            const homeFor = parseInt(updatedResults[`homeGoalsFor${i}`]);
            const homeAgainst = parseInt(updatedResults[`homeGoalsAgainst${i}`]);
            const tieBreakerFor = parseInt(updatedResults[`tieBreakerGoalsFor${i}`]);
            const tieBreakerAgainst = parseInt(updatedResults[`tieBreakerGoalsAgainst${i}`]);
            const neutralFor = parseInt(updatedResults[`neutralGoalsFor${i}`]);
            const neutralAgainst = parseInt(updatedResults[`neutralGoalsAgainst${i}`]);
            // halt if score is invalid
            if (useTwoLegs && (!(isFinal && useOneFinal))) {
                if (isInvalidScore(`homeGoalsFor${i}`, homeFor, `homeGoalsAgainst${i}`)) return
                if (isInvalidScore(`homeGoalsAgainst${i}`, homeAgainst, `homeGoalsFor${i}`)) return
                addResult(homeFor, homeAgainst, results);
            } else {
                if (isInvalidScore(`neutralGoalsFor${i}`, neutralFor, `neutralGoalsAgainst${i}`)) return
                if (isInvalidScore(`neutralGoalsAgainst${i}`, neutralAgainst, `neutralGoalsFor${i}`)) return
                addResult(neutralFor, neutralAgainst, results);
            }
            if (isInvalidScore(`tieBreakerGoalsFor${i}`, tieBreakerFor, `tieBreakerGoalsAgainst${i}`)) return
            if (isInvalidScore(`tieBreakerGoalsAgainst${i}`, tieBreakerAgainst, `tieBreakerGoalsFor${i}`)) return
            addTieBreaker(tieBreakerFor, tieBreakerAgainst, results);
        }
        const values = {results};
        const url = `tournament/${tournamentId}/knockoutResults`;
        basicFetch(url, 'put', values, setLoading, true, true);
    }

    return (
        <Container className={styles.resultsContainer} >
            <WaitForServer wait={loading} />
            {
                ( !isCurrentRound && isUpdatingResults ) ?
                    <Grid item className={styles.error}>
                        <Typography>
                            <span className={styles.closed}>THIS ROUND IS CLOSED</span>
                            <br />
                            <br />
                            TO UPDATE RESULTS ON THIS TAB, CLEAR THE CURRENT ROUND FIXTURES
                        </Typography>
                    </Grid>
                : isUpdatingResults &&
                <>
                    <Grid item className={styles.error}>
                        <Typography>
                            ALL UNSAVED CHANGES WILL BE CLEARED WHEN SWITCHING TABS
                            <br />
                            <br />
                            ONLY FULL MATCH RESULT ENTRIES ARE SAVED
                        </Typography>
                    </Grid>
                    <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        className={styles.submit}
                        onClick={handleSubmit}
                        disabled={!isCurrentRound}
                    >
                        Save Results
                    </Button>
                </>
            }
            {
                useTwoLegs && (!(isFinal && useOneFinal)) &&
                roundFixtures.map((fixture, index) => {
                    if (index % 2 === 1) return null
                    const {
                        firstTeam, firstTeamLogo, secondTeam, secondTeamLogo, automaticWinner
                    } = setTeamNames(fixture, teams);
                    const homeFor = getScoreString(fixture.home.goalsFor);
                    const homeAgainst = getScoreString(fixture.home.goalsAgainst);
                    const awayFor = getScoreString(fixture.away.goalsFor);
                    const awayAgainst = getScoreString(fixture.away.goalsAgainst);
                    const tieBreakerFor = getScoreString(fixture.tieBreaker && fixture.tieBreaker.goalsFor);
                    const tieBreakerAgainst = getScoreString(fixture.tieBreaker && fixture.tieBreaker.goalsAgainst);
                    return (
                        <Paper key={index} className={styles.resultSet}>
                        {/*home result*/}
                            <Result
                                home={firstTeam}
                                homeLogo={firstTeamLogo}
                                away={secondTeam}
                                awayLogo={secondTeamLogo}
                                homeAutoAdvance={automaticWinner}
                                goalsFor={homeFor || "-"}
                                goalsAgainst={homeAgainst || "-"}
                                isUpdatingResults={isUpdatingResults}
                                goalsForComp={
                                    <ResultInput defaultValue={homeFor}
                                                 name={`homeGoalsFor${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 disabled={automaticWinner || !isCurrentRound}
                                    />
                                }
                                goalsAgainstComp={
                                    <ResultInput defaultValue={homeAgainst}
                                                 name={`homeGoalsAgainst${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 disabled={automaticWinner || !isCurrentRound}
                                    />
                                }
                            />
                            {/*tiebreaker*/}
                            {
                                fixture.tieBreaker &&
                                <Result
                                    home={firstTeam}
                                    homeLogo={firstTeamLogo}
                                    away={secondTeam}
                                    awayLogo={secondTeamLogo}
                                    goalsFor={tieBreakerFor || "-"}
                                    goalsAgainst={tieBreakerAgainst || "-"}
                                    isUpdatingResults={isUpdatingResults}
                                    isTieBreaker={true}
                                    goalsForComp={
                                        <ResultInput defaultValue={tieBreakerFor}
                                                     name={`tieBreakerGoalsFor${index}`}
                                                     onChange={handleResults}
                                                     onMount={setInitialValues}
                                                     disabled={!isCurrentRound}
                                        />
                                    }
                                    goalsAgainstComp={
                                        <ResultInput defaultValue={tieBreakerAgainst}
                                                     name={`tieBreakerGoalsAgainst${index}`}
                                                     onChange={handleResults}
                                                     onMount={setInitialValues}
                                                     disabled={!isCurrentRound}
                                        />
                                    }
                                />
                            }
                            {/*away result */}
                            <Result
                                home={secondTeam}
                                away={firstTeam}
                                homeLogo={secondTeamLogo}
                                awayLogo={firstTeamLogo}
                                awayAutoAdvance={automaticWinner}
                                goalsFor={awayAgainst || "-"}
                                goalsAgainst={awayFor || "-"}
                                isUpdatingResults={isUpdatingResults}
                                goalsForComp={
                                    <ResultInput defaultValue={awayAgainst}
                                                 name={`homeGoalsFor${index+1}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 disabled={automaticWinner || !isCurrentRound}
                                    />
                                }
                                goalsAgainstComp={
                                    <ResultInput defaultValue={awayFor}
                                                 name={`homeGoalsAgainst${index+1}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 disabled={automaticWinner || !isCurrentRound}
                                    />
                                }
                            />
                        </Paper>
                    )
                })
            }
            {
                (!useTwoLegs || (isFinal && useOneFinal)) &&
                roundFixtures.map((fixture, index) => {
                    if (index % 2 === 1) return null
                    const {
                        firstTeam, firstTeamLogo, secondTeam, secondTeamLogo, automaticWinner
                    } = setTeamNames(fixture, teams);
                    const neutralFor = getScoreString(fixture.neutral.goalsFor);
                    const neutralAgainst = getScoreString(fixture.neutral.goalsAgainst);
                    const tieBreakerFor = getScoreString(fixture.tieBreaker && fixture.tieBreaker.goalsFor);
                    const tieBreakerAgainst = getScoreString(fixture.tieBreaker && fixture.tieBreaker.goalsAgainst);
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            <Result
                                home={firstTeam}
                                homeLogo={firstTeamLogo}
                                away={secondTeam}
                                awayLogo={secondTeamLogo}
                                homeAutoAdvance={automaticWinner}
                                goalsFor={neutralFor || "-"}
                                goalsAgainst={neutralAgainst || "-"}
                                isUpdatingResults={isUpdatingResults}
                                goalsForComp={
                                    <ResultInput defaultValue={neutralFor}
                                                 name={`neutralGoalsFor${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 disabled={automaticWinner || !isCurrentRound}
                                    />
                                }
                                goalsAgainstComp={
                                    <ResultInput defaultValue={neutralAgainst}
                                                 name={`neutralGoalsAgainst${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 disabled={automaticWinner || !isCurrentRound}
                                    />
                                }
                            />
                            {/*tiebreaker*/}
                            {
                                fixture.tieBreaker &&
                                <Result
                                    home={firstTeam}
                                    homeLogo={firstTeamLogo}
                                    away={secondTeam}
                                    awayLogo={secondTeamLogo}
                                    goalsFor={tieBreakerFor || "-"}
                                    goalsAgainst={tieBreakerAgainst || "-"}
                                    isUpdatingResults={isUpdatingResults}
                                    isTieBreaker={true}
                                    goalsForComp={
                                        <ResultInput defaultValue={tieBreakerFor}
                                                     name={`tieBreakerGoalsFor${index}`}
                                                     onChange={handleResults}
                                                     onMount={setInitialValues}
                                                     disabled={!isCurrentRound}
                                        />
                                    }
                                    goalsAgainstComp={
                                        <ResultInput defaultValue={tieBreakerAgainst}
                                                     name={`tieBreakerGoalsAgainst${index}`}
                                                     onChange={handleResults}
                                                     onMount={setInitialValues}
                                                     disabled={!isCurrentRound}
                                        />
                                    }
                                />
                            }
                        </Paper>
                    )
                })
            }
            {
                isUpdatingResults &&
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    className={styles.submit}
                    onClick={handleSubmit}
                    disabled={!isCurrentRound}
                >
                    Save Results
                </Button>
            }
        </Container>
    )
}

export function LeagueTeamResults (props) {
    const {teamFixtures, teamName, teamLogo, teamIndex, teams, useTwoLegs,
            tournamentId ,isUpdatingResults} = props;
    const [loading, setLoading] = useState(false);
    const styles = useResults();

    const [updatedResults, setUpdatedResults] = useState({});
    const handleResults = handleInputResults(setUpdatedResults);
    const setInitialValues = (inputName, value) => {
        setUpdatedResults(prevState => ({...prevState, [inputName]: value}));
    }
    const handleSubmit = () => {
        const numberOfTeams = teams.length;
        const home = [];
        const away = [];
        const neutral = [];
        for (let i=0; i<numberOfTeams; i++) {
            const homeFor = parseInt(updatedResults[`homeGoalsFor${i}`]);
            const homeAgainst = parseInt(updatedResults[`homeGoalsAgainst${i}`]);
            const awayFor = parseInt(updatedResults[`awayGoalsFor${i}`]);
            const awayAgainst = parseInt(updatedResults[`awayGoalsAgainst${i}`]);
            const neutralFor = parseInt(updatedResults[`neutralGoalsFor${i}`]);
            const neutralAgainst = parseInt(updatedResults[`neutralGoalsAgainst${i}`]);
            // halt if score is invalid
            if (useTwoLegs) {
                if (isInvalidScore(`homeGoalsFor${i}`, homeFor, `homeGoalsAgainst${i}`)) return
                if (isInvalidScore(`homeGoalsAgainst${i}`, homeAgainst, `homeGoalsFor${i}`)) return
                if (isInvalidScore(`awayGoalsFor${i}`, awayFor, `awayGoalsAgainst${i}`)) return
                if (isInvalidScore(`awayGoalsAgainst${i}`, awayAgainst, `awayGoalsFor${i}`)) return
                addResult(homeFor, homeAgainst, home);
                addResult(awayFor, awayAgainst, away);
            } else {
                if (isInvalidScore(`neutralGoalsFor${i}`, neutralFor, `neutralGoalsAgainst${i}`)) return
                if (isInvalidScore(`neutralGoalsAgainst${i}`, neutralAgainst, `neutralGoalsFor${i}`)) return
                addResult(neutralFor, neutralAgainst, neutral);
            }
        }
        const values = {teamIndex, home, away, neutral};
        const url = `tournament/${tournamentId}/leagueResults`;
        basicFetch(url, 'put', values, setLoading, true, true);
    }


    return (
        <Container className={styles.resultsContainer}>
            <WaitForServer wait={loading}/>
            {
                isUpdatingResults &&
                    <>
                        <Grid item className={styles.error}>
                            <Typography>
                                ALL UNSAVED CHANGES WILL BE CLEARED WHEN SWITCHING TABS
                                <br />
                                ONLY FULL MATCH RESULT ENTRIES ARE SAVED
                            </Typography>
                        </Grid>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            className={styles.submit}
                            onClick={handleSubmit}
                        >
                            Save Results
                        </Button>
                    </>
            }
            {
                useTwoLegs &&
                teamFixtures.home.map((fixture, index) => {
                    if (fixture && fixture.isSameTeam) return null
                    const homeGoalsFor = fixture && fixture.goalsFor.toString();
                    const homeGoalsAgainst = fixture && fixture.goalsAgainst.toString();
                    const awayGoalsFor = teamFixtures.away[index] && teamFixtures.away[index].goalsFor.toString();
                    const awayGoalsAgainst = teamFixtures.away[index] && teamFixtures.away[index].goalsAgainst.toString();
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            {/*home result*/}
                            <Result
                                home={teamName}
                                homeLogo={teamLogo}
                                away={teams[index].teamName}
                                awayLogo={teams[index].teamLogo}
                                goalsFor={homeGoalsFor}
                                goalsAgainst={homeGoalsAgainst}
                                handleResults={handleResults}
                                useTwoLegs={useTwoLegs}
                                isUpdatingResults={isUpdatingResults}
                                goalsForComp={
                                    <ResultInput defaultValue={homeGoalsFor || ""}
                                                 name={`homeGoalsFor${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                                 />
                                }
                                goalsAgainstComp={
                                    <ResultInput defaultValue={homeGoalsAgainst || ""}
                                                 name={`homeGoalsAgainst${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                    />
                                }
                            />
                            {/*away result*/}
                            {/*teams and scores are reversed on away*/}
                            <Result
                                home={teams[index].teamName}
                                homeLogo={teams[index].teamLogo}
                                away={teamName}
                                awayLogo={teamLogo}
                                goalsFor={awayGoalsAgainst}
                                goalsAgainst={awayGoalsFor}
                                handleResults={handleResults}
                                useTwoLegs={useTwoLegs}
                                isUpdatingResults={isUpdatingResults}
                                goalsForComp={
                                    <ResultInput defaultValue={awayGoalsAgainst || ""}
                                                 name={`awayGoalsAgainst${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                    />
                                }
                                goalsAgainstComp={
                                    <ResultInput defaultValue={awayGoalsFor || ""}
                                                 name={`awayGoalsFor${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                    />
                                }
                            />
                        </Paper>
                    )
                })
            }
            {
                !useTwoLegs &&
                teamFixtures.neutral.map((fixture, index) => {
                    if (fixture && fixture.isSameTeam) return null
                    const neutralGoalsFor = fixture && fixture.goalsFor.toString();
                    const neutralGoalsAgainst = fixture && fixture.goalsAgainst.toString();
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            {/*neutral result*/}
                            <Result
                                home={teamName}
                                homeLogo={teamLogo}
                                away={teams[index].teamName}
                                awayLogo={teams[index].teamLogo}
                                goalsFor={neutralGoalsFor}
                                goalsAgainst={neutralGoalsAgainst}
                                handleResults={handleResults}
                                useTwoLegs={useTwoLegs}
                                isUpdatingResults={isUpdatingResults}
                                goalsForComp={
                                    <ResultInput defaultValue={neutralGoalsFor || ""}
                                                 name={`neutralGoalsFor${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                    />
                                }
                                goalsAgainstComp={
                                    <ResultInput defaultValue={neutralGoalsAgainst || ""}
                                                 name={`neutralGoalsAgainst${index}`}
                                                 onChange={handleResults}
                                                 onMount={setInitialValues}
                                    />
                                }
                            />
                        </Paper>
                    )
                })
            }
            {
                isUpdatingResults &&
                <Button
                    type="button"
                    variant="contained"
                    color="secondary"
                    className={styles.submit}
                    onClick={handleSubmit}
                >
                    Save Results
                </Button>
            }
        </Container>
    )
}

function ResultInput (props) {
    const {name, defaultValue, onChange, onMount, disabled} = props;
    const styles = useResults();
    useEffect(() => {
        onMount(name, defaultValue);
    }, []);
    return (
        <TextField
            defaultValue={defaultValue}
            disabled={disabled}
            id={name}
            inputProps={{max: 999, min: 0, className: styles.resultInput}}
            name={name}
            placeholder="-"
            onChange={onChange}
            required
            type="number"
            variant="outlined"
            // fullWidth
            // id={teamNameInput}
            // label="Team Name"
            // disabled={disabled || disableTeamNames}
            // value={values[teamNameInput] || ""}
        />
    )
}

function Result (props) {
    const styles = useResults();
    const {home, away, goalsFor, goalsAgainst, homeAutoAdvance, awayAutoAdvance,
            isUpdatingResults, goalsForComp, goalsAgainstComp, isTieBreaker,
                homeLogo, awayLogo} = props;
    return (
        <>
            {
                isTieBreaker &&
                    <Box className={styles.tieBreaker}>
                        <Typography className={styles.tieBreakerText}>TIE-BREAKER</Typography>
                    </Box>
            }
            <Box className={`${styles.resultBox} ${isTieBreaker?styles.tieBreaker:""}`}>
                {
                    !isUpdatingResults &&
                    <Avatar alt="Team badge"
                            src={homeLogo}
                            className={styles.teamBadge}
                    >
                        {!homeLogo && <SportsSoccerOutlinedIcon />}
                    </Avatar>
                }

                <Typography className={`${styles.team} ${styles.homeTeam}`}>
                    {home}
                    {
                        homeAutoAdvance &&
                        <>
                            <br />
                            <span className={styles.advanced}>(auto adv)</span>
                        </>
                    }
                </Typography>
                {
                    !isUpdatingResults &&
                    <>
                        <Typography className={styles.goals}>
                            {isNaN(parseInt(goalsFor)) ? "-" : goalsFor}
                        </Typography>
                        <Typography className={styles.goals}>
                            {isNaN(parseInt(goalsAgainst)) ? "-" : goalsAgainst}
                        </Typography>
                    </>
                }
                {
                    isUpdatingResults &&
                    <>
                        {goalsForComp}
                        {goalsAgainstComp}
                    </>
                }
                <Typography className={`${styles.team} ${styles.awayTeam}`}>
                    {away}
                    {
                        awayAutoAdvance &&
                        <>
                            <br />
                            <span className={styles.advanced}>(auto adv)</span>
                        </>
                    }
                </Typography>
                {
                    !isUpdatingResults &&
                    <Avatar alt="Team badge"
                            src={awayLogo}
                            className={styles.teamBadge}
                    >
                        {!awayLogo && <SportsSoccerOutlinedIcon />}
                    </Avatar>
                }
            </Box>
        </>

    )
}