import React from 'react';
import PropTypes from 'prop-types';
import { AxisBottom } from '@vx/axis';
import { makeStyles } from '@material-ui/core/styles';
import {
  differenceInCalendarMonths,
  differenceInDays,
  isSameMonth,
  format,
} from 'date-fns';

const useStyles = makeStyles({
  tickLines: {
    strokeWidth: 2,
    transform: 'translate(0, 1px)',
  },
});

const XAxis = ({
  start,
  end,
  tickValues,
  tickLabelValues,
  xScale,
  graphPosition,
  color,
  hideAxisLine,
}) => {
  const classes = useStyles();

  const showXAxis = differenceInCalendarMonths(end, start) >= 12;

  return showXAxis ? (
    <>
      <AxisBottom
        top={graphPosition.bottom + 1}
        scale={xScale}
        tickValues={tickValues}
        tickFormat={() => ''}
        hideAxisLine={hideAxisLine}
        tickStroke={color}
        stroke={color}
        strokeWidth={2}
        tickLength={14}
        tickClassName={classes.tickLines}
      />
      <AxisBottom
        top={graphPosition.bottom - 2}
        scale={xScale}
        tickValues={tickLabelValues}
        tickFormat={v => format(v, 'yyyy')}
        tickLabelProps={value => ({
          fontWeight: 500,
          fill: color,
          textAnchor:
            // eslint-disable-next-line no-nested-ternary
            differenceInDays(value, start) <= 27
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
  ) : (
    <></>
  );
};

XAxis.propTypes = {
  start: PropTypes.instanceOf(Date).isRequired,
  end: PropTypes.instanceOf(Date).isRequired,
  tickValues: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  tickLabelValues: PropTypes.arrayOf(PropTypes.instanceOf(Date)).isRequired,
  xScale: PropTypes.func.isRequired,
  graphPosition: PropTypes.shape({
    bottom: PropTypes.number,
  }).isRequired,
  color: PropTypes.string.isRequired,
  hideAxisLine: PropTypes.bool,
};

XAxis.defaultProps = {
  hideAxisLine: false,
};

export default XAxis;
