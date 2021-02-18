import React, {useCallback, useEffect, useState} from "react";
import Container from "@material-ui/core/Container";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import FavoriteIcon from '@material-ui/icons/Favorite';
import WaitForServer from "../loading";
import {basicFetch, fetchApi} from "../../helpers/common";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import Button from "@material-ui/core/Button";
import {AppBar} from "@material-ui/core";
import {Switch, Route, useHistory, useLocation, Link} from 'react-router-dom';

import {KnockoutFixtures, LeagueFixtures} from "../fixtures";
import LeagueTable from "../league-table";
import Admin from "../admin";
import TabPanel from "../tab-panel";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: 10,
        paddingBottom: 10,
    },
    pageHeader: {
        color: "darkslategray",
        wordBreak: 'break-all',
        marginBottom: 10,
        padding: 10,
        fontWeight: "bold"
    },
    indicator: {
        background: "firebrick",
    },
    appBarContainer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
    },
    tabItem: {
        '&:selected': {
            fontWeight: "bold"
        }
    },
    tabPanelContainer: {
        marginTop: 10
    },
    teamContainer: {
        display: "flex",
        flexWrap: "wrap",
        padding: 0,
        justifyContent: "center"
    },
    noFixtures: {
        padding: 20,
        textAlign: "center"
    },
    favoriteText: {
        margin: "20px auto",
        width: "fit-content"
    }
}));

