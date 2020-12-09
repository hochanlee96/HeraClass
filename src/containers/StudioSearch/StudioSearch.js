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
    const [currentLocation, setCurrentLocation] = useState({ latitude: '37.5577770', longitude: '126.9575865' })
    const [currentAddress, setCurrentAddress] = useState('서울 서대문구 북아현동');
    const [maxDistance, setMaxDistance] = useState('20');
    const [isEditingAddress, setisEditingAddress] = useState(false);
    const [addressInput, setAddressInput] = useState('');
    const [coordinates, setCoordinates] = useState(null);
    const [studioTitles, setStudioTitles] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [keywordTouched, setKeywordTouched] = useState(false);
    const [searchingLocation, setSearchingLocation] = useState(false);
    const [checked, setChecked] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [amenityArray, setAmenityArray] = useState([]);
    const [filters, setFilters] = useState({ currentLocation: { ...currentLocation }, maxDistance: maxDistance });
    const [tempFilters, setTempFilters] = useState({ currentLocation: { ...currentLocation }, maxDistance: '20' });
    const [tempSearchKeyword, setTempSearchKeyword] = useState('');
    // const [timer, setTimer] = useState(null);

    const categoryKeywords = ["요가", "크로스핏", "헬스", "P.T", "복싱", "골프"]
    const [categoryArray, setCategoryArray] = useState([]);

    const dispatch = useDispatch();

    const onChange = event => {
        if (event.target.name === 'address') {
            setAddressInput(event.target.value)
        } else if (event.target.name === 'search') {
            setSearchKeyword(event.target.value);
            // setFilters({ ...filters, keyword: event.target.value });
            setKeywordTouched(true);
            // clearTimeout(timer);
        } else if (event.target.name === 'distance') {
            setMaxDistance(event.target.value);
        } else if (event.target.name === 'amenity') {
            const target = event.target.value;
            const newArray = [...amenityArray]
            const index = amenityArray.findIndex(element => element === target);
            if (index > -1) {
                newArray.splice(index, 1);
            } else {
                newArray.push(target)
            }
            setAmenityArray(newArray);
        } else if (event.target.name === 'category') {
            const target = event.target.value;
            const newArray = [...categoryArray];
            const index = categoryArray.findIndex(el => el === target);
            if (index > -1) {
                newArray.splice(index, 1);
            } else {
                newArray.push(target)
            }
            setCategoryArray(newArray);
        }
    }

    console.log(filters);

    const initialFetch = useCallback(async () => {
        dispatch(studioActions.fetchStudios({ ...filters }))
    }, [dispatch, filters])

    useEffect(() => {
        if (!keywordTouched) {
            setIsLoading(true);
            initialFetch().then(() => setIsLoading(false))
        }
    }, [initialFetch, keywordTouched])

    const search = useCallback(async () => {
        dispatch(studioActions.fetchStudios({ ...filters }))
    }, [dispatch, filters])

    // useEffect(() => {
    //     if (distanceChanged) {
    //         search().then(() => setDistanceChanged(false))
    //     }
    // }, [distanceChanged, search])

    // useEffect(() => {
    //     // if (!keywordTouched) {
    //     setIsLoading(true);
    //     search().then(() => { setIsLoading(false) })
    //     // }
    // }, [search])

    // useEffect(() => {
    //     if (searchKeyword !== '') {
    //         setTimer(setTimeout(() => {
    //             console.log("input", searchKeyword)
    //             setIsLoading(true);
    //             search(searchKeyword).then(setIsLoading(false))
    //         }, 1000))
    //     }
    //     else if (keywordTouched) {
    //         setTimer(setTimeout(() => {
    //             setIsLoading(true);
    //             search().then(setIsLoading(false))
    //         }, 1000))
    //     }
    // }, [searchKeyword, keywordTouched, search])



    const reverseGeocoding = useCallback(async currentLocation => {
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
                setFilters(prev => { return { ...prev, currentLocation: { ...location } } })
                reverseGeocoding(location);
                setisEditingAddress(false);
                setSearchingLocation(false);
            }, err => { setSearchingLocation(false); window.alert('위치를 검색할 수 없습니다. 설정을 확인하세요') }, { enableHighAccuracy: true, timeout: 5000 })
        } else {
            console.log("default location");
        }
    }

    //fetch classes from the database

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
            const location = { longitude: Number(resData[0].x), latitude: Number(resData[0].y) }
            setCurrentAddress(resData[0].roadAddress);
            setAddressInput(resData[0].roadAddress);
            setCurrentLocation({ ...location });
            setFilters(prev => { return { ...prev, currentLocation: { ...location } } })
            setisEditingAddress(false);
            setSearchingLocation(false);
        }

    }


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

    const applyFilters = () => {
        if (categoryArray && categoryArray.length > 0) {
            setSearchKeyword('');
        } else {
            setSearchKeyword(tempSearchKeyword);
        }
        setShowFilters(false);
        setFilters(prev => { return { ...prev, keyword: '', maxDistance: maxDistance, amenities: [...amenityArray], category: [...categoryArray] } });
    }

    useEffect(() => {
        search()
    }, [search])

    const category = categoryKeywords.map(key => (
        <label key={key}><input type='checkbox' name="category" value={key} checked={categoryArray.find(el => el === key) ? true : false} onChange={onChange} />{key}</label>
    ))
    console.log('cat', categoryArray)

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
            <button onClick={() => { setTempSearchKeyword(searchKeyword); setFilters(prev => { return { ...prev, keyword: searchKeyword, maxDistance: '20', amenities: [], category: [] } }); setMaxDistance('20'); setAmenityArray([]); setCategoryArray([]) }}>검색하기</button>
            <p>This is the Studio Search page</p>
            {locationSearchComponent}
            <p>Filters</p>

            <p>종목: {categoryArray.length > 0 ? categoryArray.join(', ') : "설정없음"}</p>
            <p>거리: {maxDistance} km</p>
            <p>편의시설: {amenityArray.length > 0 ? amenityArray.join(', ') : "설정없음"}</p>
            <button onClick={() => {
                setShowFilters(prev => !prev);
                if (!showFilters) {
                    setTempFilters({ ...filters })
                } else {
                    setMaxDistance(tempFilters.maxDistance);
                    if (tempFilters.amenities && tempFilters.amenities.length > 0) {
                        setAmenityArray([...tempFilters.amenities])
                    } else {
                        setAmenityArray([]);
                    }

                }
            }}>{showFilters ? "Hide" : "Show"} Filters</button>
            {showFilters ? <>
                {category}
                <label><input type='radio' name="distance" value='1' onChange={onChange} checked={maxDistance === '1'} />1km</label>
                <label><input type='radio' name="distance" value='5' onChange={onChange} checked={maxDistance === '5'} />5km</label>
                <label><input type='radio' name="distance" value='10' onChange={onChange} checked={maxDistance === '10'} />10km</label>
                <label><input type='radio' name="distance" value='20' onChange={onChange} checked={maxDistance === '20'} />20km</label>
                <label><input type='checkbox' name="amenity" value="showers" checked={amenityArray.find(el => el === 'showers') ? true : false} onChange={onChange} /> 샤워실</label>
                <label><input type='checkbox' name="amenity" value="lockers" checked={amenityArray.find(el => el === "lockers") ? true : false} onChange={onChange} /> 라커</label>
                <label><input type='checkbox' name="amenity" value="parking" checked={amenityArray.find(el => el === "parking") ? true : false} onChange={onChange} /> 주차공간</label>
                <button onClick={applyFilters}>Search</button>
            </> : null}
            {/* {showDistances ? <>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 1km?');
                    if (ok) {
                        setMaxDistance('1')
                        setDistanceChanged(true);
                        setShowDistances(false);
                    }
                }}>1km</p>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 5km?');
                    if (ok) {
                        setMaxDistance('5');
                        setDistanceChanged(true);
                        setShowDistances(false);
                    }
                }}>5km</p>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 10km?');
                    if (ok) {
                        setMaxDistance('10')
                        setDistanceChanged(true);
                        setShowDistances(false);
                    }
                }}>10km</p>
                <p onClick={() => {
                    const ok = window.confirm('set max distance to 20km?');
                    if (ok) {
                        setMaxDistance('20')
                        setDistanceChanged(true);
                        setShowDistances(false);
                    }
                }}>20km</p>
            </> : null} */}
            <div className={classes.MainContainer}>
                {isLoading ? <Spinner /> : <StudioListContainer history={props.history} allStudios={allStudios} userEmail={userEmail} favPage={false} currentLocation={currentLocation} maxDistance={maxDistance} />}
            </div>
            {navermap}
        </div>
    )
}

export default StudioSearch;