import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Link, useHistory} from 'react-router-dom';
import {fetchApi} from "../../helpers/common";
import Button from "@material-ui/core/Button";
import Box from '@material-ui/core/Box';
// import Grid from "@material-ui/core/Grid";
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        paddingTop: 10,
        paddingBottom: 10,
    },
    focusVisible: {
      backgroundColor: "cadetblue"
    },
    pageHeader: {
        color: "darkslategray",
        fontWeight: 'bolder',
        whiteSpace: "nowrap",
        padding: 10,
    },
    heading: {
        fontSize: theme.typography.pxToRem(18),
        fontWeight: theme.typography.fontWeightRegular,
        color: "darkslategray"
    },
    signedOutMessage: {
        color: 'cadetblue'
    },
    accDetails: {
        flexWrap: "wrap"
    },
    addButton: {
        display: "flex",
        marginTop: 10,
        marginBottom: 10,
        margin: "auto",
        padding: 10,
        backgroundColor: "#edf9f3",
        '&:hover' : {
            backgroundColor: "#c7ecd8",
        }
    },
}));


export default function MyTournaments (props) {
    const {user} = props;
    const classes = useStyles();
    const [adminTournaments, setAdminTournaments] = useState([]);
    useEffect(() => {
        if (!user) return
        fetchApi('tournament/myTournaments', 'get')
            .then(result => setAdminTournaments(result))
            .catch(e => console.log(e));
    }, [user]);
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md">
                <div className={classes.root}>
                    <Paper elevation={2}>
                        <Typography variant="h5"
                                    align="center"
                                    className={classes.pageHeader}
                        >
                            MY TOURNAMENTS
                        </Typography>
                    </Paper>
                    {/*FAVORITES*/}
                    <Accordion defaultExpanded={!!user}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography className={classes.heading}>Favorites</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accDetails}>
                            {
                                !user &&
                                <Typography className={classes.signedOutMessage}>
                                    <Link to="/login">
                                        Sign in to view your favorites
                                    </Link>
                                </Typography>
                            }
                        </AccordionDetails>
                    </Accordion>
                    {/*RECENT*/}
                    <Accordion defaultExpanded={true}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                        >
                            <Typography className={classes.heading}>Recent</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accDetails}>
                            <Typography>
                                Lorem ipsum
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    {/*ADMIN*/}
                    <Accordion defaultExpanded={!!user}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography className={classes.heading}>Admin</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={classes.accDetails}>
                            {
                                !user &&
                                <Typography className={classes.signedOutMessage}>
                                    <Link to="/login">
                                        Sign in to view tournaments you manage
                                    </Link>
                                </Typography>
                            }
                            {
                                user &&
                                adminTournaments.map(tournament => (
                                    <TournamentItem key={tournament._id}
                                                    tournament={tournament}
                                    />
                                ))
                            }

                        </AccordionDetails>
                    </Accordion>
                </div>
            </Container>
        </React.Fragment>

    )
}

const useTournamentStyles = makeStyles((theme) => ({
    tournamentBox: {
        display: "flex",
        flexDirection: "column",
        padding: 5,
        margin: 5,
        borderRadius: 5,
    },
    linkButton: {
        textAlign: "left",
        backgroundColor: "#f3edf9",
        '&:hover': {
            backgroundColor: "#f3edf9",
        }

    },
    name: {
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: theme.typography.fontWeightBold,
    },
    createdBy: {
        padding: 5,
        paddingLeft: 10,
        textAlign: "left",
        fontStyle: "italic"
    }
}));

export function TournamentItem (props) {
    const {tournament} = props;
    const styles = useTournamentStyles();
    const history = useHistory();
    const navigateToTournament = () => {
        history.push(`/tournament/${tournament._id}`);
    }

    return (
        <Box className={`${styles.tournamentBox}`}
             size="large"
        >
            <Button
                className={styles.linkButton}
                variant="contained"
                onClick={navigateToTournament}
            >
                <Typography className={styles.name}>{tournament.name}</Typography>
            </Button>
            <Typography
                paragraph={true}
                className={styles.createdBy}
            >
                Type: {tournament.isKnockout? "Knockout" : "League"}
                <br />
                Created by {tournament.admin.username}
            </Typography>
        </Box>
    )
}