import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useState} from "react";
import {useFormik} from "formik";
import {fetchApi} from "../../helpers/common";
import Container from "@material-ui/core/Container";
import WaitForServer from "../loading";
import CssBaseline from "@material-ui/core/CssBaseline";
import Avatar from "@material-ui/core/Avatar";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {SearchSchema} from "../../helpers/validation";
import {TournamentItem} from "./my-tournaments";
import Box from "@material-ui/core/Box";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import TabPanel from "../tab-panel";
import AdminActions from "../admin-dir/admin-actions";
import {TournamentForm} from "./create-new";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: "10px auto"
    },
    error: {
        width: "100%",
        padding: 0,
        color: 'red',
        fontSize: '1.2em',
        margin: "5px auto",
        textAlign: "center",
        '&:empty': {
            margin: 0
        }
    },
    resultsContainer: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-evenly",
        padding: 10,
        width: "100%"
    },
    panelContainer: {
        width: "100%",
        padding: "10px 0"
    }
}));

export default function Search () {
    const styles = useStyles();
    const [wait, setWaitForServer] = useState(false);
    const [serverError, setServerError] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [explore, setExploreTournaments] = useState([]);
    const [value, setValue] = useState("search");

    // get public recently created tournaments
    useEffect(() => {
        fetchApi(`tournament/explore`, 'get')
            .then(result => setExploreTournaments(result))
            .catch(e => console.log(e));
    }, []);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const formik = useFormik({
        initialValues: {searchString: ""},
        validationSchema: SearchSchema,
        onSubmit: values => {
            setWaitForServer(true);
            setServerError("");
            setTimeout(async () => {
                try {
                    const results = await fetchApi(`tournament/search?searchString=${values.searchString}`, 'get');
                    setSearchResults(results);
                } catch (err) {
                    setServerError(err);
                } finally {
                    setWaitForServer(false);
                }
            }, 300);
        }
    });
    return (
        <Container component="main" maxWidth="md">
            <WaitForServer wait={wait}/>
            <CssBaseline/>
            <div className={styles.paper}>
                <Avatar className={styles.avatar}>
                    <SearchOutlinedIcon/>
                </Avatar>
                <AppBar position="static" color="default" className={styles.appBarContainer}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="standard"
                        centered={true}
                    >
                        <Tab label="Search" value="search" />
                        <Tab label="Explore" value="explore"/>
                    </Tabs>
                </AppBar>
                <TabPanel index="search"
                          value={value}
                          className={styles.panelContainer}
                >
                    <>
                        <form className={styles.form} onSubmit={formik.handleSubmit}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="searchString"
                                label="Search"
                                name="searchString"
                                autoComplete="search"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.searchString}
                            />
                            <Typography className={styles.error}>
                                {formik.touched.searchString && formik.errors.searchString}
                            </Typography>
                            <Typography className={styles.error}>
                                {serverError}
                            </Typography>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={styles.submit}
                            >
                                Search
                            </Button>
                        </form>
                        <Paper className={styles.resultsContainer}>
                            {
                                searchResults.map(tournament => (
                                    <TournamentItem key={tournament._id}
                                                    name={tournament.name}
                                                    isKnockout={tournament.isKnockout}
                                                    createdBy={tournament.admin.username}
                                                    tournamentId={tournament._id}
                                    />
                                ))
                            }
                            {
                                searchResults.length === 0 &&
                                <Typography className={styles.noResults}>
                                    No Results
                                </Typography>
                            }
                        </Paper>
                    </>
                </TabPanel>
                <TabPanel value={value}
                          index="explore"
                          className={styles.panelContainer}
                >
                    <Paper className={styles.resultsContainer}>
                        {
                            explore.map(tournament => (
                                <TournamentItem key={tournament._id}
                                                name={tournament.name}
                                                isKnockout={tournament.isKnockout}
                                                createdBy={tournament.admin.username}
                                                tournamentId={tournament._id}
                                />
                            ))
                        }
                        {
                            explore.length === 0 &&
                            <Typography className={styles.noResults}>
                                Nothing to explore at the moment
                            </Typography>
                        }
                    </Paper>
                </TabPanel>
            </div>
        </Container>
    )
}