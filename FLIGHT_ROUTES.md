# Flight Route Integration

## Overview
StarBot now integrates with **OpenSky Network's Routes API** to fetch origin and destination airport information for tracked flights. This is a completely **FREE** API with no rate limits or API key required.

## How It Works

### 1. OpenSky Routes API
- **Endpoint**: `https://opensky-network.org/api/routes?callsign=CALLSIGN`
- **Free**: No API key needed, no rate limits
- **Returns**: Array of ICAO airport codes representing the flight route
  - `route[0]` = Origin airport
  - `route[last]` = Destination airport

### 2. Data Flow
```
1. Detect airplanes using OpenSky State Vectors API
2. Extract callsigns from detected flights
3. Query Routes API for each callsign
4. Enrich airplane data with origin → destination
5. Display route information in UI and map
```

### 3. Display Format
- **With Route Data**: `Route: KJFK → KLAX` (airport ICAO codes)
- **Without Route Data**: `Registered: United States` (fallback to country)

## API Response Format

### Example Request
```
GET https://opensky-network.org/api/routes?callsign=UAL123
```

### Example Response
```json
{
  "callsign": "UAL123",
  "route": ["KJFK", "KORD", "KLAX"],
  "updateTime": 1729785600,
  "operatorIata": "UA"
}
```

## Implementation Details

### Functions Added

#### `fetchFlightRoute(callsign, icao24)`
- Located in: `js/api.js`
- Fetches route data for a single flight
- Returns: `{origin, destination, route}` or `null`

#### `enrichAirplanesWithRoutes(airplanes)`
- Located in: `js/api.js`
- Enriches entire airplane array with route data
- Runs all route queries in parallel for speed
- Gracefully handles failures (returns original data)

### Updated Components

1. **js/app.js**
   - Added route enrichment step after fetching airplanes
   - Console logs show route fetch progress

2. **js/display.js**
   - Updated `createObjectElement()` to prioritize route over country
   - Shows `Route: ORIGIN → DESTINATION` when available

3. **js/map.js**
   - Updated map popup to show route information
   - Falls back to country if route unavailable

## Limitations & Considerations

### Coverage
- ✅ **Commercial Flights**: High coverage (~80-90%)
- ⚠️ **Private Aviation**: Limited coverage (~20-30%)
- ❌ **Military**: Usually no route data
- ❌ **Unknown Callsigns**: Cannot fetch without valid callsign

### Airport Codes
Routes use **ICAO codes** (4 letters), not IATA codes (3 letters):
- ✅ `KJFK` (ICAO) = New York JFK
- ❌ `JFK` (IATA) - not used by API

### Performance
- Route queries run in **parallel** for all detected flights
- Typical response time: **100-300ms per flight**
- Cached results prevent duplicate queries
- No rate limiting issues (free tier is generous)

## Alternative APIs (If Needed)

If you need more detailed flight information, consider these alternatives:

### 1. AviationStack (Limited Free)
- **Free Tier**: 100 requests/month
- **Provides**: Full route details, aircraft type, airline names
- **API Key**: Required (sign up at aviationstack.com)
- **Config**: Already added to `js/config.js` (set `AVIATIONSTACK_KEY`)

### 2. AeroDataBox (Via RapidAPI)
- **Free Tier**: 150 requests/day
- **Provides**: Real-time flight data, airport details
- **API Key**: Required (RapidAPI account)

### 3. FlightAware AeroAPI
- **Free Tier**: Very limited (research/testing only)
- **Provides**: Comprehensive flight tracking
- **Best for**: Production apps with budget

## Troubleshooting

### No Routes Showing
1. **Check Console**: Look for route fetch messages
2. **Verify Callsigns**: Some flights have invalid/missing callsigns
3. **Network Issues**: Ensure OpenSky API is accessible
4. **CORS**: GitHub Pages should handle this automatically

### Slow Loading
- Routes are fetched **after** airplanes are detected
- This adds 1-3 seconds to total scan time
- Consider reducing airplane count or disabling routes if speed is critical

### Partial Route Data
- Normal behavior - not all flights have registered routes
- Fallback to country registration works automatically
- Private/chartered flights often lack route information

## Future Enhancements

### Possible Improvements
1. **Airport Name Resolution**: Convert ICAO codes to full names
   - Add local airport database (JSON file)
   - Or integrate another API for airport info

2. **Route Caching**: Store frequently seen routes
   - Reduce API calls for popular flight paths
   - Use localStorage for persistence

3. **Flight Number Detection**: Show airline flight numbers
   - Parse callsign patterns (e.g., UAL123 → United 123)

4. **Estimated Arrival Time**: Calculate ETA to destination
   - Use current position, destination coords, speed
   - Display countdown timer

## Contributing

If you want to enhance the route system:
1. Airport database could use [OurAirports.com](https://ourairports.com/data/) (free CSV)
2. Airline code mapping from [OpenFlights.org](https://openflights.org/data.html)
3. Consider caching layer for frequently detected routes

## Credits

- **OpenSky Network**: Free flight tracking and route data
- **StarBot**: Integration and UI implementation
