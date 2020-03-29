import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './theme';
import Layout from './pages/Layout';

const App = () => (
  <Router>
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  </Router>
);

export default App;
