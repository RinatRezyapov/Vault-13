import * as React from "react";
import SignIn from "./SignIn";
import { Option } from 'fp-ts/lib/Option'

interface Props {
  onAuth: (id: Option<string>) => any;
}

export default class App extends React.Component<Props, {}> {
  render() {
    return <SignIn onAuth={this.props.onAuth} />
  }
}