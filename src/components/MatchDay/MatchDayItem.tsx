import React, { useState, useEffect } from "react"
import styled from "styled-components"
import * as Yup from "yup"
import { DateTime } from "luxon"
import { Formik, Field, Form } from "formik"
import { TextField } from "formik-mui";
import { useAuth0 } from "@auth0/auth0-react"
import { InputAdornment } from "@mui/material"
import { SportsSoccer } from "@mui/icons-material"
import {
  qatarDateTimeFormat,
  qatarDateTimeZone,
  localTimeFormat,
  cup2022Options,
  cup2022API,
  MatchTypeEnum,
  MatchTimeElapsedEnum,
  points,
  transformDateTimeToLocal,
  MatchDefinedEnum
} from "../../config"
import Team from "./Team"
import Knockout from "./Knockout";
import Autosave from "../Helpers/Autosave"
import { ITeamBet } from '../Helpers/Champion';

export interface IMatchDay {
  _id: string
  away_score: number
  away_extra_time_score?: number
  away_penalties_score?: number
  away_scorers: string[]
  away_team_id: string
  finished: string
  group: string
  home_score: number
  home_extra_time_score?: number
  home_penalties_score?: number
  home_scorers: string[]
  home_team_id: string
  id: string
  matchDefined?: MatchDefinedEnum 
  local_date: string
  matchday: string
  persian_date: string
  stadium_id: string
  time_elapsed: string
  type: MatchTypeEnum
  home_team_fa: string
  away_team_fa: string
  home_team_en: string
  away_team_en: string
  home_flag: string
  away_flag: string
}

export interface IMatchBet {
  matchId: string
  awayScore: number
  homeScore: number
}

export interface IMatchDayProps {
  match: IMatchDay
  matchBet?: IMatchBet
}

const ExtraScoreContainer = styled.div`
  justify-content: center;
  display: grid;
  grid-template-columns: 25% 25% 25%;
  span {
    margin: auto;
  }

`

const ExtraResult = styled.span`
font-size: small;
color: gray;
`;

const DefinedAfterRegTime = styled.div`
display: flex;
justify-content: center;
`;

const MatchDayItemContainer = styled.div`
  border-bottom: 1px solid black;
  max-width: 800px;
  padding-bottom: 5px;

  /**
   * Remove incrementals from number fields
   */
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }

  .title {
    display: grid;
    grid-template-columns: 70% 30%;

    .points {
      color: green;
      text-align: right;
    }
  }

  .result-values {
    font-size: larger;
    font-weight: bold;
    margin: auto;
  }

  .bet-values {
    padding-top: 5px;
    font-weight: bold;
    margin: auto;
    display: block;
  }

  .match-container {
    display: grid;
    grid-template-columns: 32% 12% 12% 12% 32%;
  }

  .match-bet-container {
    margin-top: 12px;
    display: flex;
    justify-content: space-between;
  }
`;

