// Map visualization module for airplanes
const MapManager = {
    map: null,
    userMarker: null,
    airplaneMarkers: [],
    isMapVisible: false,
    
    /**
     * Initialize the map
     * @param {number} latitude - User's latitude
     * @param {number} longitude - User's longitude
     */
    initMap(latitude, longitude) {
        // Clear existing map if any
        if (this.map) {
            this.map.remove();
        }
        
        // Create map centered on user's location
        this.map = L.map('airplaneMap').setView([latitude, longitude], 10);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);
        
        // Add user location marker
        this.userMarker = L.marker([latitude, longitude], {
            icon: L.divIcon({
                className: 'user-marker',
                html: '',
                iconSize: [20, 20]
            })
        }).addTo(this.map);
        
        this.userMarker.bindPopup(`
            <div style="text-align: center;">
                <strong style="color: #4a90e2;">📍 Your Location</strong><br>
                <span style="font-size: 0.85rem; color: #b8c5d6;">
                    ${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°
                </span>
            </div>
        `);
        
        console.log('Map initialized at:', latitude, longitude);
    },
    
    /**
     * Add airplanes to the map
     * @param {Array} airplanes - Array of airplane objects
     * @param {number} userLat - User's latitude
     * @param {number} userLon - User's longitude
     */
    displayAirplanesOnMap(airplanes, userLat, userLon) {
        // Clear existing airplane markers
        this.clearAirplaneMarkers();
        
        if (!this.map) {
            console.warn('Map not initialized');
            return;
        }
        
        console.log(`Displaying ${airplanes.length} airplanes on map`);
        
        // Add each airplane to the map
        airplanes.forEach((plane, index) => {
            // Get airplane's actual position
            if (!plane.latitude || !plane.longitude) {
                return; // Skip if no position data
            }
            
            const lat = plane.latitude;
            const lon = plane.longitude;
            
            // Rotate airplane icon based on heading
            const rotation = plane.heading || 0;
            
            // Create airplane marker
            const marker = L.marker([lat, lon], {
                icon: L.divIcon({
                    className: 'airplane-marker',
                    html: `<div style="transform: rotate(${rotation}deg); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">✈️</div>`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                }),
                title: plane.callsign
            }).addTo(this.map);
            
            // Create detailed popup
            const hasRoute = plane.origin && plane.destination;
            const routeInfo = hasRoute
                ? `<strong>Route:</strong> ✈️ ${plane.origin} → ${plane.destination}<br>`
                : plane.heading !== null && plane.heading !== undefined
                    ? `<strong>Flying:</strong> Heading ${this.getCompassDirection(plane.heading)}<br><strong>Registered:</strong> ${plane.country}<br>`
                    : `<strong>Registered:</strong> ${plane.country}<br>`;
            
            const velocityInfo = plane.velocity > 0 
                ? `<strong>Speed:</strong> ${plane.velocity} km/h<br>`
                : '<strong>Speed:</strong> Not available<br>';
            
            const popupContent = `
                <div style="min-width: 200px;">
                    <strong style="font-size: 1.1rem; color: #4a90e2;">✈️ ${plane.name}</strong><br>
                    <hr style="border-color: #3a4466; margin: 8px 0;">
                    ${plane.callsign !== 'Unknown' ? `<strong>Callsign:</strong> ${plane.callsign}<br>` : ''}
                    <strong>ICAO24:</strong> ${plane.icao24}<br>
                    ${routeInfo}
                    <hr style="border-color: #3a4466; margin: 8px 0;">
                    <strong>Altitude:</strong> ${plane.planeAltitude} m (${Math.round(plane.planeAltitude * 3.28084)} ft)<br>
                    ${velocityInfo}
                    <strong>Heading:</strong> ${plane.heading}° ${this.getCompassDirection(plane.heading)}<br>
                    <hr style="border-color: #3a4466; margin: 8px 0;">
                    <strong>Distance from you:</strong> ${plane.distance} km<br>
                    <strong>Elevation angle:</strong> ${plane.altitude.toFixed(1)}°
                    ${!hasRoute ? '<br><span style="color: #ffd43b; font-size: 0.85rem;">ℹ️ Route data not available for this flight</span>' : ''}
                </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Draw line from user to airplane
            const line = L.polyline([[userLat, userLon], [lat, lon]], {
                color: '#4dabf7',
                weight: 2,
                opacity: 0.4,
                dashArray: '5, 10'
            }).addTo(this.map);
            
            let trajectoryLine = null;
            let arrowMarker = null;
            
            // Only draw trajectory if we have valid heading and velocity
            if (plane.heading !== null && plane.heading !== undefined && 
                plane.velocity > 0) {
                
                // Calculate and draw trajectory line (predicted path)
                const trajectoryPoints = this.calculateTrajectory(lat, lon, plane.heading, plane.velocity);
                trajectoryLine = L.polyline(trajectoryPoints, {
                    color: '#ffd43b',
                    weight: 2,
                    opacity: 0.6,
                    dashArray: '3, 6'
                }).addTo(this.map);
                
                // Add arrow marker at the end of trajectory
                const endPoint = trajectoryPoints[trajectoryPoints.length - 1];
                arrowMarker = L.marker(endPoint, {
                    icon: L.divIcon({
                        className: 'trajectory-arrow',
                        html: `<div style="transform: rotate(${rotation}deg); font-size: 16px;">➤</div>`,
                        iconSize: [20, 20],
                        iconAnchor: [10, 10]
                    })
                }).addTo(this.map);
            }
            
            this.airplaneMarkers.push({ marker, line, trajectoryLine, arrowMarker });
        });
        
        // Fit map to show all airplanes if there are any
        if (airplanes.length > 0) {
            const bounds = L.latLngBounds([[userLat, userLon]]);
            airplanes.forEach(plane => {
                if (plane.latitude && plane.longitude) {
                    bounds.extend([plane.latitude, plane.longitude]);
                }
            });
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    },
    
    /**
     * Calculate trajectory points for an airplane
     * @param {number} lat - Current latitude
     * @param {number} lon - Current longitude
     * @param {number} heading - Heading in degrees
     * @param {number} velocity - Speed in km/h
     * @returns {Array} Array of [lat, lon] points
     */
    calculateTrajectory(lat, lon, heading, velocity) {
        const points = [[lat, lon]];
        
        // Validate inputs
        if (!velocity || velocity <= 0 || !heading && heading !== 0) {
            console.warn('Invalid velocity or heading for trajectory calculation');
            return points;
        }
        
        const timeMinutes = 10; // Predict 10 minutes ahead
        const steps = 5; // Number of points along trajectory
        
        // Convert velocity from km/h to km/min
        const speedKmPerMin = velocity / 60;
        
        for (let i = 1; i <= steps; i++) {
            const timeElapsed = (timeMinutes / steps) * i;
            const distanceKm = speedKmPerMin * timeElapsed;
            
            // Calculate new position using heading
            const newPos = this.calculateNewPosition(lat, lon, heading, distanceKm);
            points.push([newPos.lat, newPos.lon]);
        }
        
        return points;
    },
    
    /**
     * Calculate new position given starting point, heading, and distance
     * @param {number} lat - Starting latitude
     * @param {number} lon - Starting longitude
     * @param {number} heading - Heading in degrees
     * @param {number} distanceKm - Distance in kilometers
     * @returns {Object} New position {lat, lon}
     */
    calculateNewPosition(lat, lon, heading, distanceKm) {
        const R = 6371; // Earth radius in km
        const d = distanceKm / R; // Angular distance in radians
        const headingRad = heading * Math.PI / 180;
        const lat1 = lat * Math.PI / 180;
        const lon1 = lon * Math.PI / 180;
        
        const lat2 = Math.asin(
            Math.sin(lat1) * Math.cos(d) +
            Math.cos(lat1) * Math.sin(d) * Math.cos(headingRad)
        );
        
        const lon2 = lon1 + Math.atan2(
            Math.sin(headingRad) * Math.sin(d) * Math.cos(lat1),
            Math.cos(d) - Math.sin(lat1) * Math.sin(lat2)
        );
        
        return {
            lat: lat2 * 180 / Math.PI,
            lon: lon2 * 180 / Math.PI
        };
    },
    
    /**
     * Get compass direction from heading
     * @param {number} heading - Heading in degrees
     * @returns {string} Compass direction
     */
    getCompassDirection(heading) {
        const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
        const index = Math.round(heading / 45) % 8;
        return directions[index];
    },
    
    /**
     * Clear all airplane markers from map
     */
    clearAirplaneMarkers() {
        this.airplaneMarkers.forEach(item => {
            if (item.marker) {
                this.map.removeLayer(item.marker);
            }
            if (item.line) {
                this.map.removeLayer(item.line);
            }
            if (item.trajectoryLine) {
                this.map.removeLayer(item.trajectoryLine);
            }
            if (item.arrowMarker) {
                this.map.removeLayer(item.arrowMarker);
            }
        });
        this.airplaneMarkers = [];
    },
    
    /**
     * Toggle map visibility
     * @returns {boolean} New visibility state
     */
    toggleMap() {
        const mapContainer = document.getElementById('airplaneMap');
        const toggleBtn = document.getElementById('toggleMapBtn');
        
        this.isMapVisible = !this.isMapVisible;
        
        if (this.isMapVisible) {
            mapContainer.classList.remove('hidden');
            toggleBtn.textContent = '📋 Show List View';
            
            // Invalidate map size after showing (fixes rendering issues)
            setTimeout(() => {
                if (this.map) {
                    this.map.invalidateSize();
                }
            }, 100);
        } else {
            mapContainer.classList.add('hidden');
            toggleBtn.textContent = '🗺️ Show Map View';
        }
        
        return this.isMapVisible;
    },
    
    /**
     * Update map with new data
     * @param {Array} airplanes - Array of airplane objects
     * @param {number} userLat - User's latitude
     * @param {number} userLon - User's longitude
     */
    updateMap(airplanes, userLat, userLon) {
        if (!this.map) {
            this.initMap(userLat, userLon);
        }
        
        this.displayAirplanesOnMap(airplanes, userLat, userLon);
    },
    
    /**
     * Destroy the map
     */
    destroyMap() {
        if (this.map) {
            this.map.remove();
            this.map = null;
            this.userMarker = null;
            this.airplaneMarkers = [];
            this.isMapVisible = false;
        }
    }
};
