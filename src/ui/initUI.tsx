import * as ReactDOM from "react-dom";
import * as React from "react";
import update from 'immutability-helper';
import { Option, fromNullable } from 'fp-ts/lib/Option'

import { State, initGame } from "../main";
import App from "./App";
import { updateState } from "../main";
import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import green from '@material-ui/core/colors/green';
import { ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: green,
  },
  overrides: {
    MuiPaper: {
      root: {
        backgroundColor: 'transparent',
        border: '1px solid #6bff02'
      }
    },
    MuiInputBase: {
      root: {
        color: '#6bff02'
      }
    },
    MuiFormLabel: {
      root: {
        color: '#6bff02'
      }
    }
  }
});

export const initUI = (state: State) => {

  const onAuth = (id: Option<string>) => {
    updateState(state, update(state, {
      userId: {
        $set: id
      }
    }));
    fromNullable(document.getElementById('authContainer')).map(node => ReactDOM.unmountComponentAtNode(node));
    initGame(state);
  }

  ReactDOM.render(
    <ThemeProvider theme={theme}>
      <App onAuth={onAuth} />
    </ThemeProvider>, 
    document.getElementById("authContainer"));
}