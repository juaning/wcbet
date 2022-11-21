import React, {useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Container, Tabs, Tab } from "@mui/material";
import styled from 'styled-components';
import Head from '../components/Helpers/Head';
import ResponsiveAppBar from "../components/BarMenu/BarMenu";
import MatchDayList from '../components/MatchDay/MatchDayList';
import GroupViewList from "../components/GroupView/GroupViewList";
import Champion from "../components/Helpers/Champion";
import ChampNGroupsBetNotification from "../components/Notification/Notification";

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
            <ChampNGroupsBetNotification />
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