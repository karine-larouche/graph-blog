import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Pie as PieChart } from '@vx/shape';
import { Group } from '@vx/group';

const useStyles = makeStyles({
  unselectedSection: {
    cursor: 'pointer',
  },
});

const Pie = ({ playAmounts, selectedIndex, onSectionSelection, className }) => {
  const classes = useStyles();
  const [width, height] = [220, 220];
  const radius = Math.min(width, height) / 2;
  const centerX = width / 2;
  const centerY = height / 2;
  return (
    <svg width={width} height={height} className={className}>
      <Group top={centerY} left={centerX}>
        <PieChart
          data={playAmounts}
          pieValue={d => d.games.length}
          pieSortValues={() => -1}
          outerRadius={radius}
        >
          {pie =>
            pie.arcs.map((arc, i) => (
              <g
                key={arc.data.label}
                onClick={() => onSectionSelection(i)}
                className={selectedIndex !== i && classes.unselectedSection}
              >
                <path d={pie.path(arc)} fill={playAmounts[i].color} />
              </g>
            ))
          }
        </PieChart>
      </Group>
    </svg>
  );
};

Pie.propTypes = {
  playAmounts: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
      games: PropTypes.array,
    }),
  ).isRequired,
  selectedIndex: PropTypes.number.isRequired,
  onSectionSelection: PropTypes.func.isRequired,
};

export default Pie;
