import { useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Button } from '@mui/material';
import Moment from 'react-moment';
import { useSelector } from 'react-redux';
import { selectTournaments } from '@store/lobby/selectors';
import moment from 'moment';

const columns = [
    { id: 'name', label: 'Tournament', minWidth: 170 },
    { id: 'entries', label: 'Entries', minWidth: 100 },
    { id: 'start', label: 'Start', minWidth: 100 },
    { id: 'end', label: 'End', minWidth: 100 },
    { id: 'reg_end', label: 'Registration Ends', minWidth: 100, },
    {
        id: 'buyin',
        label: 'Buy In',
        align: 'right',
        // format: (value) => '$'+value.toFixed(2),
      },
    {
      id: 'prize',
      label: 'Prize Pool',
      align: 'right',
      // format: (value) => '$'+value.toFixed(2),
    },
    { id: 'statusMessage', label: 'Status', minWidth: 100 },
  ];
  const TOURNAMENT_STATUS_MESSAGES = ['Registering', 'Running', 'Ended'];

  function statusMessage(tournament) {
    let message = 'Registering'
    if(tournament.gameweek_start.start - 3600 > moment().unix()){
      if(tournament.playerEntries && tournament.playerEntries > 0){
        message = 'Registered'
        if(tournament.playerEntries >= 1)message+='('+tournament.playerEntries+')'
      }
    }else{
      if(tournament.gameweek_end.end > moment().unix()){
        message = 'Ended'
      }else{
        message = 'Running'
      }
    }
    
    return message;
  }

  function calculateLobbyRowStyle(playerEntries) {
    let styles = {}
    if(playerEntries>0)
        styles = {fontStyle: 'italic', fontWeight: 'bold'}
    return styles;
  }

const LobbyTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const tournaments = useSelector((state) => selectTournaments(state));
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleRegisterTournament = (tournamentId) => {
    console.log('registering at tournament #'+tournamentId);
  }
  
  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tournaments && tournaments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id} style={calculateLobbyRowStyle(row.entries)}>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}}>
                        <a href={'/tournament-lobby/'+row.id}>{row.name}</a>
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}}>
                        {row.entries}
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}}>
                        {row.gameweek_start.name}
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}}>
                        {row.gameweek_end.name}
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}}>
                        <Moment fromNow>{1000*(row.gameweek_start.start - 3600)}</Moment>
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}} align='right'>
                        ${row.buy_in.toFixed(2)}
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}} align='right'>
                        ${row.prize_pool.toFixed(2)}
                    </TableCell>
                    <TableCell style={{fontWeight: 'inherit', color: 'inherit'}}>
                        {(row.gameweek_start.start - 3600 > moment().unix())
                         ? 
                         <Button
                            variant="contained"
                            color={row.entries > 0 ? "primary" : "secondary"}
                            onClick={() => {
                                handleRegisterTournament(row.id);
                            }}
                        > {statusMessage(row)}</Button>
                          : statusMessage(row)}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={tournaments.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

export default LobbyTable