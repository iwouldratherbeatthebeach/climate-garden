const $ = (selector) => document.querySelector(selector);

const state = {
  plants: [],
  activeCategory: "all",
  selectedPlace: null,
  zone: null,
  zoneLabel: null,
  coldestC: null,
  normals: null,
  regionClimateLoaded: false,
  matchingRegions: [],
  regionLayers: new Map(),
  cityLayer: null
};

const categoryLabels = {
  herbs: "Herb",
  flowers: "Flower",
  fruits: "Fruit",
  vegetables: "Vegetable",
  decorative: "Decorative"
};

const worldRegions = [
  ["Pacific Northwest", 47.6, -122.3, 8, 9, "moist", "cool", "Mild, wet winters"],
  ["Northern California Coast", 38.4, -122.7, 9, 10, "moist", "mild", "Mediterranean marine"],
  ["Central California Valley", 36.7, -119.8, 9, 10, "dry", "hot", "Hot summer, mild winter"],
  ["Sonoran Desert", 32.2, -111.0, 9, 11, "dry", "hot", "Arid subtropical"],
  ["Colorado Front Range", 39.7, -104.9, 5, 6, "dry", "cool", "High plains"],
  ["Upper Midwest", 44.9, -93.2, 4, 5, "moist", "cool", "Cold continental"],
  ["Great Lakes Belt", 42.3, -83.0, 6, 7, "moist", "cool", "Lake moderated"],
  ["Mid Atlantic", 39.0, -77.0, 7, 8, "moist", "warm", "Humid temperate"],
  ["Southeast Lowlands", 33.8, -84.4, 8, 9, "humid", "hot", "Humid subtropical"],
  ["Gulf Coast", 29.8, -90.1, 9, 10, "humid", "hot", "Long warm season"],
  ["Florida Peninsula", 27.8, -81.7, 10, 11, "humid", "hot", "Subtropical to tropical"],
  ["Central Mexico Highlands", 19.4, -99.1, 9, 11, "dry", "mild", "Highland subtropical"],
  ["Yucatan", 20.9, -89.6, 11, 12, "humid", "hot", "Tropical limestone"],
  ["Caribbean Islands", 18.2, -66.5, 11, 13, "humid", "hot", "Tropical maritime"],
  ["Andean Valleys", -13.5, -71.9, 9, 11, "dry", "mild", "Cool tropical highland"],
  ["Patagonia Foothills", -41.1, -71.3, 6, 8, "moist", "cool", "Windy cool temperate"],
  ["Mediterranean Spain", 39.5, -0.4, 9, 10, "dry", "hot", "Mediterranean"],
  ["Atlantic France", 47.2, -1.6, 8, 9, "moist", "mild", "Oceanic"],
  ["British Isles", 52.4, -1.6, 8, 9, "moist", "cool", "Mild maritime"],
  ["Low Countries", 51.9, 4.5, 8, 9, "moist", "cool", "Oceanic lowland"],
  ["Central Europe", 48.2, 16.4, 6, 8, "moist", "cool", "Continental temperate"],
  ["Baltic Rim", 56.9, 24.1, 5, 6, "moist", "cool", "Cold maritime"],
  ["Nordic Coast", 59.9, 10.7, 6, 8, "moist", "cool", "Cool maritime"],
  ["Alpine Valleys", 46.5, 7.6, 5, 7, "moist", "cool", "Mountain temperate"],
  ["Italian Peninsula", 43.8, 11.3, 8, 10, "dry", "warm", "Warm Mediterranean"],
  ["Greek Islands", 37.9, 23.7, 10, 11, "dry", "hot", "Dry maritime"],
  ["Anatolian Plateau", 39.9, 32.9, 6, 8, "dry", "cool", "High continental"],
  ["Levant Coast", 33.9, 35.5, 10, 11, "dry", "hot", "Mediterranean subtropical"],
  ["Moroccan Atlas", 31.6, -7.9, 8, 10, "dry", "mild", "Highland arid edge"],
  ["Cape South Africa", -33.9, 18.4, 9, 10, "dry", "mild", "Mediterranean southern"],
  ["Ethiopian Highlands", 9.0, 38.8, 10, 12, "moist", "mild", "Tropical highland"],
  ["East African Highlands", -1.3, 36.8, 10, 12, "moist", "mild", "Equatorial highland"],
  ["South African Highveld", -26.2, 28.0, 8, 10, "dry", "warm", "High grassland"],
  ["Caucasus Foothills", 41.7, 44.8, 7, 9, "moist", "cool", "Mountain foothill"],
  ["Central Asian Oasis", 41.3, 69.2, 7, 9, "dry", "hot", "Hot continental"],
  ["Himalayan Foothills", 27.7, 85.3, 8, 10, "moist", "mild", "Monsoon foothill"],
  ["North India Plains", 28.6, 77.2, 10, 11, "humid", "hot", "Hot monsoon"],
  ["South India", 12.9, 77.6, 11, 13, "humid", "hot", "Tropical monsoon"],
  ["Northern China Plain", 39.9, 116.4, 6, 8, "dry", "cool", "Cold winter plains"],
  ["Yangtze Delta", 31.2, 121.5, 9, 10, "humid", "hot", "Humid subtropical"],
  ["Sichuan Basin", 30.6, 104.1, 9, 10, "humid", "warm", "Cloudy subtropical"],
  ["Japanese Pacific Coast", 35.7, 139.7, 9, 10, "humid", "warm", "Humid maritime"],
  ["Korean Peninsula", 37.6, 127.0, 7, 8, "moist", "cool", "Cold humid"],
  ["Southeast Asia Highlands", 18.8, 98.9, 10, 12, "moist", "mild", "Tropical highland"],
  ["Maritime Southeast Asia", 1.3, 103.8, 12, 13, "humid", "hot", "Equatorial"],
  ["Southern Australia", -37.8, 144.9, 9, 10, "dry", "mild", "Temperate dry summer"],
  ["Eastern Australia", -33.9, 151.2, 10, 11, "humid", "warm", "Subtropical coast"],
  ["Tasmania", -42.9, 147.3, 8, 9, "moist", "cool", "Cool maritime"],
  ["New Zealand North Island", -36.8, 174.8, 9, 10, "moist", "mild", "Mild maritime"],
  ["New Zealand South Island", -43.5, 172.6, 8, 9, "moist", "cool", "Cool maritime"]
].map(([name, lat, lon, zoneMin, zoneMax, moisture, heat, description]) => ({
  name,
  lat,
  lon,
  zoneMin,
  zoneMax,
  moisture,
  heat,
  description
}));

