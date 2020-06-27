import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import {
  grey,
  orange,
  amber,
  lightGreen,
  cyan,
  pink,
} from '@material-ui/core/colors';
import { isBefore, isAfter } from 'date-fns';
import { AreaStack } from '@vx/shape';
import { scaleTime, scaleLinear } from '@vx/scale';
import { last, range } from '../../../utils/arrayUtils';
import { hexToRgba } from '../../../utils/colorUtils';
import XAxis from '../../../components/XAxis';
import Legend from '../../../components/Legend';
import {
  playAmountBreakdown as labels,
  playGroupsForMonthShape,
} from './utils';

const groups = [
  { label: '1 play', color: orange[800] },
  { label: '2 plays', color: amber[500] },
  { label: '3 plays', color: lightGreen[500] },
  { label: '4 plays', color: lightGreen[700] },
  { label: '5 plays', color: cyan[400] },
  { label: '6 plays', color: cyan[500] },
  { label: '7 plays', color: cyan[600] },
  { label: '8 plays', color: cyan[700] },
  { label: '9 plays', color: cyan[800] },
  { label: '10-24 plays', color: pink[700] },
  { label: '25+ plays', color: pink[900] },
];

const colors = groups.map(g => g.color);

const useStyles = makeStyles(theme => ({
  legend: {
    position: 'absolute',
    top: 0,
    background: hexToRgba(theme.palette.background.default, 0.7),
    margin: 8,
    boxShadow: `0 0 8px 6px ${hexToRgba(
      theme.palette.background.default,
      0.7,
    )}`,
    borderBottomRightRadius: 16,
  },
  container: {
    position: 'relative',
    height: '100%',
  },
}));

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

  const years = range(firstMonth.getFullYear(), lastMonth.getFullYear());
  const isWithinRange = d => !isBefore(d, firstMonth) && !isAfter(d, lastMonth);
  const tickValues = years
    .map(y => new Date(`${y - 1}-12-01T00:00`))
    .filter(isWithinRange);
  const tickLabelValues = years
    .map(y => new Date(`${y}-06-01T00:00`))
    .filter(isWithinRange);

  return (
    <div className={classes.container}>
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
        <XAxis
          start={firstMonth}
          end={lastMonth}
          tickValues={tickValues}
          tickLabelValues={tickLabelValues}
          xScale={xScale}
          graphPosition={graphPosition}
          color={grey[600]}
          hideAxisLine
        />
      </svg>
      <Legend data={groups} className={classes.legend} />
    </div>
  );
};

GroupedPlayProgressGraph.propTypes = {
  playsOverTime: PropTypes.arrayOf(playGroupsForMonthShape).isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
};

export default GroupedPlayProgressGraph;
