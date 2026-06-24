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
  countryFeatures: [],
  countryElements: new Map(),
  selectedCountry: null,
  cityLayer: null,
  mapReady: false
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

const map = $("#map");

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

function countryCode(properties) {
  const candidates = [
    properties.ADM0_A3,
    properties.ISO_A3,
    properties.SOV_A3,
    properties.ADM0_TLC
  ];
  return candidates.find((value) => value && value !== "-99") ?? "";
}

function countryName(properties) {
  return properties.NAME_EN || properties.NAME_LONG || properties.ADMIN || properties.NAME;
}

function countryKey(feature) {
  return countryCode(feature.properties) || countryName(feature.properties);
}

function setMapStatus(message = "") {
  const status = $("#mapStatus");
  status.textContent = message;
  status.hidden = !message;
}

function countryStyle(feature) {
  const selected =
    state.selectedCountry && countryCode(feature.properties) === state.selectedCountry.code;
  const score = feature.properties.climateSimilarity;
  let fillColor = "#809188";
  let fillOpacity = state.zone ? 0.12 : 0.18;

  if (score >= 76) {
    fillColor = "#2f7d4f";
    fillOpacity = 0.72;
  } else if (score >= 60) {
    fillColor = "#e9b44c";
    fillOpacity = 0.58;
  } else if (state.zone) {
    fillColor = "#718279";
    fillOpacity = 0.16;
  }

  return {
    color: selected ? "#d46a4c" : "#fffaf0",
    fillColor,
    fillOpacity,
    weight: selected ? 3 : 0.8,
    opacity: selected ? 1 : 0.72
  };
}

function refreshCountryStyles() {
  state.countryElements.forEach((element, key) => {
    const feature = state.countryFeatures.find((item) => countryKey(item) === key);
    if (!feature) return;
    const style = countryStyle(feature);
    element.setAttribute("fill", style.fillColor);
    element.setAttribute("fill-opacity", String(style.fillOpacity));
    element.setAttribute("stroke", style.color);
    element.setAttribute("stroke-width", String(style.weight));
    element.setAttribute("stroke-opacity", String(style.opacity));
    const title = element.querySelector("title");
    if (title) {
      const score = feature.properties.climateSimilarity;
      title.textContent = Number.isFinite(score)
        ? `${countryName(feature.properties)}: ${Math.round(score)}% representative climate match`
        : `${countryName(feature.properties)}: click to view suitable plants`;
    }
  });
}

function projectCoordinate([lon, lat]) {
  return [((lon + 180) / 360) * 1000, ((90 - lat) / 180) * 500];
}