const map = L.map("map", {
  zoomControl: false,
  worldCopyJump: true,
  minZoom: 2,
  maxZoom: 8
}).setView([23, 0], 2);

L.control.zoom({ position: "bottomright" }).addTo(map);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

function zoneFromF(tempF) {
  const zone = Math.min(13, Math.max(1, Math.floor((tempF + 60) / 10) + 1));
  const zoneLow = -60 + (zone - 1) * 10;
  return {
    zone,
    label: `${zone}${tempF < zoneLow + 5 ? "a" : "b"}`
  };
}

function cToF(c) {
  return c * 1.8 + 32;
}

function zoneRangeLabel(min, max) {
  return `Zones ${min}-${max}`;
}

function setLoading(isLoading) {
  document.body.classList.toggle("loading", isLoading);
  $("#cityForm button").disabled = isLoading;
  $("#cityForm button").textContent = isLoading ? "Searching..." : "Find matches";
}

function scoreRegion(region, zone) {
  if (!zone) return 0;
  let score = 0;
  if (zone >= region.zoneMin && zone <= region.zoneMax) score += 14;
  else {
    const distance = Math.min(Math.abs(zone - region.zoneMin), Math.abs(zone - region.zoneMax));
    score += Math.max(0, 8 - distance * 2);
  }

  if (state.normals && region.normals) {
    const heatDiff = Math.abs(state.normals.warmestHighC - region.normals.warmestHighC);
    const lowDiff = Math.abs(state.normals.coolestNormalLowC - region.normals.coolestNormalLowC);
    const humidityDiff = Math.abs(state.normals.meanHumidity - region.normals.meanHumidity);
    score += Math.max(0, 10 - heatDiff);
    score += Math.max(0, 8 - lowDiff / 2);
    score += Math.max(0, 8 - humidityDiff / 4);
  }

  return score;
}

