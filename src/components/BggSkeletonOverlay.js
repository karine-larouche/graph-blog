import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Skeleton } from '@material-ui/lab';

const useStyles = makeStyles({
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(250, 250, 250, 0.5)',
  },
  skeletonText: {
    marginTop: 80,
    position: 'absolute',
    textAlign: 'center',
  },
});

const BggSkeletonOverlay = ({ text }) => {
  const classes = useStyles();
  return (
    <>
      <Skeleton variant="rect" className={classes.overlay} />
      <Typography variant="h5" className={classes.skeletonText}>
        {text}
      </Typography>
    </>
  );
};

BggSkeletonOverlay.propTypes = {
  text: PropTypes.string.isRequired,
};

export default BggSkeletonOverlay;
