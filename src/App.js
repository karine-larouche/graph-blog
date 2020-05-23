import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from './theme';
import Layout from './pages/Layout';

const App = () => (
  <Router>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  </Router>
);

export default App;
