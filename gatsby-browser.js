import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { navigate } from 'gatsby';

const onRedirectCallback = (appState) => {
    // Use Gatsby's navigate method to replace the url
    navigate(appState?.returnTo || '/', { replace: true });
};

export const wrapRootElement = ({ element }) => {
    const domain = process.env.GATSBY_AUTH0_DOMAIN || process.env.AUTH0_DOMAIN;
    console.log(domain);
    return (
    <Auth0Provider
        domain={domain}
        clientId={process.env.AUTH0_CLIENTID}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
    >
        {element}
    </Auth0Provider>
    );
};