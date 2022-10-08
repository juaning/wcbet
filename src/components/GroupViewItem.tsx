import React from 'react';
import GroupViewItemTeam, { IGroupViewItemTeam } from './GroupViewItemTeam';

export interface IGroupViewItemProps {
    group: string;
    teams: Array<IGroupViewItemTeam["team"]>;
};

const GroupViewItem = (props: IGroupViewItemProps) => {
    return (
        <div>
            <h3>Group {props.group}</h3>
            <GroupViewItemTeam />
            {props.teams.map(team => {
                return (
                    <GroupViewItemTeam team={team} />
                )
            })}
        </div>
    )
};

export default GroupViewItem;