function regionStyle(score) {
  if (score >= 30) {
    return { radius: 18, color: "#155c38", fillColor: "#2f7d4f", fillOpacity: 0.72, weight: 2 };
  }
  if (score >= 20) {
    return { radius: 13, color: "#9c6f17", fillColor: "#e9b44c", fillOpacity: 0.62, weight: 2 };
  }
  return { radius: 8, color: "#65766c", fillColor: "#7d9084", fillOpacity: 0.28, weight: 1 };
}

function renderRegionLayers() {
  worldRegions.forEach((region) => {
    const score = scoreRegion(region, state.zone);
    const existing = state.regionLayers.get(region.name);
    if (existing) {
      existing.setStyle(regionStyle(score));
      existing.setRadius(regionStyle(score).radius);
      return;
    }

    const marker = L.circleMarker([region.lat, region.lon], regionStyle(score))
      .bindPopup(regionPopup(region))
      .addTo(map);
    marker.on("click", () => {
      map.flyTo([region.lat, region.lon], 5, { duration: 0.8 });
    });
    state.regionLayers.set(region.name, marker);
  });
}

function regionPopup(region) {
  const climate = region.normals
    ? `<br>Warmest high ${region.normals.warmestHighC.toFixed(1)} C<br>Coolest low ${region.normals.coolestNormalLowC.toFixed(1)} C<br>Humidity ${region.normals.meanHumidity.toFixed(0)}%`
    : "<br>Climate normals load after city search";
  return `<strong>${region.name}</strong><br>${zoneRangeLabel(region.zoneMin, region.zoneMax)}<br>${region.description}${climate}`;
}

function plantScore(plant, zone) {
  if (!zone) return 0;
  let score = 0;
  if (zone >= plant.zoneMin && zone <= plant.zoneMax) score += 20;
  else {
    const distance = Math.min(Math.abs(zone - plant.zoneMin), Math.abs(zone - plant.zoneMax));
    score += Math.max(0, 8 - distance * 2);
  }

  if (state.normals) {
    const heat = state.normals.warmestHighC;
    const humidity = state.normals.meanHumidity;
    if (heat >= plant.summerHighMinC && heat <= plant.summerHighMaxC) {
      score += 12;
    } else {
      const heatDistance = Math.min(
        Math.abs(heat - plant.summerHighMinC),
        Math.abs(heat - plant.summerHighMaxC)
      );
      score += Math.max(0, 9 - heatDistance);
    }

    if (humidity >= plant.humidityMin && humidity <= plant.humidityMax) {
      score += 8;
    } else {
      const humidityDistance = Math.min(
        Math.abs(humidity - plant.humidityMin),
        Math.abs(humidity - plant.humidityMax)
      );
      score += Math.max(0, 7 - humidityDistance / 4);
    }
  }

  score += (plant.popularity ?? 0) / 2;
  return score;
}

function climateLabel(plant) {
  if (!plant.summerHighMinC || !plant.summerHighMaxC) return "";
  return `${plant.summerHighMinC}-${plant.summerHighMaxC} C high, ${plant.humidityMin}-${plant.humidityMax}% RH`;
}

