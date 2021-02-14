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

export function CustomizedTables(props) {
    const classes = useStyles();
    const rows = props.tableData.map((team, index) => (
        createTable(index +1, team.teamDetails.teamName.toUpperCase(), team.played,team.won,
            team.drawn, team.lost, team.goalsFor, team.goalsAgainst, team.goalDifference,
            team.points)
    ));

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table}
                   aria-label="customized table"
                   size="medium"
                   stickyHeader={true}
            >
                <TableHead>
                    <TableRow>
                        <StyledTableCell align="center" size="small">Pos</StyledTableCell>
                        <StyledTableCell align="left" className={classes.teamName}  size="small">Team</StyledTableCell>
                        <StyledTableCell align="center" size="small">Pl</StyledTableCell>
                        <StyledTableCell align="center" size="small">W</StyledTableCell>
                        <StyledTableCell align="center" size="small">D</StyledTableCell>
                        <StyledTableCell align="center" size="small">L</StyledTableCell>
                        <StyledTableCell align="center" size="small">GF</StyledTableCell>
                        <StyledTableCell align="center" size="small">GA</StyledTableCell>
                        <StyledTableCell align="center" size="small">GD</StyledTableCell>
                        <StyledTableCell align="center" size="small">Pts</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <StyledTableRow key={`${row.teamName}${row.points}`}>
                            <StyledTableCell align="center" size="small">{row.position}</StyledTableCell>
                            <StyledTableCell align="left" className={classes.teamName}>{row.teamName}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.played}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.won}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.drawn}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.lost}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.goalsFor}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.goalsAgainst}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.goalDifference}</StyledTableCell>
                            <StyledTableCell align="center" size="small">{row.points}</StyledTableCell>
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

//     id: index,
// export function DataTable(props) {
//     const rows = props.tableData.map((team, index) => (
//         {
//             id: index,
//             teamName: team.teamDetails.teamName.toUpperCase(),
//             position: index+1,
//             played: team.played,
//             won: team.won,
//             drawn: team.drawn,
//             lost: team.lost,
//             goalsFor: team.goalsFor,
//             goalsAgainst: team.goalsAgainst,
//             goalDifference: team.goalDifference,
//             points: team.points
//         }
//     ));
//     return (
//         <div style={{width: '100%' }}>
//             <DataGrid rows={rows}
//                       rowHeight={35}
//                       autoHeight={true}
//                       columns={columns}
//                       pageSize={30}
//                       hideFooter={true}
//                       hideFooterPagination={true}
//             />
//         </div>
//     );
// }
//     teamName: team.teamDetails.teamName.toUpperCase(),
//     position: index+1,
//     played: team.played,
//     won: team.won,
//     drawn: team.drawn,
//     lost: team.lost,
//     goalsFor: team.goalsFor,
//     goalsAgainst: team.goalsAgainst,
//     goalDifference: team.goalDifference,
//     points: team.points
// }
// const columns = [
//     { field: 'id', headerName: 'Pos', width: 100 },
//     { field: 'teamName', headerName: 'Team', width: 200},
//     { field: 'played', headerName: 'P', type: 'number', width: 100 },
//     { field: 'won', headerName: 'W', type: 'number', width: 100 },
//     { field: 'drawn', headerName: 'D', type: 'number', width: 100 },
//     { field: 'lost', headerName: 'L', type: 'number', width: 100 },
//     { field: 'goalsFor', headerName: 'GF', type: 'number', width: 100 },
//     { field: 'goalsAgainst', headerName: 'GA', type: 'number', width: 100 },
//     { field: 'goalDifference', headerName: 'GD', type: 'number', width: 100 },
//     { field: 'points', headerName: 'Pts', type: 'number', width: 100 },
// ];