export default function Tournament (props) {
    const {tournamentId, user} = props;
    const styles = useStyles();
    const [loading, setLoadingStatus] = useState(false);
    const [tournament, setTournament] = useState({notSet: true});
    const [isTournamentAFavorite, setFavorite] = useState(false);
    const [isLeague, setLeague] = useState(false);
    const [teams, setTeams] = useState([]);
    const [fixturesDocument, setFixturesDoc] = useState({notSet: true});
    const [tableData, setTableData] = useState([]);
    const location = useLocation();
    const path = location.pathname.split('/');
    const page = path[path.length -1];
    const startingPage =
        ['table', 'admin', 'teams'].includes(page) ? page : 'fixtures';
    const [currentPage, setCurrentPage] = React.useState(startingPage);
    const history = useHistory();
    const handleChange = (event, newValue) => {
        setCurrentPage(newValue);
        const baseUrl = `/tournament/${tournamentId}`;
        if (newValue === "fixtures" || newValue === "favorites") {
            history.push(`${baseUrl}`)
        } else {
            history.push(`${baseUrl}/${newValue}`);
        }
    };
    // get fixtures on mount
    const getTournamentAndFixtures = useCallback(async () => {
        setLoadingStatus(true);
        let tournament = {};
        try {
            tournament = await fetchApi(`tournament/${tournamentId}`, 'get');
            if (tournament === null) return setTournament({notFound: true});
            setTournament(tournament);
            setTeams(tournament.teams);
            setLeague(!tournament.isKnockout);
            const fixtures = await fetchApi(`tournament/${tournamentId}/fixtures`, 'get');
            setFixturesDoc(fixtures);
            if (!tournament.isKnockout) {
                const tableData = await fetchApi(`tournament/${tournamentId}/leagueTable`, 'get');
                setTableData(tableData);
            }
        } catch (e) {
            if (!tournament.name) setTournament({notFound: true});
            console.log(e);
        } finally {
            setTimeout(()=>setLoadingStatus(false), 100);
        }
    }, [tournamentId])
    // get tournament and fixtures on mount
    useEffect(() => {
        getTournamentAndFixtures()
            .catch(undefined);
    }, [getTournamentAndFixtures]);
    // find if tournament is a favorite
    useEffect(() => {
        if (!user) return
        fetchApi(`tournament/${tournamentId}/isFavorite`, 'get')
            .then(result => setFavorite(result))
            .catch(e => console.log(e));
    }, [tournamentId, user]);
    const handleAddToFav = () => {
        basicFetch(`tournament/${tournamentId}/favorites`,'post',{},setLoadingStatus);
        setFavorite(true);
    }
    const handleRemoveFromFav =() => {
        basicFetch(`tournament/${tournamentId}/favorites`, 'delete',{},setLoadingStatus);
        setFavorite(false);
    }
    // add to recent list using local storage
    useEffect(() => {
        if (tournament && !tournament.notSet && !tournament.notFound) {
            const tournamentObj = {
                name: tournament.name,
                createdBy: tournament.admin.username,
                isKnockout: tournament.isKnockout,
                tournamentId: tournament._id
            }
            let recentTournaments = localStorage.getItem('recentTournaments');
            if (recentTournaments) recentTournaments = JSON.parse(recentTournaments);
            else recentTournaments = [];
            // remove current tournament from list if present - add to top as most recent
            recentTournaments = recentTournaments.filter(item => {
                return (item.tournamentId !== tournament._id)
            });
            if (recentTournaments.length > 4) recentTournaments.pop();
            recentTournaments.unshift(tournamentObj);
            localStorage.setItem('recentTournaments', JSON.stringify(recentTournaments));
        }
    }, [tournament])
    if (tournament.notFound) return (
        <Container maxWidth="lg" className={styles.root}>
            <Typography>TOURNAMENT NOT FOUND</Typography>
        </Container>
    )
    if (tournament.notSet) return (
        <Container maxWidth="lg" className={styles.root}>
            <Typography>LOADING</Typography>
        </Container>
    )
    if (currentPage === "admin" && !tournament.notSet && !tournament.notFound &&
        tournament.admin.username !== user) {
        // setCurrentPage('fixtures');
        window.location.href = `/tournament/${tournamentId}`;
    }
    return (
        <Container maxWidth="lg" className={styles.root}>
            <WaitForServer wait={loading}/>
            <Paper elevation={2}>
                <Typography variant="h6" align="center" className={styles.pageHeader}>
                    {tournament.name}
                </Typography>
            </Paper>
            <AppBar position="sticky" color="default" className={styles.appBarContainer}>
                <Tabs
                    value={currentPage}
                    onChange={handleChange}
                    classes={{indicator: styles.indicator}}
                    textColor="primary"
                    variant="scrollable"
                    scrollButtons="on"
                >
                    <Tab icon={<FavoriteIcon color={currentPage==="favorites"?"secondary":"disabled"}/>}
                         aria-label="favorites"
                         value="favorites"/>
                    <Tab label="Fixtures"
                         className={styles.tabItem}
                         value="fixtures"
                    />
                    {
                        tournament && !tournament.isKnockout &&
                        <Tab label="Table"
                             className={styles.tabItem}
                             value="table"
                        />
                    }

                    <Tab label="Teams"
                         className={styles.tabItem}
                         value="teams"
                    />
                    {
                        !tournament.notSet && tournament.admin.username === user &&
                        <Tab label="ADMIN"
                             className={styles.tabItem}
                             value="admin"
                        />
                    }
                </Tabs>
            </AppBar>
            <Box className={styles.tabPanelContainer}>
                <Switch>
                    {/*LEAGUE TABLE*/}
                    <Route path="/tournament/:id/table">
                        {
                            isLeague &&
                            <TabPanel value={currentPage} index="table">
                                {
                                    !tournament.hasLeagueFixturesGenerated &&
                                    <Paper className={styles.noFixtures}>
                                        Fixtures have not been generated yet.
                                    </Paper>
                                }
                                {
                                    tableData.length !== 0 &&
                                    <LeagueTable tableData={tableData}/>
                                }
                            </TabPanel>
                        }
                    </Route>
                    {/*TOURNAMENT TEAMS*/}
                    <Route path="/tournament/:id/teams">
                        <TabPanel value={currentPage}
                                  index="teams"
                                  className={styles.teamContainer}>
                            {
                                teams.map((team, index) => (
                                    <Team key={index}
                                          team={team}
                                          index={index}
                                    />
                                ))
                            }
                        </TabPanel>
                    </Route>
                    {/*ADMIN PAGE*/}
                    <Route path="/tournament/:id/admin">
                        {
                            tournament.admin.username === user &&
                            <TabPanel value={currentPage}
                                      index="admin"
                            >
                                <Admin tournament={tournament}
                                       tournamentId={tournamentId}
                                       fixtures={fixturesDocument}
                                />
                            </TabPanel>
                        }
                    </Route>
                    {/*FIXTURES & RESULTS (DEFAULT) TAB AND FAVORITES TAB*/}
                    <Route path="/tournament/:id">
                        {/*FAVORITES*/}
                        <TabPanel value={currentPage} index="favorites">
                            {
                                !user &&
                                <Typography className={styles.favoriteText}>
                                    <Link to={{pathname: "/login", state: {prevPage: window.location.href}}}>
                                        Sign in to add to your favorites
                                    </Link>
                                </Typography>
                            }
                            {
                                user &&
                                <Button type="button"
                                        variant="contained"
                                        color={isTournamentAFavorite?"primary":"secondary"}
                                        className={styles.submit}
                                        onClick={isTournamentAFavorite?handleRemoveFromFav:handleAddToFav}
                                        fullWidth={true}
                                >
                                    {isTournamentAFavorite ? "Remove from favorites":"Add to Favorites"}
                                </Button>
                            }
                        </TabPanel>
                        {/*FIXTURES*/}
                        <TabPanel value={currentPage}
                                  index="fixtures">
                            {
                                !tournament.hasLeagueFixturesGenerated && !tournament.currentRound &&
                                <Paper className={styles.noFixtures}>
                                    Fixtures have not been generated yet.
                                </Paper>
                            }
                            {
                                tournament.hasLeagueFixturesGenerated &&
                                !fixturesDocument.notSet &&
                                <LeagueFixtures
                                    teams={teams}
                                    fixtures={fixturesDocument.leagueFixtures}
                                    useTwoLegs={tournament.useTwoLegs}
                                    tournamentId={tournamentId}
                                />
                            }
                            {
                                tournament.currentRound && !fixturesDocument.notSet &&
                                <KnockoutFixtures
                                    teams={teams}
                                    fixtures={fixturesDocument}
                                    useTwoLegs={tournament.useTwoLegs}
                                    useOneFinal={tournament.useOneFinal}
                                />
                            }
                        </TabPanel>
                    </Route>
                </Switch>
            </Box>
        </Container>
        )
}


