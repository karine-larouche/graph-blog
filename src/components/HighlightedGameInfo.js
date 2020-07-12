import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  highlightedGameInfo: {
    display: 'flex',
    alignItems: 'center',
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

const HighlightedGameInfo = ({
  name,
  rating,
  numberOfPlays,
  getRatingColor,
  className,
}) => {
  const classes = useStyles();

  return (
    <div className={`${classes.highlightedGameInfo} ${className}`}>
      <Typography>{name}</Typography>
      {rating && (
        <div
          className={classes.rating}
          style={{
            backgroundColor: getRatingColor(rating),
          }}
        >
          <Typography variant="body2">{rating}</Typography>
        </div>
      )}
      <Typography className={classes.totalPlays}>
        Total plays: {numberOfPlays}
      </Typography>
    </div>
  );
};

HighlightedGameInfo.propTypes = {
  name: PropTypes.string.isRequired,
  rating: PropTypes.number,
  numberOfPlays: PropTypes.number.isRequired,
  getRatingColor: PropTypes.func,
};

HighlightedGameInfo.defaultProps = {
  rating: null,
  getRatingColor: null,
};

export default HighlightedGameInfo;
