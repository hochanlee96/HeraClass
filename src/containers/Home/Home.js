import React from 'react';

// import publicIp from 'react-public-ip';

import classes from './Home.module.css';

// const initialState = { countA: 0, countB: 0, };

// const reducer = (state, action) => {
//     switch (action.type) {
//         case 'incrementA':
//             return { ...state, countA: state.countA + 1 };
//         case 'decrementB':
//             return { countA: state.countA - 1 };
//         case 'incrementB':
//             return { ...state, countB: state.countB + 1 };
//         case 'decrementB':
//             return { countB: state.countB - 1 };
//         default:
//             throw new Error();
//     }
// }


const Home = () => {

    // const [state, dispatch] = useReducer(reducer, initialState);



    // const [ip, setIp] = useState('');

    // const getIp = useCallback(async () => {
    //     const ipv4 = await publicIp.v4() || "";
    //     setIp(ipv4);
    // }, [])

    // useEffect(() => {
    //     getIp();
    // }, [getIp])

    // const sendMessage = async () => {
    //     const response = await fetch('http://localhost:3001/sms/test', {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         credentials: 'include'
    //     });

    //     const resData = await response.json();
    //     console.log(resData);
    // }
    return (
        <div>
            {/* <>
                <p onClick={() => { dispatch({ type: 'incrementA' }) }}>Count A: {state.countA}</p>
                <p onClick={() => { dispatch({ type: 'incrementB' }) }}>Count B: {state.countB}</p>
            </> */}
            <p className={classes.Font}>This is the Home container</p>
            {/* test */}
            {/* <button onClick={sendMessage}>send test sms</button> */}
        </div>
    )
}

export default Home;
