import React from 'react';
import { Alert, Stack } from '@mui/material';
import { hasWCStarted } from '../../config';

const ChampNGroupsBetNotification = () => {
  if (hasWCStarted()) return null;
  return (
    <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error">El campeón y  el primero y segundo de cada grupo pueden elegirse hasta antes del inicio del campeonato mundial</Alert>
    </Stack>
  )
};

export default ChampNGroupsBetNotification;