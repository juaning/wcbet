import React from "react"
import { Link } from "gatsby";
import Head from '../components/Head'
import LoginButton from '../components/LoginButton';

const Main = () => (
  <>
    <Head title="Home page" />
    <div>
      <LoginButton />
      <Link to="/account">Go to your account</Link>
    </div>
  </>
);

export default Main;