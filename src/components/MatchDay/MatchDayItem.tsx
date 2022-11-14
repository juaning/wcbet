import React, { useState } from "react"
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
  transformDateTimeToLocal
} from "../../config"
import Team from "./Team"
import Autosave from "../Helpers/Autosave"

export enum MatchTypeEnum {
  GROUP = 'group',
  ROUND_OF_16 = 'R16',
  QUARTERFINAL = 'QR',
  THIRD_PLACE = '3RD',
  SEMIFINAL = 'SF',
  FINAL = 'FIN',
}

export interface IMatchDay {
  _id: string
  away_score: number
  away_scorers: string[]
  away_team_id: string
  finished: string
  group: string
  home_score: number
  home_scorers: string[]
  home_team_id: string
  id: string
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
  /**
   * TODO:
   * [x] Add form to load bets
   * [ ] Add logic to show form if match has not started
   * [ ] Show score if match has started or finished
   * [ ] Add styles
   * [x] Fetch bet data from endpoint
   */
  const { getAccessTokenSilently } = useAuth0()
  const [isCreated, setIsCreated] = useState<boolean>(!!matchBet)
  const date = DateTime.fromFormat(
    match.local_date,
    qatarDateTimeFormat,
    qatarDateTimeZone
  )

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

  const now = DateTime.now().toLocal();
  const matchDateTime = transformDateTimeToLocal(match.local_date);

  const isBetLock = now >= matchDateTime;

  return (
    <MatchDayItemContainer>
      <h4>Hora: {date.toLocal().toFormat(localTimeFormat)}</h4>
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
            .min(0, "El numero tiene que ser como mínimo 0.")
            .max(20, "El máximo número de goles permitidos es 20.")
            .integer()
            .nullable(false),
          awayScore: Yup.number()
            .required('Goles de visitante es requerido.')
            .typeError("Ingrese un numero valido.")
            .min(0, "El numero tiene que ser como mínimo 0.")
            .max(20, "El máximo número de goles permitidos es 20.")
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
    </MatchDayItemContainer>
  )
}

export default MatchDayItem
