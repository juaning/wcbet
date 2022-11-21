import React from 'react';
import { Alert, Stack, Typography } from '@mui/material';
import { canBetChamNGroups } from '../../config';

const ChampNGroupsBetNotification = () => {
  if (canBetChamNGroups()) return null;
  return (
    <Stack sx={{ width: '100%', marginBottom: '16px;' }} spacing={2}>
        <Alert severity="error">
          El campeón y  el primero y segundo de cada grupo pueden elegirse hasta después del último partido de la primera fecha. <Typography variant='body1' sx={{ fontWeight: 'bold'}}>Irán v Gales 25/11/2022 9:00 hrs.</Typography>
        </Alert>
    </Stack>
  )
};

export const GroupsBetsInfo = () => {
  if (canBetChamNGroups()) return null;
  return (
    <Stack sx={{ width: '100%', margin: '16px 0' }} spacing={2}>
        <Alert severity="info">
        Hacé click en el grupo para elegir al ganador y al segundo.
        </Alert>
    </Stack>
  )
}

export default ChampNGroupsBetNotification;