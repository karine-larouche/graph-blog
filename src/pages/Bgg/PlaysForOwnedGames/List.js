import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { blueGrey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      border: ({ selected }) => selected && `solid 1px ${blueGrey[800]}`,
      borderRadius: theme.shape.borderRadius,
      overflowY: 'hidden',
    },
    label: {
      backgroundColor: ({ selected }) => selected && selected.color,
      padding: '4px 20px',
    },
    listContainer: {
      flex: 1,
      overflowY: 'auto',
    },
    list: {
      paddingRight: 12,
    },
    game: {
      marginBottom: 4,
    },
    instructions: {
      color: blueGrey[600],
    },
  }),
);

const List = ({ selected, className }) => {
  const classes = useStyles({ selected });

  return (
    <div className={`${className} ${classes.root}`}>
      {selected ? (
        <>
          <div className={classes.label}>
            <Typography>{selected.label}</Typography>
          </div>
          <div className={classes.listContainer}>
            <ul className={classes.list}>
              {selected.games.map(game => (
                <li key={game.name} className={classes.game}>
                  <Typography variant="body2" display="inline">
                    {game.name}
                  </Typography>
                  {selected.showAmount && (
                    <Typography variant="body2" display="inline">
                      {` - ${game.numPlays}`}
                    </Typography>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <Typography className={classes.instructions}>
          Click on a section of the chart to see the corresponding games.
        </Typography>
      )}
    </div>
  );
};

List.propTypes = {
  selected: PropTypes.shape({
    label: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    showAmount: PropTypes.bool.isRequired,
    games: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        numPlays: PropTypes.number.isRequired,
      }),
    ).isRequired,
  }),
};

List.defaultProps = {
  selected: undefined,
};

export default List;
