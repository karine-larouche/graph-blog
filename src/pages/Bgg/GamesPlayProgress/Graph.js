import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';
import { Group } from '@vx/group';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { curveMonotoneX } from '@vx/curve';
import { AxisBottom } from '@vx/axis';
import {
  subDays,
  differenceInCalendarMonths,
  isSameMonth,
  format,
  isAfter,
  isBefore,
} from 'date-fns';
import { last, min, max, range } from '../../../utils/arrayUtils';
import { gameWithPlayProgressShape } from './utils';

const scalePadding = 16;
const horizontalPadding = 8;

const useStyles = makeStyles({
  tickLines: {
    strokeWidth: 2,
    transform: 'translate(0, 1px)',
  },
});

/* eslint-disable react/prop-types */
const SingleLine = React.memo(
  ({ game, isHighlighted, setHighlightedGame, getRatingColor, x, y }) => (
    <LinePath
      id={`line-path-${game.name}`}
      key={game.name}
      data={game.totalPlays}
      x={x}
      y={y}
      stroke={getRatingColor(game.rating)}
      fill="none"
      opacity={isHighlighted ? 1 : 0.6}
      strokeWidth={isHighlighted ? 4 : 3}
      curve={curveMonotoneX}
      onMouseEnter={() => setHighlightedGame(game)}
    />
  ),
);
/* eslint-enable react/prop-types */

const GamesPlayProgressGraph = ({
  playsPerGame,
  getRatingColor,
  highlightedGame,
  setHighlightedGame,
  width,
  height,
}) => {
  const classes = useStyles();

  const [x, y, xScale, start, end, graphPosition] = useMemo(() => {
    const position = {
      top: 1,
      bottom: height - scalePadding,
      left: horizontalPadding,
      right: width - horizontalPadding,
    };

    const earliestPlay = min(playsPerGame.map(game => game.totalPlays[0].date));
    const startDate = subDays(new Date(earliestPlay), 1);
    const xAxisScale = scaleTime({
      domain: [startDate, new Date()],
      range: [position.left, position.right],
    });

    const maxPlays = max(playsPerGame.map(game => last(game.totalPlays).total));
    const yScale = scaleLinear({
      domain: [0, maxPlays],
      range: [position.bottom, position.top],
    });

    return [
      d => xScale(new Date(d.date)),
      d => yScale(d.total),
      xAxisScale,
      startDate,
      new Date(),
      position,
    ];
  }, [playsPerGame, width, height]);

  const isHighlighted = game =>
    Boolean(highlightedGame) && highlightedGame.name === game.name;

  const showXAxis = differenceInCalendarMonths(end, start) >= 12;
  const years = range(start.getFullYear(), end.getFullYear());
  const isWithinRange = d => isAfter(d, start) && isBefore(d, end);
  const tickValues = years
    .map(year => new Date(`${year}-01-01T00:00`))
    .filter(isWithinRange);
  const tickLabelValues = years
    .map(year => new Date(`${year}-07-01T00:00`))
    .filter(isWithinRange);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} height={`${height}px`}>
      <Group>
        {playsPerGame.map(game => (
          <SingleLine
            key={game.name}
            game={game}
            isHighlighted={isHighlighted(game)}
            setHighlightedGame={setHighlightedGame}
            getRatingColor={getRatingColor}
            x={x}
            y={y}
          />
        ))}
        <use
          xlinkHref={`#line-path-${highlightedGame && highlightedGame.name}`}
        />
        {highlightedGame &&
          highlightedGame.totalPlays.map(d => (
            <g key={`${highlightedGame.name}-${d.total}`}>
              <GlyphDot
                cx={x(d)}
                cy={y(d)}
                r={2}
                fill="#000"
                onMouseEnter={() => setHighlightedGame(highlightedGame)}
              />
            </g>
          ))}
      </Group>
      {showXAxis && (
        <>
          <AxisBottom
            top={graphPosition.bottom}
            scale={xScale}
            tickValues={tickValues}
            tickFormat={() => ''}
            tickStroke={grey[800]}
            stroke={grey[800]}
            strokeWidth={2}
            tickLength={14}
            tickClassName={classes.tickLines}
          />
          <AxisBottom
            top={graphPosition.bottom - 4}
            scale={xScale}
            tickValues={tickLabelValues}
            tickFormat={v => format(v, 'yyyy')}
            tickLabelProps={value => ({
              fontWeight: 500,
              fill: grey[800],
              textAnchor:
                // eslint-disable-next-line no-nested-ternary
                differenceInCalendarMonths(value, start) <= 1
                  ? 'start'
                  : isSameMonth(value, end)
                  ? 'end'
                  : 'middle',
            })}
            hideAxisLine
            hideTicks
            tickClassName="tickLabels"
          />
        </>
      )}
    </svg>
  );
};

GamesPlayProgressGraph.propTypes = {
  playsPerGame: PropTypes.arrayOf(gameWithPlayProgressShape).isRequired,
  getRatingColor: PropTypes.func.isRequired,
  highlightedGame: gameWithPlayProgressShape,
  setHighlightedGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

GamesPlayProgressGraph.defaultProps = {
  highlightedGame: undefined,
};

export default GamesPlayProgressGraph;
