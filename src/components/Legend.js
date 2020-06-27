import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
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

const Legend = ({ data, className }) => {
  const classes = useStyles();

  return (
    <div className={className}>
      {data.map(d => (
        <div key={d.label} className={classes.legendItem}>
          <div
            className={classes.legendColor}
            style={{ backgroundColor: d.color }}
          />
          <Typography>{d.label}</Typography>
        </div>
      ))}
    </div>
  );
};

Legend.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default Legend;
