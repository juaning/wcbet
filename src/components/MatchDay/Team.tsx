import React from "react";
import styled from "styled-components";

interface ITeamProps {
  flag: string;
  name: string;
}

const TeamContainer = styled.div`
display: grid;
grid-row: auto;
img {
  width: 75px;
  height: 45px;
  margin: auto;
  border: 1px solid black;
  border-radius: 5px;
}
span {
  padding-top: 6px;
  margin: auto;
}
`;

const Team = ({ flag, name }: ITeamProps) => (
  <TeamContainer>
    <img src={flag} alt={`Flag of ${name}`} />
    <span>{name}</span>
  </TeamContainer>
);

export default Team;