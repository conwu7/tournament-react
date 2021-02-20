import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import {Link} from 'react-router-dom';
import {fetchApi} from "../../helpers/common";
import Box from '@material-ui/core/Box';
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
        flexWrap: "wrap",
        justifyContent: "space-evenly"
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
    emptyList: {
        color: "lightgray"
    }
}));


export default function MyTournaments (props) {
    const {user} = props;
    const [recentTournaments, setRecent] = useState([]);
    const styles = useStyles();
    const [adminTournaments, setAdminTournaments] = useState([]);
    const [favorites, setFavorites] = useState([]);
    useEffect(() => {
        if (!user) return
        fetchApi('tournament/myTournaments', 'get')
            .then(result => {
                setAdminTournaments(result.admin || []);
                setFavorites(result.favorites || []);
            })
            .catch(e => console.log(e));
    }, [user]);
    // load recent list from local storage
    useEffect(() => {
        const recent = localStorage.getItem('recentTournaments');
        if (recent) {
            setRecent(JSON.parse(recent));
        }
    }, [])
    return (
        <React.Fragment>
            <CssBaseline />
            <Container maxWidth="md">
                <div className={styles.root}>
                    <Paper elevation={2}>
                        <Typography variant="h5"
                                    align="center"
                                    className={styles.pageHeader}
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
                            <Typography className={styles.heading}>Favorites</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={styles.accDetails}>
                            {
                                !user &&
                                <Typography className={styles.signedOutMessage}>
                                    <Link to={{pathname: "/login", state: {prevPage: window.location.href}}}>
                                        Sign in to view your favorites
                                    </Link>
                                </Typography>
                            }
                            {
                                user && favorites.length === 0 &&
                                    <Typography className={styles.emptyList}>
                                        Empty
                                    </Typography>
                            }
                            {
                                user &&
                                favorites.map(tournament => (
                                    <TournamentItem key={tournament._id}
                                                    name={tournament.name}
                                                    isKnockout={tournament.isKnockout}
                                                    createdBy={tournament.admin.username}
                                                    tournamentId={tournament._id}
                                    />
                                ))
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
                            <Typography className={styles.heading}>Recent (On this browser)</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={styles.accDetails}>
                            {
                                recentTournaments.length === 0 &&
                                <Typography className={styles.emptyList}>
                                    Empty
                                </Typography>
                            }
                            {
                                recentTournaments.map(tournament => (
                                    <TournamentItem key={tournament.tournamentId}
                                                    name={tournament.name}
                                                    isKnockout={tournament.isKnockout}
                                                    createdBy={tournament.createdBy}
                                                    tournamentId={tournament.tournamentId}
                                    />
                                ))
                            }
                        </AccordionDetails>
                    </Accordion>
                    {/*ADMIN*/}
                    <Accordion defaultExpanded={!!user}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3a-content"
                            id="panel3a-header"
                        >
                            <Typography className={styles.heading}>Admin</Typography>
                        </AccordionSummary>
                        <AccordionDetails className={styles.accDetails}>
                            {
                                !user &&
                                <Typography className={styles.signedOutMessage}>
                                    <Link to={{pathname: "/login", state: {prevPage: window.location.href}}}>
                                        Sign in to view tournaments you manage
                                    </Link>
                                </Typography>
                            }
                            {
                                user && adminTournaments.length === 0 &&
                                <Typography className={styles.emptyList}>
                                    Empty
                                </Typography>
                            }
                            {
                                user &&
                                adminTournaments.map(tournament => (
                                    <TournamentItem key={tournament._id}
                                                    name={tournament.name}
                                                    isKnockout={tournament.isKnockout}
                                                    createdBy={tournament.admin.username}
                                                    tournamentId={tournament._id}
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
        width: "48%",
        minWidth: 270,
        maxWidth: "100%"
    },
    linkButton: {
        textAlign: "left",
        textDecoration: "none",
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#f3edf9",
        '&:hover': {
            backgroundColor: "#f3edf9",
        }
    },
    name: {
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: theme.typography.fontWeightBold,
        width: "100%",
        textAlign: "left"
    },
    tournamentInfo: {
        padding: 5,
        paddingLeft: 10,
        textAlign: "left",
        fontStyle: "italic",
        color: "darkslategray",
        backgroundColor: "whitesmoke"
    }
}));

export function TournamentItem (props) {
    const {name, createdBy, isKnockout, tournamentId} = props;
    const styles = useTournamentStyles();
    return (
        <Box className={`${styles.tournamentBox}`}
             size="large"
        >
            <Link
                to={`/tournament/${tournamentId}`}
                className={styles.linkButton}
                variant="contained"
            >
                <Typography className={styles.name}>{name}</Typography>
            </Link>
            <Typography
                paragraph={true}
                className={styles.tournamentInfo}
            >
                Type: {isKnockout? "Knockout" : "League"}
                <br />
                Created by {createdBy}
            </Typography>
        </Box>
    )
}