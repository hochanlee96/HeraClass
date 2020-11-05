import Class from '../../models/class';
// import * as firebase from "firebase/app";
// import { dbService } from '../../fbase';

export const FETCH_CLASS = 'FETCH_CLASS';
export const UPDATE_FOLLOWER = 'UPDATE_FOLLOWER';

export const fetchClass = () => {
    return async dispatch => {
        try {
            //서버이용하기
            const response = await fetch("http://localhost:3001/user/class-list", {
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
                    resData[key]._id,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].address,
                    resData[key].category,
                    resData[key].details,
                    resData[key].followers,
                    { ...resData[key].coordinates }
                ));
            }

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
            dispatch({ type: FETCH_CLASS, fetchedClasses: fetchedClasses });
        } catch (error) {
            throw error;
        }
    }
}

export const updateFollower = (classId, userEmail, add) => {
    return async dispatch => {
        try {
            if (add) {
                //서버이용
                const response = await fetch('http://localhost:3001/user/class-list/update-followers', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        classId: classId,
                        add: true
                    })
                });
                if (response.ok) {
                    dispatch({ type: UPDATE_FOLLOWER, add: true, classId: classId, userEmail: userEmail })
                }

                //firebase 이용
                // dbService.collection("classes").doc(`${classId}`).update({
                //     followers: firebase.firestore.FieldValue.arrayUnion(userId)
                // });


            } else {
                //서버이용
                const response = await fetch('http://localhost:3001/user/class-list/update-followers', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        classId: classId,
                        add: false
                    })
                });
                if (response.ok) {
                    dispatch({ type: UPDATE_FOLLOWER, add: false, classId: classId, userEmail: userEmail })
                }
                //firebase 이용
                // dbService.collection("classes").doc(`${classId}`).update({
                //     followers: firebase.firestore.FieldValue.arrayRemove(userId)
                // });


            }
        } catch (error) {
            throw error;
        }
    }
}