function ringPath(ring) {
  let path = "";
  let previousLon = null;
  ring.forEach((coordinate, index) => {
    const [x, y] = projectCoordinate(coordinate);
    const startsNewSegment =
      index === 0 ||
      (previousLon !== null && Math.abs(coordinate[0] - previousLon) > 180);
    path += `${startsNewSegment ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    previousLon = coordinate[0];
  });
  return `${path}Z`;
}

function geometryPath(geometry) {
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map(ringPath).join("");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .flatMap((polygon) => polygon.map(ringPath))
      .join("");
  }
  return "";
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(aLat, aLon, bLat, bLon) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(bLat - aLat);
  const dLon = toRadians(bLon - aLon);
  const lat1 = toRadians(aLat);
  const lat2 = toRadians(bLat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function nearestClimateRegion(feature) {
  const lat = Number(feature.properties.LABEL_Y ?? feature.properties.centerLat);
  const lon = Number(feature.properties.LABEL_X ?? feature.properties.centerLon);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return worldRegions
    .filter((region) => region.normals)
    .map((region) => ({ region, distance: distanceKm(lat, lon, region.lat, region.lon) }))
    .sort((a, b) => a.distance - b.distance)[0]?.region;
}

function climateSimilarity(region) {
  if (!state.normals || !region?.normals) return null;
  const heatDiff = Math.abs(state.normals.warmestHighC - region.normals.warmestHighC);
  const lowDiff = Math.abs(
    state.normals.coolestNormalLowC - region.normals.coolestNormalLowC
  );
  const humidityDiff = Math.abs(state.normals.meanHumidity - region.normals.meanHumidity);
  const zoneDistance =
    state.zone >= region.zoneMin && state.zone <= region.zoneMax
      ? 0
      : Math.min(
          Math.abs(state.zone - region.zoneMin),
          Math.abs(state.zone - region.zoneMax)
        );

  return Math.max(
    0,
    Math.min(100, 100 - heatDiff * 2.2 - lowDiff * 1.35 - humidityDiff * 0.9 - zoneDistance * 8)
  );
}

function scoreCountries() {
  state.countryFeatures.forEach((feature) => {
    const region = nearestClimateRegion(feature);
    feature.properties.climateRegion = region?.name ?? "";
    feature.properties.climateSimilarity = climateSimilarity(region);
  });
}

function selectCountry(feature) {
  const properties = feature.properties;
  state.selectedCountry = {
    code: countryCode(properties),
    name: countryName(properties),
    feature
  };
  $("#countryFilter").textContent = `Origin: ${state.selectedCountry.name}`;
  $("#clearCountry").hidden = false;
  refreshCountryStyles();
  renderRegions();
  renderPlants();
}

async function loadCountries() {
  const sources = [
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson",
    "https://cdn.jsdelivr.net/gh/nvkelso/natural-earth-vector@master/geojson/ne_110m_admin_0_countries.geojson"
  ];
  let data;
  for (const source of sources) {
    try {
      const response = await fetch(source);
      if (!response.ok) continue;
      data = await response.json();
      break;
    } catch {
      // Try the next public mirror.
    }
  }
  if (!data?.features?.length) {
    throw new Error("Country boundaries could not be loaded. Check network or content blocking.");
  }

  const svgNamespace = "http://www.w3.org/2000/svg";
  state.countryFeatures = data.features.filter((feature) => feature.geometry);
  state.countryElements.clear();
  map.replaceChildren();

  state.countryFeatures.forEach((feature) => {
    const pathData = geometryPath(feature.geometry);
    if (!pathData) return;
    const path = document.createElementNS(svgNamespace, "path");
    const title = document.createElementNS(svgNamespace, "title");
    path.setAttribute("d", pathData);
    path.setAttribute("class", "country-shape");
    path.setAttribute("tabindex", "0");
    path.setAttribute("role", "button");
    path.setAttribute("aria-label", `Select ${countryName(feature.properties)}`);
    path.addEventListener("click", () => selectCountry(feature));
    path.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectCountry(feature);
      }
    });
    title.textContent = `${countryName(feature.properties)}: click to view suitable plants`;
    path.append(title);
    map.append(path);
    state.countryElements.set(countryKey(feature), path);
  });
  refreshCountryStyles();
  state.mapReady = true;
  setMapStatus("");
}

function isSeasonalPlant(plant) {
  return /annual|biennial|warm-season|cool-season|root crop|bulb crop|tuber crop/i.test(
    plant.type
  );
}

function distanceFromRange(value, min, max) {
  if (value >= min && value <= max) return 0;
  return Math.min(Math.abs(value - min), Math.abs(value - max));
}

function plantSuitability(plant) {
  if (!state.zone || !state.normals) return { suitable: false, score: 0, reasons: [] };

  const seasonal = isSeasonalPlant(plant);
  const zoneFits = state.zone >= plant.zoneMin && state.zone <= plant.zoneMax;
  const heatDistance = distanceFromRange(
    state.normals.warmestHighC,
    plant.summerHighMinC,
    plant.summerHighMaxC
  );
  const humidityDistance = distanceFromRange(
    state.normals.meanHumidity,
    plant.humidityMin,
    plant.humidityMax
  );
  const suitable = (seasonal || zoneFits) && heatDistance <= 3 && humidityDistance <= 12;
  const score =
    100 -
    heatDistance * 6 -
    humidityDistance * 1.5 -
    (!seasonal && !zoneFits ? 50 : 0) +
    (plant.popularity ?? 0) / 2;
  const reasons = [
    seasonal ? "Seasonal crop" : zoneFits ? `Hardy in zone ${state.zoneLabel}` : "Winter mismatch",
    heatDistance === 0 ? "Heat match" : `${heatDistance.toFixed(0)} C outside preferred high`,
    humidityDistance === 0
      ? "Humidity match"
      : `${humidityDistance.toFixed(0)}% outside preferred humidity`
  ];
  return { suitable, score, reasons };
}

function climateLabel(plant) {
  if (!plant.summerHighMinC || !plant.summerHighMaxC) return "";
  return `${plant.summerHighMinC}-${plant.summerHighMaxC} C high, ${plant.humidityMin}-${plant.humidityMax}% RH`;
}

function renderRegions() {
  if (!state.zone) {
    $("#regionMetric").textContent = "--";
    $("#regionCount").textContent = "Search first";
    $("#regionsList").innerHTML =
      `<p class="empty">Enter a city to highlight countries with similar representative climate.</p>`;
    return;
  }

  const countries = state.countryFeatures
    .filter((feature) => Number(feature.properties.climateSimilarity) >= 60)
    .sort(
      (a, b) =>
        b.properties.climateSimilarity - a.properties.climateSimilarity ||
        countryName(a.properties).localeCompare(countryName(b.properties))
    );

  $("#regionMetric").textContent = state.regionClimateLoaded ? String(countries.length) : "...";
  $("#regionCount").textContent = state.regionClimateLoaded
    ? `${countries.length} countries`
    : "Calculating...";
  $("#regionsList").innerHTML = countries
    .slice(0, 16)
    .map(
      (feature) => `
        <article class="region-card ${
          state.selectedCountry?.code === countryCode(feature.properties) ? "active" : ""
        }" data-country="${countryCode(feature.properties)}">
          <div class="card-top">
            <div>
              <strong>${countryName(feature.properties)}</strong>
              <span class="subtle">${feature.properties.climateRegion || "Representative climate point"}</span>
            </div>
            <span class="badge">${Math.round(feature.properties.climateSimilarity)}% match</span>
          </div>
        </article>
      `
    )
    .join("") || `<p class="empty">Climate comparisons are still loading.</p>`;

  document.querySelectorAll(".region-card").forEach((card) => {
    card.addEventListener("click", () => {
      const feature = state.countryFeatures.find(
        (item) => countryCode(item.properties) === card.dataset.country
      );
      if (feature) selectCountry(feature);
    });
  });
}

function renderPlants() {
  if (!state.zone || !state.normals) {
    $("#plantCount").textContent = "Search first";
    $("#plantsList").innerHTML =
      `<p class="empty">Enter your city before browsing recommendations. Plants are only shown after climate suitability can be checked.</p>`;
    return;
  }

  let plants = state.plants;
  if (state.activeCategory !== "all") {
    plants = plants.filter((plant) => plant.category === state.activeCategory);
  }

  if (state.selectedCountry) {
    plants = plants.filter((plant) =>
      (plant.originCountries ?? []).includes(state.selectedCountry.code)
    );
  }

  plants = plants
    .map((plant) => ({ ...plant, match: plantSuitability(plant) }))
    .filter((plant) => plant.match.suitable)
    .map((plant) => ({ ...plant, score: plant.match.score }))
    .sort((a, b) => b.score - a.score || a.commonName.localeCompare(b.commonName))
    .filter(
      (plant, index, all) =>
        all.findIndex((candidate) => candidate.scientificName === plant.scientificName) === index
    )
    .slice(0, 60);

  const originLabel = state.selectedCountry ? ` from ${state.selectedCountry.name}` : "";
  $("#plantCount").textContent = `${plants.length} suitable${originLabel}`;
  $("#plantsList").innerHTML =
    plants
      .map(
        (plant) => `
          <article class="plant-card">
            <div class="card-top">
              <div>
                <strong>${plant.baseName ?? plant.commonName}</strong>
                <span class="subtle"><em>${plant.scientificName}</em></span>
              </div>
              <span class="badge">${categoryLabels[plant.category]}</span>
            </div>
            <div class="plant-meta">
              <span>${isSeasonalPlant(plant) ? "Seasonal" : zoneRangeLabel(plant.zoneMin, plant.zoneMax)}</span>
              <span>${plant.type}</span>
              <span>${plant.sun}</span>
              <span>${plant.water}</span>
              <span>${climateLabel(plant)}</span>
              <span>${plant.origin}</span>
              <span>${plant.climateForm} profile</span>
            </div>
          </article>
        `
      )
      .join("") ||
    `<p class="empty">No plants from this origin pass the current zone, heat, and humidity checks in this category. Try another plant type or country.</p>`;
}

function renderAll() {
  refreshCountryStyles();
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
  const cacheKey = "terratwin-region-normals-v2";
  const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
  worldRegions.forEach((region) => {
    if (cached[region.name]) region.normals = cached[region.name];
  });

  const missing = worldRegions.filter((region) => !region.normals);
  let completed = worldRegions.length - missing.length;
  const workers = Array.from({ length: 4 }, async () => {
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
      completed += 1;
      if (completed % 5 === 0) {
        setMapStatus(`Comparing world climates ${completed}/${worldRegions.length}...`);
      }
    }
  });

  await Promise.all(workers);
  localStorage.setItem(cacheKey, JSON.stringify(cached));
  state.regionClimateLoaded = true;
  scoreCountries();
  setMapStatus("");
}

function renderCityPoint(place) {
  state.cityLayer?.remove();
  const [x, y] = projectCoordinate([place.longitude, place.latitude]);
  const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  circle.setAttribute("cx", x.toFixed(2));
  circle.setAttribute("cy", y.toFixed(2));
  circle.setAttribute("r", "7");
  circle.setAttribute("class", "city-point");
  title.textContent = `${place.name}, estimated USDA zone ${state.zoneLabel}`;
  circle.append(title);
  map.append(circle);
  state.cityLayer = circle;
}

async function runSearch(city) {
  setLoading(true);
  let cityReady = false;
  try {
    const place = await geocodeCity(city);
    const climate = await fetchClimate(place);
    const zone = zoneFromF(cToF(climate.coldestC));

    state.selectedPlace = place;
    state.zone = zone.zone;
    state.zoneLabel = zone.label;
    state.coldestC = climate.coldestC;
    state.normals = climate.normals;
    state.selectedCountry = null;
    $("#countryFilter").textContent = "All origins";
    $("#clearCountry").hidden = true;

    $("#placeTitle").textContent = `${place.name}${place.admin1 ? `, ${place.admin1}` : ""}`;
    $("#climateSummary").textContent =
      `USDA zone is estimated from recent historical annual low extremes. High, low, and humidity normals come from NASA POWER climatology near ${place.latitude.toFixed(2)}, ${place.longitude.toFixed(2)}.`;
    $("#zoneMetric").textContent = zone.label;
    $("#coldMetric").textContent = `${climate.coldestC.toFixed(1)} C`;
    $("#highMetric").textContent = `${climate.normals.warmestHighC.toFixed(1)} C`;
    $("#lowMetric").textContent = `${climate.normals.coolestNormalLowC.toFixed(1)} C`;
    $("#humidityMetric").textContent = `${climate.normals.meanHumidity.toFixed(0)}%`;

    renderCityPoint(place);
    renderAll();
    cityReady = true;
    setLoading(false);
    setMapStatus("Comparing representative climates around the world...");
    hydrateRegionNormals()
      .then(() => {
        scoreCountries();
        renderAll();
      })
      .catch(() => {
        setMapStatus("Some global climate comparisons could not be loaded.");
      });
  } catch (error) {
    $("#climateSummary").textContent = error.message;
    setMapStatus("");
  } finally {
    if (!cityReady) setLoading(false);
  }
}

async function init() {
  const [plantsResult, countriesResult] = await Promise.allSettled([
    fetch("/plants.json").then((response) => {
      if (!response.ok) throw new Error("Plant database could not be loaded.");
      return response.json();
    }),
    loadCountries()
  ]);

  if (plantsResult.status === "fulfilled") {
    state.plants = plantsResult.value;
  } else {
    $("#plantCount").textContent = "Unavailable";
    $("#plantsList").innerHTML = `<p class="empty">${plantsResult.reason.message}</p>`;
  }
  if (countriesResult.status === "rejected") {
    setMapStatus(countriesResult.reason.message);
  }
  renderRegions();
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

  $("#clearCountry").addEventListener("click", () => {
    state.selectedCountry = null;
    $("#countryFilter").textContent = "All origins";
    $("#clearCountry").hidden = true;
    refreshCountryStyles();
    renderRegions();
    renderPlants();
  });
}

init();
