import { addToCollection, mergeDoc } from './firebase';
import { findDoc } from "./firebase";
import { FirebaseQueryCondition } from "../domain/entities";
import { fromNullable, Option, none } from 'fp-ts/lib/Option'

export const authenticate = async (login: string, password: string): Promise<Option<string>> => {
  const response = await findDoc("users", [
    new FirebaseQueryCondition("login", "==", login),
    new FirebaseQueryCondition("password", "==", password),
  ])
  if (response.length === 1) {
    const user = fromNullable(response[0]);
    const userLogin: string = user.map(v => v.data.login).getOrElse(() => "");
    const userPassword: string = user.map(v => v.data.password).getOrElse(() => "");

    if (userLogin === login && userPassword === password) {
      const resId: Option<string> = user.map(user => user.id)
      return resId
    }
  }
  return none;
}


export const register = async (login: string, password: string, nickname: string) => {
  const response = await findDoc("users", [
    new FirebaseQueryCondition("login", "==", login)
  ])

  if (response.length === 0) {
    return addToCollection("users", {
      login: login,
      password: password
    }).then((response: string) => {
      mergeDoc("players", response, {
        id: response,
        fps: 10,
        nickname: nickname,
        type: "player",
        position: {
          q: 7,
          r: 3,
          s: -10
        },
        targetPosition: {
          q: 7,
          r: 3,
          s: -10
        },
      })
      return fromNullable(response)
    });
  } else {
    return none
  }

}