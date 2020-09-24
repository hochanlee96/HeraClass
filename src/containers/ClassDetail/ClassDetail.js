import React, { useState, useEffect } from 'react';
// import { useSelector } from 'react-redux';

import Layout from '../../components/hoc/Layout/Layout';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const [selectedClass, setFetchedClass] = useState();


    // try fetching
    const fetchClass = async classId => {
        try {
            const response = await fetch(`https://hercules-56a2b.firebaseio.com/class-list/${classId}.json`);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            setFetchedClass({
                title: resData.title,
                imageUrl: resData.imageUrl,
                address: resData.address,
                details: { ...resData.details },
                category: [...resData.category]
            })

        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        fetchClass(classId);
    }, [classId])


    // 
    // const selectedClass = useSelector(state => state.allClasses.allClasses.find(cl => cl.id === classId));


    let detail = null;
    if (selectedClass) {
        const catList = selectedClass.category.map(cat => (
            <p key={cat}>{cat}</p>
        ))
        detail = <div>
            <img src={selectedClass.imageUrl} alt='' />
            <p><strong>{selectedClass.title}</strong></p>
            <p>주소: {selectedClass.address}</p>
            <p>전화번호: {selectedClass.details.tel}</p>
            <p>카테고리</p>
            {catList}
        </div>
    }

    return (
        <Layout>
            <p>This is the Class Detail container</p>
            {detail}
        </Layout>
    )
}

export default ClassDetail;