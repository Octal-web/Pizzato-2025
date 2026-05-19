import React, { useEffect, useRef } from "react";

export const ContactMap = ({ apiKey }) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const geocoderRef = useRef(null);
    
    useEffect(() => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&callback=initMap&v=weekly`;
        script.async = true;
        script.defer = true;

        window.initMap = () => {
            if (mapRef.current) {
                const map = new window.google.maps.Map(mapRef.current, {
                    center: { lat: -29.2466, lng: -51.5315 },
                    zoom: 17,
                    streetViewControl: true,
                    mapTypeControl: false,
                    styles: [
                        {
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#f5f5f5",
                                },
                            ],
                        },
                        {
                            elementType: "labels.icon",
                            stylers: [
                                {
                                    visibility: "off",
                                },
                            ],
                        },
                        {
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#616161",
                                },
                            ],
                        },
                        {
                            elementType: "labels.text.stroke",
                            stylers: [
                                {
                                    color: "#f5f5f5",
                                },
                            ],
                        },
                        {
                            featureType: "administrative.land_parcel",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#bdbdbd",
                                },
                            ],
                        },
                        {
                            featureType: "poi",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#eeeeee",
                                },
                            ],
                        },
                        {
                            featureType: "poi",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#757575",
                                },
                            ],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#e5e5e5",
                                },
                            ],
                        },
                        {
                            featureType: "poi.park",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#9e9e9e",
                                },
                            ],
                        },
                        {
                            featureType: "road",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#ffffff",
                                },
                            ],
                        },
                        {
                            featureType: "road.arterial",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#757575",
                                },
                            ],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#dadada",
                                },
                            ],
                        },
                        {
                            featureType: "road.highway",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#616161",
                                },
                            ],
                        },
                        {
                            featureType: "road.local",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#9e9e9e",
                                },
                            ],
                        },
                        {
                            featureType: "transit.line",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#e5e5e5",
                                },
                            ],
                        },
                        {
                            featureType: "transit.station",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#eeeeee",
                                },
                            ],
                        },
                        {
                            featureType: "water",
                            elementType: "geometry",
                            stylers: [
                                {
                                    color: "#c9c9c9",
                                },
                            ],
                        },
                        {
                            featureType: "water",
                            elementType: "labels.text.fill",
                            stylers: [
                                {
                                    color: "#9e9e9e",
                                },
                            ],
                        },
                    ],
                });

                geocoderRef.current = new window.google.maps.Geocoder();

                const placeMarker = (location, label) => {
                    if (markerRef.current) {
                        markerRef.current.setMap(null); // Remove o marcador anterior
                    }

                    markerRef.current = new window.google.maps.Marker({
                        position: location,
                        map: map,
                        draggable: false,
                        animation: window.google.maps.Animation.DROP,
                        visible: true,
                        icon: {
                            url: "/site/img/location-pin.png",
                            labelOrigin: new window.google.maps.Point(25, 90),
                        },
                        label: {
                            text: label,
                            color: "#161616",
                            fontSize: "24px",
                            fontWeight: "400",
                            fontFamily: 'Proxima Nova", sans-serif',
                        },
                    });

                    map.panTo(location);
                };

                placeMarker(
                    { lat: -29.1753, lng: -51.6021 },
                    "Pizzato",
                );
            }
        };
        document.head.appendChild(script);

        return () => {
            if (script) {
                document.head.removeChild(script);
            }
        };
    }, []);

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
};
