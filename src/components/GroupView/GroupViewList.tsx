import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import { isEmpty } from 'lodash';
import { cup2022API, cup2022Options } from '../../config';
import GroupViewItem, { IGroupViewItem } from './GroupViewItem';
import { ITeamBet } from '../Helpers/Champion';

/**
 * TODO:
 * [x] Add form to save 1st & 2nd from group
 * [x] Fetch team bet values
 */

export interface IGroupViewData {
    group: IGroupViewItem,
    bets: Array<ITeamBet>
}

const GroupViewListContainer = styled.div``;

const GroupViewList = () => {
    const [standings, setStandings] = useState<Array<IGroupViewData>>();
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
            fetch(`${cup2022API}/api-wc2022/standings`, fetchOptions)
            .then((response): Promise<Array<IGroupViewItem>> => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json()
            })
            .then(async (result: Array<IGroupViewItem>) => {
                // Fetch team bets
                const groupsStandings = await Promise.all(result.map(async (group: IGroupViewItem) => {
                    const betsRaw = await fetch(`${cup2022API}/user-team-bet/group/${group._id}`, fetchOptions);
                    const bets: Array<ITeamBet> = await betsRaw.json();
                    return ({
                        group,
                        bets
                    })
                }));
                setStandings(groupsStandings);
            })
            .catch(err => console.error(err));
        });
    }, []);

    if (!standings || isEmpty(standings)) {
        return (
            <GroupViewListContainer>
                No standings at the moment
            </GroupViewListContainer>
        );
    }

    return (
        <GroupViewListContainer>
            {standings?.map(standing => <GroupViewItem
                group={standing}
                key={standing.group._id}
            />)}
        </GroupViewListContainer>
    )
};

export default GroupViewList;