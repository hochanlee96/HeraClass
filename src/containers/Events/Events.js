import React, { useState, useEffect, useCallback } from 'react';
import { NavLink } from 'react-router-dom';

const Events = () => {
    const [events, setEvents] = useState(null);

    const fetchMyEvents = useCallback(async studioId => {
        try {

            //서버이용해서 fetch class
            const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + `/event/enrolled`, {
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const resData = await response.json();
            setEvents(resData);

        } catch (error) {
            throw error;
        }
    }, [])

    useEffect(() => {
        fetchMyEvents();
    }, [fetchMyEvents])

    const cancelEvent = async eventId => {
        //async cancel put request
        const response = await fetch(process.env.REACT_APP_SERVER_BASE_URL + `/event/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                eventId: eventId
            })
        });
        if (!response.ok) {
            throw new Error('Something went wrong!');
        }
        const resData = await response.json();
        setEvents(resData);
    }

    let eventsList = null;
    if (events) {
        eventsList = events.map(event => {
            return (
                <div key={event._id}>
                    <p>title : {event.title}</p>
                    <p>trainer: {event.trainer}</p>
                    <p>date: {new Date(event.date).toLocaleDateString()}</p>
                    <p>duration: {event.duration}</p>
                    <p>difficulty: {event.difficulty}</p>
                    <p>category: {event.category}</p>
                    <p>capacity: {event.capacity}</p>
                    <p># students enrolled: {event.students.length}</p>
                    <p>장소: <NavLink
                        to={`/detail/${event.studioId._id}`}
                        exact
                    >{event.studioId.title}</NavLink></p>
                    <p>주소: {event.studioId.address}</p>
                    <button onClick={() => cancelEvent(event._id)}>Cancel Event</button>
                </div>
            )
        })
    }

    return (
        <>
            My Events
            {eventsList}
        </>
    );
}

export default Events;