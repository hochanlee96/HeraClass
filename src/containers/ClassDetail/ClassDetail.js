import React, { useState, useEffect, useCallback } from 'react';

import Layout from '../../components/hoc/Layout/Layout';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const [selectedClass, setSelectedClass] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const fetchClass = useCallback(async classId => {
        const response = await fetch(`https://hercules-56a2b.firebaseio.com/class-list/${classId}.json?`);
        if (!response.ok) {
            // const errorResData = await response.json();
            let message = 'Something went wrong...';
            throw new Error(message);
        }
        const resData = await response.json();
        console.log('resData: ', resData);
        // const category = [];
        // for (const key in resData.category) {
        //     category.concat(resData.category[key]);
        // }
        console.log(resData.details);
        setSelectedClass({ ...resData, category: [...resData.category], details: { ...resData.details } });
    }, [])

    useEffect(() => {
        setIsLoading(true);
        const fetchedClass = fetchClass(classId);
        setSelectedClass(fetchedClass);
        ;

    }, [classId, fetchClass]);

    let detail;
    // let catList = null;
    if (isLoading) {
        detail = <p>Loading...</p>
    } else {
        // console.log(selectedClass.category);
        // catList = selectedClass.category.map(cat => (
        //     <p key={cat}>{cat}</p>
        // ))
        detail = (
            <div>
                <img src={selectedClass.imageUrl} alt='' />
                <p><strong>{selectedClass.title}</strong></p>
                <p>주소: {selectedClass.address}</p>
                {/* <p>전화번호: {selectedClass.details.tel}</p> */}
                <p>카테고리</p>
                {/* {catList} */}
            </div>
        )
    }

    return (
        <Layout>
            <p>This is the Class Detail container</p>
            {detail}
            {/* {catList} */}
        </Layout>
    )
}

export default ClassDetail;