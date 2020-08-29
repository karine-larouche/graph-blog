import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ParentSize from '../../../components/ParentSize';
import BggInstructions from '../../../components/BggInstruction';
import BggErrorState from '../../../components/BggErrorState';
import formatData from './formatData';
import Graph from './Graph';

const useStyles = makeStyles({
  groupedPlayProgress: {
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
  errorState,
  plays,
  username,
  className,
}) => {
  const classes = useStyles();

  if (isFetching)
    return <Typography>{`Fetching games for ${username}...`}</Typography>;
  if (errorState.hasError && errorState.error === 'username')
    return <Typography>Invalid username</Typography>;
  if (errorState.hasError) return <BggErrorState />;
  if (!plays) return <BggInstructions />;
  if (plays.length === 0)
    return <Typography>Log your plays on bgg to see this chart.</Typography>;

  const playsOverTime = formatData(plays);

  return (
    <div className={`${classes.groupedPlayProgress} ${className}`}>
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
  errorState: PropTypes.shape({
    hasError: PropTypes.bool.isRequired,
    error: PropTypes.string,
  }).isRequired,
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
