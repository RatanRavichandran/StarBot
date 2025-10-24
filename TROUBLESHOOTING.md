# Troubleshooting Guide

## 🚨 Most Common Issue: Location Permission Denied

### The Problem
You click "Detect My Location" and see:
> "🚫 Location access denied"

### The Solution (Step-by-Step)

#### **For Chrome/Edge Users:**

1. **Look at the address bar** - You'll see something like:
   ```
   🔒 localhost:8000
   ```

2. **Click the lock icon (🔒)** in the address bar

3. You'll see a dropdown menu with permissions. Find **Location**

4. **Change it from "Block" to "Allow"** (or "Ask")

5. **Refresh the page** (press F5 or click the refresh button)

6. **Click "Detect My Location"** again - it should work now!

#### **For Firefox Users:**

1. **Look at the address bar** for a 🔒 or ⓘ icon

2. **Click it** → Click the arrow → "More Information"

3. Go to the **"Permissions"** tab

4. Find **"Access Your Location"**

5. **Uncheck "Use Default"** and select **"Allow"**

6. **Close** the window and **refresh** the page (F5)

7. **Try again!**

#### **For Safari Users:**

1. **Safari menu** → Preferences → Websites → Location

2. Find **localhost** in the list

3. Change it to **"Allow"**

4. **Close** preferences and **refresh** the page

5. **Try again!**

### Still Not Working?

