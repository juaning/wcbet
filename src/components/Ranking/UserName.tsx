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
    grid-template-columns: 7% 8% 12% 57%;
    gap: 5%;
    img {
        width: 25px;
        margin: auto;
    }
`;

const UserName = ({flag, name, badge, position}: ITeamName) => (
    <TeamNameContainer>
        {position}
        {badge}
        <img src={flag} alt={`Picture of ${name}`} />
        <span>{name}</span>
    </TeamNameContainer>
)

export default UserName;