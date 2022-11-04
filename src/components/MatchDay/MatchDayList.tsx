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
import MatchDayItem, { IMatchDay, IMatchBet } from "./MatchDayItem";

export interface IMatchAndBet {
  match: IMatchDay;
  bet?: IMatchBet;
}
export interface IAllMatchDays {
  [key: string]: {
    matchDate: string;
    matches: Array<IMatchAndBet>;
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

      const fetchBets = fetch(`${cup2022API}/user-match-bet`, fetchOptions);
      const fetchMatches = fetch(`${cup2022API}/api-wc2022/matches`, fetchOptions);
      
      Promise.all([fetchBets, fetchMatches])
        .then((results) => Promise.all(results.map(r => r.json())))
        .then(([matchBets, matches]) => {
          // Group by match day
          const grouped = matches.reduce((matchdays: IAllMatchDays, match: IMatchDay) => {
            // Find bet
            const bet = matchBets?.find((matchBet: IMatchBet) => matchBet.matchId === match.id);
            if (matchdays[match.matchday]) {
              matchdays[match.matchday].matches.push({ match, bet });
              matchdays[match.matchday].isOpen = match.time_elapsed !== MatchTimeElapsedEnum.FINISHED;
            } else {
              matchdays[match.matchday] = {
                matchDate: DateTime
                  .fromFormat(match.local_date, qatarDateTimeFormat, qatarDateTimeZone)
                  .toLocal().toFormat(localDateFormat),
                matches: [{match, bet}],
                isOpen: match.time_elapsed !== MatchTimeElapsedEnum.FINISHED,
              }
            } return {...matchdays}}, {});
          // Sort by start time
          Object.keys(grouped).map(
            (key: string) => (
              grouped[key].matches.sort((a: IMatchAndBet, b: IMatchAndBet) => (
                (new Date(a.match.local_date)).valueOf() - (new Date(b.match.local_date)).valueOf()
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
            {matches[key].matches.map((matchAndBet: IMatchAndBet) => (
              <MatchDayItem
                key={matchAndBet.match._id}
                match={matchAndBet.match}
                matchBet={matchAndBet.bet}
              />))}
          </>
        );
      })}
    </MatchDayListContainer>
  )
}

export default MatchDayList;