function renderRegions() {
  const regions = state.zone
    ? worldRegions
        .map((region) => ({ ...region, score: scoreRegion(region, state.zone) }))
        .filter((region) => region.score >= (state.regionClimateLoaded ? 18 : 1))
        .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
    : worldRegions.slice(0, 10).map((region) => ({ ...region, score: 0 }));

  state.matchingRegions = regions;
  $("#regionMetric").textContent = state.zone ? String(regions.length) : "--";
  $("#regionCount").textContent = `${regions.length} shown`;
  $("#regionsList").innerHTML = regions
    .slice(0, 14)
    .map(
      (region) => `
        <article class="region-card" data-region="${region.name}">
          <div class="card-top">
            <div>
              <strong>${region.name}</strong>
              <span class="subtle">${region.description}${region.normals ? ` · ${region.normals.warmestHighC.toFixed(0)} C high · ${region.normals.meanHumidity.toFixed(0)}% RH` : ""}</span>
            </div>
            <span class="badge">${zoneRangeLabel(region.zoneMin, region.zoneMax)}</span>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".region-card").forEach((card) => {
    card.addEventListener("click", () => {
      const region = worldRegions.find((item) => item.name === card.dataset.region);
      if (region) map.flyTo([region.lat, region.lon], 5, { duration: 0.8 });
    });
  });
}

function renderPlants() {
  const strict = $("#strictZone").checked;
  let plants = state.plants;

  if (state.activeCategory !== "all") {
    plants = plants.filter((plant) => plant.category === state.activeCategory);
  }

  if (state.zone && strict) {
    plants = plants.filter((plant) => state.zone >= plant.zoneMin && state.zone <= plant.zoneMax);
  }

  plants = plants
    .map((plant) => ({ ...plant, score: plantScore(plant, state.zone) }))
    .sort((a, b) => b.score - a.score || a.commonName.localeCompare(b.commonName))
    .slice(0, 80);

  $("#plantCount").textContent = `${plants.length} of ${state.plants.length.toLocaleString()} shown`;
  $("#plantsList").innerHTML =
    plants
      .map(
        (plant) => `
          <article class="plant-card">
            <div class="card-top">
              <div>
                <strong>${plant.commonName}</strong>
                <span class="subtle"><em>${plant.scientificName}</em></span>
              </div>
              <span class="badge">${categoryLabels[plant.category]}</span>
            </div>
            <div class="plant-meta">
              <span>${zoneRangeLabel(plant.zoneMin, plant.zoneMax)}</span>
              <span>${plant.type}</span>
              <span>${plant.sun}</span>
              <span>${plant.water}</span>
              <span>${climateLabel(plant)}</span>
              <span>${plant.origin}</span>
            </div>
          </article>
        `
      )
      .join("") || `<p class="empty">No plants match that filter yet. Try another category or turn off strict zone matching.</p>`;
}

function renderAll() {
  renderRegionLayers();
  renderRegions();
  renderPlants();
}

async function geocodeCity(city) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.search = new URLSearchParams({
    name: city,
    count: "1",
    language: "en",
    format: "json"
  });
  const response = await fetch(url);
  if (!response.ok) throw new Error("Could not geocode that city.");
  const data = await response.json();
  if (!data.results?.length) throw new Error("No city match found.");
  return data.results[0];
}

function pastDate(yearsAgo) {
  const date = new Date();
  date.setFullYear(date.getFullYear() - yearsAgo);
  return date.toISOString().slice(0, 10);
}

function yesterday() {
  const date = new Date();
  date.setDate(date.getDate() - 3);
  return date.toISOString().slice(0, 10);
}

async function fetchClimate(place) {
  const params = new URLSearchParams({
    latitude: String(place.latitude),
    longitude: String(place.longitude),
    start_date: pastDate(8),
    end_date: yesterday(),
    daily: "temperature_2m_min,precipitation_sum",
    timezone: "auto"
  });
  const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${params}`);
  if (!response.ok) throw new Error("Could not fetch weather history.");
  const data = await response.json();
  const times = data.daily?.time ?? [];
  const lows = data.daily?.temperature_2m_min ?? [];
  const yearlyLows = new Map();

  lows.forEach((low, index) => {
    if (typeof low !== "number") return;
    const year = times[index]?.slice(0, 4);
    const current = yearlyLows.get(year);
    yearlyLows.set(year, current === undefined ? low : Math.min(current, low));
  });

  const annualExtremes = [...yearlyLows.values()].filter(Number.isFinite);
  if (!annualExtremes.length) throw new Error("Weather history did not include temperatures.");
  const coldestC = annualExtremes.reduce((sum, value) => sum + value, 0) / annualExtremes.length;
  const normals = await fetchPowerNormals(place);
  return { coldestC, normals };
}

function average(values) {
  const nums = values.filter(Number.isFinite);
  return nums.reduce((sum, value) => sum + value, 0) / nums.length;
}

function monthlyValues(parameter) {
  if (!parameter) return [];
  const monthKeys = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  return monthKeys.map((key) => Number(parameter[key])).filter(Number.isFinite);
}

