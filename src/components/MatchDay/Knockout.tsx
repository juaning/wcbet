import React from 'react';
import styled from "styled-components"
import * as Yup from "yup";
import { FormControlLabel, Radio } from '@mui/material';
import { Formik, Field, Form } from "formik";
import { RadioGroup } from 'formik-mui';
import { useAuth0 } from '@auth0/auth0-react';
import { IMatchDay } from './MatchDayItem';
import Autosave from '../Helpers/Autosave';
import {
  MatchTypeEnum,
  TeamBetTypeEnum,
  cup2022API,
  cup2022Options
} from '../../config';
import { ITeamBet } from '../Helpers/Champion';

export interface IKnockoutProps {
  isBetLock: boolean;
  match: IMatchDay;
  knockoutBet?: ITeamBet;
  setKnockoutBet: (bet: ITeamBet) => void;
}

const KnockoutContainer = styled.div`
.form {
  div {
    display: grid;
    grid-template-columns: 50% 50%;
    label {
      justify-content: center;
    }
  }
}
`;

const Knockout = ({ isBetLock, match, knockoutBet, setKnockoutBet }: IKnockoutProps) => {
  let instance: number;
  const { getAccessTokenSilently } = useAuth0();

  switch(match.type) {
    case MatchTypeEnum.ROUND_OF_16:
      instance = TeamBetTypeEnum.ROUND_OF_16;
      break;
    case MatchTypeEnum.QUARTERFINAL:
      instance = TeamBetTypeEnum.QUARTERFINAL;
      break;
    case MatchTypeEnum.SEMIFINAL:
      instance = TeamBetTypeEnum.SEMIFINAL;
      break;
    case MatchTypeEnum.THIRD_PLACE:
      instance = TeamBetTypeEnum.THIRD_PLACE;
      break;
    case MatchTypeEnum.FINAL:
      instance = TeamBetTypeEnum.FINAL;
      break;
    default:
      instance = TeamBetTypeEnum.QUARTERFINAL;
  }

  const saveBet = async (values: ITeamBet): Promise<ITeamBet> => {
    const token = await getAccessTokenSilently()
    const fetchOptions = {
      ...cup2022Options,
      method: values.id ? "PUT" : "POST",
      headers: {
        ...cup2022Options.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }
    const response = await fetch(`${cup2022API}/user-team-bet`, fetchOptions);
    return response.json();
  }
  return (
    <KnockoutContainer>
      <h4>{match.type !== MatchTypeEnum.FINAL ? 'Avanza' : 'Campeón'}</h4>
      <Formik
        enableReinitialize
        initialValues={{teamId: knockoutBet?.teamId ? knockoutBet?.teamId : ''}}
        validationSchema={Yup.object({
          teamId: Yup.string().required('Tenes que elegir quien avanza.')
        })}
        onSubmit={async (values, { setSubmitting }) => {
          if (isBetLock || instance === -1) return;
          const data = knockoutBet && knockoutBet.id
            ? { ...knockoutBet, ...values }
            : { ...values, instance, matchId: match.id };
          try {
            const savedBet = await saveBet(data);
            console.log(savedBet);
            setKnockoutBet(savedBet);
          } catch (error) {
            console.error(error);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className='form'>
            <Field component={RadioGroup} name="teamId">
              <FormControlLabel
                value={match.home_team_id}
                control={<Radio disabled={isSubmitting || isBetLock} />}
                label={match.home_team_en}
                labelPlacement="start"
                disabled={isSubmitting || isBetLock}
              />
              <FormControlLabel
                value={match.away_team_id}
                control={<Radio disabled={isSubmitting || isBetLock} />}
                label={match.away_team_en}
                disabled={isSubmitting || isBetLock}
              />
            </Field>
            <Autosave debounceMs={1000} />
          </Form>
        )}
      </Formik>
    </KnockoutContainer>
  );
};

export default Knockout;