import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles(theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
}));

const AppBar = ({ showMenuButton, openMenu }) => {
  const classes = useStyles();

  return (
    <MuiAppBar position="relative">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open menu"
          onClick={openMenu}
          edge="start"
          className={`${classes.menuButton} ${
            showMenuButton ? '' : classes.hide
          }`}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap>
          Graph Collection
        </Typography>
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.propTypes = {
  showMenuButton: PropTypes.bool.isRequired,
  openMenu: PropTypes.func.isRequired,
};

AppBar.defaultProps = {};

export default AppBar;
