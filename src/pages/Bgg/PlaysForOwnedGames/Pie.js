import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Pie as PieChart } from '@vx/shape';
import { Group } from '@vx/group';

const useStyles = makeStyles({
  selectableSection: {
    cursor: 'pointer',
  },
});

const Pie = ({
  playAmounts,
  isSkeleton,
  selectedIndex,
  onSectionSelection,
  className,
}) => {
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
          pieValue={d => d.numGames || d.games.length}
          pieSortValues={() => -1}
          outerRadius={radius}
        >
          {pie =>
            pie.arcs.map((arc, i) => (
              <g
                key={arc.data.label}
                onClick={isSkeleton ? undefined : () => onSectionSelection(i)}
                className={
                  isSkeleton || selectedIndex === i
                    ? undefined
                    : classes.selectableSection
                }
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
      games: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string.isRequired,
          numPlays: PropTypes.number.isRequired,
        }),
      ),
      numGames: PropTypes.number,
    }),
  ).isRequired,
  isSkeleton: PropTypes.bool.isRequired,
  selectedIndex: PropTypes.number,
  onSectionSelection: PropTypes.func.isRequired,
};

Pie.defaultProps = {
  selectedIndex: undefined,
};

export default Pie;