const useTeamsStyle = makeStyles((theme) => ({
    teamBox: {
        display: "flex",
        flexDirection: "column",
        padding: 5,
        margin: 5,
        borderRadius: 5,
        width: "fit-content"
    },
    teamButton: {
        display: "flex",
        justifyContent: "space-between",
        textAlign: "left",
        backgroundColor: "#f5e1e1",
        '&:hover': {
            backgroundColor: "#f5e1e1",
        },
        width: 300,
        margin: "auto"
        // alignSelf: "center"
    },
    teamIndex: {
        fontSize: 24,
        color: "brown",
        fontFamily: "'Rubik Mono One', sans-serif !important"
    },
    name: {
        paddingTop: 5,
        paddingBottom: 5,
        fontWeight: theme.typography.fontWeightBold,
    },
    owner: {
        margin: 0,
        padding: 5,
        paddingLeft: 10,
        textAlign: "left",
        fontStyle: "italic",
        width: 300,
    }
}));
function Team (props) {
    const {team, index} = props;
    const styles = useTeamsStyle();
    return (
        <Box className={`${styles.teamBox}`}
             size="large"
        >
            <Button
                className={styles.teamButton}
                variant="contained"
                // onClick={navigateToTournament}
            >
                <Typography className={styles.teamIndex}>{index+1}</Typography>
                <Typography className={styles.name}>
                    {team.teamName || "( empty )"}
                </Typography>
            </Button>
            <Typography
                paragraph={true}
                className={styles.owner}
            >
                Owner: {team.playerName || "(empty)"}
            </Typography>
        </Box>
    )
}