**Use Manual Location Entry Instead:**
1. After the error appears, you'll see a button: **"✍️ Enter Coordinates"**
2. Click it
3. Enter your coordinates (get them from https://www.latlong.net/)
4. Click **"🎯 Use This Location"**

---

#### Solution 1: Use the correct localhost URL
Instead of accessing via `http://[::]:8000`, use:
```
http://localhost:8000
```
or
```
http://127.0.0.1:8000
```

The IPv6 address `[::]` can cause issues with geolocation in some browsers.

#### Solution 2: Check Browser Permissions

**Chrome/Edge:**
1. Click the lock/info icon in the address bar
2. Find "Location" permission
3. Change it to "Allow"
4. Refresh the page

**Firefox:**
1. Click the lock icon in the address bar
2. Click the arrow next to "Connection secure"
3. Click "More information"
4. Go to "Permissions" tab
5. Allow "Access Your Location"
6. Refresh the page

**Safari:**
1. Safari → Preferences → Websites → Location
2. Find localhost and set to "Allow"
3. Refresh the page

#### Solution 3: Use Manual Location Entry

If geolocation still doesn't work:
1. Click "Detect My Location"
2. When it fails, a button "Enter Coordinates" will appear
3. Click it and enter your coordinates manually
4. You can find your coordinates at: https://www.latlong.net/

Example coordinates:
- New York: 40.7128, -74.0060
- London: 51.5074, -0.1278
- Tokyo: 35.6762, 139.6503
- Sydney: -33.8688, 151.2093
- Paris: 48.8566, 2.3522

#### Solution 4: Try a Different Browser

Some browsers handle geolocation better:
- ✅ **Best**: Chrome, Firefox
- ⚠️ **OK**: Edge, Safari
- ❌ **Avoid**: Internet Explorer

#### Solution 5: Enable Location Services (System-wide)

**Windows:**
1. Settings → Privacy & Security → Location
2. Turn ON "Location services"
3. Allow apps to access location

**macOS:**
1. System Preferences → Security & Privacy → Privacy
2. Click "Location Services"
3. Enable location for your browser

**Linux:**
1. Settings → Privacy → Location Services
2. Enable location services

## API Issues

### Problem: "Failed to fetch planets/satellites"

**Causes:**
- Network connection issues
- API rate limits
- CORS issues (less common with these APIs)

**Solutions:**
1. Check your internet connection
2. Wait a few minutes and try "Refresh Sky Data"
3. Check browser console for specific errors (F12)

### Problem: No satellites showing

**Causes:**
- No satellites currently overhead
- CelesTrak API temporarily down

**Solutions:**
1. Wait a few minutes - satellites move fast
2. Click "Refresh Sky Data"
3. Try at different times of day (ISS passes change)

### Problem: Planets showing but not at zenith

This is normal! Planets are rarely directly overhead. The app shows:
- Objects at zenith (within 5°)
- Nearby objects (within 10°)
- All visible planets above horizon

## Performance Issues

### Problem: Page loads slowly

**Solutions:**
1. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
2. Disable browser extensions temporarily
3. Close other tabs

### Problem: "Scanning the sky" takes too long

This is normal for the first scan (10-30 seconds) because it:
- Queries NASA Horizons for 9 solar system bodies
- Fetches TLE data for 6 satellite groups
- Processes 100+ star positions

**Solutions:**
- Wait patiently for first scan
- Subsequent refreshes use cache (much faster)

## Display Issues

### Problem: No objects showing

**Causes:**
- Nothing is overhead at your location/time
- You might be looking at deep space between stars

**What you'll see:**
> "No major celestial objects are directly overhead at this moment."

This is normal! The zenith point often has no bright objects.

**Solutions:**
1. Try at a different time
2. Look for objects in the "Nearby Objects" section
3. Check "Satellites" section for passes

### Problem: Coordinates look wrong

**Check:**
- Latitude should be -90 to 90
- Longitude should be -180 to 180
- If using manual entry, double-check your coordinates

## Testing Without Location

You can test the app with these interesting locations:

**Great for satellites:**
- Kennedy Space Center: 28.5721, -80.6480
- Baikonur Cosmodrome: 45.9650, 63.3050

**Great for stars:**
- Mauna Kea Observatory: 19.8207, -155.4681
- Atacama Desert: -24.6272, -69.2422

**Major cities:**
- New York: 40.7128, -74.0060
- London: 51.5074, -0.1278
- Tokyo: 35.6762, 139.6503

## Console Debugging

Press F12 to open browser console and check for errors:

**Good messages:**
```
🌌 What's Above Me - Initializing...
✅ Application ready
📍 Getting location...
✅ Location obtained
🔭 Calculating zenith coordinates...
```

**Common error messages:**
- "Geolocation error" - Check permissions
- "Failed to fetch" - Network/API issue
- "CORS policy" - Shouldn't happen with these APIs

## Still Having Issues?

1. **Update your browser** to the latest version
2. **Clear all cache** and cookies
3. **Disable VPN/proxy** temporarily
4. **Try incognito/private mode**
5. **Check the GitHub Issues** page
6. **Report the bug** with:
   - Browser name and version
   - Operating system
   - Full error message from console (F12)
   - Steps to reproduce

## Development Mode Issues

### Problem: Changes not showing

**Solutions:**
1. Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
2. Clear cache
3. Stop and restart the Python server
4. Check file was saved correctly

### Problem: Server won't start

**Error: Address already in use**

```powershell
# Windows - Find and kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <process_id> /F

# Or use a different port
python -m http.server 8080
```

## GitHub Pages Deployment Issues

### Problem: Page shows old version

**Solutions:**
1. Clear GitHub Pages cache (wait 5-10 minutes)
2. Hard refresh your browser
3. Check the commit was pushed: `git log`

### Problem: Geolocation not working on GitHub Pages

**Check:**
- GitHub Pages uses HTTPS ✅ (this is good)
- Make sure repository is public
- Check browser permissions for your GitHub Pages domain

---

## Quick Checklist

Before reporting an issue, verify:

- [ ] Using `http://localhost:8000` (not IPv6 address)
- [ ] Browser location permission is granted
- [ ] System location services are enabled
- [ ] Browser is up to date
- [ ] Internet connection is working
- [ ] Checked browser console (F12) for errors
- [ ] Tried manual location entry
- [ ] Tried different browser
- [ ] Cleared cache and refreshed

---

**Most issues are solved by:**
1. Using `http://localhost:8000`
2. Granting location permission
3. Using manual location entry as fallback

Enjoy exploring the sky! 🌟
