import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import { isValid, format, subDays } from 'date-fns';
import Typography from '@material-ui/core/Typography';
import { mix } from 'colour-utils';
import { last } from '../../../utils/arrayUtils';
import ParentSize from '../../../components/ParentSize';
import BggInstructions from '../../../components/BggInstruction';
import BggErrorState from '../../../components/BggErrorState';
import HighlightedGameInfo from '../../../components/HighlightedGameInfo';
import Graph from './Graph';

const ratingColors = {
  1: '#ff0000',
  2: '#ff3366',
  3: '#ff6699',
  4: '#ff66cc',
  5: '#cc99ff',
  6: '#9999ff',
  7: '#99ffff',
  8: '#66ff99',
  9: '#33cc99',
  10: '#00cc00',
  undefined: grey[700],
};

const getRatingColor = rating => {
  if (!rating) return ratingColors[undefined];
  return mix(
    ratingColors[Math.floor(rating)],
    ratingColors[Math.ceil(rating)],
    rating % 1,
  );
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
  return playsPerGame;
};

const formatData = (plays, ratings) =>
  plays && ratings ? addRatings(groupByGame(plays), ratings) : null;

const useStyles = makeStyles(theme => ({
  gamePlayProgress: {
    display: 'flex',
    flexDirection: 'column',
  },
  graph: {
    flex: 1,
    overflow: 'auto',
  },
  highlightedGameInfo: {
    height: 40,
    margin: theme.spacing(0, 0, 1, 1),
  },
}));

const GamesPlayProgress = ({
  isFetching,
  errorState,
  plays,
  ratings,
  username,
  className,
}) => {
  const classes = useStyles();
  const [highlightedGame, setHighlightedGame] = useState();
  const playsPerGame = useMemo(() => formatData(plays, ratings), [
    plays,
    ratings,
  ]);

  if (isFetching)
    return <Typography>{`Fetching games for ${username}...`}</Typography>;
  if (errorState.hasError && errorState.error === 'username')
    return <Typography>Invalid username</Typography>;
  if (errorState.hasError) return <BggErrorState />;
  if (!plays) return <BggInstructions />;
  if (plays.length === 0)
    return <Typography>Log your plays on bgg to see this chart.</Typography>;

  return (
    <div className={`${classes.gamePlayProgress} ${className}`}>
      {highlightedGame ? (
        <HighlightedGameInfo
          name={highlightedGame && highlightedGame.name}
          rating={highlightedGame && highlightedGame.rating}
          numberOfPlays={
            highlightedGame && last(highlightedGame.totalPlays).total
          }
          getRatingColor={getRatingColor}
          className={classes.highlightedGameInfo}
        />
      ) : (
        <Typography className={classes.highlightedGameInfo}>
          Hover over a line to see game info
        </Typography>
      )}
      <div className={classes.graph}>
        <ParentSize>
          {({ width, height }) => (
            <Graph
              playsPerGame={playsPerGame}
              getRatingColor={getRatingColor}
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
