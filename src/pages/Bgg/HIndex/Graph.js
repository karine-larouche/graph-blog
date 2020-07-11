import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import { range } from '../../../utils/arrayUtils';

const calculateHIndex = totalPlays =>
  Math.max(...totalPlays.map((total, index) => Math.min(total, index + 1)));

const useStyles = makeStyles(theme => ({
  container: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'flex-end',
  },
  playSquare: {
    fill: theme.palette.primary.main,
    stroke: grey[900],
  },
  hIndexSquare: {
    fill: 'transparent',
    stroke: grey[900],
    strokeLinejoin: 'round',
  },
  legend: {
    position: 'absolute',
    maxWidth: '50%',
    top: 0,
    right: 0,
    padding: theme.spacing(1, 2, 0, 0),
    textAlign: 'end',
  },
}));

const HIndexGraph = ({ totalPlays, width, height }) => {
  const classes = useStyles();

  const hIndex = calculateHIndex(totalPlays);

  const squareStrokeWidth = 0.1;
  const viewBoxWidth = totalPlays.length + squareStrokeWidth;
  const viewBoxHeight = totalPlays[0] + squareStrokeWidth;

  const limitingAxis =
    height / viewBoxHeight < width / viewBoxWidth ? 'y' : 'x';

  return (
    <div className={classes.container}>
      <svg
        viewBox={`${-squareStrokeWidth / 2} ${squareStrokeWidth /
          2} ${viewBoxWidth} ${viewBoxHeight}`}
        width={limitingAxis === 'x' ? `${width}px` : undefined}
        height={limitingAxis === 'y' ? `${height}px` : undefined}
      >
        <g>
          {totalPlays.flatMap((total, x) =>
            range(1, total).map(y => (
              <rect
                // eslint-disable-next-line react/no-array-index-key
                key={`${x}-${y}`}
                x={x}
                y={viewBoxHeight - y}
                ry={squareStrokeWidth / 4}
                width={1}
                height={1}
                strokeWidth={squareStrokeWidth}
                className={classes.playSquare}
              />
            )),
          )}
          <path
            d={`M 0 ${viewBoxHeight - hIndex} l ${hIndex} 0 l 0 ${hIndex}`}
            strokeWidth={squareStrokeWidth * 3}
            className={classes.hIndexSquare}
          />
        </g>
      </svg>
      <div className={classes.legend}>
        <Typography variant="h5">Current H‑Index</Typography>
        <Typography variant="h2">{hIndex}</Typography>
      </div>
    </div>
  );
};

HIndexGraph.propTypes = {
  totalPlays: PropTypes.arrayOf(PropTypes.number).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

HIndexGraph.defaultProps = {};

export default HIndexGraph;
