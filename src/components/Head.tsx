import React from 'react';
import { Helmet } from 'react-helmet';

interface HeadProps {
    title: string;
}

const Head = ({ title }: HeadProps) => {
  return (
    <>
      <Helmet
        defaultTitle="Home | WC Bet"
        title={title}
        titleTemplate="%s | WC Bet"
      />
    </>
  )
}

export default Head;