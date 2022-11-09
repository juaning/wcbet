import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Container } from "@mui/material";
import styled from 'styled-components';
import Head from '../components/Helpers/Head';
import ResponsiveAppBar from "../components/BarMenu/BarMenu";
import MatchDayList from '../components/MatchDay/MatchDayList';
import GroupViewList from "../components/GroupView/GroupViewList";
import Champion from "../components/Helpers/Champion";

const MainContainer = styled.div`
display: grid;
grid-template-columns: 40% 60%;
gap: 2rem;
font-family: "Open Sans";
`;

const Account = () => {
    const { user, logout } = useAuth0();

    return (
        <Container>
            <Head title="Account" />
            <ResponsiveAppBar user={user} logout={logout} />
            <Champion />
            <MainContainer>
                <MatchDayList />
                <GroupViewList />
            </MainContainer>
        </Container>
)};

export default withAuthenticationRequired(Account);