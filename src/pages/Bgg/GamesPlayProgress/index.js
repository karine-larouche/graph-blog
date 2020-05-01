import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { isValid, format, subDays } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { last } from '../../../utils/arrayUtils';
import ParentSize from '../../../components/ParentSize';
import BggInstructions from '../../../components/BggInstruction';
import HighlightedGameInfo from './HighlightedGameInfo';
import Graph from './Graph';

const ratingColors = {
  1: '#f00',
  2: '#f36',
  3: '#f69',
  4: '#f6c',
  5: '#c9f',
  6: '#99f',
  7: '#9ff',
  8: '#6f9',
  9: '#3c9',
  10: '#0c0',
  undefined: grey[700],
};

const groupByGame = plays => {
  const playsByGame = plays.reduceRight((games, play) => {
    if (isValid(new Date(play.date)) && play.quantity !== 0) {
      const game = games[play.name];
      if (game) {
        if (last(game.totalPlays).date === play.date) {
          last(game.totalPlays).total += play.quantity;
        } else {
          game.totalPlays.push({
            date: play.date,
            total: last(game.totalPlays).total + play.quantity,
          });
        }
      } else {
        // eslint-disable-next-line no-param-reassign
        games[play.name] = {
          name: play.name,
          totalPlays: [
            {
              date: format(subDays(new Date(play.date), 1), 'yyyy-MM-dd'),
              total: 0,
            },
            { date: play.date, total: play.quantity },
          ],
        };
      }
    }
    return games;
  }, {});
  return Object.values(playsByGame);
};

const addRatings = (playsPerGame, ratings) => {
  ratings.forEach(ratedGame => {
    const playedGame = playsPerGame.find(g => g.name === ratedGame.name);
    if (playedGame) {
      playedGame.rating = ratedGame.rating;
    }
  });
};

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

const GamesPlayProgress = ({
  isFetching,
  hasError,
  plays,
  ratings,
  username,
  className,
}) => {
  const classes = useStyles();
  const [highlightedGame, setHighlightedGame] = useState();

  if (isFetching)
    return <Typography>{`Fetching games for ${username}...`}</Typography>;
  if (hasError) return <Typography>An error occured... sorry!</Typography>;
  if (!plays) return <BggInstructions />;
  if (plays.length === 0)
    return <Typography>Log your plays on bgg to see this chart.</Typography>;

  const playsPerGame = groupByGame(plays);
  addRatings(playsPerGame, ratings);

  return (
    <div className={`${classes.gamePlayProgress} ${className}`}>
      <HighlightedGameInfo
        highlightedGame={highlightedGame}
        ratingColors={ratingColors}
      />
      <div className={classes.graph}>
        <ParentSize>
          {({ width, height }) => (
            <Graph
              playsPerGame={playsPerGame}
              ratingColors={ratingColors}
              highlightedGame={highlightedGame}
              setHighlightedGame={setHighlightedGame}
              width={width}
              height={height}
            />
          )}
        </ParentSize>
      </div>
    </div>
  );
};

GamesPlayProgress.propTypes = {
  isFetching: PropTypes.bool.isRequired,
  hasError: PropTypes.bool.isRequired,
  plays: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  ratings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      rating: PropTypes.number,
    }),
  ),
  username: PropTypes.string.isRequired,
};

GamesPlayProgress.defaultProps = {
  plays: undefined,
  ratings: undefined,
};

export default GamesPlayProgress;
