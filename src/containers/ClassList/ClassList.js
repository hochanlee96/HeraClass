import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ClassListContainer from '../../components/ClassCardsContainer/ClassCardsContainer';
import classes from './ClassList.module.css';
import * as classActions from '../../store/actions/class-list';
import Spinner from '../../components/UI/Spinner/Spinner';
import NaverMap from '../../components/Map/NaverMap';

const ClassList = props => {
    const defaultCenter = { latitude: "37.5624917", longitude: "126.9724786" }
    const allClasses = useSelector(state => state.classList.allClasses);
    const userEmail = useSelector(state => state.auth.email);
    const [isLoading, setIsLoading] = useState(false);
    const [center, setCenter] = useState(defaultCenter);
    const [currentLocation, setCurrentLocation] = useState({ latitude: '37.5577767', longitude: '126.9575868' })
    const [currentAddress, setCurrentAddress] = useState('서울 서대문구 북아현동');
    const [maxDistance, setMaxDistance] = useState('20');
    const [showDistances, setShowDistances] = useState(false);
    const [isEditingAddress, setisEditingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [classTitles, setClassTitles] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [timer, setTimer] = useState(null);

    const dispatch = useDispatch();

    const onChange = event => {
        if (event.target.name === 'address') {
            setAddressInput(event.target.value)
        } else if (event.target.name === 'search') {
            setSearchKeyword(event.target.value);
            clearTimeout(timer);
        }
    }

    const search = useCallback(async keyword => {
        // const response = await fetch(`http://localhost:3001/user/class-list/search/keyword/${keyword}`, {
        //     credentials: 'include'
        // });
        // const resData = await response.json();
        // console.log(resData)
        dispatch(classActions.fetchKeyword(currentLocation, keyword))
    }, [dispatch, currentLocation])

    useEffect(() => {
        if (searchKeyword !== '') {
            setTimer(setTimeout(() => {
                console.log("input", searchKeyword)
                search(searchKeyword)
            }, 1000))
        }
    }, [searchKeyword, search])

    const reverseGeocoding = useCallback(async currentLocation => {
        const response = await fetch(`http://localhost:3001/map/reverse-geolocation/${currentLocation.latitude}&${currentLocation.longitude}`, {
            credentials: 'include'
        });
        const resData = await response.json();
        console.log('resData', resData);
        //error handling
        setCurrentAddress(resData.area1.alias + " " + resData.area2.name + " " + resData.area3.name);
    }, [])

    const searchCurrentLocation = () => {
        if ("geolocation" in navigator) {
            console.log("Geolocation Available");
            navigator.geolocation.getCurrentPosition(position => {
                const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                setCurrentLocation(location);
                reverseGeocoding(location);
                setisEditingAddress(false);
            })
        } else {
            console.log("default location");
        }
    }

    //fetch classes from the database
    const loadClasses = useCallback(async () => {
        try {
            await dispatch(classActions.fetchClass(currentLocation, maxDistance));
        } catch (error) {
        }
    }, [dispatch, currentLocation, maxDistance]);

    const geocoding = async addressInput => {
        const response = await fetch(`http://localhost:3001/map/${addressInput}`, {
            credentials: 'include'
        });
        const resData = await response.json();
        setCurrentAddress(resData[0].roadAddress);
        setCurrentLocation({ longitude: Number(resData[0].x), latitude: Number(resData[0].y) })
        setisEditingAddress(false);
        console.log('resData', resData);
    }

    //when this page is rendered, load classes
    useEffect(() => {
        setIsLoading(true);
        loadClasses().then(() => {
            setIsLoading(false)
        });
    }, [dispatch, loadClasses])

    useEffect(() => {
        if (allClasses) {
            const classTitles = [];
            const classCoordinates = [];
            allClasses.forEach(cl => {
                classTitles.push(cl.title)
                if (cl.coordinates) {
                    classCoordinates.push({ ...cl.coordinates })
                }
            })
            setClassTitles(classTitles);
            setCoordinates(classCoordinates);

        }
    }, [allClasses])

    let navermap = null;
    if (coordinates) {
        navermap = <NaverMap title={classTitles} coordinates={coordinates} center={currentLocation} zoom={13} printCenter={center => { setCenter({ latitude: center._lat, longitude: center._lng }) }} />
    }
    console.log(center);
    // if (allClasses) {
    //     const classTitles = [];
    //     const classCoordinates = [];
    //     allClasses.forEach(cl => {
    //         classTitles.push(cl.title)
    //         if (cl.coordinates) {
    //             classCoordinates.push({ ...cl.coordinates })
    //         }
    //     })

    //     navermap = <NaverMap title={classTitles} coordinates={classCoordinates} center={center} zoom={13} printCenter={center => { setCenter({ latitude: center._lat, longitude: center._lng }) }} />
    // }

    return (
        <div>
            <label>검색창</label>
            <input type="text" placeholder="검색어를 입력하세요" value={searchKeyword} onChange={onChange} name="search" />
            <p>This is the Class List container</p>
            {isEditingAddress ? <input type='text' placeholder="새로운 위치를 입력하세요" value={addressInput} onChange={onChange} name="address" />
                : isLoading ? null : <p>현재위치 : {currentAddress}</p>}
            <button onClick={searchCurrentLocation}>현재 위치 검색하기</button>
            <button onClick={() => setisEditingAddress(prev => !prev)}>{isEditingAddress ? "원래대로" : "위치 재설정"}</button>
            {isEditingAddress ? <button onClick={() => geocoding(addressInput)}>위치 검색하기</button> : null}
            <p onClick={() => setShowDistances(prev => !prev)}>{maxDistance} km</p>

            {showDistances ? <>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 1km?');
                    if (ok) {
                        setMaxDistance('1')
                        setShowDistances(false);
                    }
                }}>1km</p>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 5km?');
                    if (ok) {
                        setMaxDistance('5')
                        setShowDistances(false);
                    }
                }}>5km</p>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 10km?');
                    if (ok) {
                        setMaxDistance('10')
                        setShowDistances(false);
                    }
                }}>10km</p>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 20km?');
                    if (ok) {
                        setMaxDistance('20')
                        setShowDistances(false);
                    }
                }}>20km</p>
            </> : null}
            <div className={classes.MainContainer}>
                {isLoading ? <Spinner /> : <ClassListContainer history={props.history} allClasses={allClasses} userEmail={userEmail} favPage={false} currentLocation={currentLocation} maxDistance={maxDistance} />}
            </div>
            {navermap}
        </div>
    )
}

export default ClassList;