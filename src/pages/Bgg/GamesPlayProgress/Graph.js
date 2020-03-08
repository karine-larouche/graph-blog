import React from 'react';
import PropTypes from 'prop-types';
import { grey } from '@material-ui/core/colors';
import { Group } from '@vx/group';
import { GlyphDot } from '@vx/glyph';
import { LinePath } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { curveMonotoneX } from '@vx/curve';
import { subDays } from 'date-fns';
import { last, min, max } from '../../../utils/arrayUtils';
import {
  gameWithPlayProgress as gameWithPlayProgressShape,
  ratingColors as ratingColorsShape,
} from './propTypes';

const GamesPlayProgressGraph = ({
  playsPerGame,
  ratingColors,
  highlightedGame,
  setHighlightedGame,
  width,
  height,
}) => {
  const borderWidth = 4;

  const earliestPlay = min(playsPerGame.map(game => game.totalPlays[0].date));
  const startDate = subDays(new Date(earliestPlay), 1);
  const xScale = scaleTime({ domain: [startDate, new Date()] });
  xScale.range([borderWidth, width - borderWidth]);

  const maxPlays = max(playsPerGame.map(game => last(game.totalPlays).total));
  const yScale = scaleLinear({ domain: [0, maxPlays] });
  yScale.range([height - borderWidth, borderWidth]);

  const x = d => xScale(new Date(d.date));
  const y = d => yScale(d.total);

  const isHighlighted = game =>
    highlightedGame && highlightedGame.name === game.name;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} height={`${height}px`}>
      <Group>
        {playsPerGame.map(game => (
          <LinePath
            id={`line-path-${game.name}`}
            key={game.name}
            data={game.totalPlays}
            x={x}
            y={y}
            stroke={ratingColors[game.rating]}
            fill="none"
            opacity={isHighlighted(game) ? 1 : 0.6}
            strokeWidth={isHighlighted(game) ? 4 : 3}
            curve={curveMonotoneX}
            onMouseEnter={() => setHighlightedGame(game)}
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
      <rect
        x={borderWidth / 2}
        y={borderWidth / 2}
        width={width - borderWidth}
        height={height - borderWidth}
        fill="none"
        stroke={grey[300]}
        strokeWidth={borderWidth}
        rx={12}
        ry={12}
      />
    </svg>
  );
};

GamesPlayProgressGraph.propTypes = {
  playsPerGame: PropTypes.arrayOf(gameWithPlayProgressShape).isRequired,
  ratingColors: ratingColorsShape.isRequired,
  highlightedGame: gameWithPlayProgressShape,
  setHighlightedGame: PropTypes.func.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

GamesPlayProgressGraph.defaultProps = {
  highlightedGame: undefined,
};

export default GamesPlayProgressGraph;