import React, { SyntheticEvent, useState } from 'react';
import styled from 'styled-components';
import GroupViewItemTeam, { IGroupViewItemTeam } from './GroupViewItemTeam';
import FormDialog from './GroupWinnersModal';
import {
    canBetChamNGroups,
    TeamBetTypeEnum,
    lastMatchDateTimePerGroup,
    transformDateTimeToLocal,
    TGroups,
    points,
    MatchTypeEnum
} from '../../config';
import { IGroupViewData } from './GroupViewList';
import { ITeamBet } from '../Helpers/Champion';
import { DateTime } from 'luxon';

export interface IGroupViewItem {
    _id?: string;
    group: string;
    teams: Array<IGroupViewItemTeam["team"]>;
};

export interface IGroupViewItemProps {
    group: IGroupViewData;
}

export interface IGroupWinners {
    winner: string;
    second: string;
}

const GroupViewContainer = styled.div`
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.23);
    padding: 8px;
    margin-bottom: 12px;
    min-width: 640px;

    &.active:hover {
        border: 1px solid rgba(0, 0, 0, 0.87);
        cursor: pointer;
    }

    .title {
        display: grid;
        grid-template-columns: 70% 30%;

        .points {
        color: green;
        text-align: right;
        }
    }
`

const GroupViewItem = ({ group }: IGroupViewItemProps) => {
    const [open, setModalOpen] = useState<boolean>(false);
    const [groupWinners, setGroupWinners] = useState<IGroupWinners>({
        winner: group.bets.find(bet => bet.instance === TeamBetTypeEnum.GROUP_WINNER)?.teamId || '',
        second: group.bets.find(bet => bet.instance === TeamBetTypeEnum.GROUP_SECOND)?.teamId || ''
    });
    const [groupBets, setGroupBets] = useState<Array<ITeamBet>>(group.bets);
    const onGroupClick = () => {
        if (canBetChamNGroups()) return;
        setModalOpen(true);
    }
    const handleClose = (event: SyntheticEvent) => {
        event.stopPropagation();
        setModalOpen(false);
    };
    const calculatePts = (teams: Array<IGroupViewItemTeam["team"]>): number => {
        let pts = 0;
        if (teams[0]?.team_id === groupWinners.winner) {
            pts += points[MatchTypeEnum.GROUP].advances || 0;
        }
        if (teams[1]?.team_id === groupWinners.second) {
            pts += points[MatchTypeEnum.GROUP].advances || 0;
        }
        if (teams[0]?.team_id === groupWinners.second) {
            pts += points[MatchTypeEnum.GROUP].advancesAsSecond || 0;
        }
        if (teams[1]?.team_id === groupWinners.winner) {
            pts += points[MatchTypeEnum.GROUP].advancesAsSecond || 0;
        }
        return pts;
    }
    const groupName = group.group.group as TGroups;
    const now = DateTime.now().toLocal();
    const lastGameDT = transformDateTimeToLocal(lastMatchDateTimePerGroup[groupName]);
    const isGroupDefined = now >= lastGameDT;
    const hasBet = groupWinners.winner !== '' || groupWinners.second !== '';
    const teamsList = group.group.teams
        .sort((a, b) => Number(b?.pts) - Number(a?.pts))

    const wonPts = isGroupDefined && hasBet ? calculatePts(teamsList) : undefined;

    return (
        <GroupViewContainer onClick={onGroupClick} className={canBetChamNGroups() ? '' : 'active'}>
            <FormDialog
                open={open}
                handleClose={handleClose}
                group={group.group.group}
                teams={group.group.teams}
                bets={groupBets}
                groupId={group.group._id}
                groupWinners={groupWinners}
                setGroupWinners={setGroupWinners}
                setGroupBets={setGroupBets}
            />
            <div className='title'>
                <h3>Group {group.group.group}</h3>
                {wonPts !== undefined && <h3 className='points'>{`${wonPts > 0 ? '+ ' : ''}${wonPts}`}</h3>}
            </div>
            <GroupViewItemTeam />
            {teamsList.map(team => {
                let position;
                if (team?.team_id === groupWinners.winner) {
                    position = TeamBetTypeEnum.GROUP_WINNER;
                } else if (team?.team_id === groupWinners.second) {
                    position = TeamBetTypeEnum.GROUP_SECOND;
                }
                return (
                    <GroupViewItemTeam team={team} key={team?.team_id} position={position} />
                )
            })}
        </GroupViewContainer>
    )
};

export default GroupViewItem;