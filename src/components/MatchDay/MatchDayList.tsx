import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { cup2022API, cup2022Options } from "../../config";
import MatchDayItem, {IMatchDay} from "./MatchDayItem";

export interface IAllMatchDays {
  [key: string]: Array<IMatchDay>;
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
            matchdays[match.matchday].push(match)
          } else {
            matchdays[match.matchday] = [match]
          } return {...matchdays}}, {});
        // Sort by start time
        Object.keys(grouped).map(
          (key: string) => (
            grouped[key].sort((a: IMatchDay, b: IMatchDay) => (
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
            <h3 key={key}>Match Day {key}</h3>
            {matches[key].map((match: IMatchDay) => (<MatchDayItem match={match} key={match._id} />))}
          </>
        );
      })}
    </MatchDayListContainer>
  )
}

export default MatchDayList;