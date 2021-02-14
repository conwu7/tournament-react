import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import '../stylesheets/default-font.css';
import {Link, NavLink} from 'react-router-dom';
import {fetchApi} from "../helpers/common";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    // appBar: {
    //   backgroundColor: "darkslategray"
    // },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        fontWeight: 'bolder',
        color: "whitesmoke"
    },
    links: {
        fontWeight: 'bold',
    },
    menuItem: {
        backgroundColor: "whitesmoke",
        margin: 5
    },
    menuIcon: {
        color: 'whitesmoke'
    },
    loginText: {
        color: 'whitesmoke',
        textDecoration: 'none'
    },
    logoutText: {
        color: "indianred",
        backgroundColor: "whitesmoke",
        margin: 5
    },
    navLinkText: {
        color: "inherit",
        textDecoration: "none",
    }
}));

export default function NavBar (props) {
    const {user} = props;
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleLogout = async () => {
        try {
            await fetchApi('users/logout', 'post');
            window.location.reload();
        } catch (err) {
            alert(err)
        }
    }
    return (
        <AppBar position="fixed"
                className={classes.appBar}>
            <Toolbar>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MenuIcon className={classes.menuIcon} />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <Link to="/" className={classes.navLinkText}>
                        <MenuItem onClick={handleClose} className={classes.menuItem}>
                            Home
                        </MenuItem>
                    </Link>
                    <Link to="/new" className={classes.navLinkText}>
                        <MenuItem onClick={handleClose} className={classes.menuItem}>
                            New Tournament
                        </MenuItem>
                    </Link>
                    {
                        user &&
                        <MenuItem onClick={handleLogout} className={classes.logoutText}>Logout</MenuItem>
                    }
                </Menu>
                <Typography variant="h6" className={classes.title}>
                    Home
                </Typography>
                {
                    !user &&
                        <>
                            <Button color="inherit" className={classes.links}>
                                <NavLink to="/login" className={classes.loginText}>Login</NavLink>
                            </Button>
                            <Button color="inherit" className={classes.links}>
                                <NavLink to="/signup" className={classes.loginText}>Sign-up</NavLink>
                            </Button>
                        </>
                }
            </Toolbar>
        </AppBar>
    )
}