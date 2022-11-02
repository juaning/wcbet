import React from "react";
import styled from "styled-components";
import * as Yup from 'yup';
import { DateTime } from 'luxon';
import { Formik, Field, Form, ErrorMessage } from "formik";
import { qatarDateTimeFormat, qatarDateTimeZone, localTimeFormat } from "../../config";
import TeamName from "../Helpers/TeamName";

export interface IMatchDay {
    _id: string;
    away_score: number;
    away_scorers: string[];
    away_team_id: string;
    finished: string;
    group: string;
    home_score: number;
    home_scorers: string[];
    home_team_id: string;
    id: string;
    local_date: string;
    matchday: string;
    persian_date: string;
    stadium_id: string;
    time_elapsed: string;
    type: string;
    home_team_fa: string;
    away_team_fa: string;
    home_team_en: string;
    away_team_en: string;
    home_flag: string;
    away_flag: string;
}

export interface IMatchDayProps {
  match: IMatchDay;
}

const MatchDayItemContainer = styled.div`
  border-bottom: 1px solid black;
  max-width: 800px;
  padding-bottom: 5px;

  .match-container {
    display: grid;
    grid-template-columns: 32% 12% 12% 12% 32%;
  }
`;

const MatchDayItem = ({ match }: IMatchDayProps) => {
  /**
   * TODO:
   * [ ] Add form to load bets
   * [ ] Add logic to show form if match has not started
   * [ ] Show score if match has started or finished
   * [ ] Add styles
   * [ ] Fetch bet data from endpoint
   */
  const date = DateTime.fromFormat(match.local_date, qatarDateTimeFormat, qatarDateTimeZone);

  return (
    <MatchDayItemContainer>
      <h4>Hora: {date.toLocal().toFormat(localTimeFormat)}</h4>
      <Formik
        initialValues={{
          homeScore: 0,
          awayScore: 0
        }}
        validationSchema={Yup.object({
          homeScore: Yup.number()
            .typeError('Ingrese un numero valido.')
            .min(0, 'El numero tiene que ser como mínimo 0.')
            .max(20, 'El máximo número de goles permitidos es 20.'),
          awayScore: Yup.number()
            .typeError('Ingrese un numero valido.')
            .min(0, 'El numero tiene que ser como mínimo 0.')
            .max(20, 'El máximo número de goles permitidos es 20.'),
        })}
        onSubmit={values => {console.log(values)}}
      >
        <Form>
          <div className="match-container">
            <TeamName flag={match.home_flag} name={match.home_team_en} />
            <Field name="homeScore" type="number" />
            <ErrorMessage name="homeScore" />
            {/* <span>{match.home_score}</span> */}
            <span>vs</span>
            <Field name="awayScore" type="number" />
            <ErrorMessage name="awayScore" />
            {/* <span>{match.away_score}</span> */}
            <TeamName flag={match.away_flag} name={match.away_team_en} />
          </div>
          <button type="submit">Save</button>
        </Form>
      </Formik>
    </MatchDayItemContainer>
  )
}

export default MatchDayItem;