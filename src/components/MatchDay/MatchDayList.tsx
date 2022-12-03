import React, {useState, useEffect} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import styled from "styled-components";
import { styled as styledMUI } from '@mui/material/styles';
import { DateTime } from 'luxon';
import isEmpty from 'lodash/isEmpty';
import {
  cup2022API,
  cup2022Options,
  localDateFormat,
  MatchTimeElapsedEnum,
  MatchTypeEnum,
  qatarDateTimeFormat,
  qatarDateTimeZone,
  StageTitle,
  transformDateTimeToLocal,
} from "../../config";
import MatchDayItem, { IMatchDay, IMatchBet } from "./MatchDayItem";
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
    stage: MatchTypeEnum;
  }
}

// export type TStageGroup = {
//   [key: string]: {
//     matchDays: IAllMatchDays;
//     stageTitle: string;
//   }
// }

export type TStageGroup = {
  [key in MatchTypeEnum]?: {
    matchDays: IAllMatchDays;
    stageTitle: string;
  }
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

interface IExpandItem {
  [key: string]: boolean;
}

type TExpandStage = {
  [key in MatchTypeEnum]?: boolean
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
  const [stages, setStages] = useState<TStageGroup>();
  const [expanded, setExpanded] = useState<IExpandItem>({});
  const [stageExpanded, setStageExpanded] = useState<TExpandStage>({});
  const { getAccessTokenSilently } = useAuth0();

  const handleExpandClick = (id: string) => {
    const newExpanded = { ...expanded, [id]: !expanded[id] };
    setExpanded(newExpanded);
  }

  const handleStageExpandClick = (id: MatchTypeEnum) => {
    const newExpanded = { ...stageExpanded, [id]: !stageExpanded[id] };
    setStageExpanded(newExpanded);
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
                stage: match.type,
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
          // Group by stage
          const stage: TStageGroup = {};
          const stageExpandList: TExpandStage = {};
          Object.keys(sorted).forEach((key: string): void => {
            const instance: MatchTypeEnum = sorted[key].stage;
            stage[instance] = {
              stageTitle: StageTitle[instance],
              matchDays: {
                ...(stage[instance]?.matchDays),
                [key]: sorted[key]
              }
            };
            stageExpandList[instance] = DateTime.now().startOf('day') <= DateTime.fromFormat(sorted[key].matchDate, localDateFormat);
          });
          setExpanded(expandList);
          setStageExpanded(stageExpandList);
          setStages(stage);
        })
        .catch(err => console.error(err));
    })
  }, []);

  if (!stages) {
    return <Loader />
  }

  return (
    <MatchDayListContainer>
      {Object.keys(stages).map((key: string) => {
        return (
          <div key={`stage-${key}`}>
            <CollapsableTitle onClick={() => handleStageExpandClick(key as MatchTypeEnum)}>
              <h2>{stages[key as MatchTypeEnum]?.stageTitle}</h2>
              <ExpandMore
                expand={!!stageExpanded[key as MatchTypeEnum]}
                aria-expanded={stageExpanded[key as MatchTypeEnum]}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </ExpandMore>
            </CollapsableTitle>
            <Collapse in={stageExpanded[key as MatchTypeEnum]}  timeout="auto" unmountOnExit>
              {Object.keys(stages[key as MatchTypeEnum]?.matchDays ?? {}).map((mdKey: string) => (
                <div key={`match-day-${mdKey}`}>
                  <CollapsableTitle onClick={() => handleExpandClick(mdKey)}>
                    <h3>Match Day {mdKey} - {stages[key as MatchTypeEnum]?.matchDays[mdKey].matchDate}</h3>
                    <ExpandMore
                      expand={expanded[mdKey]}
                      aria-expanded={expanded[mdKey]}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </ExpandMore>
                  </CollapsableTitle>
                  <Collapse in={expanded[mdKey]}  timeout="auto" unmountOnExit>
                    {stages[key as MatchTypeEnum]?.matchDays[mdKey].matches.map((matchAndBet: IMatchAndBet) => (
                      <MatchDayItem
                        key={`match-${matchAndBet.match.id}`}
                        match={matchAndBet.match}
                        matchBet={matchAndBet.bet}
                      />))}
                  </Collapse>
                </div>
              ))}
            </Collapse>
          </div>
        );
      })}
    </MatchDayListContainer>
  )
}

export default MatchDayList;