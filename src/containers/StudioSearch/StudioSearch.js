import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import StudioListContainer from '../../components/StudioCardsContainer/StudioCardsContainer';
import classes from './StudioSearch.module.css';
import * as studioActions from '../../store/actions/studio-search';
import Spinner from '../../components/UI/Spinner/Spinner';
import NaverMap from '../../components/Map/NaverMap';

const StudioSearch = props => {
    const defaultCenter = { latitude: "37.5624917", longitude: "126.9724786" }
    const allStudios = useSelector(state => state.studioList.allStudios);
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
    const [studioTitles, setStudioTitles] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [searchingLocation, setSearchingLocation] = useState(false);
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
        dispatch(studioActions.fetchKeyword(currentLocation, keyword))
    }, [dispatch, currentLocation])

    useEffect(() => {
        if (searchKeyword !== '') {
            setTimer(setTimeout(() => {
                console.log("input", searchKeyword)
                setIsLoading(true);
                search(searchKeyword).then(setIsLoading(false))
            }, 500))
        }
    }, [searchKeyword, search])

    const reverseGeocoding = useCallback(async currentLocation => {
        // const currentLocation = { latitude: "37.6870252", longitude: "126.6949921" }
        const response = await fetch(`http://localhost:3001/map/reverse-geolocation/${currentLocation.latitude}&${currentLocation.longitude}`, {
            credentials: 'include'
        });
        const resData = await response.json();
        console.log(resData);
        //error handling
        setCurrentAddress(resData.area1.alias + " " + resData.area2.name + " " + resData.area3.name);
    }, [])
    const searchCurrentLocation = () => {
        if ("geolocation" in navigator) {
            console.log("Geolocation Available");
            navigator.geolocation.getCurrentPosition(position => {
                const location = { latitude: position.coords.latitude, longitude: position.coords.longitude };
                console.log(position);
                setCurrentLocation(location);
                reverseGeocoding(location);
                setisEditingAddress(false);
                setSearchingLocation(false);
            })
        } else {
            console.log("default location");
        }
    }

    //fetch classes from the database
    const loadStudios = useCallback(async () => {
        try {
            await dispatch(studioActions.fetchStudios(currentLocation, maxDistance));
        } catch (error) {
        }
    }, [dispatch, currentLocation, maxDistance]);

    const geocoding = async addressInput => {
        const response = await fetch(`http://localhost:3001/map/${addressInput}`, {
            credentials: 'include'
        });
        const resData = await response.json();
        console.log('resdata', resData);
        if (resData.length === 0) {
            //어떻게 할지...
            window.alert("위치를 검색할 수 없습니다. 더 자세히 입력해주세요");
        } else {
            setCurrentAddress(resData[0].roadAddress);
            setCurrentLocation({ longitude: Number(resData[0].x), latitude: Number(resData[0].y) })
            setisEditingAddress(false);
        }

    }

    //when this page is rendered, load classes
    useEffect(() => {
        setIsLoading(true);
        loadStudios().then(() => {
            setIsLoading(false)
        });
    }, [dispatch, loadStudios])

    useEffect(() => {
        if (allStudios) {
            const studioTitles = [];
            const studioCoordinates = [];
            allStudios.forEach(studio => {
                studioTitles.push(studio.title)
                if (studio.coordinates) {
                    studioCoordinates.push({ ...studio.coordinates })
                }
            })
            setStudioTitles(studioTitles);
            setCoordinates(studioCoordinates);

        }
    }, [allStudios])

    let navermap = null;
    if (coordinates) {
        navermap = <NaverMap title={studioTitles} coordinates={coordinates} center={currentLocation} zoom={13} printCenter={center => { setCenter({ latitude: center._lat, longitude: center._lng }) }} />
    }

    let locationSearchComponent = (<>
        {isEditingAddress ? <input type='text' placeholder="새로운 위치를 입력하세요" value={addressInput} onChange={onChange} name="address" />
            : searchingLocation ? <p>searching...</p> : <p>현재위치 : {currentAddress}</p>}
        {!isEditingAddress ? <button onClick={() => {
            setSearchingLocation(true);
            searchCurrentLocation();
        }}>현재 위치 검색하기</button> : null}
        <button onClick={() => setisEditingAddress(prev => !prev)}>{isEditingAddress ? "원래대로" : "위치 재설정"}</button>
        {isEditingAddress ? <button onClick={() => geocoding(addressInput)}>위치 검색하기</button> : null}
    </>)

    return (
        <div>
            <label>검색창</label>
            <input type="text" placeholder="검색어를 입력하세요" value={searchKeyword} onChange={onChange} name="search" />
            <p>This is the Studio Search page</p>
            {locationSearchComponent}
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
                {isLoading ? <Spinner /> : <StudioListContainer history={props.history} allStudios={allStudios} userEmail={userEmail} favPage={false} currentLocation={currentLocation} maxDistance={maxDistance} />}
            </div>
            {navermap}
        </div>
    )
}

export default StudioSearch;