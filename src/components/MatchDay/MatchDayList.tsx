import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { styled as styledMUI } from '@mui/material/styles';
import { DateTime } from 'luxon';
import {
  cup2022API,
  cup2022Options,
  localDateFormat,
  MatchTimeElapsedEnum,
  qatarDateTimeFormat,
  qatarDateTimeZone,
  transformDateTimeToLocal
} from "../../config";
import MatchDayItem, { IMatchDay, IMatchBet } from "./MatchDayItem";
import { isEmpty } from "lodash";
import { Collapse } from "@mui/material";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Loader from "../Loader/Loader";

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

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface IExpandItem {
  [key: string]: boolean;
}

const ExpandMore = styledMUI((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const MatchDayListContainer = styled.div`
max-width: 640px;
margin: auto;
`;

const CollapsableTitle = styled.div`
  display: grid;
  grid-template-columns: 80% 20%;
`

const MatchDayList = () => {
  const [matches, setMatches] = useState<IAllMatchDays>();
  const [expanded, setExpanded] = useState<IExpandItem>({});
  const { getAccessTokenSilently } = useAuth0();

  const handleExpandClick = (id: string) => {
    const newExpanded = { ...expanded, [id]: !expanded[id] };
    setExpanded(newExpanded);
  }

  useEffect(() => {
    getAccessTokenSilently().then(token => {
      const fetchOptions = {
        ...cup2022Options,
        headers: {
          ...cup2022Options.headers,
          Authorization: `Bearer ${token}`
        }
      };

      const today = DateTime.now().toLocal();
      const fetchBets = fetch(`${cup2022API}/user-match-bet`, fetchOptions);
      const fetchMatches = fetch(`${cup2022API}/api-wc2022/matches`, fetchOptions);
      
      Promise.all([fetchBets, fetchMatches])
        .then((results) => Promise.all(results.map(r => r.json())))
        .then(([matchBets, matches]) => {
          if (isEmpty(matches)) return;
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
          let expandList = {};
          Object.keys(grouped).map(
            (key: string) => {
              const hasGameToday = grouped[key]
                .matches
                .find((matchBet: IMatchAndBet) => transformDateTimeToLocal(matchBet.match.local_date) >= today);
              expandList = { ...expandList, [key]: hasGameToday !== undefined };
              return (
              grouped[key].matches.sort((a: IMatchAndBet, b: IMatchAndBet) => (
                (new Date(a.match.local_date)).valueOf() - (new Date(b.match.local_date)).valueOf()
              ))
            )}
          );
          const sorted =  { ...grouped };
          setExpanded(expandList);
          setMatches(sorted);
        })
        .catch(err => console.error(err));
    })
  }, []);

  if (!matches) {
    return <Loader />
  }

  return (
    <MatchDayListContainer>
      {Object.keys(matches).map((key: string) => {
        return (
          <div key={`match-day-${key}`}>
            <CollapsableTitle onClick={() => handleExpandClick(key)}>
              <h3>Match Day {key} - {matches[key].matchDate}</h3>
              <ExpandMore
                expand={expanded[key]}
                aria-expanded={expanded[key]}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CollapsableTitle>
            <Collapse in={expanded[key]}  timeout="auto" unmountOnExit>
              {matches[key].matches.map((matchAndBet: IMatchAndBet) => (
                <MatchDayItem
                  key={`match-${matchAndBet.match.id}`}
                  match={matchAndBet.match}
                  matchBet={matchAndBet.bet}
                />))}
              </Collapse>
          </div>
        );
      })}
    </MatchDayListContainer>
  )
}

export default MatchDayList;