import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  legend: {
    margin: '20px 0 0 20px',
  },
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 8,
  },
});

const Legend = ({ playAmounts }) => {
  const classes = useStyles();

  return (
    <div className={classes.legend}>
      {playAmounts.map(playAmount => (
        <div key={playAmount.label} className={classes.legendItem}>
          <div
            className={classes.legendColor}
            style={{ backgroundColor: playAmount.color }}
          />
          <Typography>{playAmount.label}</Typography>
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = {
  playAmounts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      games: PropTypes.array,
    }),
  ).isRequired,
};

export default Legend;
