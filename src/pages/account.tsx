import React from "react";
import { Link } from 'gatsby';
import { useAuth0 } from "@auth0/auth0-react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Head from '../components/Head';
import LogoutButton from "../components/LogoutButton";
import GroupViewList from "../components/GroupViewList";

const Account = () => {
    const { user } = useAuth0();
    return (
        <>
            <Head title="Account" />
            <nav>
                <Link to="/">Home</Link>
            </nav>
            <p>Email: {user?.email}</p>
            <LogoutButton />
            <GroupViewList />
        </>
)};

export default withAuthenticationRequired(Account);