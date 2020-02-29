import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { grey } from '@material-ui/core/colors';
import { Group } from '@vx/group';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { curveMonotoneX } from '@vx/curve';
import { isValid, format, subDays } from 'date-fns';
import { last, min, max } from '../../../utils/arrayUtils';

const ratingColor = {
  1: '#f00',
  2: '#f36',
  3: '#f69',
  4: '#f6c',
  5: '#c9f',
  6: '#99f',
  7: '#9ff',
  8: '#6f9',
  9: '#3c9',
  10: '#0c0',
  undefined: grey[700],
};

const groupByGame = plays => {
  const playsByGame = plays.reduceRight((games, play) => {
    if (isValid(new Date(play.date))) {
      const game = games[play.name];
      if (game) {
        if (last(game.totalPlays).date === play.date) {
          last(game.totalPlays).total += play.quantity;
        } else {
          game.totalPlays.push({
            date: play.date,
            total: last(game.totalPlays).total + play.quantity,
          });
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        games[play.name] = {
          name: play.name,
          totalPlays: [
            {
              date: format(subDays(new Date(play.date), 1), 'yyyy-MM-dd'),
              total: 0,
            },
            { date: play.date, total: play.quantity },
          ],
        };
      }
    }
    return games;
  }, {});
  return Object.values(playsByGame);
};

const addRatings = (playsPerGame, ratings) => {
  ratings.forEach(ratedGame => {
    const playedGame = playsPerGame.find(g => g.name === ratedGame.name);
    if (playedGame) {
      playedGame.rating = ratedGame.rating;
    }
  });
};

const GamesPlayProgress = ({
  isFetching,
  hasError,
  plays,
  ratings,
  username,
  className,
}) => {
  const [highlightedGame, setHighlightedGame] = useState();

  if (isFetching) return `Fetching games for ${username}...`;
  if (hasError) return 'An error occured... sorry!';
  if (!plays) return 'Enter your bgg username to view your plays.';
  if (plays.length === 0) return 'Log your plays on bgg to see this chart.';

  const playsPerGame = groupByGame(plays);
  addRatings(playsPerGame, ratings);

  const [width, height] = [600, 400];
  const borderWidth = 4;

  const earliestPlay = min(playsPerGame.map(game => game.totalPlays[0].date));
  const startDate = subDays(new Date(earliestPlay), 1);
  const xScale = scaleTime({ domain: [startDate, new Date()] });
  xScale.range([0, width]);

  const maxPlays = max(playsPerGame.map(game => last(game.totalPlays).total));
  const yScale = scaleLinear({ domain: [0, maxPlays] });
  yScale.range([height, 0]);

  const x = d => xScale(new Date(d.date));
  const y = d => yScale(d.total);

  const isHighlighted = game =>
    highlightedGame && highlightedGame.name === game.name;

  return (
    <svg
      viewBox={`-${borderWidth} -${borderWidth} ${width +
        2 * borderWidth} ${height + 2 * borderWidth}`}
      width={width + 2 * borderWidth}
      className={className}
    >
      <Group>
        {playsPerGame.map(game => (
          <LinePath
            id={`line-path-${game.name}`}
            key={game.name}
            data={game.totalPlays}
            x={x}
            y={y}
            stroke={ratingColor[game.rating]}
            fill="none"
            opacity={isHighlighted(game) ? 1 : 0.6}
            strokeWidth={isHighlighted(game) ? 4 : 3}
            curve={curveMonotoneX}
            onMouseEnter={() => setHighlightedGame(game)}
            onMouseLeave={() => setHighlightedGame()}
          />
        ))}
        <use
          xlinkHref={`#line-path-${highlightedGame && highlightedGame.name}`}
          onMouseEnter={() => setHighlightedGame(highlightedGame)}
          onMouseLeave={() => setHighlightedGame()}
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
                onMouseLeave={() => setHighlightedGame()}
              />
            </g>
          ))}
      </Group>
      <rect
        x={-borderWidth / 2}
        y={-borderWidth / 2}
        width={width + borderWidth}
        height={height + borderWidth}
        fill="none"
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
  ratings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      rating: PropTypes.number,
    }),
  ),
  username: PropTypes.string.isRequired,
};

GamesPlayProgress.defaultProps = {
  plays: undefined,
  ratings: undefined,
};

export default GamesPlayProgress;
