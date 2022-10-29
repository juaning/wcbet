import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { cup2022API, cup2022Options } from '../../config';
import GroupViewItem, { IGroupViewItemProps } from './GroupViewItem';

const GroupViewListContainer = styled.div``;

const GroupViewList = () => {
    const [standings, setStandings] = useState<Array<IGroupViewItemProps>>();
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
            fetch(`${cup2022API}/standings`, fetchOptions)
            .then((response): Promise<Array<IGroupViewItemProps>> => response.json())
            .then((result: Array<IGroupViewItemProps>) => {
                setStandings(result);
            })
            .catch(err => console.error(err));
        });
    }, []);

    if (!standings) {
        return (
            <GroupViewListContainer>
                No standings at the moment
            </GroupViewListContainer>
        );
    }

    return (
        <GroupViewListContainer>
            {standings?.map(groupStanding => <GroupViewItem
                group={groupStanding.group}
                teams={groupStanding.teams}
                key={groupStanding._id}
            />)}
        </GroupViewListContainer>
    )
};

export default GroupViewList;