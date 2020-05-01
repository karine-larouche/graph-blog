import React from 'react';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const BggInstructions = () => (
  <Typography>
    {'Enter your '}
    <Link href="https://boardgamegeek.com/" target="_blank">
      BoardGameGeek
    </Link>
    {' username to view your plays.'}
  </Typography>
);

export default BggInstructions;
