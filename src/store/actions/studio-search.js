import SimpleStudio from '../../models/studio/simpleStudio';

export const FETCH_STUDIO = 'FETCH_STUDIO';
export const UPDATE_FOLLOWER = 'UPDATE_FOLLOWER';

const computeDistance = (myLocation, studioLocation) => {
    const p = 0.017453292519943295;
    const c = Math.cos;
    const a = 0.5 - c((studioLocation.latitude - myLocation.latitude) * p) / 2 + c(myLocation.latitude * p) * c(studioLocation.latitude * p) * (1 - c((studioLocation.longitude - myLocation.longitude) * p)) / 2;
    return 12742 * Math.asin(Math.sqrt(a));
}

export const fetchKeyword = (currentLocation, keyword) => {
    return async dispatch => {
        const response = await fetch(`http://localhost:3001/user/studio-search/search/keyword/${keyword}`, {
            credentials: 'include'
        });
        const resData = await response.json();
        console.log(resData);
        const fetchedStudios = [];

        for (const key in resData) {
            fetchedStudios.push(new SimpleStudio(
                resData[key]._id,
                resData[key].title,
                resData[key].imageUrl,
                resData[key].bigAddress,
                [...resData[key].category],
                [...resData[key].followers],
                { ...resData[key].coordinates },
                resData[key].postedBy,
                [...resData[key].reviews],
                computeDistance(currentLocation, resData[key].coordinates)
            ));
        }
        dispatch({ type: FETCH_STUDIO, fetchedStudios: fetchedStudios });
    }
}

export const fetchStudios = (currentLocation, maxDistance) => {
    return async dispatch => {
        try {
            //서버이용하기
            const coordDistance = { '1': 0.013, '5': 0.045, '10': 0.09, '20': 0.9 }
            const boundary = {
                maxLat: Number(currentLocation.latitude) + coordDistance[maxDistance],
                minLat: Number(currentLocation.latitude) - coordDistance[maxDistance],
                maxLng: Number(currentLocation.longitude) + coordDistance[maxDistance],
                minLng: Number(currentLocation.longitude) - coordDistance[maxDistance],
            }
            const response = await fetch(`http://localhost:3001/user/studio-search/search?maxLat=${boundary.maxLat}&minLat=${boundary.minLat}&maxLng=${boundary.maxLng}&minLng=${boundary.minLng}`, {
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }
            const resData = await response.json();
            // console.log(resData);
            const fetchedStudios = [];

            for (const key in resData) {
                fetchedStudios.push(new SimpleStudio(
                    resData[key]._id,
                    resData[key].title,
                    resData[key].imageUrl,
                    resData[key].bigAddress,
                    [...resData[key].category],
                    [...resData[key].followers],
                    { ...resData[key].coordinates },
                    resData[key].postedBy,
                    [...resData[key].reviews],
                    computeDistance(currentLocation, resData[key].coordinates)
                ));
            }
            dispatch({ type: FETCH_STUDIO, fetchedStudios: fetchedStudios });
        } catch (error) {
            throw error;
        }
    }
}

export const updateFollower = (studioId, userEmail, add) => {
    return async dispatch => {
        try {
            if (add) {
                //서버이용
                const response = await fetch('http://localhost:3001/user/studio-search/update-followers', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        studioId: studioId,
                        add: true
                    })
                });
                if (response.ok) {
                    dispatch({ type: UPDATE_FOLLOWER, add: true, studioId: studioId, userEmail: userEmail })
                }

            } else {
                //서버이용
                const response = await fetch('http://localhost:3001/user/studio-search/update-followers', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        studioId: studioId,
                        add: false
                    })
                });
                if (response.ok) {
                    dispatch({ type: UPDATE_FOLLOWER, add: false, studioId: studioId, userEmail: userEmail })
                }

            }
        } catch (error) {
            throw error;
        }
    }
}