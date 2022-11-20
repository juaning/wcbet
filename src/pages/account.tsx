import React, {useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Container, Tabs, Tab, Alert, Stack } from "@mui/material";
import styled from 'styled-components';
import Head from '../components/Helpers/Head';
import ResponsiveAppBar from "../components/BarMenu/BarMenu";
import MatchDayList from '../components/MatchDay/MatchDayList';
import GroupViewList from "../components/GroupView/GroupViewList";
import Champion from "../components/Helpers/Champion";

const MainContainer = styled.div`
margin: auto;
font-family: "Open Sans";
overflow-y: hidden;
overflow-x: scroll;
`;

const Account = () => {
    const { user, logout } = useAuth0();
    const [activeTab, setActiveTab] = useState<number>(0);

    const handleTabChange = (event: React.SyntheticEvent, newTab: number) => {
        setActiveTab(newTab);
    }

    return (
        <Container>
            <Head title="Account" />
            <ResponsiveAppBar user={user} logout={logout} />
            <Stack sx={{ width: '100%' }} spacing={2}>
                <Alert severity="error">El campeón y  el primero y segundo de cada grupo pueden elegirse hast antes del inicio del campeonato mundial</Alert>
            </Stack>
            <Champion />
            <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Partidos" />
                <Tab label="Grupos" />
                <Tab label="Ranking" />
            </Tabs>
            <MainContainer>
                {activeTab === 0 && <MatchDayList />}
                {activeTab === 1 && <GroupViewList />}
                {activeTab === 2 && <div>Ranking</div>}
            </MainContainer>
        </Container>
)};

export default withAuthenticationRequired(Account);