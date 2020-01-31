import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      marginLeft: 20,
      border: `solid 1px ${grey[900]}`,
      borderRadius: theme.shape.borderRadius,
      overflowY: 'hidden',
    },
    label: {
      backgroundColor: props => props.color,
      padding: '4px 20px',
    },
    listContainer: {
      flex: 1,
      overflowY: 'scroll',
    },
    list: {
      paddingRight: 12,
    },
    game: {
      marginBottom: 4,
    },
  }),
);

const List = ({ label, color, showAmount, games, className }) => {
  const classes = useStyles({ color });
  return (
    <div className={`${className} ${classes.root}`}>
      <div className={classes.label}>
        <Typography>{label}</Typography>
      </div>
      <div className={classes.listContainer}>
        <ul className={classes.list}>
          {games.map(game => (
            <li key={game.name} className={classes.game}>
              <Typography variant="body2" display="inline">
                {game.name}
              </Typography>
              {showAmount && (
                <Typography variant="body2" display="inline">
                  {` - ${game.numPlays}`}
                </Typography>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

List.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  showAmount: PropTypes.bool.isRequired,
  games: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      numPlays: PropTypes.number.isRequired,
    }),
  ).isRequired,
};

export default List;
