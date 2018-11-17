import update from 'immutability-helper';
import { updateState } from '../main';
import { FirebaseQueryCondition, MapObject } from "../domain/entities";
import { State } from "../main";
import { dSE } from './constants';

const firebase = require("firebase");
require("firebase/firestore");

firebase.initializeApp({
  apiKey: 'AIzaSyBglCquYX3gcZcPGcv-EAWJCrdihgkK18A',
  authDomain: 'vault13-e0440.firebaseapp.com',
  projectId: 'vault13-e0440'
});

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true
});

export const addToCollection = (collection: string, data: { [key: string]: any }) =>
  db
    .collection(collection)
    .add(data)
    .then((docRef: any) => docRef.id)
    .catch((error: any) => console.error("Error adding document: ", error));

export const getCollection = (collection: string, ) =>
  db.collection(collection)
    .get()
    .then((querySnapshot: any) => querySnapshot.docs.map((doc: any) => ({ id: doc.id, data: doc.data() })))
    .catch((error: any) => console.log("Error getting documents: ", error))

export const getDoc = (collection: string, doc: string) =>
  db
    .collection(collection)
    .doc(doc)
    .get()
    .then((doc: any) => {
      if (doc.exists) {
        return doc.data()
      } else {
        console.log("No such document!");
      }
    })
    .catch((error: any) => console.log("Error getting documents: ", error))

export const findDoc = (collection: string, conditions: Array<FirebaseQueryCondition>) => {
  let query = db.collection(collection)
  conditions.forEach(condition => {
    query = query.where(condition.item, condition.operator, condition.value);
  })

  return query
    .get()
    .then((querySnapshot: any) => querySnapshot.docs.map((doc: any) => ({ id: doc.id, data: doc.data() })))
    .catch((error: any) => console.log("Error getting documents: ", error));
}

export const mergeDoc = (collection: string, doc: string, data: any) => {
  db
    .collection(collection)
    .doc(doc)
    .set(
      { ...data },
      { merge: true }
    )
}

export const listen = (state: State, id: string) => {
  return db.collection("players").doc(id)
    .onSnapshot(function (doc: any) {
      const playerIdx = state.mapObjects.findIndex(el => el.id === id);
      if (playerIdx !== -1) {
        const player = state.mapObjects[playerIdx];
        const mapObject = new MapObject(id, player.nickname, player.type, player.position, doc.data().targetPosition, player.path, player.lastFrameTime, player.fps, 0, 0, dSE);
        updateState(state, update(state, {
          mapObjects: {
            $splice: [[playerIdx, 1, mapObject]]
          }
        }));
      }
    });
}