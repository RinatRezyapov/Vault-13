import * as ReactDOM from "react-dom";
import * as React from "react";
import update from 'immutability-helper';
import { Option, fromNullable } from 'fp-ts/lib/Option'

import { State, initGame } from "../main";
import App from "./App";
import { updateState } from "../main";

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

  ReactDOM.render(<App onAuth={onAuth} />, document.getElementById("authContainer"));
}