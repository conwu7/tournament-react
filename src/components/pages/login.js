import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useFormik} from "formik";
import WaitForServer from "../loading";
import {fetchApi} from "../../helpers/common";
import {Link as RouterLink} from 'react-router-dom';
import {LoginSchema} from "../../helpers/validation";

export default function Login() {
    return (
        <FormBody
            page="Log in"
            isCreating={false}
            showUsername={false}
            apiUrl="login"
            validationSchema={LoginSchema}
        />
    )
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        color: 'red',
        fontSize: '1.2em',
        margin: "auto",
        textAlign: "center"
    }
}));

export function FormBody (props) {
    const classes = useStyles();
    const {showUsername, page, isCreating, apiUrl, validationSchema} = props;
    const [wait, setWaitForServer] = useState(false);
    const [serverError, setServerError] = useState("");
    const initialValues = {
        username: showUsername? '' : undefined,
        email: '',
        password: ''
    }
    const formik = useFormik({
        initialValues,
        validationSchema,
        onSubmit: values => {
            setWaitForServer(true);
            setServerError("");
            setTimeout(async ()=>{
                try {
                    await fetchApi( `users/${apiUrl}`, 'post', values);
                    window.location.reload();
                } catch (err) {
                    setServerError(err);
                } finally {
                    setWaitForServer(false);
                }
            }, 1500);
        }
    });
    return (
        <>
            <Container component="main" maxWidth="xs">
                <WaitForServer wait={wait} />
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {page}
                    </Typography>
                    <form className={classes.form} onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            {   showUsername &&
                                <>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant="outlined"
                                            required
                                            fullWidth
                                            id="username"
                                            label="Username"
                                            name="username"
                                            autoComplete="username"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.username}
                                    />
                                    </Grid>
                                    <Grid item className={classes.error}>
                                        {formik.touched.username && formik.errors.username}
                                    </Grid>
                                </>

                            }
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                            </Grid>
                            <Grid item className={classes.error}>
                                {formik.touched.email && formik.errors.email}
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.password}
                                />
                            </Grid>
                            <Grid item className={classes.error}>
                                {formik.touched.password && formik.errors.password}
                            </Grid>
                        </Grid>
                        <Grid item className={classes.error}>
                            {serverError}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            {page}
                        </Button>
                        <Grid container justify="flex-end">
                            {
                                isCreating ?
                                    <Grid item>
                                        <RouterLink to="login">
                                            Already have an account? Log in
                                        </RouterLink>
                                    </Grid> :
                                    <Grid item>
                                        <RouterLink to="/signup">
                                            Don't have an account? Sign Up
                                        </RouterLink>
                                    </Grid>
                            }
                        </Grid>
                    </form>
                </div>
            </Container>
        </>
    )
}