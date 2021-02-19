import Modal from "@material-ui/core/Modal";
import Box from "@material-ui/core/Box";
import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import {makeStyles} from "@material-ui/core/styles";
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import {IconButton} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Paper from "@material-ui/core/Paper";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        outline: "none"
    },
    searchContainer: {
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "90%",
        padding: 10,
        maxHeight: "calc(80vh - 80px)",
        borderRadius: 10,
        overflow: "auto",
        backgroundColor: "whitesmoke"
    },
    cancelContainer: {
        width: "100%",
        height: 60,
        margin: 10,
        padding: 0,
        textAlign: "center",
        backgroundColor: "transparent"
    },
    cancelButton: {
        backgroundColor: "white",
        position: "sticky",
        padding: 0,
        '& svg': {
            width: 50,
            height: 50
        }
    },
    resultButton: {
        display: "flex",
        justifyContent: "flex-start",
        backgroundColor: "#d8e7e8",
        '&:hover': {
            backgroundColor: "#c8dddf",
        },
        width: 300,
        padding: 10,
        margin: 10,
        borderRadius: 8
    },
    teamBadge: {
        width: 60,
        height: 60,
        margin: "0 10px"
    }
}));

export default function TeamSearch (props) {
    const {useActivity, handleClose, inputName, logoInputName, handleSelectedTeam} = props;

    const [isLoading, setLoading] = useState(false);
    const [results, setResults] = useState([]);

    const styles = useStyles();

    const handleResultClick = (teamName, teamLogo) => {
        return () => {
            handleSelectedTeam(inputName, logoInputName, teamName, teamLogo);
            handleClose();
        }
    }
    useEffect(() => {
        if (useActivity) {
            setLoading(true);
            const searchString = document.getElementById(inputName).value;
            if (!searchString) return
            fetch(
                `https://www.thesportsdb.com/api/v1/json/1/searchteams.php?t=${searchString}`,
            )
                .then(response => response.json())
                .then(results => {
                    if (!results) return
                    if (!results.teams) return
                    setResults(results.teams);
                })
                .catch(e => console.log(e))
                .finally(() => setLoading(false));
        }
    }, [inputName, useActivity])

    return (
        <Modal open={useActivity}
               className={styles.modal}
               onBackdropClick={handleClose}
        >
            <>
                <Paper className={styles.cancelContainer}>
                    <IconButton onClick={handleClose}
                                className={styles.cancelButton}
                    >
                        <CancelOutlinedIcon />
                    </IconButton>
                </Paper>
                <Box className={styles.searchContainer}>
                    {
                        isLoading &&
                        <CircularProgress size={100} thickness={4} className={styles.loadingContainer}/>
                    }
                    {
                        !isLoading && results.length === 0 &&
                        <Typography>
                            NO RESULTS
                        </Typography>
                    }
                    {
                        !isLoading && results && results.map((result, index) => (
                            <Button variant="contained"
                                    onClick={handleResultClick(result.strTeam, result.strTeamBadge)}
                                    key={index}
                                    className={styles.resultButton}
                            >
                                <Avatar alt="Team badge"
                                        src={result.strTeamBadge}
                                        className={styles.teamBadge}
                                />
                                {result.strTeam}
                            </Button>
                        ))
                    }
                </Box>
            </>
        </Modal>
    )
}