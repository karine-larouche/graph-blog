import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { gameWithPlayProgressShape } from './utils';
import { last } from '../../../utils/arrayUtils';

const useStyles = makeStyles(theme => ({
  highlightedGameInfo: {
    display: 'flex',
    alignItems: 'center',
    height: 40,
    margin: theme.spacing(0, 0, 1, 1),
  },
  rating: {
    marginLeft: theme.spacing(2),
    minWidth: 30,
    padding: '0 4px',
    height: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
  },
  totalPlays: {
    marginLeft: theme.spacing(2),
  },
}));

const HighlightedGameInfo = ({ highlightedGame, getRatingColor }) => {
  const classes = useStyles();

  return (
    <div className={classes.highlightedGameInfo}>
      {highlightedGame ? (
        <>
          <Typography>{highlightedGame.name}</Typography>
          {highlightedGame.rating && (
            <div
              className={classes.rating}
              style={{
                backgroundColor: getRatingColor(highlightedGame.rating),
              }}
            >
              <Typography variant="body2">{highlightedGame.rating}</Typography>
            </div>
          )}
          <Typography className={classes.totalPlays}>
            Total plays: {last(highlightedGame.totalPlays).total}
          </Typography>
        </>
      ) : (
        <Typography>Hover over a line to see game info</Typography>
      )}
    </div>
  );
};

HighlightedGameInfo.propTypes = {
  highlightedGame: gameWithPlayProgressShape,
  getRatingColor: PropTypes.func.isRequired,
};

HighlightedGameInfo.defaultProps = {
  highlightedGame: undefined,
};

export default HighlightedGameInfo;
