# Weather Widget - Embeddable Snippet

**Product:** TrustLayer Weather  
**Type:** White-Label Ready  
**Version:** 1.0.0  
**Pricing:** $9-$19/month  

---

## Overview

Real-time weather display with animated radar for outdoor service businesses.

---

## Quick Start

```html
<div id="tl-weather"></div>
<script src="https://tlid.io/widgets/tl-weather.js" 
        data-site-id="YOUR_SITE_ID"
        data-location="Nashville, TN"></script>
```

---

## Features

| Feature | Description |
|---------|-------------|
| **Current Conditions** | Temp, humidity, wind |
| **7-Day Forecast** | Extended outlook |
| **Animated Radar** | Real-time radar overlay |
| **Severe Alerts** | Storm warnings |
| **Work Day Scoring** | Good/bad day to work outside |
| **Auto-Location** | Detect visitor location |
| **Multiple Locations** | Track multiple job sites |
| **Historical Data** | Past weather for disputes |

---

## Display Modes

| Mode | Description |
|------|-------------|
| `compact` | Just current temp and icon |
| `standard` | Current + 3-day forecast |
| `full` | Full display with radar |
| `radar-only` | Just the radar map |

---

## Configuration Options

```javascript
TLWeather.init({
  siteId: 'YOUR_SITE_ID',
  mode: 'standard',
  theme: 'dark',
  location: {
    auto: true, // Auto-detect
    fallback: 'Nashville, TN'
  },
  units: 'imperial', // or 'metric'
  radar: {
    enabled: true,
    zoom: 8,
    animate: true
  },
  workScoring: {
    enabled: true,
    minTemp: 40,
    maxTemp: 95,
    maxWind: 20,
    noRain: true
  },
  alerts: {
    enabled: true,
    types: ['tornado', 'thunderstorm', 'flood']
  }
});
```

---

## Work Day Score

The widget can score if today is a good day for outdoor work:

| Score | Meaning |
|-------|---------|
| 90-100 | Excellent |
| 70-89 | Good |
| 50-69 | Fair |
| 30-49 | Poor |
| 0-29 | Bad (don't schedule) |

Factors: Temperature, precipitation, wind, humidity

---

## API Endpoints

```
GET https://tlid.io/api/weather/current?location=Nashville,TN
{
  "temp": 72,
  "feels_like": 74,
  "humidity": 65,
  "wind": 8,
  "conditions": "Partly Cloudy",
  "icon": "partly-cloudy",
  "workScore": 85
}

GET https://tlid.io/api/weather/forecast?location=Nashville,TN&days=7
{
  "forecast": [
    { "date": "2026-01-30", "high": 75, "low": 55, "conditions": "Sunny" },
    ...
  ]
}
```

---

## Data Sources

- Open-Meteo API (weather data)
- RainViewer API (radar tiles)
- OpenStreetMap (base maps)

---

## Pricing Tiers

| Tier | Price | Requests/mo | Features |
|------|-------|-------------|----------|
| Starter | $9/mo | 10K | Current + forecast |
| Growth | $14/mo | 50K | + Radar, alerts |
| Business | $19/mo | Unlimited | + White-label, API |

---

## White-Label Package

$49 setup + $19/mo minimum
- Your branding
- Remove "Powered by TrustLayer"

---

## Source Location

`client/src/components/weather-*.tsx`  
`server/routes.ts` - weather endpoints

---

## Changelog

### v1.0.0 (January 2026)
- Initial release
- Real-time conditions
- Animated radar
- Work day scoring
