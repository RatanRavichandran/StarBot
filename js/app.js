// Main application controller
const App = {
    currentLocation: null,
    currentZenithCoords: null,
    
    /**
     * Initialize the application
     */
    init() {
        console.log('%c🌌 What\'s Above Me - Sky Object Detector', 'font-size: 20px; font-weight: bold; color: #4a90e2;');
        console.log('%cInitializing...', 'color: #b8c5d6;');
        
        // Set up event listeners (only for elements that still exist)
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshSkyData();
            });
        }
        
        // Map toggle
        const toggleMapBtn = document.getElementById('toggleMapBtn');
        if (toggleMapBtn) {
            toggleMapBtn.addEventListener('click', () => {
                const isVisible = MapManager.toggleMap();
                
                // If map is now visible and we have airplane data, display it
                if (isVisible && DisplayController.currentAirplanes.length > 0 && DisplayController.currentLocation) {
                    MapManager.updateMap(
                        DisplayController.currentAirplanes,
                        DisplayController.currentLocation.latitude,
                        DisplayController.currentLocation.longitude
                    );
                }
            });
        }
        
        // Collapsible airplane section toggle
        const airplaneHeader = document.getElementById('airplaneHeader');
        if (airplaneHeader) {
            airplaneHeader.addEventListener('click', () => {
                const content = document.getElementById('airplaneCollapsibleContent');
                const toggleIcon = airplaneHeader.querySelector('.collapsible-toggle');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    toggleIcon.classList.add('expanded');
                } else {
                    content.style.display = 'none';
                    toggleIcon.classList.remove('expanded');
                }
            });
        }
        
        // Collapsible satellite section toggle
        const satelliteHeader = document.getElementById('satelliteHeader');
        if (satelliteHeader) {
            satelliteHeader.addEventListener('click', () => {
                const content = document.getElementById('satelliteCollapsibleContent');
                const toggleIcon = satelliteHeader.querySelector('.collapsible-toggle');
                
                if (content.style.display === 'none') {
                    content.style.display = 'block';
                    toggleIcon.classList.add('expanded');
                } else {
                    content.style.display = 'none';
                    toggleIcon.classList.remove('expanded');
                }
            });
        }
        
        console.log('%c✅ Application ready', 'color: #51cf66; font-weight: bold;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3a4466;');
        console.log('%c💡 Auto-starting with Bangalore location', 'color: #ffd700; font-weight: bold;');
        console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #3a4466;');
        
        // Auto-start the sky scan with hard-coded location
        this.detectLocationAndScan();
    },
    
    /**
     * Detect location and scan the sky
     */
    async detectLocationAndScan() {
        try {
            DisplayController.clearError();
            DisplayController.showLoading();
            
            // Get user's location
            console.log('📍 Getting location...');
            this.currentLocation = await LocationManager.getLocation();
            console.log('✅ Location obtained:', this.currentLocation);
            
            document.getElementById('loadingMessage').textContent = 'Scanning the sky above you...';
            
            // Display location
            DisplayController.displayLocation(this.currentLocation);
            
            // Scan the sky
            await this.scanSky();
            
        } catch (error) {
            console.error('❌ Error:', error);
            DisplayController.showError(error.message);
        }
    },
    
    /**
     * Use manually entered location
     */
    async useManualLocation() {
        try {
            const lat = parseFloat(document.getElementById('manualLatitude').value);
            const lng = parseFloat(document.getElementById('manualLongitude').value);
            const alt = parseFloat(document.getElementById('manualAltitude').value) || 0;
            
            // Validate inputs
            if (isNaN(lat) || isNaN(lng)) {
                DisplayController.showError('Please enter valid latitude and longitude values.');
                return;
            }
            
            if (lat < -90 || lat > 90) {
                DisplayController.showError('Latitude must be between -90 and 90 degrees.');
                return;
            }
            
            if (lng < -180 || lng > 180) {
                DisplayController.showError('Longitude must be between -180 and 180 degrees.');
                return;
            }
            
            DisplayController.clearError();
            DisplayController.showLoading();
            
            // Set manual location
            this.currentLocation = {
                latitude: lat,
                longitude: lng,
                altitude: alt,
                accuracy: 0, // Manual entry has no accuracy measurement
                timestamp: Date.now()
            };
            
            console.log('✅ Manual location set:', this.currentLocation);
            
            // Display location
            DisplayController.displayLocation(this.currentLocation);
            
            // Hide manual form
            document.getElementById('manualLocationForm').classList.add('hidden');
            
            // Scan the sky
            await this.scanSky();
            
        } catch (error) {
            console.error('❌ Error:', error);
            DisplayController.showError('Failed to use manual location: ' + error.message);
        }
    },
    
    /**
     * Scan the sky for celestial objects
     */
    async scanSky() {
        try {
            if (!this.currentLocation) {
                throw new Error('Location not available. Please detect your location first.');
            }
            
            const { latitude, longitude, altitude } = this.currentLocation;
            const now = new Date();
            
            console.log('🔭 Calculating zenith coordinates...');
            
            // Calculate zenith coordinates
            this.currentZenithCoords = AstronomyUtils.geographicToZenithCelestial(
                latitude, 
                longitude, 
                now
            );
            
            console.log('✅ Zenith coords:', this.currentZenithCoords);
            
            // Display celestial coordinates
            DisplayController.displayCelestialCoordinates(this.currentZenithCoords);
            
            console.log('🌠 Fetching celestial objects...');
            
            // Fetch all celestial objects in parallel
            const [planets, rawAirplanes, satellites, stars, celestialBodies] = await Promise.all([
                APIManager.fetchSolarSystemObjects(latitude, longitude, altitude, now)
                    .catch(err => {
                        console.warn('Failed to fetch planets:', err);
                        return [];
                    }),
                APIManager.fetchAirplanes(latitude, longitude, altitude, now)
                    .catch(err => {
                        console.warn('Failed to fetch airplanes:', err);
                        return [];
                    }),
                APIManager.fetchSatellites(latitude, longitude, altitude, now)
                    .catch(err => {
                        console.warn('Failed to fetch satellites:', err);
                        return [];
                    }),
                Promise.resolve(APIManager.findNearbyStars(
                    this.currentZenithCoords.ra, 
                    this.currentZenithCoords.dec
                )),
                APIManager.fetchInterestingCelestialBodies(
                    latitude, 
                    longitude, 
                    this.currentZenithCoords.ra,
                    this.currentZenithCoords.dec,
                    5
                )
                    .catch(err => {
                        console.warn('Failed to fetch celestial bodies:', err);
                        return [];
                    })
            ]);
            
            // Enrich airplanes with route information
            console.log('✈️ Fetching flight routes...');
            const airplanes = await APIManager.enrichAirplanesWithRoutes(rawAirplanes)
                .catch(err => {
                    console.warn('Failed to fetch routes, using basic airplane data:', err);
                    return rawAirplanes;
                });
            
            console.log(`✅ Found ${planets.length} planets, ${airplanes.length} airplanes, ${satellites.length} satellites, ${stars.length} stars, ${celestialBodies.length} celestial bodies`);
            
            // Categorize objects by distance from zenith
            const results = this.categorizeObjects(
                planets,
                airplanes,
                satellites, 
                stars,
                this.currentZenithCoords,
                celestialBodies
            );
            
            // Display results
            await DisplayController.displayResults(results);
            
            console.log('✅ Sky scan complete');
            
        } catch (error) {
            console.error('❌ Error scanning sky:', error);
            DisplayController.showError('Failed to scan the sky: ' + error.message);
        }
    },
    
    /**
     * Categorize objects by their distance from zenith
     * @param {Array} planets - Planet objects
     * @param {Array} airplanes - Airplane objects
     * @param {Array} satellites - Satellite objects
     * @param {Array} stars - Star objects
     * @param {Object} zenithCoords - Zenith coordinates
     * @returns {Object} Categorized objects
     */
    categorizeObjects(planets, airplanes, satellites, stars, zenithCoords, celestialBodies = []) {
        const allObjects = [...planets, ...airplanes, ...satellites, ...stars];
        
        // Calculate distance from zenith for each object
        allObjects.forEach(obj => {
            if (obj.ra !== undefined && obj.dec !== undefined) {
                obj.distanceFromZenith = AstronomyUtils.angularDistance(
                    zenithCoords.ra, 
                    zenithCoords.dec,
                    obj.ra, 
                    obj.dec
                );
            } else {
                obj.distanceFromZenith = 999; // Unknown distance
            }
        });
        
        // Separate objects at zenith (within tolerance)
        const zenithObjects = allObjects.filter(
            obj => obj.distanceFromZenith <= CONFIG.ZENITH_TOLERANCE
        ).sort((a, b) => a.distanceFromZenith - b.distanceFromZenith);
        
        // Separate nearby objects (within nearby tolerance but not at zenith)
        const nearbyObjects = allObjects.filter(
            obj => obj.distanceFromZenith > CONFIG.ZENITH_TOLERANCE && 
                   obj.distanceFromZenith <= CONFIG.NEARBY_TOLERANCE
        ).sort((a, b) => a.distanceFromZenith - b.distanceFromZenith);
        
        // Add distance info to objects
        [...zenithObjects, ...nearbyObjects].forEach(obj => {
            obj.distance = obj.distanceFromZenith.toFixed(2);
        });
        
        // Filter and sort satellites: limit to 7 closest, max 3 Starlink
        const sortedSatellites = satellites
            .filter(s => s.altitude > 0)
            .sort((a, b) => a.distanceFromZenith - b.distanceFromZenith);
        
        const filteredSatellites = [];
        let starlinkCount = 0;
        
        for (const sat of sortedSatellites) {
            const isStarlink = sat.name && sat.name.toLowerCase().includes('starlink');
            
            if (isStarlink) {
                if (starlinkCount < 3) {
                    filteredSatellites.push(sat);
                    starlinkCount++;
                }
            } else {
                filteredSatellites.push(sat);
            }
            
            if (filteredSatellites.length >= 7) break;
        }
        
        console.log(`Filtered satellites: ${filteredSatellites.length} (${starlinkCount} Starlink)`);
        
        return {
            zenithObjects,
            nearbyObjects,
            airplanes: airplanes.filter(p => p.altitude > 0),
            satellites: filteredSatellites,
            planets: planets.filter(p => p.altitude > 0),
            stars: stars,
            celestialBodies: celestialBodies.slice(0, 5) // Limit to 5 interesting celestial bodies
        };
    },
    
    /**
     * Refresh sky data with current location
     */
    async refreshSkyData() {
        if (!this.currentLocation) {
            DisplayController.showError('Please detect your location first.');
            return;
        }
        
        console.log('🔄 Refreshing sky data...');
        DisplayController.showLoading();
        
        // Clear cache to force fresh data
        APIManager.clearCache();
        
        await this.scanSky();
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
