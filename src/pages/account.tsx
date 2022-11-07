import React from "react";
import { Link } from 'gatsby';
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Container } from "@mui/material";
import styled from 'styled-components';
import Head from '../components/Helpers/Head';
import LogoutButton from "../components/Helpers/LogoutButton";
import MatchDayList from '../components/MatchDay/MatchDayList';
import GroupViewList from "../components/GroupView/GroupViewList";

const MainContainer = styled.div`
display: grid;
grid-template-columns: 40% 60%;
gap: 2rem;
font-family: "Open Sans";
`;

const Account = () => {
    const { user } = useAuth0();

    return (
        <Container>
            <Head title="Account" />
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <p>Email: {user?.email}</p>
            <LogoutButton />
            <MainContainer>
                <MatchDayList />
                <GroupViewList />
            </MainContainer>
        </Container>
)};

export default withAuthenticationRequired(Account);