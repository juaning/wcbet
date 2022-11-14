import React from 'react';
import styled from 'styled-components';
import { LooksOneOutlined, LooksTwoOutlined } from '@mui/icons-material';
import { TeamBetTypeEnum } from '../../config';

import TeamName from '../Helpers/TeamName';

export interface IGroupViewItemTeam {
    team?: {
        team_id: string;
        mp: string;
        w: string;
        l: string;
        pts: string;
        gf: string;
        ga: string;
        gd: string;
        d: string;
        name_en: string;
        flag: string;
    };
    position?: TeamBetTypeEnum;
}

const TeamRowContainer = styled.div`
    display: grid;
    gap: 1rem;
    grid-template-columns: 3fr repeat(8, 1fr);
    margin: 5px 0;
    padding: 5px 0;
    border-bottom: 1px solid #ecedef;
    font-size: 14px;

    .title {
        color: #70757a;
        font-size: 12px;
    }
`;

const GroupViewItemTeam = ({ team, position }: IGroupViewItemTeam) => {
    if (!team) {
        return (
            <TeamRowContainer>
                <div className='title'><span>Equipo</span></div>
                <div className="title"><span>PJ</span></div>
                <div className="title"><span>G</span></div>
                <div className="title"><span>E</span></div>
                <div className="title"><span>P</span></div>
                <div className="title"><span>GF</span></div>
                <div className="title"><span>GE</span></div>
                <div className="title"><span>DG</span></div>
                <div className="title"><span>Pts</span></div>
            </TeamRowContainer>
        );
    }
    let badge;
    if (position && position === TeamBetTypeEnum.GROUP_WINNER) {
        badge = <LooksOneOutlined />;
    } else if (position && position === TeamBetTypeEnum.GROUP_SECOND) {
        badge = <LooksTwoOutlined />;
    }
    return (
        <TeamRowContainer>
            <div className='col'>
                <TeamName flag={team.flag} name={team.name_en} badge={badge} />
            </div>
            <div className="col">{team.mp}</div>
            <div className="col">{team.w}</div>
            <div className="col">{team.d}</div>
            <div className="col">{team.l}</div>
            <div className="col">{team.gf}</div>
            <div className="col">{team.ga}</div>
            <div className="col">{team.gd}</div>
            <div className="col">{team.pts}</div>
        </TeamRowContainer>
    )
}

export default GroupViewItemTeam;