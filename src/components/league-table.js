import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const StyledTableCell = withStyles((theme) => ({
    head: {
        width: 35,
        paddingLeft: 0,
        paddingRight: 0,
        color: theme.palette.common.white,
        backgroundColor: "#4e4eb1"
    },
    body: {
        paddingLeft: 0,
        paddingRight: 0,
        fontSize: 14,
        border: "1px solid rgba(224, 224, 224, 0.3)"
    },
}))(TableCell);

const useStyles = makeStyles({
    table: {
        minWidth: 'fit-content',
    },
    teamName: {
        fontWeight: "bold",
        paddingLeft: 10,
        paddingRight: 5
    }
});

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

function createTable(position, teamName, played, won, drawn, lost, goalsFor,
                     goalsAgainst, goalDifference, points) {
    return {
        position, teamName, played, won, drawn, lost, goalsFor,
        goalsAgainst, goalDifference, points
    }
}

export function CustomizedTables(props) {
    const styles = useStyles();
    const rows = props.tableData.map((team, index) => (
        createTable(index +1, team.teamDetails.teamName.toUpperCase(), team.played,team.won,
            team.drawn, team.lost, team.goalsFor, team.goalsAgainst, team.goalDifference,
            team.points)
    ));

    return (
        <TableContainer component={Paper}>
            <Table className={styles.table}
                   aria-label="customized table"
                   size="medium"
                   stickyHeader={true}
            >
                <TableHead>
                    <TableRow>
                    {
                        ['Pos','Team','Pl','W','D','L','GF','GA','GD','Pts'].map((colHead, index) => (
                            <StyledTableCell align="center"
                                             size="small"
                                             key={index}
                            >
                                {colHead}
                            </StyledTableCell>
                        ))
                    }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={`${row.teamName}${row.points}`}>
                            {
                                ['position', 'teamName', 'played', 'won', 'drawn', 'lost', 'goalsFor',
                                    'goalsAgainst', 'goalDifference', 'points'].map((value, index) => (
                                    <StyledTableCell align={value === 'teamName'?'left':'center'}
                                                     size="small"
                                                     key={index}
                                                     className={styles[value]}
                                     >
                                        {row[value]}
                                    </StyledTableCell>
                                ))
                            }
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default function LeagueTable (props) {
    return (
        <CustomizedTables tableData={props.tableData}/>
    )
}