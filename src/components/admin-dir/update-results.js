import {KnockoutFixtures, LeagueFixtures} from '../fixtures';
import Paper from "@material-ui/core/Paper";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
    noFixtures: {
        padding: 20,
        textAlign: "center"
    }
}));
export default function UpdateResults (props) {
    const {tournament, fixtures} = props;
    const {leagueFixtures} = fixtures;
    const {useTwoLegs, teams, _id: tournamentId} = tournament;
    const styles = useStyles();
    if (!tournament.hasLeagueFixturesGenerated && !tournament.currentRound) return (
        <Paper className={styles.noFixtures}>
            Fixtures have not been generated yet.
        </Paper>
    )
    return (
        <>
            {
                tournament.hasLeagueFixturesGenerated &&
                <LeagueFixtures fixtures={leagueFixtures}
                                teams={teams}
                                useTwoLegs={useTwoLegs}
                                isUpdatingResults={true}
                                tournamentId={tournamentId}
                />
            }
            {
                tournament.currentRound &&
                <KnockoutFixtures fixtures={fixtures}
                                  teams={teams}
                                  useTwoLegs={useTwoLegs}
                                  isUpdatingResults={true}
                                  tournamentId={tournamentId}
                />
            }
        </>


    )
}
