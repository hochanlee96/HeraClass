import SimpleStudio from '../../models/studio/simpleStudio';

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
                fetchedClasses.push(new SimpleStudio(
                    resData[key]._id,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].address,
                    [...resData[key].category],
                    [...resData[key].followers],
                    { ...resData[key].coordinates },
                    resData[key].postedBy,
                    [...resData[key].reviews],
                ));
            }
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

            }
        } catch (error) {
            throw error;
        }
    }
}