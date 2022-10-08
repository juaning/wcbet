import React from 'react';
import styled from 'styled-components';

interface ITeamName {
    flag: string;
    name: string;
}

const TeamNameContainer = styled.div`
    display: grid;
    grid-template-columns: 20% 80%;
    img {
        width: 25px;
        margin: auto;
    }
`;

const TeamName = ({flag, name}: ITeamName) => (
    <TeamNameContainer>
        <img src={flag} alt={`Picture of ${name}`} />
        <span>{name}</span>
    </TeamNameContainer>
)

export default TeamName;