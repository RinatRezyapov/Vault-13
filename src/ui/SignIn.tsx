import * as React from "react";
import { authenticate, register } from "../utils/authentication";
import { Option, isSome } from 'fp-ts/lib/Option'
import TextField from "@material-ui/core/TextField";
import { Button, Paper, Snackbar } from "@material-ui/core";

interface Props {
  onAuth: (id: Option<string>) => any;
}

interface State {
  login: string;
  password: string;
  nickname: string;
  repeatedPassword: string;
  registration: boolean;
  loginError: string;
  passwordError: string;
  nicknameError: string;
  snackbar: {
    open: boolean,
    message: string,
  };
}

export default class AuthForm extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      login: "",
      password: "",
      nickname: "",
      loginError: "",
      passwordError: "",
      nicknameError: "",
      repeatedPassword: "",
      registration: false,
      snackbar: {
        open: false,
        message: '',
      }
    }
    this.onLoginClick = this.onLoginClick.bind(this);
    this.onLoginChange = this.onLoginChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
    this.onRepeatedPasswordChange = this.onRepeatedPasswordChange.bind(this);
    this.onRegistrationClick = this.onRegistrationClick.bind(this);
    this.onRegisterClick = this.onRegisterClick.bind(this);
    this.onNicknameChange = this.onNicknameChange.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.onToLoginClick = this.onToLoginClick.bind(this);
  }

  onLoginClick(evt: any) {
    evt.preventDefault();
    authenticate(this.state.login, this.state.password).then(id => {
      if (isSome(id)) {
        this.props.onAuth(id)
      } else {
        this.setState({
          snackbar: {
            open: true,
            message: 'User is not found'
          }
        })
      }
    })
  }

  onRegistrationClick() {
    this.setState({
      registration: true
    })
  }
  
  onToLoginClick() {
    this.setState({
      registration: false
    })
  }

  onRegisterClick() {
    if (this.state.login.length < 6) {
      this.setState({
        loginError: "The length of the login must be at least 6 symbols"
      })
      return
    }

    if (this.state.password.length < 6) {
      this.setState({
        passwordError: "The length of the password must be at least 6 symbols"
      })
      return
    }

    if (this.state.password === this.state.repeatedPassword) {
      register(this.state.login, this.state.password, this.state.nickname).then(id => {
        if (isSome(id)) {
          this.props.onAuth(id as any);
          this.setState({
            registration: false
          })
        } else {
          this.setState({
            snackbar: {
              open: true,
              message: 'User is already exists'
            }
          })
        }
      })
    } else {
      this.setState({
        passwordError: "Passwords do not match"
      })
      return
    }
  }

  onLoginChange(evt: any) {
    this.setState({
      login: evt.target.value,
      loginError: ""
    })
  }

  onNicknameChange(evt: any) {
    this.setState({
      nickname: evt.target.value,
      nicknameError: ""
    })
  }

  onPasswordChange(evt: any) {
    this.setState({
      password: evt.target.value,
      passwordError: ""
    })
  }

  onRepeatedPasswordChange(evt: any) {
    this.setState({
      repeatedPassword: evt.target.value,
      passwordError: ""
    })
  }

  handleSnackbarClose() {
    this.setState({
      snackbar: {
        open: false,
        message: ''
      }
    })
  }

  renderSnackBar() {
    return <Snackbar
      open={this.state.snackbar.open}
      message={this.state.snackbar.message}
      autoHideDuration={6000}
      onClose={this.handleSnackbarClose}
    />
  }

  render() {

    if (this.state.registration) {
      return <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper style={{ padding: "15px" }}>
          <TextField
            fullWidth
            style={{ marginTop: "15px" }}
            label="Login"
            value={this.state.login}
            onChange={this.onLoginChange}
            error={this.state.loginError !== ""}
            helperText={this.state.loginError}
          />
          <TextField
            fullWidth
            type="password"
            style={{ marginTop: "15px" }}
            label="Password"
            value={this.state.password}
            onChange={this.onPasswordChange}
            error={this.state.passwordError !== ""}
            helperText={this.state.passwordError}
          />
          <TextField
            fullWidth
            type="password"
            style={{ marginTop: "15px" }}
            label="Repeat password"
            value={this.state.repeatedPassword}
            onChange={this.onRepeatedPasswordChange}
            error={this.state.passwordError !== ""}
            helperText={this.state.passwordError}
          />
          <TextField
            fullWidth
            style={{ marginTop: "15px" }}
            label="Nickname"
            value={this.state.nickname}
            onChange={this.onNicknameChange}
            error={this.state.nicknameError !== ""}
            helperText={this.state.nicknameError}
          />
          <div style={{ flex: 1, textAlign: "center", marginTop: "15px" }}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={this.onToLoginClick}
              style={{ marginRight: 16 }}
            >
              To Login
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={this.onRegisterClick}
            >
              Register
            </Button>
          </div>
        </Paper>
        {this.renderSnackBar()}
      </div>
    }

    return <form
      onSubmit={this.onLoginClick}
      style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Paper style={{ padding: "15px" }}>
        <TextField
          fullWidth
          style={{ marginTop: "15px" }}
          label="Login"
          value={this.state.login}
          onChange={this.onLoginChange}
        />
        <TextField
          fullWidth
          type="password"
          style={{ marginTop: "15px" }}
          label="Password"
          value={this.state.password}
          onChange={this.onPasswordChange}
        />
        <div style={{ flex: 1, textAlign: "center", marginTop: "15px" }}>
          <Button
            variant="outlined"
            color="primary"
            type="submit"
          >
            Login
          </Button>
          <Button
            style={{ marginLeft: "15px" }}
            variant="outlined"
            color="secondary"
            onClick={this.onRegistrationClick}
          >
            Registration
          </Button>
        </div>
        {this.renderSnackBar()}
      </Paper>
    </form>
  }
}