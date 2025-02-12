import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Skeletonnable from './Skeletonnable';

const useStyles = makeStyles({
  legendItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
  },
  unselectedSection: {
    cursor: 'pointer',
  },
  legendColor: {
    height: 20,
    width: 20,
    borderRadius: 10,
    marginRight: 8,
  },
});

const Legend = ({
  data,
  isSkeleton,
  selectedIndex,
  onSectionSelection,
  className,
}) => {
  const classes = useStyles();

  return (
    <div className={className}>
      {data.map((d, i) => (
        <button
          key={d.label}
          onClick={isSkeleton ? undefined : () => onSectionSelection(i)}
          type="button"
          className={`${classes.legendItem} ${
            selectedIndex === i ? '' : classes.unselectedSection
          }`}
        >
          <div
            className={classes.legendColor}
            style={{ backgroundColor: d.color }}
          />
          <Skeletonnable isSkeleton={isSkeleton} animation={false}>
            <Typography>{d.label}</Typography>
          </Skeletonnable>
        </button>
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
  isSkeleton: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number,
  onSectionSelection: PropTypes.func.isRequired,
};

Legend.defaultProps = {
  selectedIndex: undefined,
};

export default Legend;
