import Class from '../../models/class';

export const FETCH_CLASS = 'FETCH_CLASS';

export const fetchClass = () => {
    return async dispatch => {
        try {
            const response = await fetch("https://hercules-56a2b.firebaseio.com/class-list.json");
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            console.log(resData);
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
        } catch (error) {
            throw error;
        }
    }
}