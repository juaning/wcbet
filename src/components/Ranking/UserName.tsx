import React from 'react';
import styled from 'styled-components';

interface ITeamName {
    flag: string;
    name: string;
    badge?: JSX.Element;
    position?: number;
}

const TeamNameContainer = styled.div`
    display: grid;
    grid-template-columns: 5% 12% 12% 62%;
    gap: 2.5%;
    img {
        width: 25px;
        margin: auto;
    }
    span {
      padding-left: 6px;
    }
`;

const UserName = ({flag, name, badge, position}: ITeamName) => (
    <TeamNameContainer>
        {position ? position : <span />}
        {badge ? badge : <span />}
        <img src={flag} alt={`Picture of ${name}`} />
        <span>{name}</span>
    </TeamNameContainer>
)

export default UserName;