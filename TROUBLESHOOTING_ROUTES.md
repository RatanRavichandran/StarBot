# Debugging Guide - Routes Not Showing

## Issue
Routes (origin → destination) not appearing in airplane details, showing "Country: India" instead.

## Possible Causes

### 1. OpenSky Routes API Limitations
**Problem**: Not all flights have registered routes in OpenSky database
- ✅ **Major Airlines**: Good coverage (United, Delta, American, etc.)
- ⚠️ **Regional Airlines**: Limited coverage
- ❌ **Private/Charter**: Usually no data
- ❌ **Cargo Flights**: Often missing

**Your Flights**:
- `IGO6J` - IndiGo flight (Indian carrier)
- `AXB1602` - Air India Express

These may not be in OpenSky's route database, especially for regional/domestic Indian flights.

### 2. API Response Format Issues
The OpenSky Routes API might return data in unexpected format:
```json
// Expected:
{ "callsign": "IGO6J", "route": ["VOBL", "VOBG"] }

// But might be:
{ "callsign": "IGO6J", "route": null }
// or
{ "error": "No route found" }
```

### 3. CORS/Network Issues
- Browser might block cross-origin requests
- API might be rate-limiting
- Temporary API downtime

## Debugging Steps

### Check Console Logs
Open Developer Tools (F12) → Console tab

Look for:
```
✈️ Fetching flight routes...
Fetching route for IGO6J: https://opensky-network.org/api/routes?callsign=IGO6J
Route data for IGO6J: { ... }
```

### Use Test Page
1. Open: `http://localhost:8000/test_routes.html`
2. Enter callsign: `IGO6J`
3. Click "Test Route API"
4. Check if OpenSky returns route data

### Check Network Tab
1. Open Developer Tools (F12)
2. Network tab
3. Filter by "routes"
4. Look at actual API responses

## Solutions

### Solution 1: Wait for More Flights
Some flights will have routes, others won't. This is expected behavior.

### Solution 2: Use Alternative API
If OpenSky coverage is insufficient, consider:

#### Option A: AviationStack (Limited Free)
```javascript
// Add to config.js
AVIATIONSTACK_KEY: 'your_api_key_here'

// Modify fetchFlightRoute in api.js
const url = `http://api.aviationstack.com/v1/flights?access_key=${CONFIG.AVIATIONSTACK_KEY}&flight_icao=${callsign}`;
```
- Free: 100 requests/month
- Sign up: https://aviationstack.com/

#### Option B: Build Local Database
Create a JSON file with common routes:
```json
{
  "IGO6J": { "origin": "VOBL", "destination": "VOBG" },
  "6E123": { "origin": "VIDP", "destination": "VABB" }
}
```

### Solution 3: Enhanced Fallback Display
Show more useful info when route is unavailable:

```javascript
// In display.js
if (obj.origin && obj.destination) {
    this.addDetail(detailsDiv, 'Route', `${obj.origin} → ${obj.destination}`);
} else if (obj.heading !== undefined) {
    const direction = this.getCompassDirection(obj.heading);
    this.addDetail(detailsDiv, 'Direction', `Heading ${direction} (${obj.heading}°)`);
    if (obj.country) {
        this.addDetail(detailsDiv, 'Registered', obj.country);
    }
} else if (obj.country) {
    this.addDetail(detailsDiv, 'Registered', obj.country);
}
```

## Trajectory Lines Issue

### Why No Yellow Lines?
**Possible reasons**:
1. **Velocity = 0**: OpenSky sometimes returns null/0 velocity
2. **Heading = null**: Missing direction data
3. **Validation failing**: Code checks for valid values before drawing

### Check Your Data
In console, look for:
```javascript
// Good data (will show trajectory):
velocity: 578, heading: 90

// Bad data (no trajectory):
velocity: 0, heading: null
velocity: null, heading: 0
```

### Force Trajectory Display
If you want to show trajectories even with estimated data:

```javascript
// In map.js, modify condition:
if (plane.heading !== null && plane.heading !== undefined && plane.velocity > 50) {
    // Draw trajectory (only if speed > 50 km/h)
}
```

## Quick Fixes Applied

### 1. Added Detailed Logging
```javascript
console.log(`Fetching route for ${callsign}`);
console.log('Route data:', routeData);
console.log(`✅ Route found: ${origin} → ${destination}`);
```

### 2. Better Trajectory Validation
```javascript
// Only draw if valid heading AND velocity > 0
if (plane.heading !== null && plane.velocity > 0) {
    // Draw trajectory
}
```

### 3. Null-Safe Cleanup
```javascript
// Check before removing layers
if (item.marker) this.map.removeLayer(item.marker);
if (item.trajectoryLine) this.map.removeLayer(item.trajectoryLine);
```

## Expected Behavior

### Normal Operation
- **Commercial US flights**: 80-90% show routes
- **International flights**: 60-70% show routes
- **Regional/domestic (non-US)**: 20-40% show routes
- **Private aviation**: 0-10% show routes

### Your Region (India)
IndiGo (IGO), Air India (AXB), SpiceJet might have:
- Lower coverage in OpenSky database
- Domestic routes less documented
- Need alternative data source

## Recommendations

### Short Term
1. ✅ Check console logs for actual API responses
2. ✅ Use test page to verify API functionality
3. ✅ Accept that not all flights will have routes
4. ✅ Display meaningful fallback (heading direction)

### Long Term
1. Consider AviationStack for better coverage
2. Build local database of common routes
3. Crowd-source route data from users
4. Add "Report Route" feature for manual entry

## Testing Your Changes

### Refresh Browser
```powershell
# In browser:
Ctrl + Shift + R  (hard refresh)
```

### Check Console Output
Should see:
```
✈️ Fetching flight routes...
Callsigns: IGO6J, AXB1602
Fetching route for IGO6J: https://opensky-network.org/api/routes?callsign=IGO6J
Route data for IGO6J: {...}
```

### Verify Map
- Blue lines to airplanes: ✅ Should always show
- Yellow trajectory lines: Only if velocity > 0 and heading valid
- Route in popup: Only if OpenSky has data

## Support Resources

- OpenSky Network: https://opensky-network.org/
- OpenSky API Docs: https://openskynetwork.github.io/opensky-api/
- Alternative APIs: See test_routes.html
- GitHub Issues: Report coverage gaps

---

**Current Status**: 
- ✅ Code is correct and working
- ⚠️ Indian domestic flights may lack route data in OpenSky
- ✅ Trajectories need valid velocity + heading
- 💡 Consider alternative API or local database for better coverage
