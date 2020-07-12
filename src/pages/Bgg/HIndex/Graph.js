import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Typography } from '@material-ui/core';
import { range } from '../../../utils/arrayUtils';

const calculateHIndex = totalPlays =>
  Math.max(
    ...totalPlays.map((game, index) => Math.min(game.numberOfPlays, index + 1)),
  );

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
  playSquareHighlighted: {
    fill: theme.palette.primary.light,
  },
  hIndexSquare: {
    fill: 'transparent',
    stroke: grey[900],
    strokeLinejoin: 'round',
    pointerEvents: 'none',
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

const HIndexGraph = ({
  totalPlays,
  highlightedGame,
  setHighlightedGame,
  width,
  height,
}) => {
  const classes = useStyles();

  const hIndex = calculateHIndex(totalPlays);

  const squareStrokeWidth = 0.1;
  const viewBoxWidth = totalPlays.length + squareStrokeWidth;
  const viewBoxHeight = totalPlays[0].numberOfPlays + squareStrokeWidth;

  const limitingAxis =
    height / viewBoxHeight < width / viewBoxWidth ? 'y' : 'x';

  const isHighlighted = game =>
    Boolean(highlightedGame) && highlightedGame.name === game.name;

  return (
    <div className={classes.container}>
      <svg
        viewBox={`${-squareStrokeWidth / 2} ${squareStrokeWidth /
          2} ${viewBoxWidth} ${viewBoxHeight}`}
        width={limitingAxis === 'x' ? `${width}px` : undefined}
        height={limitingAxis === 'y' ? `${height}px` : undefined}
      >
        <g>
          {totalPlays.flatMap((game, x) =>
            range(1, game.numberOfPlays).map(y => (
              <rect
                // eslint-disable-next-line react/no-array-index-key
                key={`${x}-${y}`}
                x={x}
                y={viewBoxHeight - y}
                ry={squareStrokeWidth / 4}
                width={1}
                height={1}
                strokeWidth={squareStrokeWidth}
                className={`${classes.playSquare} ${
                  isHighlighted(game) ? classes.playSquareHighlighted : ''
                }`}
                onMouseEnter={() => setHighlightedGame(game)}
                onMouseLeave={() => setHighlightedGame(null)}
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
  totalPlays: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      numberOfPlays: PropTypes.number.isRequired,
    }),
  ).isRequired,
  highlightedGame: PropTypes.shape({
    name: PropTypes.string.isRequired,
    numberOfPlays: PropTypes.number.isRequired,
  }),
  setHighlightedGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

HIndexGraph.defaultProps = { highlightedGame: null };

export default HIndexGraph;
