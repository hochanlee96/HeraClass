import Class from '../../models/class';
import { dbService } from '../../fbase';

export const FETCH_CLASS = 'FETCH_CLASS';

export const fetchClass = () => {
    return async dispatch => {
        try {
            // const response = await fetch("https://hercules-56a2b.firebaseio.com/class-list.json");
            // if (!response.ok) {
            //     throw new Error('Something went wrong!');
            // }

            // const resData = await response.json();
            // // console.log(resData);
            // const fetchedClasses = [];

            // for (const key in resData) {
            //     fetchedClasses.push(new Class(
            //         key,
            //         resData[key].title,
            //         resData[key].imageUrl,
            //         resData[key].address,
            //         resData[key].category,
            //         resData[key].details
            //     ));
            // }
            const fetchedClasses = await dbService.collection("classes").get();
            const classArray = [];
            fetchedClasses.forEach(cl => classArray.push(new Class(
                cl.id,
                cl.data().title,
                cl.data().imageUrl,
                cl.data().address,
                cl.data().category,
                cl.data().details
            )));
            console.log(classArray);
            //이부분은 listener활용한 부분이라서 db가 바뀌면 자동으로 바뀜
            // dbService.collection("classes").onSnapshot(snapshot => {
            //     // console.log(snapshot.docs[0].data());
            //     const classArray = snapshot.docs.map(cl => new Class(
            //         cl.id,
            //         cl.data().title,
            //         cl.data().imageUrl,
            //         cl.data().address,
            //         cl.data().category,
            //         cl.data().details
            //     ))
            dispatch({ type: FETCH_CLASS, fetchedClasses: classArray });
        } catch (error) {
            throw error;
        }
    }
}

// export const updateFollower = () => {
//     return async dispatch => {
//         try {
//             dbService.collection("classes").onSnapshot(snapshot => {
//                 const classArray = snapshot.docs.map(cl => new Class(
//                     cl.id,
//                     cl.data().title,
//                     cl.data().imageUrl,
//                     cl.data().address,
//                     cl.data().category,
//                     cl.data().details
//                 ))
//                 dispatch({ type: FETCH_CLASS, fetchedClasses: classArray });
//             })

//             // dispatch({ type: FETCH_CLASS, fetchedClasses: fetchedClasses });
//         } catch (error) {
//             throw error;
//         }
//     }
// }
