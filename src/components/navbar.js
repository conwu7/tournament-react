import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import Menu from '@material-ui/core/Menu';
import '../stylesheets/default-font.css';
import {Link, NavLink} from 'react-router-dom';
import {fetchApi} from "../helpers/common";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        flexDirection: "row-reverse"
    },
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
        textAlign: "center"
    },
    menuIcon: {
        color: 'whitesmoke',
        fontSize: 30,
        marginLeft: 50
    },
    linkText: {
        width: 70,
        textAlign: "left",
        // fontSize: 22
    },
    loginText: {
        color: 'whitesmoke',
        textDecoration: 'none',
        fontSize: 18
    },
    logoutText: {
        color: "indianred",
    },
    navLinkText: {
        display: "block",
        margin: 10,
        padding: "10px 25px",
        fontSize: 18,
        color: "darkslategray",
        textAlign: "left",
        textDecoration: "none",
        backgroundColor: "whitesmoke",
    }
}));

export default function NavBar (props) {
    const {user} = props;
    const styles = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    // const location = useLocation();
    // const path = location.pathname.split('/');
    // const page = path[1];
    // const startingPage =
    //     page === 'tournament' ? ''
    //         : ['new', 'search', 'home'].includes(page) ? page
    //         : 'home';
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
                className={styles.appBar}>
            <Toolbar>
                {/*<Typography variant="h6" className={styles.title}>*/}
                {/*    {startingPage && startingPage.toUpperCase()}*/}
                {/*</Typography>*/}
                {
                    !user &&
                        <>
                            <Button color="inherit" className={styles.links}>
                                <NavLink to={{pathname: "/login", state: {prevPage: window.location.href}}}
                                         className={styles.loginText}>Login</NavLink>
                            </Button>
                            <Button color="inherit" className={styles.links}>
                                <NavLink to={{pathname: "/signup", state: {prevPage: window.location.href}}}
                                         className={styles.loginText}>Sign-up</NavLink>
                            </Button>
                        </>
                }
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <MenuIcon className={styles.menuIcon} />
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                >
                    <Link to="/" onClick={handleClose} className={styles.navLinkText}>
                        <span className={styles.linkText}>Home</span>
                    </Link>
                    <Link to="/search" onClick={handleClose} className={styles.navLinkText}>
                        <span className={styles.linkText}>Search</span>
                    </Link>
                    <Link to="/new" onClick={handleClose} className={styles.navLinkText}>
                        <span className={styles.linkText}>New</span>
                    </Link>
                    {
                        user &&
                        <Link onClick={handleLogout} to="#" className={styles.navLinkText}>
                            <span className={`${styles.linkText} ${styles.logoutText}`}>Logout</span>
                        </Link>
                    }
                </Menu>
            </Toolbar>
        </AppBar>
    )
}