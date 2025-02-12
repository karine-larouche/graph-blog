import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import Typography from '@material-ui/core/Typography';
import { mix } from 'colour-utils';
import { last, range } from '../../../utils/arrayUtils';

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
    stroke: grey[900],
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

/* eslint-disable react/prop-types */
const SingleSquare = React.memo(
  ({
    x,
    y,
    game,
    year,
    squareStrokeWidth,
    fill,
    className,
    setHighlightedGame,
    setHighlightedYear,
  }) => {
    return (
      <rect
        x={x}
        y={y}
        ry={squareStrokeWidth / 4}
        width={1}
        height={1}
        strokeWidth={squareStrokeWidth}
        className={className}
        fill={fill}
        onMouseEnter={() => {
          setHighlightedGame(game);
          setHighlightedYear(year);
        }}
        onMouseLeave={() => {
          setHighlightedGame(null);
          setHighlightedYear(null);
        }}
      />
    );
  },
);
/* eslint-enable react/prop-types */

const HIndexGraph = ({
  totalPlaysYear,
  isYearMode,
  highlightedYear,
  highlightedGame,
  setHighlightedYear,
  setHighlightedGame,
  zoom,
  width,
  height,
}) => {
  const classes = useStyles();
  const theme = useTheme();

  const yearColors = [
    theme.palette.primary.main,
    mix(theme.palette.primary.main, theme.palette.background.default, 0.25),
    mix(theme.palette.primary.main, theme.palette.background.default, 0.5),
    mix(theme.palette.primary.main, theme.palette.background.default, 0.75),
  ];
  const highlightedYearColors = [
    mix(theme.palette.primary.main, theme.palette.background.default, 0.3),
    mix(theme.palette.primary.main, theme.palette.background.default, 0.55),
    mix(theme.palette.primary.main, theme.palette.background.default, 0.7),
    mix(theme.palette.primary.main, theme.palette.background.default, 0.95),
  ];

  const totalPlaysLastYear = last(totalPlaysYear).totalPlays;
  const totalPlaysSelectedYear =
    highlightedYear &&
    totalPlaysYear.find(({ year }) => year === highlightedYear).totalPlays;

  const hIndex = calculateHIndex(totalPlaysLastYear);
  const hIndexSelectedYear =
    highlightedYear && calculateHIndex(totalPlaysSelectedYear);
  const displayedHIndex = hIndexSelectedYear || hIndex;

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

  const isXAxisCropped = totalPlaysLastYear.length > maxHorizontalSquares;
  const isYAxisCropped =
    totalPlaysLastYear[0].numberOfPlays > maxVerticalSquares;

  const isHighlighted = (game, year) =>
    Boolean(highlightedGame) &&
    highlightedGame.name === game.name &&
    highlightedYear === year;

  const displayedTotalPlaysYear = isYearMode
    ? totalPlaysYear.filter(({ year }) => year >= highlightedYear).reverse()
    : [last(totalPlaysYear)];

  return (
    <div className={classes.container}>
      <svg
        viewBox={`${-squareStrokeWidth / 2} ${squareStrokeWidth /
          2} ${viewBoxWidth} ${viewBoxHeight}`}
        width={limitingAxis === 'x' ? `${width}px` : undefined}
        height={limitingAxis === 'y' ? `${height}px` : undefined}
      >
        <g>
          {displayedTotalPlaysYear.map(({ year, totalPlays }, i) =>
            totalPlays
              .slice(0, maxHorizontalSquares)
              .flatMap((game, x) =>
                range(
                  1,
                  Math.min(game.numberOfPlays, maxVerticalSquares),
                ).map(y => (
                  <SingleSquare
                    key={
                      `${year}-${x}-${y}` /* eslint-disable-line react/no-array-index-key */
                    }
                    x={x}
                    y={viewBoxHeight - y}
                    squareStrokeWidth={squareStrokeWidth}
                    game={game}
                    year={year}
                    fill={
                      isHighlighted(game, year)
                        ? highlightedYearColors[i % yearColors.length]
                        : yearColors[i % yearColors.length]
                    }
                    className={`${classes.playSquare} ${
                      isHighlighted(game, year)
                        ? classes.playSquareHighlighted
                        : ''
                    }`}
                    setHighlightedGame={setHighlightedGame}
                    setHighlightedYear={setHighlightedYear}
                  />
                )),
              ),
          )}
          <path
            d={`M 0 ${viewBoxHeight -
              displayedHIndex} l ${displayedHIndex} 0 l 0 ${displayedHIndex}`}
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
        <Typography variant="h5">
          {isYearMode && highlightedYear
            ? `H-Index for ${highlightedYear}`
            : 'Current H‑Index'}
        </Typography>
        <Typography variant="h2">{displayedHIndex}</Typography>
      </div>
    </div>
  );
};

const totalPlaysShape = PropTypes.arrayOf(
  PropTypes.shape({
    name: PropTypes.string.isRequired,
    numberOfPlays: PropTypes.number.isRequired,
  }),
);

HIndexGraph.propTypes = {
  totalPlaysYear: PropTypes.arrayOf(
    PropTypes.shape({
      year: PropTypes.number.isRequired,
      totalPlays: totalPlaysShape.isRequired,
    }),
  ).isRequired,
  isYearMode: PropTypes.bool.isRequired,
  highlightedYear: PropTypes.number,
  highlightedGame: PropTypes.shape({
    name: PropTypes.string.isRequired,
    numberOfPlays: PropTypes.number.isRequired,
  }),
  setHighlightedYear: PropTypes.func.isRequired,
  setHighlightedGame: PropTypes.func.isRequired,
  zoom: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

HIndexGraph.defaultProps = {
  highlightedGame: null,
  highlightedYear: null,
};

export default HIndexGraph;
