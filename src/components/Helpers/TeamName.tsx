import React from 'react';
import styled from 'styled-components';

interface ITeamName {
    flag: string;
    name: string;
    badge?: JSX.Element;
}

const TeamNameContainer = styled.div`
    display: grid;
    grid-template-columns: 15% 65% 10%;
    gap: 5%;
    img {
        width: 25px;
        margin: auto;
    }
`;

const TeamName = ({flag, name, badge}: ITeamName) => (
    <TeamNameContainer>
        <img src={flag} alt={`Picture of ${name}`} />
        <span>{name}</span>
        {badge}
    </TeamNameContainer>
)

export default TeamName;