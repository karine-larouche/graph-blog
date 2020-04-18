import React from 'react';
import PropTypes from 'prop-types';
import {
  grey,
  orange,
  amber,
  lightGreen,
  cyan,
  pink,
} from '@material-ui/core/colors';
import { AreaStack } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { last } from '../../../utils/arrayUtils';
import { hexToRgba } from '../../../utils/colorUtils';
import {
  playAmountBreakdown as labels,
  playGroupsForMonthShape,
} from './utils';

const colors = [
  orange[800],
  amber[500],
  lightGreen[500],
  lightGreen[700],
  cyan[400],
  cyan[500],
  cyan[600],
  cyan[700],
  cyan[800],
  pink[700],
  pink[900],
];

const GroupedPlayProgressGraph = ({ playsOverTime, width, height }) => {
  const borderWidth = 4;

  const firstMonth = new Date(`${playsOverTime[0].month}-01T00:00`);
  const lastMonth = new Date(`${last(playsOverTime).month}-01T00:00`);
  const xScale = scaleTime({
    domain: [firstMonth, lastMonth],
    range: [borderWidth, width - borderWidth],
  });

  const allTimeTotalPlays = labels.reduce(
    (total, l) => total + last(playsOverTime)[l],
    0,
  );
  const yScale = scaleLinear({
    domain: [0, allTimeTotalPlays],
    range: [height - borderWidth, borderWidth],
  });

  const x = d => xScale(new Date(`${d.data.month}-01T00:00`));
  const y0 = d => yScale(d[0]);
  const y1 = d => yScale(d[1]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} height={`${height}px`}>
      <AreaStack
        top={0}
        left={0}
        keys={labels}
        data={playsOverTime}
        x={x}
        y0={y0}
        y1={y1}
      >
        {({ stacks, path }) => {
          return stacks.reverse().map((stack, i) => {
            return (
              <path
                key={`stack-${stack.key}`}
                d={path(stack)}
                stroke={colors[i]}
                strokeWidth={2}
                strokeLinejoin="bevel"
                fill={hexToRgba(colors[i], 0.6)}
                // onClick={event => alert(`${stack.key}`)}
              />
            );
          });
        }}
      </AreaStack>
      <rect
        x={borderWidth / 2}
        y={borderWidth / 2}
        width={width - borderWidth}
        height={height - borderWidth}
        fill="none"
        stroke={grey[300]}
        strokeWidth={borderWidth}
        rx={4}
        ry={4}
      />
    </svg>
  );
};

GroupedPlayProgressGraph.propTypes = {
  playsOverTime: PropTypes.arrayOf(playGroupsForMonthShape).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default GroupedPlayProgressGraph;
