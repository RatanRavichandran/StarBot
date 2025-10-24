# 🌌 What's Above Me?

An interactive web application that detects celestial objects directly overhead your location in real-time. Discover satellites, planets, stars, and other astronomical objects at your zenith point using your browser.

![What's Above Me Banner](https://img.shields.io/badge/Astronomy-Web%20App-blue) ![GitHub Pages](https://img.shields.io/badge/Deployment-GitHub%20Pages-success) ![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 📍 **Precise Location Detection** - Uses browser Geolocation API with high accuracy mode
- 🔭 **Real-time Sky Scanning** - Detects celestial objects directly above you
- ✈️ **Airplane Tracking** - Live tracking of commercial flights overhead (OpenSky Network)
- �️ **Interactive Map** - Visual map showing airplane positions relative to you with flight paths
- �🛰️ **Satellite Tracking** - Live tracking of ISS, Starlink, GPS, and other satellites
- 🪐 **Solar System Objects** - Real-time positions of planets, Moon, and Sun
- ⭐ **Star Catalog** - Identifies bright stars from the Yale Bright Star Catalog (100+ stars)
- 🎯 **Zenith Focus** - Specifically finds objects at or near your zenith (directly overhead)
- 🌐 **No Backend Required** - Runs entirely in your browser
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices

## 🚀 Live Demo

**[Launch What's Above Me](https://yourusername.github.io/StarBot/)**

*(Replace with your actual GitHub Pages URL after deployment)*

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Astronomy Calculations**: Custom JavaScript utilities for celestial coordinate conversions
- **APIs**:
  - NASA JPL Horizons API (solar system objects)
  - OpenSky Network API (real-time airplane tracking)
  - CelesTrak API (satellite TLE data)
  - Yale Bright Star Catalog (embedded)
- **Libraries**:
  - [satellite.js](https://github.com/shashwatak/satellite-js) - SGP4 satellite propagation
  - [Leaflet.js](https://leafletjs.com/) - Interactive maps

## 📋 How It Works

1. **Location Detection**: Request user's precise geographic location (latitude, longitude, altitude)
2. **Time Synchronization**: Calculate current UTC time, Julian Date, and Local Sidereal Time
3. **Zenith Calculation**: Convert geographic position to celestial coordinates (RA/Dec at zenith)
4. **Object Detection**:
   - Query NASA Horizons for planetary positions
   - Query OpenSky Network for real-time airplane positions and data
   - Fetch satellite TLE data from CelesTrak and calculate positions using satellite.js
   - Search embedded star catalog for nearby bright stars
5. **Display Results**: Show objects at zenith and nearby objects with detailed information

## 🎯 Usage

### Basic Usage

1. Open the application in a modern web browser
2. Click "📍 Detect My Location" button
3. Allow location access when prompted
4. Wait for the sky scan to complete
5. View celestial objects overhead

### Interpreting Results

- **Directly Above (Zenith)**: Objects within 5° of your zenith point
- **Nearby Objects**: Objects within 10° of zenith
- **Airplanes**: Live flights overhead with map visualization
  - Click "🗺️ Show Map View" to see airplanes on an interactive map
  - Blue lines connect your position to each airplane
  - Click airplane markers for detailed flight information
- **Satellites**: Live satellite passes overhead (when visible)
- **Planets**: Solar system objects above your horizon
- **Stars**: Bright stars from the catalog

### Tips for Best Results

- Use the app outdoors or near a window for better GPS accuracy
- Enable high-accuracy location services on your device
- Refresh data periodically as objects move across the sky
- Check at different times of day/night for different objects

## 📦 Installation & Deployment

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/StarBot.git
cd StarBot
```

2. Open `index.html` in a web browser, or use a local server:
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server -p 8000
```

3. Navigate to `http://localhost:8000` (⚠️ Important: use `localhost`, not `[::]` or other addresses)

**Note:** If geolocation doesn't work, the app provides a manual location entry option.

### GitHub Pages Deployment

1. Push your code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Enable GitHub Pages:
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Choose **main** branch and **/ (root)** folder
   - Click **Save**

3. Your site will be published at: `https://yourusername.github.io/StarBot/`

**Important**: GitHub Pages requires HTTPS, which is automatically provided. This is required for the Geolocation API to work.

## ⚙️ Configuration

### API Keys (Optional)

The app works without any API keys using free services. However, you can optionally add an N2YO API key for enhanced satellite tracking:

1. Sign up at [N2YO.com](https://www.n2yo.com/api/)
2. Get your free API key (1000 requests/hour)
3. Edit `js/config.js`:
```javascript
N2YO_API_KEY: 'YOUR_API_KEY_HERE'
```

### Customization

Edit `js/config.js` to customize:

- **Search radius**: `ZENITH_TOLERANCE` and `NEARBY_TOLERANCE`
- **Satellite groups**: Add/remove from `SATELLITE_GROUPS`
- **Solar system bodies**: Modify `SOLAR_SYSTEM_BODIES`
- **Star catalog**: Add more stars to `BRIGHT_STARS`
- **Display limits**: Adjust `MAX_NEARBY_OBJECTS` and `MAX_SATELLITES_DISPLAY`

## 🌐 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Opera 76+
- ⚠️ Requires HTTPS (except localhost)
- ⚠️ Requires location permission

**Having issues?** See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common solutions.

## 🔒 Privacy & Security

- ✅ All processing happens in your browser
- ✅ Location data is never sent to any server
- ✅ No cookies or tracking
- ✅ No user data collected
- ✅ Open source and transparent

## 📚 Data Sources

- **Planets/Sun/Moon**: [NASA JPL Horizons System](https://ssd.jpl.nasa.gov/horizons/)
- **Airplanes**: [OpenSky Network](https://opensky-network.org/) - Free real-time ADS-B data
- **Satellites**: [CelesTrak](https://celestrak.org/)
- **Stars**: [Yale Bright Star Catalog](http://tdc-www.harvard.edu/catalogs/bsc5.html)
- **Satellite Calculations**: [satellite.js](https://github.com/shashwatak/satellite-js)

## 🤝 Contributing

Contributions are welcome! Here are some ways to contribute:

- 🐛 Report bugs or issues
- 💡 Suggest new features
- 📝 Improve documentation
- 🌟 Add more stars to the catalog
- 🛰️ Enhance satellite tracking
- 🎨 Improve UI/UX design

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NASA JPL for the Horizons API
- CelesTrak for satellite data
- The satellite.js contributors
- Yale University for the Bright Star Catalog

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/StarBot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/StarBot/discussions)

## 🗺️ Roadmap

- [ ] Add constellation overlay visualization
- [ ] Include meteor shower predictions
- [ ] Add ISS visibility alerts
- [ ] Support for deep sky objects (galaxies, nebulae)
- [ ] Time travel feature (see sky at different times)
- [ ] 3D sky visualization
- [ ] Social sharing of discoveries
- [ ] Mobile app version

---

**Made with ❤️ for stargazers and astronomy enthusiasts**

*Clear skies!* 🌟
