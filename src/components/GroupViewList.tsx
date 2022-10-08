import { group } from 'console';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { cup2022API, cup2022Options, cup2022APIStatusResponseEnum } from '../config';
import GroupViewItem, { IGroupViewItemProps } from './GroupViewItem';

interface IStandingsResponse {
    status: cup2022APIStatusResponseEnum.SUCCESS | cup2022APIStatusResponseEnum.ERROR;
    data?: Array<IGroupViewItemProps>;
    message?: string;
}

const GroupViewListContainer = styled.div``;

const GroupViewList = () => {
    const [standings, setStandings] = useState<Array<IGroupViewItemProps>>();

    useEffect(() => {
        fetch(`${cup2022API}/standings`, cup2022Options)
        .then(response => response.json())
        .then((result: IStandingsResponse) => {
            if (result.status === cup2022APIStatusResponseEnum.SUCCESS) {
                setStandings(result.data);
            }
            if (result.status === cup2022APIStatusResponseEnum.ERROR) {
                throw new Error(result.message);
            }
        })
        .catch(err => console.error(err));
    }, []);

    return (
        <GroupViewListContainer>
            {standings?.map(groupStanding => <GroupViewItem
                group={groupStanding.group}
                teams={groupStanding.teams}
            />)}
        </GroupViewListContainer>
    )
};

export default GroupViewList;