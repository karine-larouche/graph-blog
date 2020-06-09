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
import { makeStyles } from '@material-ui/core/styles';
import {
  format,
  isSameDay,
  differenceInCalendarMonths,
  isBefore,
  isAfter,
} from 'date-fns';
import { AreaStack } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { AxisBottom } from '@vx/axis';
import { last, range } from '../../../utils/arrayUtils';
import { hexToRgba } from '../../../utils/colorUtils';
import {
  playAmountBreakdown as labels,
  playGroupsForMonthShape,
} from './utils';

const useStyles = makeStyles({
  tickLines: {
    strokeWidth: 2,
  },
});

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
  const classes = useStyles();

  const scalePadding = 16;
  const horizontalPadding = 8;
  const graphPosition = {
    top: 1,
    bottom: height - scalePadding,
    left: horizontalPadding,
    right: width - horizontalPadding,
  };

  const firstMonth = new Date(`${playsOverTime[0].month}-01T00:00`);
  const lastMonth = new Date(`${last(playsOverTime).month}-01T00:00`);
  const xScale = scaleTime({
    domain: [firstMonth, lastMonth],
    range: [graphPosition.left, graphPosition.right],
  });

  const allTimeTotalPlays = labels.reduce(
    (total, l) => total + last(playsOverTime)[l],
    0,
  );
  const yScale = scaleLinear({
    domain: [0, allTimeTotalPlays],
    range: [graphPosition.bottom, graphPosition.top],
  });

  const x = d => xScale(new Date(`${d.data.month}-01T00:00`));
  const y0 = d => yScale(d[0]);
  const y1 = d => yScale(d[1]);

  const showXAxis = differenceInCalendarMonths(lastMonth, firstMonth) >= 12;
  const years = range(firstMonth.getFullYear(), lastMonth.getFullYear());
  const isWithinRange = d => !isBefore(d, firstMonth) && !isAfter(d, lastMonth);
  const tickValues = years
    .map(y => new Date(`${y - 1}-12-01T00:00`))
    .filter(isWithinRange);
  const tickLabelValues = years
    .map(y => new Date(`${y}-06-01T00:00`))
    .filter(isWithinRange);

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
          return stacks
            .reverse()
            .map((stack, i) => (
              <path
                key={`stack-${stack.key}`}
                d={path(stack)}
                stroke={colors[i]}
                strokeWidth={2}
                strokeLinejoin="bevel"
                fill={hexToRgba(colors[i], 0.6)}
              />
            ));
        }}
      </AreaStack>
      {showXAxis && (
        <>
          <AxisBottom
            top={graphPosition.bottom + 2}
            scale={xScale}
            tickValues={tickValues}
            tickFormat={() => ''}
            hideAxisLine
            tickStroke={grey[600]}
            tickClassName={classes.tickLines}
          />
          <AxisBottom
            top={graphPosition.bottom - 4}
            scale={xScale}
            tickValues={tickLabelValues}
            tickFormat={v => format(v, 'yyyy')}
            tickLabelProps={value => ({
              fontWeight: 500,
              fill: grey[600],
              // eslint-disable-next-line no-nested-ternary
              textAnchor: isSameDay(value, firstMonth)
                ? 'start'
                : isSameDay(value, lastMonth)
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

GroupedPlayProgressGraph.propTypes = {
  playsOverTime: PropTypes.arrayOf(playGroupsForMonthShape).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default GroupedPlayProgressGraph;
