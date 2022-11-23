import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { cup2022API, cup2022Options } from '../../config';
import UserName from './UserName';
import { CreditCardOffOutlined } from '@mui/icons-material';

export interface UserItem {
  pts: number;
  name: string;
  paid: boolean;
  groups: Array<string>;
  championFlag: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Ranking = () => {
  const [users, setUsers] = useState<Array<UserItem>>([]);

  useEffect(() => {
    fetch(`${cup2022API}/user/all`, cup2022Options)
      .then((result) => result.json())
      .then((usersAPI: Array<UserItem>) => setUsers(usersAPI))
      .catch(err => console.error(err));
  }, []);
  let lastPoints = 0;
  return (
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Jugador</StyledTableCell>
            <StyledTableCell align="right">Puntos</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => {
            let printPosition = false;
            if (lastPoints !== user.pts) {
              lastPoints = user.pts;
              printPosition = true;
            }
            return (
            <StyledTableRow key={user.name}>
              <StyledTableCell component="th" scope="row">
                <UserName
                  flag={user.championFlag}
                  name={user.name}
                  position={printPosition ? index + 1 : undefined}
                  badge={!user.paid ? undefined : <CreditCardOffOutlined color='warning' />}
                />
              </StyledTableCell>
              <StyledTableCell align="right">{user.pts}</StyledTableCell>
            </StyledTableRow>
          )})}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Ranking;