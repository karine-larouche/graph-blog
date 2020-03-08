import React from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Bgg from '../Bgg';
import Menu, { drawerWidth } from './Menu';
import AppBar from './AppBar';

const useStyles = makeStyles(theme => ({
  layout: {
    display: 'flex',
    overflow: 'hidden',
  },
  shift: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflow: 'auto',
    [theme.breakpoints.up('lg')]: {
      width: theme.breakpoints.values.lg - drawerWidth,
      margin: '0 auto',
    },
  },
  welcome: {
    margin: 20,
  },
}));

const Layout = () => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = React.useState(location.pathname === '/');

  return (
    <div className={classes.layout}>
      <Menu isOpen={open} close={() => setOpen(false)} />
      <div className={classes.shift}>
        <AppBar showMenuButton={!open} openMenu={() => setOpen(true)} />
        <main className={classes.main}>
          <Switch>
            <Route path={['/bgg-owned-games', '/bgg-play-progress']}>
              <Bgg />
            </Route>
            <Route exact path="/">
              <Typography className={classes.welcome}>
                Welcome! Select a graph in the menu.
              </Typography>
            </Route>
            <Route path="/">
              <Redirect to="/" />
            </Route>
          </Switch>
        </main>
      </div>
    </div>
  );
};

export default Layout;
