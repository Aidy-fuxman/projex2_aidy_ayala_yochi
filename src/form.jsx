import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import './form.css';
import { useForm } from "react-hook-form";

function ChangeView({ center }) {
    const map = useMap();
    map.setView(center);
    return null;
}

function Form() {
    const [searchValue, setSearchValue] = useState("");
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [showMap, setShowMap] = useState(null);
    const { register, handleSubmit, reset } = useForm();

    const Autocomplete = (e) => {
        const search = e.target.value;
        setSearchValue(search);
        if (search === "") {
            setResults([]);
            setShowResults(false);
            return;
        }
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search)}&limit=5`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setResults(data);
                setShowResults(true);
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    };

    const OpenStreetMap = (lat, lon) => {
        setShowMap([lat, lon]);
    };

    const save = (data) => {
        console.log("Form Data:", data);
        alert("Data saved successfully:\n" + JSON.stringify(data, null, 2));
        reset(); // איפוס הטופס לאחר שמירת הנתונים
       
    };

    return (
        <form onSubmit={handleSubmit(save)}>
            <label>Enter name</label>
            <input type="text" name="name" {...register("name")} />

            <label>Enter address to search</label>
            <input
                {...register("address")}
                type="text"
                name="address"
                onChange={Autocomplete}
                value={searchValue}
            />

            {showResults && (
                <div id="results">
                    {results.map((result, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                setSearchValue(result.display_name);
                                OpenStreetMap(result.lat, result.lon);
                            }}
                        >
                            {result.display_name}
                        </button>
                    ))}
                </div>
            )}

            {showMap && Array.isArray(showMap) && (
                <MapContainer
                    id="map"
                    center={showMap}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "400px", width: "100%" }}
                >
                    <ChangeView center={showMap} />
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={showMap}>
                        <Popup>
                            This is a place <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            )}

            <label>Enter phone</label>
            <input type="text" name="phone" {...register("phone")} />
            <label>Enter email</label>
            <input type="email" name="email" {...register("email")} />
            <label>Needed wifi</label>
            <input type="checkbox" name="wifi" {...register("wifi")} />
            <label>Needed kitchen</label>
            <input type="checkbox" name="kitchen" {...register("kitchen")} />
            <label>Needed coffee machine</label>
            <input type="checkbox" name="coffee" {...register("coffee")} />
            <label>Number of rooms</label>
            <input type="number" name="rooms" {...register("rooms")} />
            <label>Distance won't move</label>
            <input type="number" name="distance" {...register("distance")} />
            <input type="hidden" name="status" value={"searchStatus"} />
            <br />
            <input type="submit" />
        </form>
    );
}

export default Form;
