import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { DateTime } from 'luxon';
import {
  cup2022API,
  cup2022Options,
  localDateFormat,
  MatchTimeElapsedEnum,
  qatarDateTimeFormat,
  qatarDateTimeZone
} from "../../config";
import MatchDayItem, {IMatchDay} from "./MatchDayItem";

export interface IAllMatchDays {
  [key: string]: {
    matchDate: string;
    matches: Array<IMatchDay>;
    isOpen: boolean;
  }
}

const MatchDayListContainer = styled.div``;

const MatchDayList = () => {
  const [matches, setMatches] = useState<IAllMatchDays>();
  const { getAccessTokenSilently } = useAuth0();

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      const fetchOptions = {
        ...cup2022Options,
        headers: {
          ...cup2022Options.headers,
          Authorization: `Bearer ${token}`
        }
      };
      fetch(`${cup2022API}/matches`, fetchOptions)
      .then((response): Promise<Array<IMatchDay>> => response.json())
      .then((matches: Array<IMatchDay>) => {
        // Group by match day
        const grouped = matches.reduce((matchdays: IAllMatchDays, match: IMatchDay) => {
          if (matchdays[match.matchday]) {
            matchdays[match.matchday].matches.push(match);
            matchdays[match.matchday].isOpen = match.time_elapsed !== MatchTimeElapsedEnum.FINISHED;
          } else {
            matchdays[match.matchday] = {
              matchDate: DateTime
                .fromFormat(match.local_date, qatarDateTimeFormat, qatarDateTimeZone)
                .toLocal().toFormat(localDateFormat),
              matches: [match],
              isOpen: match.time_elapsed !== MatchTimeElapsedEnum.FINISHED,
            }
          } return {...matchdays}}, {});
        // Sort by start time
        Object.keys(grouped).map(
          (key: string) => (
            grouped[key].matches.sort((a: IMatchDay, b: IMatchDay) => (
              (new Date(a.local_date)).valueOf() - (new Date(b.local_date)).valueOf()
            ))
          )
        );
        const sorted =  { ...grouped };
        setMatches(sorted);
      })
      .catch(err => console.error(err));
    })
  }, []);

  if (!matches) return null;

  /**
   * TODO:
   * Add logic to colapse passed matchday views
   */
  return (
    <MatchDayListContainer>
      {Object.keys(matches).map((key: string) => {
        return (
          <>
            <h3 key={key}>Match Day {key} - {matches[key].matchDate}</h3>
            {matches[key].matches.map((match: IMatchDay) => (<MatchDayItem match={match} key={match._id} />))}
          </>
        );
      })}
    </MatchDayListContainer>
  )
}

export default MatchDayList;