import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

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
    }
}));

export function LeagueFixtures (props) {
    const {teams, fixtures, useTwoLegs} = props;
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

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
                    variant="scrollable"
                    scrollButtons="auto"
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
                            <TeamResults
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
        marginBottom: 15,
        width: 350,
        backgroundColor: "whitesmoke"
    },
    resultBox: {
        display: "flex",
        height: 45,
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
    }
}));

function TeamResults (props) {
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
        </Container>
    )
}

function Result (props) {
    const styles = useResults();
    const {home, away, goalsFor, goalsAgainst} = props;
    return (
        <Box className={styles.resultBox}>
            <Typography className={`${styles.team} ${styles.homeTeam}`}>
                {home}
            </Typography>
            <Typography className={styles.goals}>
                {isNaN(parseInt(goalsFor)) ? "-" : goalsFor}
            </Typography>
            <Typography className={styles.goals}>
                {isNaN(parseInt(goalsAgainst)) ? "-" : goalsAgainst}
            </Typography>
            <Typography className={`${styles.team} ${styles.awayTeam}`}>
                {away}
            </Typography>
        </Box>
    )
}