async function fetchPowerNormals(place) {
  const params = new URLSearchParams({
    parameters: "T2M_MAX,T2M_MIN,RH2M",
    community: "AG",
    longitude: String(place.longitude),
    latitude: String(place.latitude),
    format: "JSON"
  });
  const response = await fetch(
    `https://power.larc.nasa.gov/api/temporal/climatology/point?${params}`
  );
  if (!response.ok) throw new Error("Could not fetch NASA POWER climate normals.");
  const data = await response.json();
  const parameters = data.properties?.parameter ?? {};
  const maxValues = monthlyValues(parameters.T2M_MAX);
  const minValues = monthlyValues(parameters.T2M_MIN);
  const humidityValues = monthlyValues(parameters.RH2M);

  if (!maxValues.length || !minValues.length || !humidityValues.length) {
    throw new Error("NASA POWER climate normals were incomplete for this point.");
  }

  return {
    warmestHighC: Math.max(...maxValues),
    coolestNormalLowC: Math.min(...minValues),
    meanHighC: average(maxValues),
    meanLowC: average(minValues),
    meanHumidity: average(humidityValues)
  };
}

async function hydrateRegionNormals() {
  if (state.regionClimateLoaded) return;
  const cacheKey = "terratwin-region-normals-v1";
  const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
  worldRegions.forEach((region) => {
    if (cached[region.name]) region.normals = cached[region.name];
  });

  const missing = worldRegions.filter((region) => !region.normals);
  const workers = Array.from({ length: 6 }, async () => {
    while (missing.length) {
      const region = missing.shift();
      try {
        region.normals = await fetchPowerNormals({
          latitude: region.lat,
          longitude: region.lon
        });
        cached[region.name] = region.normals;
      } catch {
        region.normals = null;
      }
    }
  });

  await Promise.all(workers);
  localStorage.setItem(cacheKey, JSON.stringify(cached));
  state.regionClimateLoaded = true;
  state.regionLayers.forEach((layer, name) => {
    const region = worldRegions.find((item) => item.name === name);
    if (region) layer.setPopupContent(regionPopup(region));
  });
}

async function runSearch(city) {
  setLoading(true);
  try {
    const place = await geocodeCity(city);
    const climate = await fetchClimate(place);
    const zone = zoneFromF(cToF(climate.coldestC));

    state.selectedPlace = place;
    state.zone = zone.zone;
    state.zoneLabel = zone.label;
    state.coldestC = climate.coldestC;
    state.normals = climate.normals;

    $("#placeTitle").textContent = `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}`;
    $("#climateSummary").textContent =
      `USDA zone is estimated from recent historical annual low extremes. High, low, and humidity normals come from NASA POWER climatology near ${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}.`;
    $("#zoneMetric").textContent = zone.label;
    $("#coldMetric").textContent = `${climate.coldestC.toFixed(1)} C`;
    $("#highMetric").textContent = `${climate.normals.warmestHighC.toFixed(1)} C`;
    $("#lowMetric").textContent = `${climate.normals.coolestNormalLowC.toFixed(1)} C`;
    $("#humidityMetric").textContent = `${climate.normals.meanHumidity.toFixed(0)}%`;

    if (state.cityLayer) state.cityLayer.remove();
    state.cityLayer = L.circleMarker([place.latitude, place.longitude], {
      radius: 9,
      color: "#10291f",
      fillColor: "#d46a4c",
      fillOpacity: 0.92,
      weight: 3
    })
      .bindPopup(`<strong>${place.name}</strong><br>Estimated USDA zone ${zone.label}`)
      .addTo(map);

    map.flyTo([place.latitude, place.longitude], 5, { duration: 0.8 });
    renderAll();
    $("#regionCount").textContent = "Loading climate normals...";
    await hydrateRegionNormals();
    renderAll();
  } catch (error) {
    $("#climateSummary").textContent = error.message;
  } finally {
    setLoading(false);
  }
}

async function init() {
  renderRegionLayers();
  renderRegions();

  const response = await fetch("/plants.json");
  state.plants = await response.json();
  renderPlants();

  $("#cityForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const city = new FormData(event.currentTarget).get("city")?.toString().trim();
    if (city) runSearch(city);
  });

  document.querySelectorAll(".chip").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
      button.classList.add("active");
      state.activeCategory = button.dataset.category;
      renderPlants();
    });
  });

  $("#strictZone").addEventListener("change", renderPlants);
}

init();
