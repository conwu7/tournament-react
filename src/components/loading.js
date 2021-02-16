import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
// import style from '../stylesheets/components/loading.module.scss';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    loadingContainer: {
        outline: "none"
    },
}));
export default function WaitForServer (props) {
    const {wait} = props;
    const styles = useStyles();
    return (
        <Modal
            open={wait}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            disableBackdropClick={true}
            className={styles.modal}
        >
            <CircularProgress size={100} thickness={4} className={styles.loadingContainer}/>
        </Modal>
    )
}