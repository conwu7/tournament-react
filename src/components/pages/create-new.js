import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import AddCircleOutlineOutlinedIcon from '@material-ui/icons/AddCircleOutlineOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useFormik} from "formik";
import {fetchApi} from "../../helpers/common";
import {useHistory, Link} from "react-router-dom";
import WaitForServer from "../loading";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
        height: 60,
        fontSize: 19
    },
    tournamentType: {
        display: "flex",
        flexDirection: "row"
    },
    nameField: {
        borderRadius: 5,
        fontSize: 20,
    },
    checkbox: {
        '& input': {
           // transform: "scale(2)"
        }
    },
    checkboxLabel: {
        fontWeight: "bold",
        fontSize: 20,
    },
    moreInfo: {
        color: "dimgray"
    },
    error: {
        color: 'red',
        fontSize: '1.2em',
        margin: "auto",
        textAlign: "center"
    }
}));

export default function CreateNew(props) {

    return (
        <TournamentForm isCreating={true}
                        user={props.user}
        />
    )
}

export function TournamentForm (props) {
    let {isCreating, tournament, user} = props;
    tournament = tournament || {};
    const {isKnockout, useRealTeams, useTwoLegs, useOneFinal, useAwayGoals,
        name, _id: tournamentId, hasLeagueFixturesGenerated, currentRound} = tournament;
    const allDisabled = hasLeagueFixturesGenerated || !!currentRound;
    const classes = useStyles();
    const [wait, setWaitForServer] = useState(false);
    const [serverError, setServerError] = useState("");
    const [tournamentProps, setTournamentProps] = useState({
        isKnockout: isCreating ? null : isKnockout? 1 : 0,
        useRealTeams: useRealTeams ? 1 : 0,
        useTwoLegs: useTwoLegs ? 1 : 0,
        useOneFinal: useOneFinal ? 1 : 0,
        useAwayGoals: useAwayGoals ? 1 : 0
    });
    const handleRadioChange = (prop) => {
        return (e) => {
            if (!e.target.checked) {
                return setTournamentProps(prevState => ({...prevState, [prop]: 0}));
            }
            setTournamentProps(prevState => ({...prevState, [prop]: parseInt(e.target.value)}));
        }
    }
    const history = useHistory();
    const formik = useFormik({
        initialValues: { name: name || "" },
        // validationSchema,
        onSubmit: values => {
            setWaitForServer(true);
            setServerError("");
            const allProps = Object.assign(values, tournamentProps);
            if (values.isKnockout === null) {
                setWaitForServer(false);
                return setServerError("Tournament type required");
            }
            setTimeout(async ()=>{
                try {
                    const url = isCreating ? 'tournament' : `tournament/${tournamentId}`;
                    const method = isCreating ? 'post' : 'put';
                    await fetchApi( url, method, allProps);
                    if (isCreating) {
                        history.push("/");
                    } else {
                        window.location.reload();
                    }
                } catch (err) {
                    setServerError(err);
                } finally {
                    setWaitForServer(false);
                }
            }, 2000);
        }
    });
    if (isCreating && !user) {
        return (
            <Container component="main"
                       maxWidth="md"
                       style={{padding: "30px"}}
            >
                <Typography>
                    <Link to="/login">
                        Log in to create tournaments.
                    </Link>
                </Typography>
            </Container>
        )
    }
    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <WaitForServer wait={wait} />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <AddCircleOutlineOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isCreating ? "New Tournament" : "Update Tournament"}
                </Typography>
                <form className={classes.form} onSubmit={formik.handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth={true}
                                type="text"
                                id="name"
                                label="Tournament Name"
                                name="name"
                                autoComplete="tournamentName"
                                InputProps={{className: classes.nameField}}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                            />
                        </Grid>
                        <Grid item className={classes.error}>
                            {formik.touched.name && formik.errors.name}
                        </Grid>
                        <Grid item className={classes.error}>
                            {
                                allDisabled &&
                                <Typography>
                                    You can only change the name as this tournament is already in progress.
                                    <br />
                                    <br />
                                    In order to update other settings, reset the tournament's fixtures.
                                </Typography>
                            }
                        </Grid>
                        <Grid item xs={12}>
                            {/*<FormLabel component="legend">Type</FormLabel>*/}
                            <FormControl component="fieldset">
                                <RadioGroup aria-label="isKnockout"
                                            name="isKnockout"
                                            value={tournamentProps.isKnockout}
                                            onChange={handleRadioChange('isKnockout')}
                                            className={classes.tournamentType}
                                >
                                    <FormControlLabel value={0}
                                                      disabled={allDisabled}
                                                      control={<Radio />}
                                                      label={<Typography className={classes.checkboxLabel}>League</Typography>}/>
                                    <FormControlLabel value={1}
                                                      disabled={allDisabled}
                                                      control={<Radio />}
                                                      label={<Typography className={classes.checkboxLabel}>Knockout</Typography>}/>
                                </RadioGroup>
                            </FormControl>

                        </Grid>
                        <Grid item xs={12}>
                            <FormControl component="fieldset">
                                <FormControlLabel
                                    control={<Checkbox className={classes.checkbox}
                                                       value={1}
                                                       color="secondary"
                                                       checked={!!tournamentProps.useRealTeams}
                                                       onChange={handleRadioChange('useRealTeams')}
                                                       disabled={allDisabled}
                                    />}
                                    label={<Typography className={classes.checkboxLabel}>Use Real Teams</Typography>}
                                />
                            </FormControl>
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item>
                                <Typography className={classes.moreInfo}>
                                    Show real club options when adding teams
                                </Typography>
                            </Grid>
                        </Grid>
                        {/*TWO LEGS OPTION*/}
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox className={classes.checkbox}
                                                   value={1}
                                                   color="secondary"
                                                   onChange={handleRadioChange('useTwoLegs')}
                                                   checked={!!tournamentProps.useTwoLegs}
                                                   disabled={allDisabled}
                                />}
                                label={<Typography className={classes.checkboxLabel}>Use Two Legs</Typography>}
                            />
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item>
                                <Typography className={classes.moreInfo}>
                                    Each encounter will have a home and away match
                                </Typography>
                            </Grid>
                        </Grid>
                        {/*ONE FINAL OPTION*/}
                        <Grid item xs={12}>
                            <FormControlLabel

                                control={<Checkbox className={classes.checkbox}
                                                   value={1}
                                                   color="secondary"
                                                   disabled={tournamentProps.isKnockout === 0 ||
                                                   tournamentProps.useTwoLegs !== 1 || allDisabled}
                                                   onChange={handleRadioChange('useOneFinal')}
                                                   checked={!!tournamentProps.useOneFinal}
                                />}
                                label={<Typography className={classes.checkboxLabel}>Use One Leg Final</Typography>}
                            />
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item>
                                <Typography className={classes.moreInfo}>
                                    Only enabled if type is Knockout and "Use Two Legs" is selected
                                    <br />
                                    <br />
                                    For knockout tournaments with two legs, the final will have only one neutral match
                                </Typography>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Checkbox className={classes.checkbox}
                                                   value={1}
                                                   color="secondary"
                                                   disabled={tournamentProps.isKnockout === 0 ||
                                                   tournamentProps.useTwoLegs !== 1 || allDisabled}
                                                   onChange={handleRadioChange('useAwayGoals')}
                                                   checked={!!tournamentProps.useAwayGoals}
                                />}
                                label={<Typography className={classes.checkboxLabel}>Use Away Goals Tiebreaker</Typography>}
                            />
                        </Grid>
                        <Grid container justify="flex-start">
                            <Grid item>
                                <Typography className={classes.moreInfo}>
                                    Only enabled if type is Knockout and "Use Two Legs" is selected
                                    <br />
                                    <br />
                                    If the round is still a tie after both home and away matches are completed,
                                    the team who scored more goals away will progress to the next round.
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item className={classes.error}>
                            {serverError}
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.submit}
                    >
                        Save
                    </Button>
                    {/*<Grid container justify="flex-end">*/}
                    {/*    <Grid item>*/}
                    {/*        <Link href="#" variant="body2">*/}
                    {/*            Already have an account? Sign in*/}
                    {/*        </Link>*/}
                    {/*    </Grid>*/}
                    {/*</Grid>*/}
                </form>
            </div>
        </Container>
    );
}