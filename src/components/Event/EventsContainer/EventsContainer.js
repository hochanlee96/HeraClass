import React, { useState, useEffect } from 'react';

const EventsContainer = ({ userEmail, joinEvent, eventsArray }) => {
    const [week, setWeek] = useState(null);
    const [activeIndex, setActiveIndex] = useState(new Date().getDay());
    const [todayEventsArray, setTodayEventsArray] = useState(null);
    const dayArray = ['일', '월', '화', '수', '목', '금', '토']

    useEffect(() => {
        const now = new Date();
        let week = []
        for (let i = 1; i < 7; i++) {
            week.push(new Date(now.setDate(now.getDate() + 1)))
        }
        week = [new Date(), ...week]
        setWeek(week);
    }, [])

    useEffect(() => {
        if (eventsArray) {
            setTodayEventsArray(eventsArray.filter(event => new Date(event.date).toLocaleDateString() === new Date().toLocaleDateString()))
        }
    }, [eventsArray])

    const onDayClicked = (dayIndex, dateString) => {
        setActiveIndex(dayIndex);
        setTodayEventsArray(eventsArray.filter(event => new Date(event.date).toLocaleDateString() === dateString))
    }

    const moveCalendar = direction => {
        if (direction === 'forward') {
            const tempWeek = [...week];
            const tempDay = new Date(tempWeek[6])
            const tomorrow = new Date(tempDay.setDate(tempDay.getDate() + 1));
            tempWeek.splice(0, 1);
            tempWeek.push(tomorrow);
            setWeek(tempWeek)
            setActiveIndex(tomorrow.getDay())
            setTodayEventsArray(eventsArray.filter(event => new Date(event.date).toLocaleDateString() === tomorrow.toLocaleDateString()))
        } else {
            console.log('back')
            const now = new Date(new Date().toLocaleDateString())
            if (now < new Date(new Date(week[0]).setDate(week[0].getDate() - 1))) {
                let tempWeek = [...week];
                const tempDay = new Date(tempWeek[0])
                const yesterday = new Date(tempDay.setDate(tempDay.getDate() - 1));
                tempWeek.splice(6, 1);
                tempWeek = [yesterday, ...tempWeek]
                setWeek(tempWeek)
                setActiveIndex(yesterday.getDay())
                setTodayEventsArray(eventsArray.filter(event => new Date(event.date).toLocaleDateString() === yesterday.toLocaleDateString()))
            }
        }
    }
    console.log(week);
    let days;
    if (week) {
        days = week.map(day => <div key={day.getDay()} style={day.getDay() === activeIndex ? { backgroundColor: 'orange' } : null} onClick={() => onDayClicked(day.getDay(), day.toLocaleDateString())}>
            <p style={{ display: 'inline-block', marginBottom: '0' }} >{day.getDate()}</p>
            <p style={{ marginTop: '0' }}>{dayArray[day.getDay()]}</p>
        </div>)
    }

    let eventList;
    if (todayEventsArray && todayEventsArray.length > 0) {
        eventList = todayEventsArray.map(event => {
            let enrolled = false;
            if (userEmail && event.students.findIndex(studentEmail => studentEmail === userEmail) > -1) {
                enrolled = true;
            }
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
                    {enrolled ? <p>You are enrolled in this event!</p> : <button onClick={() => joinEvent(event._id)}>Join</button>}
                </div>
            )
        })
    } else {
        eventList = <p>There are no Events today!</p>
    }


    return (<>
        <p><strong>Events</strong></p>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
            <button onClick={() => moveCalendar("back")}>Left</button>
            {days}
            <button onClick={() => moveCalendar("forward")}>Right</button>
        </div>
        {eventList}
    </>)
}

export default EventsContainer;