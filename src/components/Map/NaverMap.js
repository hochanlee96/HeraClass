import React from "react";
import { RenderAfterNavermapsLoaded, NaverMap, Marker } from "react-naver-maps";

export const NaverAPIMap = (props) => {
    const NAVER_API_KEY = 'httryobi1m';

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
                defaultCenter={{ lat: props.lat, lng: props.lng }} // 지도 초기 위치
                defaultZoom={18}
            >
                <Marker
                    key={1}
                    position={{ lat: props.lat, lng: props.lng }}
                    animation={2}
                    onClick={() => { alert(props.title); }}
                />
            </NaverMap>
        </RenderAfterNavermapsLoaded>
    );
};

export default NaverAPIMap;