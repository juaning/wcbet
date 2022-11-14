import React, { SyntheticEvent } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { Formik, Field, Form } from "formik"
import { Select } from "formik-mui";
import { useAuth0 } from "@auth0/auth0-react";
import { IGroupViewItemTeam } from './GroupViewItemTeam';
import Autosave from '../Helpers/Autosave';
import { IGroupWinners } from './GroupViewItem';
import { ITeamBet } from '../Helpers/Champion';
import { cup2022API, cup2022Options, TeamBetTypeEnum } from '../../config'; 

export interface IFormDialogProps {
  open: boolean;
  handleClose: (event: SyntheticEvent) => void;
  group: string;
  teams: Array<IGroupViewItemTeam["team"]>;
  bets: Array<ITeamBet>;
  groupId?: string;
  groupWinners: IGroupWinners;
  setGroupWinners: (winners: IGroupWinners) => void;
  setGroupBets: (bets: Array<ITeamBet>) => void;
}

export default function GroupWinnersModal({
  open,
  handleClose,
  group,
  teams,
  bets,
  groupId,
  groupWinners,
  setGroupWinners,
  setGroupBets,
}: IFormDialogProps) {
  /**
   * TODO: 
   * [ ] Add logic to remove selected option from the other dropdown
   * [x] Add autosave
   * [x] Add bets to initialy populate
   * [ ] Save to endpoint
   */
   const { getAccessTokenSilently } = useAuth0();
   
   const saveTeamBet = async (values: Array<ITeamBet>): Promise<Array<ITeamBet>> => {
    const token = await getAccessTokenSilently()
    const fetchOptions = values.map(bet => ({
      ...cup2022Options,
      method: bet.id ? "PUT" : "POST",
      headers: {
        ...cup2022Options.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bet),
    }));
    const promises: Array<Promise<Response>> = [];
    values.forEach((bet, index) => {
      if (values[index].teamId.length > 0) {
        promises.push(fetch(`${cup2022API}/user-team-bet`, fetchOptions[index]));
      }
    });
    const response = await Promise.all(promises);
    return Promise.all(response.map(bet => bet.json()));
  }
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ganadores del Grupo {group}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Elegi el ganador y segundo del Grupo {group}
          </DialogContentText>
          <Formik
            enableReinitialize
            initialValues={groupWinners}
            onSubmit={async (values, { setSubmitting }) => {
              const data = [
                {
                  id: bets.find(bet => bet.instance === TeamBetTypeEnum.GROUP_WINNER)?.id,
                  groupId,
                  teamId: values.winner,
                  instance: TeamBetTypeEnum.GROUP_WINNER,
                }, {
                  id: bets.find(bet => bet.instance === TeamBetTypeEnum.GROUP_SECOND)?.id,
                  groupId,
                  teamId: values.second,
                  instance: TeamBetTypeEnum.GROUP_SECOND,
                }
              ];
              try {
                const saved = await saveTeamBet(data);
                if (bets.length < 1) {
                  setGroupBets([...bets, ...saved]);
                } else {
                  saved.sort((a, b) => a.instance - b.instance);
                  setGroupBets([...saved]);
                }
                setGroupWinners(values);
              } catch (error) {
                console.error(error);
              } finally {
                setSubmitting(false);
              }
            }}
          >
            <Form>
              <FormControl sx={{ width: 1, mt: 2 }}>
                <Field
                  name="winner"
                  label="Ganador"
                  component={Select}
                >
                  {teams.map(team => (
                    <MenuItem key={team?.team_id} value={team?.team_id}>{team?.name_en}</MenuItem>
                  ))}
                </Field>
              </FormControl>
              <FormControl sx={{ width: 1, mt: 2 }}>
                <Field
                  name="second"
                  label="Segundo"
                  component={Select}
                >
                  {teams.map(team => (
                    <MenuItem key={team?.team_id} value={team?.team_id}>{team?.name_en}</MenuItem>
                  ))}
                </Field>
              </FormControl>
              <Autosave debounceMs={1000} />
            </Form>
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}