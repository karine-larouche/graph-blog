import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ZoomInIcon from '@material-ui/icons/Add';
import ZoomOutIcon from '@material-ui/icons/Remove';
import ParentSize from '../../../components/ParentSize';
import BggInstructions from '../../../components/BggInstruction';
import HighlightedGameInfo from '../../../components/HighlightedGameInfo';
import formatData from './formatData';
import Graph from './Graph';

const useZoom = () => {
  const [zoom, setZoom] = useState(0.375);
  const zoomInDisabled = zoom > 0.6;

  const zoomIn = () => setZoom((zoom * 4) / 3);
  const zoomOut = () => setZoom((zoom * 3) / 4);

  return [zoom, zoomInDisabled, zoomIn, zoomOut];
};

const useStyles = makeStyles(theme => ({
  hIndex: {
    display: 'flex',
    flexDirection: 'column',
  },
  graph: {
    flex: 1,
    overflow: 'auto',
  },
  highlightedGameInfo: {
    height: 30,
    margin: theme.spacing(0, 0, 1, 0),
  },
}));

const HIndex = ({ isFetching, errorState, plays, username, className }) => {
  const classes = useStyles();
  const [highlightedGame, setHighlightedGame] = useState();
  const [zoom, zoomInDisabled, zoomIn, zoomOut] = useZoom();

  if (isFetching)
    return <Typography>{`Fetching games for ${username}...`}</Typography>;
  if (errorState.hasError && errorState.error === 'username')
    return <Typography>Invalid username</Typography>;
  if (errorState.hasError)
    return <Typography>An error occured, please try again</Typography>;
  if (!plays) return <BggInstructions />;
  if (plays.length === 0)
    return <Typography>Log your plays on bgg to see this chart.</Typography>;

  const totalPlays = formatData(plays);

  return (
    <div className={`${classes.hIndex} ${className}`}>
      <div className={classes.highlightedGameInfo}>
        {highlightedGame ? (
          <HighlightedGameInfo
            name={highlightedGame && highlightedGame.name}
            numberOfPlays={highlightedGame && highlightedGame.numberOfPlays}
          />
        ) : (
          <div>
            <IconButton
              aria-label="zoom in"
              onClick={zoomIn}
              disabled={zoomInDisabled}
              size="small"
            >
              <ZoomInIcon />
            </IconButton>
            <IconButton aria-label="zoom out" onClick={zoomOut} size="small">
              <ZoomOutIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className={classes.graph}>
        <ParentSize>
          {({ width, height }) => (
            <Graph
              totalPlays={totalPlays}
              highlightedGame={highlightedGame}
              setHighlightedGame={setHighlightedGame}
              zoom={zoom}
              width={width}
              height={height}
            />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

HIndex.propTypes = {
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

HIndex.defaultProps = {
  plays: undefined,
};

export default HIndex;