const MatchDayItem = ({ match, matchBet }: IMatchDayProps) => {
  const { getAccessTokenSilently } = useAuth0();
  const [isCreated, setIsCreated] = useState<boolean>(!!matchBet);
  const [knockoutBet, setKnockoutBet] = useState<ITeamBet>();
  const date = DateTime.fromFormat(
    match.local_date,
    qatarDateTimeFormat,
    qatarDateTimeZone
  );

  useEffect(() => {
    getAccessTokenSilently().then(async token => {
      const fetchOptions = {
        ...cup2022Options,
        headers: {
          ...cup2022Options.headers,
          Authorization: `Bearer ${token}`
        }
      };

      const response = await fetch(`${cup2022API}/user-team-bet/match/${match.id}`, fetchOptions);
      const bet = await response.json();
      if (bet) {
        setKnockoutBet(bet);
      }
    })
  }, []);

  const saveMatchBet = async (values: IMatchBet, isUpdate: boolean = false) => {
    const token = await getAccessTokenSilently()
    const fetchOptions = {
      ...cup2022Options,
      method: isUpdate ? "PUT" : "POST",
      headers: {
        ...cup2022Options.headers,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(values),
    }
    const updateUrl = isUpdate ? `/${values.matchId}` : ""
    return fetch(`${cup2022API}/user-match-bet${updateUrl}`, fetchOptions)
  }

  const calculateMatchPoints = (match: IMatchDay, bet: IMatchBet): number | undefined => {
    if (
      match &&
      (match.time_elapsed === MatchTimeElapsedEnum.FINISHED ||
        match.finished === 'TRUE')
    ) {
      let newPts = 0;
      // Calculate who won
      const awayWon =
        match.away_score > match.home_score && bet.awayScore > bet.homeScore;
      const homeWon =
        match.away_score < match.home_score && bet.awayScore < bet.homeScore;
      const draw =
        match.away_score === match.home_score &&
        bet.awayScore === bet.homeScore;
      if (awayWon || homeWon || draw) {
        newPts += points[match.type].winOrDraw;
      }
      // Calculate result points
      const resultMatches =
        match.away_score === bet.awayScore &&
        match.home_score === bet.homeScore;
      if (resultMatches) {
        newPts += points[match.type].result;
      }

      // Calculate knockout stage points
      if (knockoutBet && knockoutBet.matchId) {
        let goalDiff = 0;
        switch (match.matchDefined) {
          case MatchDefinedEnum.EXTRA_TIME:
            goalDiff =
              (match.away_extra_time_score || 0) - (match.home_extra_time_score || 0);
            break;
          case MatchDefinedEnum.PENALTIES:
            goalDiff =
              (match.away_penalties_score || 0) - (match.home_penalties_score || 0);
            break;
          case MatchDefinedEnum.REGULAR:
          default:
            goalDiff = match.away_score - match.home_score;
        }
        const awayAdvances = goalDiff > 0 && match.away_team_id === knockoutBet.teamId;
        const homeAdvances = goalDiff < 0 && match.home_team_id === knockoutBet.teamId;
        if (awayAdvances || homeAdvances) {
          newPts += (points[match.type].advances || 0);
        }
      }

      return newPts;
    }
    return;
  }

  const now = DateTime.now().toLocal();
  const matchDateTime = transformDateTimeToLocal(match.local_date);

  const isBetLock = now >= matchDateTime;
  const wonPts = matchBet ? calculateMatchPoints(match, matchBet) : undefined;

  return (
      <MatchDayItemContainer>
        <div className="title">
          <h4>Hora: {date.toLocal().toFormat(localTimeFormat)}</h4>
          {wonPts !== undefined && <h4 className="points">{`${wonPts > 0 ? '+ ' : ''}${wonPts}`}</h4>}
        </div>
        <Formik
          enableReinitialize
          initialValues={{
            homeScore: matchBet ? matchBet.homeScore : 0,
            awayScore: matchBet ? matchBet.awayScore : 0,
          }}
          validationSchema={Yup.object({
            homeScore: Yup.number()
              .required('Goles de local es requerido.')
              .typeError("Ingrese un numero valido.")
              .min(0, "El numero tiene que ser como m??nimo 0.")
              .max(20, "El m??ximo n??mero de goles permitidos es 20.")
              .integer()
              .nullable(false),
            awayScore: Yup.number()
              .required('Goles de visitante es requerido.')
              .typeError("Ingrese un numero valido.")
              .min(0, "El numero tiene que ser como m??nimo 0.")
              .max(20, "El m??ximo n??mero de goles permitidos es 20.")
              .integer()
              .nullable(false),
          })}
          onSubmit={async (values, { setSubmitting }) => {
            const data = { ...values, matchId: match.id }
            try {
              if (!isCreated) {
                await saveMatchBet(data)
                setIsCreated(true)
              } else {
                await saveMatchBet(data, true)
              }
            } catch (error) {
              console.log(error)
            } finally {
              setSubmitting(false)
            }
          }}
        >
          <Form>
            <div className="match-container">
              <Team flag={match.home_flag} name={match.home_team_en} />
              <span className="result-values">{match.home_score}</span>
              <span className="result-values">vs</span>
              <span className="result-values">{match.away_score}</span>
              <Team flag={match.away_flag} name={match.away_team_en} />
            </div>
            <DefinedAfterRegTime>
                {match.matchDefined === MatchDefinedEnum.EXTRA_TIME && (<ExtraResult >
                  <ExtraScoreContainer>
                    <span>{match.home_extra_time_score}</span>
                    <span> - </span>
                    <span>{match.away_extra_time_score}</span>
                  </ExtraScoreContainer>
                  <div>Tiempo extra</div>
                </ExtraResult>)}
                {match.matchDefined === MatchDefinedEnum.PENALTIES && (<ExtraResult>
                  <ExtraScoreContainer>
                    <span>{match.home_penalties_score}</span>
                    <span> - </span>
                    <span>{match.away_penalties_score}</span>
                  </ExtraScoreContainer>
                  <div>Penales</div>
                </ExtraResult>)}
              </DefinedAfterRegTime>
            <div className="bet-values">Tu apuesta</div>
            <div className="match-bet-container">
              <Field
                name="homeScore"
                type="number"
                component={TextField}
                inputProps={{style: {textAlign: 'center'}}}
                InputProps={{
                  readOnly: isBetLock,
                  startAdornment: (
                    <InputAdornment position="end">
                      <SportsSoccer />
                    </InputAdornment>
                  )
                }}
              />
              <Field
                name="awayScore"
                type="number"
                component={TextField}
                inputProps={{style: {textAlign: 'center'}}}
                InputProps={{
                  readOnly: isBetLock,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SportsSoccer />
                    </InputAdornment>
                  )
                }}
              />
            </div>
            <Autosave debounceMs={1000} />
          </Form>
        </Formik>
        {match.type !== MatchTypeEnum.GROUP
          && <Knockout
            isBetLock={isBetLock}
            match={match}
            knockoutBet={knockoutBet}
            setKnockoutBet={setKnockoutBet}
          />}
      </MatchDayItemContainer>
  )
}

export default MatchDayItem
