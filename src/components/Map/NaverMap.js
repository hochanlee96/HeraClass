import React from "react";
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from "react-naver-maps";

export const NaverAPIMap = (props) => {
    const NAVER_API_KEY = 'httryobi1m';


    const markers = props.coordinates.map(co => (
        <Marker
            key={co.latitude}
            position={{ lat: co.latitude, lng: co.longitude }}
            animation={0}
            onClick={() => { alert(props.title[0]); }} />
    ))

    return (
        <RenderAfterNavermapsLoaded
            ncpClientId={NAVER_API_KEY} // 자신의 네이버 계정에서 발급받은 Client ID
            error={<p>Maps Load Error</p>}
            loading={<p>Maps Loading...</p>}
        >
            <NaverMap
                mapDivId={"maps-getting-started-uncontrolled"} // default: react-naver-map
                style={{
                    width: 400, // 네이버지도 가로 길이
                    height: 400 // 네이버지도 세로 길이
                }}
                defaultCenter={{ lat: props.center.latitude, lng: props.center.longitude }} // 지도 초기 위치
                defaultZoom={props.zoom}
                center={{ lat: props.center.latitude, lng: props.center.longitude }}
                onCenterChanged={center => { props.printCenter(center) }}
            >
                {/* <Marker
                    key={1}
                    position={{ lat: props.lat, lng: props.lng }}
                    animation={2}
                    onClick={() => { alert(props.title); }}
                /> */}
                {markers}
            </NaverMap>
        </RenderAfterNavermapsLoaded>
    );
};

export default NaverAPIMap;