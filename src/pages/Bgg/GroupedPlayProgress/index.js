import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ParentSize from '../../../components/ParentSize';
import formatData from './formatData';
import Graph from './Graph';

const useStyles = makeStyles({
  gamePlayProgress: {
    display: 'flex',
    flexDirection: 'column',
  },
  graph: {
    flex: 1,
    overflow: 'auto',
  },
});

const GroupedPlayProgress = ({
  isFetching,
  hasError,
  plays,
  username,
  className,
}) => {
  const classes = useStyles();

  if (isFetching)
    return <Typography>{`Fetching games for ${username}...`}</Typography>;
  if (hasError) return <Typography>An error occured... sorry!</Typography>;
  if (!plays)
    return <Typography>Enter your bgg username to view your plays.</Typography>;
  if (plays.length === 0)
    return <Typography>Log your plays on bgg to see this chart.</Typography>;

  const playsOverTime = formatData(plays);

  return (
    <div className={`${classes.gamePlayProgress} ${className}`}>
      <div className={classes.graph}>
        <ParentSize>
          {({ width, height }) => (
            <Graph
              playsOverTime={playsOverTime}
              width={width}
              height={height}
            />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

GroupedPlayProgress.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  plays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  username: PropTypes.string.isRequired,
};

GroupedPlayProgress.defaultProps = {
  plays: undefined,
};

export default GroupedPlayProgress;