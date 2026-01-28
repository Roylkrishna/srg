import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Package, Search, ShoppingCart, LogIn, ExternalLink } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const ActivityMap = ({ activityData }) => {
    // Filter data to only include items with valid location
    const validData = activityData?.filter(item =>
        item.location &&
        typeof item.location.lat === 'number' &&
        typeof item.location.lng === 'number'
    ) || [];

    if (validData.length === 0) {
        return (
            <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 h-[400px] flex flex-col items-center justify-center text-gray-400">
                <p>No location data available to map.</p>
            </div>
        );
    }

    // Determine center: default to approximate center of India or first point
    const center = validData.length > 0
        ? [validData[0].location.lat, validData[0].location.lng]
        : [20.5937, 78.9629]; // India Center

    return (
        <MapContainer
            center={center}
            zoom={4}
            scrollWheelZoom={false}
            className="h-[400px] w-full rounded-2xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://openstreetmap.in/">OpenStreetMap India</a> contributors'
                url="https://{s}.tile.openstreetmap.in/osm-in/{z}/{x}/{y}.png"
            />
            {validData.map((log, idx) => (
                <Marker
                    key={idx}
                    position={[log.location.lat, log.location.lng]}
                >
                    <Popup>
                        <div className="p-2 min-w-[200px]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`p-1.5 rounded-full text-white text-xs ${log.eventType === 'VIEW_PRODUCT' ? 'bg-blue-500' :
                                    log.eventType === 'SEARCH' ? 'bg-orange-500' : 'bg-gray-500'
                                    }`}>
                                    {log.eventType === 'VIEW_PRODUCT' ? <Package size={14} /> :
                                        log.eventType === 'SEARCH' ? <Search size={14} /> : <Activity size={14} />}
                                </span>
                                <span className="font-bold text-gray-900 text-sm">
                                    {log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Guest Visitor'}
                                </span>
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                                {new Date(log.timestamp).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 border-t border-gray-100 pt-1 mt-1">
                                {log.eventType === 'VIEW_PRODUCT' && log.productId ? `Viewed: ${log.productId.name}` :
                                    log.eventType === 'SEARCH' ? `Searched: "${log.metadata?.query}"` : log.eventType}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default ActivityMap;
