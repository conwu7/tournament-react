import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TabPanel from "./tab-panel";
import {LeagueTeamResults, KnockoutTeamResults} from "./fixtures-dir/fixtures";

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
        marginTop: 10
    }
}));

const roundLabels = {
    roundOf32: 'Round of 32',
    roundOf16: 'Last 16',
    roundOf8: 'Quarter-Finals',
    roundOf4: 'Semi-Finals',
    roundOf2: 'Final'
}

export function KnockoutFixtures (props) {
    const {teams, fixtures, useTwoLegs, useOneFinal, isUpdatingResults, tournamentId} = props;
    const {startingRound, currentRound} = fixtures;
    const styles = useStyles();
    const [value, setValue] = useState(currentRound);
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
        <Paper className={styles.root}>
            <AppBar position="sticky" color="default" className={styles.appBarContainer}>
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
                        availableRounds.map((round, index) => (
                            <Tab
                                key={index}
                                value={round}
                                label={roundLabels[round]}
                                />
                        ))
                    }
                </Tabs>
            </AppBar>
            <Box className={styles.tabPanelContainer}>
                {
                    availableRounds.map((round, index) => (
                        <TabPanel index={round}
                                  value={value}
                                  key={round}
                        >
                            <KnockoutTeamResults
                                roundFixtures={fixtures[round]}
                                teams={teams}
                                useTwoLegs={useTwoLegs}
                                useOneFinal={useOneFinal}
                                tournamentId={tournamentId}
                                isCurrentRound={value === fixtures.currentRound}
                                isFinal={value === "roundOf2"}
                                isUpdatingResults={isUpdatingResults}
                            />
                        </TabPanel>
                    ))
                }
            </Box>
        </Paper>
    )
}

export function LeagueFixtures (props) {
    const {teams, fixtures, useTwoLegs, isUpdatingResults, tournamentId} = props;
    const styles = useStyles();
    const [value, setValue] = useState(0);
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
                    aria-label="scrollable auto tabs example"
                >
                    {
                        teams.map((team, index) => (
                            <Tab
                                key={index}
                                label={team.teamName}
                                />
                        ))
                    }
                </Tabs>
            </AppBar>
            <Box className={styles.tabPanelContainer}>
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
                                teamLogo={team.teamLogo}
                                teamIndex={index}
                                tournamentId={tournamentId}
                                isUpdatingResults={isUpdatingResults}
                            />
                        </TabPanel>
                    ))
                }
            </Box>
        </Paper>
    );
}

