import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import {lightGreen} from "@material-ui/core/colors";

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

function a11yProps(index) {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

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
        justifyContent: "center",
        alignItems: "center"
    }
}));

export function LeagueFixtures (props) {
    const {teams, fixtures, useTwoLegs} = props;
    const classes = useStyles();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Paper className={classes.root}>
            <AppBar position="static" color="default" className={classes.appBarContainer}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        teams.map((team, index) => (
                            <Tab
                                key={index}
                                label={team.teamName}
                                {...a11yProps(index)} />
                        ))
                    }
                </Tabs>
            </AppBar>
            <Box className={classes.tabPanelContainer}>
                {
                    teams.map((team, index) => (
                        <TabPanel index={index}
                                  value={value}
                                  key={index}
                        >
                            <LeagueTeamResults
                                teamFixtures={fixtures[index]}
                                teams={teams}
                                useTwoLegs={useTwoLegs}
                                teamName={team.teamName}
                            />
                        </TabPanel>
                    ))
                }
            </Box>
        </Paper>
    );
}

const roundLabels = {
    roundOf32: 'Round of 32',
    roundOf16: 'Last 16',
    roundOf8: 'Quarter-Finals',
    roundOf4: 'Semi-Finals',
    roundOf2: 'Final'
}

export function KnockoutFixtures (props) {
    const {teams, fixtures, useTwoLegs} = props;
    const {startingRound, currentRound} = fixtures;
    const classes = useStyles();
    const [value, setValue] = useState(0);
    const [availableRounds, setAvailableRounds] = useState([]);

    useEffect(() => {
        if (!startingRound || !currentRound) return
        let startingNumber = parseInt(startingRound.slice(7));
        const currentNumber = parseInt(currentRound.slice(7));
        let roundsArray = [];
        do {
            roundsArray.push(`roundOf${startingNumber}`);
            startingNumber /= 2;
        } while (startingNumber >= currentNumber);
        setAvailableRounds(roundsArray);
    }, [startingRound, currentRound])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (availableRounds.length === 0) return null
    return (
        <Paper className={classes.root}>
            <AppBar position="sticky" color="default" className={classes.appBarContainer}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                    aria-label="scrollable auto tabs example"
                >
                    {
                        availableRounds.map((team, index) => (
                            <Tab
                                key={index}
                                label={roundLabels[team]}
                                {...a11yProps(index)} />
                        ))
                    }
                </Tabs>
            </AppBar>
            <Box className={classes.tabPanelContainer}>
                {
                    availableRounds.map((round, index) => (
                        <TabPanel index={index}
                                  value={value}
                                  key={index}
                        >
                            <KnockoutTeamResults
                                roundFixtures={fixtures[round]}
                                teams={teams}
                                useTwoLegs={useTwoLegs}
                            />
                        </TabPanel>
                    ))
                }
            </Box>
        </Paper>
    )
}

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

function KnockoutTeamResults (props) {
    const {roundFixtures, teams, useTwoLegs} = props;
    const styles = useResults();
    return (
        <Container className={styles.resultsContainer} >
            {
                useTwoLegs &&
                roundFixtures.map((fixture, index) => {
                    if (index % 2 === 1) return null
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
                    const firstTeam = teams[fixture.teamIndex].teamName;
                    const secondTeam = teams[roundFixtures[fixture.opponentIndex].teamIndex].teamName;
                    return (
                        <Paper key={index} className={styles.resultSet}>
                            <Result
                                home={firstTeam}
                                away={secondTeam}
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

function LeagueTeamResults (props) {
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
                        <span className={styles.advanced}
                             component="span"
                        >(auto adv)
                        </span>
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
                        <span className={styles.advanced}
                             component="span"
                        >(auto adv)
                        </span>
                    </>
                }
            </Typography>
        </Box>
    )
}