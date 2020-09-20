import React from 'react';

import Layout from '../../components/hoc/Layout/Layout';
import CLASSES from '../../data/dummy-data';

const ClassDetail = props => {
    const classId = props.match.params.classId;
    const selectedClass = CLASSES.find(cl => cl.id === classId);

    const catList = selectedClass.category.map(cat => (
        <p key={cat}>{cat}</p>
    ))
    return (
        <Layout>
            <p>This is the Class Detail container</p>
            <div>
                <img src={selectedClass.imageUrl} alt='' />
                <p><strong>{selectedClass.title}</strong></p>
                <p>주소: {selectedClass.address}</p>
                <p>전화번호: {selectedClass.details.tel}</p>
                <p>카테고리</p>
                {catList}
            </div>
        </Layout>
    )
}

export default ClassDetail;