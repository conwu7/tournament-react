import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

const useResults = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    resultsContainer: {
        paddingTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
    },
    resultSet: {
        minWidth: "40%",
        marginBottom: 15,
        backgroundColor: "whitesmoke"
    },
    resultBox: {
        display: "flex",
        minHeight: 45,
        padding: 5,
        justifyContent: "center",
        alignItems: "center"
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
        width: 100,
        alignSelf: "center",
        fontWeight: "bold"
    },
    homeTeam: {
        textAlign: "right",
        paddingRight: 10
    },
    awayTeam: {
        textAlign: "left",
        paddingLeft: 10
    },
    advanced: {
        color: "seagreen"
    }
}));

export function KnockoutTeamResults (props) {
    const {roundFixtures, teams, useTwoLegs} = props;
    const styles = useResults();
    const setTeamNames = (fixture, teams) => {
        let firstTeam, secondTeam, automaticWinner;
        if (fixture.isEmpty) {
            firstTeam = secondTeam = "(empty)";
        } else if (roundFixtures[fixture.opponentIndex].isEmpty) {
            firstTeam = teams[fixture.teamIndex].teamName;
            secondTeam = "(empty)";
            automaticWinner = true;
        } else {
            firstTeam = teams[fixture.teamIndex].teamName;
            secondTeam = teams[roundFixtures[fixture.opponentIndex].teamIndex].teamName;
        }
        return {firstTeam, secondTeam, automaticWinner};
    }
    return (
        <Container className={styles.resultsContainer} >
            {
                useTwoLegs &&
                roundFixtures.map((fixture, index) => {
                    if (index % 2 === 1) return null
                    const {firstTeam, secondTeam, automaticWinner} = setTeamNames(fixture, teams);
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            <Result
                                home={firstTeam}
                                away={secondTeam}
                                homeAutoAdvance={automaticWinner}
                                goalsFor={fixture.home.goalsFor || "-"}
                                goalsAgainst={fixture.home.goalsAgainst || "-"}
                            />
                            <Result
                                home={secondTeam}
                                away={firstTeam}
                                awayAutoAdvance={automaticWinner}
                                goalsFor={fixture.away.goalsAgainst || "-"}
                                goalsAgainst={fixture.away.goalsFor || "-"}
                            />
                        </Paper>
                    )
                })
            }
            {
                !useTwoLegs &&
                roundFixtures.map((fixture, index) => {
                    if (index % 2 === 1) return null
                    const {firstTeam, secondTeam, automaticWinner} = setTeamNames(fixture, teams);
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            <Result
                                home={firstTeam}
                                away={secondTeam}
                                homeAutoAdvance={automaticWinner}
                                goalsFor={fixture.neutral.goalsFor || "-"}
                                goalsAgainst={fixture.neutral.goalsAgainst || "-"}
                            />
                        </Paper>
                    )
                })
            }
        </Container>
    )
}

export function LeagueTeamResults (props) {
    const {teamFixtures, teamName, teams, useTwoLegs} = props;
    const styles = useResults();
    return (
        <Container className={styles.resultsContainer}>
            {
                useTwoLegs &&
                teamFixtures.home.map((fixture, index) => {
                    if (fixture && fixture.isSameTeam) return null
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            {/*home result*/}
                            <Result
                                home={teamName}
                                away={teams[index].teamName}
                                goalsFor={fixture && fixture.goalsFor}
                                goalsAgainst={fixture && fixture.goalsAgainst}
                            />
                            {/*away result*/}
                            <Result
                                home={teams[index].teamName}
                                away={teamName}
                                goalsFor={(
                                    teamFixtures.away[index] && teamFixtures.away[index].goalsAgainst
                                )}
                                goalsAgainst={(
                                    teamFixtures.away[index] && teamFixtures.away[index].goalsFor
                                )}
                            />
                        </Paper>
                    )
                })
            }
            {
                !useTwoLegs &&
                teamFixtures.neutral.map((fixture, index) => {
                    if (fixture && fixture.isSameTeam) return null
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            {/*neutral result*/}
                            <Result
                                home={teamName}
                                away={teams[index].teamName}
                                goalsFor={fixture && fixture.goalsFor}
                                goalsAgainst={fixture && fixture.goalsAgainst}
                            />
                        </Paper>
                    )
                })
            }
        </Container>
    )
}

function Result (props) {
    const styles = useResults();
    const {home, away, goalsFor, goalsAgainst, homeAutoAdvance, awayAutoAdvance} = props;
    return (
        <Box className={styles.resultBox}>
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
            <Typography className={styles.goals}>
                {isNaN(parseInt(goalsFor)) ? "-" : goalsFor}
            </Typography>
            <Typography className={styles.goals}>
                {isNaN(parseInt(goalsAgainst)) ? "-" : goalsAgainst}
            </Typography>
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
        </Box>
    )
}