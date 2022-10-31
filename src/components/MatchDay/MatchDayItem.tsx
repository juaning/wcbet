import React from "react";
import styled from "styled-components";
import { DateTime } from 'luxon';
import { qatarDateTimeFormat, qatarDateTimeZone, localDateTimeFormat } from "../../config";
import TeamName from "../TeamName";

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

const MatchDayItemContainer = styled.div``;

const MatchDayItem = ({ match }: IMatchDayProps) => {
  const date = DateTime.fromFormat(match.local_date, qatarDateTimeFormat, qatarDateTimeZone);
  /**
   * TODO:
   * Add form to load bets
   * Add logic to show form if match has not started
   * Show score if match is started or finished
   */
  return (
    <MatchDayItemContainer>
      <h4>Hora: {date.toLocal().toFormat(localDateTimeFormat)}</h4>
      <TeamName flag={match.home_flag} name={match.home_team_en} />
      vs
      <TeamName flag={match.away_flag} name={match.away_team_en} />
    </MatchDayItemContainer>
  )
}

export default MatchDayItem;