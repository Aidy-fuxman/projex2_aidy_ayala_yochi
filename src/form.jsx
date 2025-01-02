
import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";//השלמה של הcss עבור ספריית leaflet
import './form.css';

function ChangeView({ center }) {//קבלת מערך עם שני נקודות
    const map = useMap(); // קבלת אובייקט המפה
    map.setView(center); // תצוגה של המפה לפי הנקודות
    return null;
}
function Form() {
    const [searchValue, setSearchValue] = useState("");//משתנה בסטייט עבור שדה הקלט
    const [results, setResults] = useState([]); // אחסון התוצאות שחוזרות מהקריאה לשרת 
    const [showResults, setShowResults] = useState(false); // הצגת/הסתרת תוצאות עבור הכפתורים
    const [showMap, setShowMap] = useState(null); // -מערך קואורדינטות למפה

    const Autocomplete = (e) => {
        const search = e.target.value;//קבלת ערך החיפוש
        setSearchValue(search);//עריכה של שדה הקלט
        if (search === "") {//באם השדה ריק מערך ריק של תוצאות ועדכון שאין מה להציג
            setResults([]);
            setShowResults(false);
            return;
        }
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(search )}&limit=5`)//קריאה לשרת עם המפתח ומס הצגות
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok");
                }
                return res.json();
            })
            .then((data) => {
                setResults(data); // עדכון התוצאות
                setShowResults(true);//ויש מה להציג
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    };

    const OpenStreetMap = (lat, lon) => {//פונקציה שמקבלת כל פעם את שני ההקואורדינטות
        setShowMap([lat, lon]); //עורכים את המשתנה של תצוגת המפה
    };

    return (
        <div>
            <label>Enter name</label> <input type="text" name="name" />
            <label>Enter address to search</label>
            <input
                type="text"
                name="address"
                onChange={Autocomplete}//בעת שינוי הכתובת נשלח לפונקציית שמציגה את הנתונים
                value={searchValue}
            />
            {showResults && (//דיב שבו מציגים את כל תוצאות החיפוש באם חזר משהו 
                <div id="results">
                    {results.map((result, index) => (//מעבר בלולאה ויצירה של כפתור עם הכתובת האפשרית
                        <button
                            key={index}
                            onClick={() => {//שני עדכונים בעת לחיצה על כפתור מסוים
                                setSearchValue(result.display_name); //  בשדה הקלט עדכון השם שנבחר
                                OpenStreetMap(result.lat, result.lon); //מציגים את המפה לפי שני הנקודות
                            }}>
                                
                            {result.display_name}
                        </button>
                    ))}
                </div>
            )}

            {showMap && Array.isArray(showMap) && (//דיב נוסף להצגת המפה
                <MapContainer
                    id="map"
                    center={showMap}//מערך עם הקוארדינטות
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: "400px", width: "100%" }}>
                         {/* // שליחה לפונקציית הצגה כל פעם בעת שינוי */}
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
            <input type="text" name="phone" />
            <label>Enter email</label>
            <input type="email" name="email" />
            <label>Needed wifi</label>
            <input type="checkbox" name="wifi" />
            <label>Needed kitchen</label>
            <input type="checkbox" name="kitchen" />
            <label>Needed coffee machine</label>
            <input type="checkbox" name="coffee" />
            <label>Number of rooms</label>
            <input type="number" name="rooms" />
            <label>Distance won't move</label>
            <input type="number" name="distance" />
            <input type="hidden" name="status" value={"searchStatus"} />
        </div>
    );

                        }
export default Form;




























