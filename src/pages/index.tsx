import React from "react"
import { Link } from "gatsby";
import LoginButton from '../components/LoginButton';

const Main = () => (
  <div>
   <LoginButton />
   <Link to="/account">Go to your account</Link>
 </div>
);

export default Main;