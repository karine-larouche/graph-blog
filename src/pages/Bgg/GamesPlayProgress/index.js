import React from 'react';
import PropTypes from 'prop-types';
import { red, grey } from '@material-ui/core/colors';
import { Group } from '@vx/group';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { curveMonotoneX } from '@vx/curve';
import { format, subDays } from 'date-fns';
import { last, min, max } from '../../../utils/arrayUtils';

const groupByGame = plays => {
  const playsByGame = plays.reduceRight((games, play) => {
    const game = games[play.name];
    if (game) {
      game.totalPlays.push({
        date: play.date,
        total: last(game.totalPlays).total + play.quantity,
      });
    } else {
      // eslint-disable-next-line no-param-reassign
      games[play.name] = {
        name: play.name,
        totalPlays: [{ date: play.date, total: play.quantity }],
      };
    }
    return games;
  }, {});
  return Object.values(playsByGame);
};

const GamesPlayProgress = ({
  isFetching,
  hasError,
  plays,
  username,
  className,
}) => {
  if (isFetching) return `Fetching games for ${username}...`;
  if (hasError) return 'An error occured... sorry!';
  if (!plays) return 'Enter your bgg username to view your plays.';
  if (plays.length === 0) return 'Log your plays on bgg to see this chart.';

  const playsPerGame = groupByGame(plays);

  const [width, height] = [600, 400];
  const borderWidth = 4;

  const earliestPlay = min(playsPerGame.map(game => game.totalPlays[0].date));
  const startDate = subDays(new Date(earliestPlay), 1);
  const latestPlay = max(playsPerGame.map(game => last(game.totalPlays).date));
  const xScale = scaleTime({ domain: [startDate, new Date(latestPlay)] });
  xScale.range([0, width]);

  const maxPlays = max(playsPerGame.map(game => last(game.totalPlays).total));
  const yScale = scaleLinear({ domain: [0, maxPlays] });
  yScale.range([height, 0]);

  const x = d => xScale(new Date(d.date));
  const y = d => yScale(d.total);

  const initial = { date: format(startDate, 'yyyy-MM-dd'), total: 0 };

  return (
    <svg
      viewBox={`-${borderWidth} -${borderWidth} ${width +
        2 * borderWidth} ${height + 2 * borderWidth}`}
      width={width + 2 * borderWidth}
      className={className}
    >
      <Group>
        {playsPerGame.map((game, i) => (
          <LinePath
            key={game.name}
            data={[initial, ...game.totalPlays]}
            x={x}
            y={y}
            stroke={red[((i % 9) + 1) * 100]}
            strokeWidth={2}
            curve={curveMonotoneX}
          />
        ))}
        {playsPerGame.map((game, i) =>
          game.totalPlays.map(d => (
            <g key={`${game.name}-${d.total}`}>
              <GlyphDot
                cx={x(d)}
                cy={y(d)}
                r={3}
                fill={red[((i % 9) + 1) * 100]}
                stroke="#fff"
                strokeWidth={2}
              />
            </g>
          )),
        )}
      </Group>
      <rect
        x={-borderWidth / 2}
        y={-borderWidth / 2}
        width={width + borderWidth}
        height={height + borderWidth}
        fill="transparent"
        stroke={grey[300]}
        strokeWidth={borderWidth}
        rx={12}
        ry={12}
      />
    </svg>
  );
};

GamesPlayProgress.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  plays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  username: PropTypes.string.isRequired,
};

GamesPlayProgress.defaultProps = {
  plays: undefined,
};

export default GamesPlayProgress;
