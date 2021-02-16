import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {basicFetch} from "../../helpers/common";
import Container from "@material-ui/core/Container";
import WaitForServer from "../loading";

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
export default function AdminActions (props) {
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
                               disabled={!tournament.isKnockout || tournament.isComplete}
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
                        className={styles.confirmActionInput}
                    />
                </div>
            }
        </Paper>
    )
}