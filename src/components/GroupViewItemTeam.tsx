import React from 'react';

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
    }
}

const GroupViewItemTeam = ({ team }: IGroupViewItemTeam) => {
    if (!team) {
        return (
            <div className='team'>
                <div className='col'>
                    <span>Equipo</span>
                </div>
                <div className="col"><span>PJ</span></div>
                <div className="col"><span>G</span></div>
                <div className="col"><span>E</span></div>
                <div className="col"><span>P</span></div>
                <div className="col"><span>GF</span></div>
                <div className="col"><span>GE</span></div>
                <div className="col"><span>DG</span></div>
                <div className="col"><span>Pts</span></div>
            </div>
        );
    }
    return (
        <div className='team'>
            <div className='col'>
                <img src={team.flag} alt={`Picture of ${team.name_en}`} />
                <span>{team.name_en}</span>
            </div>
            <div className="col">{team.mp}</div>
            <div className="col">{team.w}</div>
            <div className="col">{team.d}</div>
            <div className="col">{team.l}</div>
            <div className="col">{team.gf}</div>
            <div className="col">{team.ga}</div>
            <div className="col">{team.gd}</div>
            <div className="col">{team.pts}</div>
        </div>
    )
}

export default GroupViewItemTeam;