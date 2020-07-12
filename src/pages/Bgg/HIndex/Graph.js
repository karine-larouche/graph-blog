import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
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
  },
  cropStart: {
    stopColor: theme.palette.background.default,
    stopOpacity: 0,
  },
  cropEnd: {
    stopColor: theme.palette.background.default,
    stopOpacity: 1,
  },
  legend: {
    position: 'absolute',
    maxWidth: '50%',
    top: 0,
    right: 0,
    padding: theme.spacing(1, 2, 0, 0),
    textAlign: 'end',
  },
  noHover: {
    pointerEvents: 'none',
  },
}));

const HIndexGraph = ({
  totalPlays,
  highlightedGame,
  setHighlightedGame,
  zoom,
  width,
  height,
}) => {
  const classes = useStyles();

  const hIndex = calculateHIndex(totalPlays);

  const limitingAxis = height < width ? 'y' : 'x';

  const squareStrokeWidth = 0.1;
  const maxSquaresForLimitingAxis = hIndex / zoom;

  const maxHorizontalSquares =
    limitingAxis === 'x'
      ? maxSquaresForLimitingAxis
      : (maxSquaresForLimitingAxis * width) / height;
  const maxVerticalSquares =
    limitingAxis === 'y'
      ? maxSquaresForLimitingAxis
      : (maxSquaresForLimitingAxis * height) / width;

  const viewBoxWidth = maxHorizontalSquares + squareStrokeWidth;
  const viewBoxHeight = maxVerticalSquares + squareStrokeWidth;

  const isXAxisCropped = totalPlays.length > maxHorizontalSquares;
  const isYAxisCropped = totalPlays[0].numberOfPlays > maxVerticalSquares;

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
          {totalPlays.slice(0, maxHorizontalSquares).flatMap((game, x) =>
            range(1, Math.min(game.numberOfPlays, maxVerticalSquares)).map(
              y => (
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
              ),
            ),
          )}
          <path
            d={`M 0 ${viewBoxHeight - hIndex} l ${hIndex} 0 l 0 ${hIndex}`}
            strokeWidth={squareStrokeWidth * 3}
            className={`${classes.hIndexSquare} ${classes.noHover}`}
          />
        </g>
        <defs>
          <linearGradient id="gradX" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" className={classes.cropStart} />
            <stop offset="90%" className={classes.cropEnd} />
          </linearGradient>
          <linearGradient id="gradY" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" className={classes.cropStart} />
            <stop offset="90%" className={classes.cropEnd} />
          </linearGradient>
        </defs>
        {isXAxisCropped && (
          <rect
            x={Math.floor(maxHorizontalSquares) - 2}
            y={squareStrokeWidth}
            width={2 + squareStrokeWidth}
            height={viewBoxHeight}
            fill="url(#gradX)"
            className={classes.noHover}
          />
        )}
        {isYAxisCropped && (
          <rect
            x={-squareStrokeWidth / 2}
            y={maxVerticalSquares % 1}
            width={viewBoxWidth}
            height={2 + squareStrokeWidth}
            fill="url(#gradY)"
            className={classes.noHover}
          />
        )}
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
  zoom: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

HIndexGraph.defaultProps = { highlightedGame: null };

export default HIndexGraph;
