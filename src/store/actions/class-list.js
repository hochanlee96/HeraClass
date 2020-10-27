import Class from '../../models/class';
import * as firebase from "firebase/app";
import { dbService } from '../../fbase';

export const FETCH_CLASS = 'FETCH_CLASS';
export const UPDATE_FOLLOWER = 'UPDATE_FOLLOWER';

export const fetchClass = () => {
    return async dispatch => {
        try {
            //서버이용하기
            const response = await fetch("http://localhost:3001/class-list", {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            console.log(resData);
            // console.log(resData);
            const fetchedClasses = [];

            for (const key in resData) {
                fetchedClasses.push(new Class(
                    key,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].address,
                    resData[key].category,
                    resData[key].details
                ));
            }
            dispatch({ type: FETCH_CLASS, fetchedClasses: fetchedClasses });

            //firebase 이용하기
            // const fetchedClasses = await dbService.collection("classes").get();
            // const classArray = [];
            // fetchedClasses.forEach(cl => classArray.push(new Class(
            //     cl.id,
            //     cl.data().title,
            //     cl.data().imageUrl,
            //     cl.data().address,
            //     cl.data().category,
            //     cl.data().details,
            //     cl.data().followers
            // )));
            // dispatch({ type: FETCH_CLASS, fetchedClasses: classArray });
        } catch (error) {
            throw error;
        }
    }
}

export const updateFollower = (classId, userId, add) => {
    return async dispatch => {
        try {
            if (add) {
                dbService.collection("classes").doc(`${classId}`).update({
                    followers: firebase.firestore.FieldValue.arrayUnion(userId)
                });
                dispatch({ type: UPDATE_FOLLOWER, add: true, classId: classId, userId: userId })
            } else {
                dbService.collection("classes").doc(`${classId}`).update({
                    followers: firebase.firestore.FieldValue.arrayRemove(userId)
                });
                dispatch({ type: UPDATE_FOLLOWER, add: false, classId: classId, userId: userId })
            }
        } catch (error) {
            throw error;
        }
    }
}
