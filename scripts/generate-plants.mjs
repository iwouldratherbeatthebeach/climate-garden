import { writeFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";

const forms = [
  { name: "Classic", shift: 0, pop: 8 },
  { name: "Patio", shift: 1, pop: 7 },
  { name: "Cold-hardy", shift: -1, pop: 9 },
  { name: "Heat-tolerant", shift: 1, pop: 8 },
  { name: "Compact", shift: 0, pop: 6 },
  { name: "Culinary", shift: 0, pop: 7 },
  { name: "Pollinator", shift: 0, pop: 8 },
  { name: "Container", shift: 1, pop: 6 },
  { name: "Meadow", shift: -1, pop: 5 },
  { name: "Orchard", shift: 0, pop: 7 },
  { name: "Heritage", shift: -1, pop: 6 },
  { name: "Urban", shift: 1, pop: 5 }
];

const bases = [
  ["Basil", "Ocimum basilicum", "herbs", "annual herb", 10, 13, "Full sun", "Even moisture", "South Asia"],
  ["Thai Basil", "Ocimum basilicum var. thyrsiflora", "herbs", "annual herb", 10, 13, "Full sun", "Even moisture", "Southeast Asia"],
  ["Rosemary", "Salvia rosmarinus", "herbs", "woody herb", 8, 11, "Full sun", "Low water", "Mediterranean"],
  ["Thyme", "Thymus vulgaris", "herbs", "perennial herb", 5, 9, "Full sun", "Low water", "Mediterranean"],
  ["Oregano", "Origanum vulgare", "herbs", "perennial herb", 5, 10, "Full sun", "Low water", "Mediterranean"],
  ["Marjoram", "Origanum majorana", "herbs", "tender herb", 9, 11, "Full sun", "Moderate water", "Mediterranean"],
  ["Sage", "Salvia officinalis", "herbs", "perennial herb", 5, 9, "Full sun", "Low water", "Mediterranean"],
  ["Parsley", "Petroselinum crispum", "herbs", "biennial herb", 4, 9, "Sun to part shade", "Even moisture", "Mediterranean"],
  ["Cilantro", "Coriandrum sativum", "herbs", "annual herb", 3, 10, "Sun to part shade", "Even moisture", "Western Asia"],
  ["Dill", "Anethum graveolens", "herbs", "annual herb", 3, 9, "Full sun", "Moderate water", "Eurasia"],
  ["Chives", "Allium schoenoprasum", "herbs", "perennial herb", 3, 9, "Full sun", "Moderate water", "Eurasia"],
  ["Garlic Chives", "Allium tuberosum", "herbs", "perennial herb", 4, 9, "Full sun", "Moderate water", "East Asia"],
  ["Mint", "Mentha spicata", "herbs", "perennial herb", 4, 9, "Part shade", "Moist soil", "Europe"],
  ["Peppermint", "Mentha x piperita", "herbs", "perennial herb", 4, 9, "Part shade", "Moist soil", "Europe"],
  ["Lemon Balm", "Melissa officinalis", "herbs", "perennial herb", 4, 9, "Sun to part shade", "Moderate water", "Europe"],
  ["Lavender", "Lavandula angustifolia", "herbs", "woody herb", 5, 9, "Full sun", "Low water", "Mediterranean"],
  ["Chamomile", "Matricaria chamomilla", "herbs", "annual herb", 3, 9, "Full sun", "Moderate water", "Europe"],
  ["Fennel", "Foeniculum vulgare", "herbs", "perennial herb", 6, 10, "Full sun", "Low water", "Mediterranean"],
  ["Tarragon", "Artemisia dracunculus", "herbs", "perennial herb", 4, 8, "Full sun", "Moderate water", "Eurasia"],
  ["Sorrel", "Rumex acetosa", "herbs", "leaf herb", 3, 8, "Sun to part shade", "Moist soil", "Europe"],
  ["Shiso", "Perilla frutescens", "herbs", "annual herb", 8, 11, "Sun to part shade", "Even moisture", "East Asia"],
  ["Lemongrass", "Cymbopogon citratus", "herbs", "tropical grass", 9, 13, "Full sun", "Even moisture", "Southeast Asia"],
  ["Bay Laurel", "Laurus nobilis", "herbs", "evergreen tree", 8, 11, "Full sun", "Moderate water", "Mediterranean"],
  ["Curry Leaf", "Murraya koenigii", "herbs", "small tree", 10, 13, "Full sun", "Moderate water", "South Asia"],
  ["Rose", "Rosa spp.", "flowers", "shrub", 4, 10, "Full sun", "Moderate water", "Northern Hemisphere"],
  ["Dahlia", "Dahlia pinnata", "flowers", "tuberous flower", 8, 11, "Full sun", "Even moisture", "Mexico"],
  ["Peony", "Paeonia lactiflora", "flowers", "perennial flower", 3, 8, "Full sun", "Moderate water", "East Asia"],
  ["Tulip", "Tulipa gesneriana", "flowers", "spring bulb", 3, 8, "Full sun", "Moderate water", "Central Asia"],
  ["Daffodil", "Narcissus pseudonarcissus", "flowers", "spring bulb", 3, 9, "Sun to part shade", "Moderate water", "Europe"],
  ["Iris", "Iris germanica", "flowers", "rhizome flower", 3, 9, "Full sun", "Low water", "Mediterranean"],
  ["Daylily", "Hemerocallis fulva", "flowers", "perennial flower", 3, 9, "Full sun", "Moderate water", "East Asia"],
  ["Coneflower", "Echinacea purpurea", "flowers", "perennial flower", 3, 9, "Full sun", "Low water", "North America"],
  ["Black-eyed Susan", "Rudbeckia hirta", "flowers", "perennial flower", 3, 9, "Full sun", "Low water", "North America"],
  ["Zinnia", "Zinnia elegans", "flowers", "annual flower", 9, 11, "Full sun", "Moderate water", "Mexico"],
  ["Marigold", "Tagetes erecta", "flowers", "annual flower", 9, 11, "Full sun", "Moderate water", "Mexico"],
  ["Sunflower", "Helianthus annuus", "flowers", "annual flower", 4, 10, "Full sun", "Moderate water", "North America"],
  ["Cosmos", "Cosmos bipinnatus", "flowers", "annual flower", 9, 11, "Full sun", "Low water", "Mexico"],
  ["Nasturtium", "Tropaeolum majus", "flowers", "annual flower", 8, 11, "Sun to part shade", "Moderate water", "South America"],
  ["Hydrangea", "Hydrangea macrophylla", "flowers", "flowering shrub", 5, 9, "Part shade", "Moist soil", "East Asia"],
  ["Camellia", "Camellia japonica", "flowers", "evergreen shrub", 7, 10, "Part shade", "Even moisture", "East Asia"],
  ["Azalea", "Rhododendron spp.", "flowers", "flowering shrub", 5, 9, "Part shade", "Moist acidic soil", "Asia"],
  ["Bougainvillea", "Bougainvillea glabra", "flowers", "flowering vine", 9, 13, "Full sun", "Low water", "South America"],
  ["Hibiscus", "Hibiscus rosa-sinensis", "flowers", "tropical shrub", 9, 13, "Full sun", "Even moisture", "East Asia"],
  ["Passionflower", "Passiflora incarnata", "flowers", "flowering vine", 6, 10, "Full sun", "Moderate water", "Americas"],
  ["Apple", "Malus domestica", "fruits", "fruit tree", 3, 8, "Full sun", "Moderate water", "Central Asia"],
  ["Pear", "Pyrus communis", "fruits", "fruit tree", 4, 9, "Full sun", "Moderate water", "Europe"],
  ["Asian Pear", "Pyrus pyrifolia", "fruits", "fruit tree", 5, 9, "Full sun", "Moderate water", "East Asia"],
  ["Peach", "Prunus persica", "fruits", "fruit tree", 5, 9, "Full sun", "Moderate water", "China"],
  ["Nectarine", "Prunus persica var. nucipersica", "fruits", "fruit tree", 5, 9, "Full sun", "Moderate water", "China"],
  ["Apricot", "Prunus armeniaca", "fruits", "fruit tree", 5, 8, "Full sun", "Low water", "Central Asia"],
  ["Sweet Cherry", "Prunus avium", "fruits", "fruit tree", 5, 8, "Full sun", "Moderate water", "Europe"],
  ["Sour Cherry", "Prunus cerasus", "fruits", "fruit tree", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Plum", "Prunus domestica", "fruits", "fruit tree", 4, 9, "Full sun", "Moderate water", "Europe"],
  ["Fig", "Ficus carica", "fruits", "fruit tree", 7, 11, "Full sun", "Low water", "Western Asia"],
  ["Pomegranate", "Punica granatum", "fruits", "fruit shrub", 7, 11, "Full sun", "Low water", "Iran"],
  ["Persimmon", "Diospyros kaki", "fruits", "fruit tree", 7, 10, "Full sun", "Moderate water", "East Asia"],
  ["American Persimmon", "Diospyros virginiana", "fruits", "fruit tree", 4, 9, "Full sun", "Low water", "North America"],
  ["Jujube", "Ziziphus jujuba", "fruits", "fruit tree", 6, 10, "Full sun", "Low water", "China"],
  ["Mulberry", "Morus alba", "fruits", "fruit tree", 4, 9, "Full sun", "Moderate water", "Asia"],
  ["Pecan", "Carya illinoinensis", "fruits", "nut tree", 6, 9, "Full sun", "Moderate water", "North America"],
  ["Almond", "Prunus dulcis", "fruits", "nut tree", 7, 10, "Full sun", "Low water", "Western Asia"],
  ["Hazelnut", "Corylus avellana", "fruits", "nut shrub", 4, 9, "Full sun", "Moderate water", "Europe"],
  ["Blueberry", "Vaccinium corymbosum", "fruits", "berry shrub", 4, 8, "Full sun", "Moist acidic soil", "North America"],
  ["Raspberry", "Rubus idaeus", "fruits", "cane fruit", 3, 8, "Full sun", "Even moisture", "Eurasia"],
  ["Blackberry", "Rubus fruticosus", "fruits", "cane fruit", 5, 10, "Full sun", "Moderate water", "Eurasia"],
  ["Grape", "Vitis vinifera", "fruits", "fruiting vine", 6, 10, "Full sun", "Low water", "Mediterranean"],
  ["Kiwi", "Actinidia deliciosa", "fruits", "fruiting vine", 7, 10, "Full sun", "Moderate water", "China"],
  ["Hardy Kiwi", "Actinidia arguta", "fruits", "fruiting vine", 4, 8, "Full sun", "Moderate water", "East Asia"],
  ["Olive", "Olea europaea", "fruits", "fruit tree", 8, 11, "Full sun", "Low water", "Mediterranean"],
  ["Yuzu", "Citrus junos", "fruits", "citrus tree", 8, 11, "Full sun", "Moderate water", "East Asia"],
  ["Meyer Lemon", "Citrus x meyeri", "fruits", "citrus tree", 9, 12, "Full sun", "Moderate water", "China"],
  ["Loquat", "Eriobotrya japonica", "fruits", "fruit tree", 8, 11, "Full sun", "Moderate water", "East Asia"],
  ["Tomato", "Solanum lycopersicum", "vegetables", "warm-season annual", 10, 13, "Full sun", "Even moisture", "South America"],
  ["Pepper", "Capsicum annuum", "vegetables", "warm-season annual", 9, 13, "Full sun", "Even moisture", "Americas"],
  ["Eggplant", "Solanum melongena", "vegetables", "warm-season annual", 9, 13, "Full sun", "Even moisture", "South Asia"],
  ["Cucumber", "Cucumis sativus", "vegetables", "annual vine", 9, 13, "Full sun", "Even moisture", "South Asia"],
  ["Zucchini", "Cucurbita pepo", "vegetables", "annual squash", 9, 13, "Full sun", "Even moisture", "Americas"],
  ["Winter Squash", "Cucurbita maxima", "vegetables", "annual squash", 8, 12, "Full sun", "Moderate water", "South America"],
  ["Pumpkin", "Cucurbita pepo", "vegetables", "annual squash", 8, 12, "Full sun", "Moderate water", "North America"],
  ["Okra", "Abelmoschus esculentus", "vegetables", "warm-season annual", 9, 13, "Full sun", "Moderate water", "Africa"],
  ["Sweet Corn", "Zea mays", "vegetables", "annual grass", 4, 10, "Full sun", "Even moisture", "Mexico"],
  ["Bean", "Phaseolus vulgaris", "vegetables", "annual legume", 7, 11, "Full sun", "Moderate water", "Americas"],
  ["Pea", "Pisum sativum", "vegetables", "cool-season annual", 3, 8, "Full sun", "Even moisture", "Mediterranean"],
  ["Lettuce", "Lactuca sativa", "vegetables", "leafy annual", 3, 9, "Part shade", "Even moisture", "Mediterranean"],
  ["Spinach", "Spinacia oleracea", "vegetables", "leafy annual", 3, 8, "Sun to part shade", "Even moisture", "Western Asia"],
  ["Kale", "Brassica oleracea var. sabellica", "vegetables", "leafy biennial", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Cabbage", "Brassica oleracea var. capitata", "vegetables", "cool-season biennial", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Broccoli", "Brassica oleracea var. italica", "vegetables", "cool-season annual", 3, 9, "Full sun", "Even moisture", "Mediterranean"],
  ["Cauliflower", "Brassica oleracea var. botrytis", "vegetables", "cool-season annual", 3, 9, "Full sun", "Even moisture", "Mediterranean"],
  ["Carrot", "Daucus carota subsp. sativus", "vegetables", "root crop", 3, 9, "Full sun", "Even moisture", "Eurasia"],
  ["Beet", "Beta vulgaris", "vegetables", "root crop", 3, 10, "Full sun", "Even moisture", "Mediterranean"],
  ["Radish", "Raphanus sativus", "vegetables", "root crop", 3, 10, "Sun to part shade", "Even moisture", "Asia"],
  ["Turnip", "Brassica rapa subsp. rapa", "vegetables", "root crop", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Potato", "Solanum tuberosum", "vegetables", "tuber crop", 3, 10, "Full sun", "Moderate water", "Andes"],
  ["Sweet Potato", "Ipomoea batatas", "vegetables", "tuber vine", 8, 12, "Full sun", "Moderate water", "Central America"],
  ["Onion", "Allium cepa", "vegetables", "bulb crop", 3, 10, "Full sun", "Moderate water", "Central Asia"],
  ["Garlic", "Allium sativum", "vegetables", "bulb crop", 3, 9, "Full sun", "Low water", "Central Asia"],
  ["Artichoke", "Cynara cardunculus var. scolymus", "vegetables", "perennial vegetable", 7, 10, "Full sun", "Moderate water", "Mediterranean"],
  ["Asparagus", "Asparagus officinalis", "vegetables", "perennial vegetable", 3, 9, "Full sun", "Moderate water", "Europe"],
  ["Rhubarb", "Rheum rhabarbarum", "vegetables", "perennial vegetable", 3, 8, "Full sun", "Even moisture", "Asia"],
  ["Hosta", "Hosta spp.", "decorative", "shade perennial", 3, 9, "Part shade", "Even moisture", "East Asia"],
  ["Boxwood", "Buxus sempervirens", "decorative", "evergreen shrub", 5, 9, "Sun to part shade", "Moderate water", "Europe"],
  ["Japanese Maple", "Acer palmatum", "decorative", "ornamental tree", 5, 8, "Part shade", "Even moisture", "East Asia"],
  ["Red Maple", "Acer rubrum", "decorative", "shade tree", 3, 9, "Full sun", "Moist soil", "North America"],
  ["Dogwood", "Cornus florida", "decorative", "flowering tree", 5, 9, "Part shade", "Moderate water", "North America"],
  ["Magnolia", "Magnolia grandiflora", "decorative", "evergreen tree", 7, 10, "Full sun", "Moderate water", "North America"],
  ["Crape Myrtle", "Lagerstroemia indica", "decorative", "flowering tree", 7, 10, "Full sun", "Low water", "East Asia"],
  ["Redbud", "Cercis canadensis", "decorative", "flowering tree", 4, 9, "Sun to part shade", "Moderate water", "North America"],
  ["Serviceberry", "Amelanchier alnifolia", "decorative", "small tree", 3, 8, "Full sun", "Moderate water", "North America"],
  ["Lilac", "Syringa vulgaris", "decorative", "flowering shrub", 3, 8, "Full sun", "Moderate water", "Balkans"],
  ["Forsythia", "Forsythia x intermedia", "decorative", "flowering shrub", 5, 9, "Full sun", "Moderate water", "East Asia"],
  ["Juniper", "Juniperus communis", "decorative", "evergreen shrub", 3, 9, "Full sun", "Low water", "Northern Hemisphere"],
  ["Arborvitae", "Thuja occidentalis", "decorative", "evergreen tree", 3, 8, "Full sun", "Moderate water", "North America"],
  ["Ornamental Grass", "Miscanthus sinensis", "decorative", "grass", 5, 9, "Full sun", "Low water", "East Asia"],
  ["Bamboo", "Phyllostachys aurea", "decorative", "running bamboo", 7, 11, "Sun to part shade", "Moderate water", "China"],
  ["Agave", "Agave americana", "decorative", "succulent", 8, 11, "Full sun", "Low water", "Mexico"],
  ["Yucca", "Yucca filamentosa", "decorative", "succulent shrub", 4, 10, "Full sun", "Low water", "North America"],
  ["Canna Lily", "Canna indica", "decorative", "tropical perennial", 8, 11, "Full sun", "Moist soil", "Americas"],
  ["Elephant Ear", "Colocasia esculenta", "decorative", "tropical foliage", 8, 12, "Part shade", "Moist soil", "Southeast Asia"],
  ["Banana", "Musa basjoo", "decorative", "hardy tropical foliage", 5, 10, "Full sun", "Even moisture", "East Asia"]
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function climateProfile({ category, type, zoneMin, zoneMax, water, origin, formShift }) {
  const tropical = /Tropical|South Asia|Southeast Asia|Caribbean|Yucatan|Africa|Maritime/i.test(
    `${type} ${origin}`
  );
  const mediterranean = /Mediterranean|Iran|Western Asia|Central Asia/i.test(origin);
  const cool = zoneMax <= 8 || /cool|spring|cool-season|leafy|root/i.test(type);
  const heatBase = tropical ? 31 : mediterranean ? 29 : cool ? 24 : 27;
  const highMin = clamp(Math.round(heatBase - 8 + formShift), 12, 34);
  const highMax = clamp(Math.round(heatBase + 7 + formShift * 2), highMin + 4, 42);

  let humidityMin = 35;
  let humidityMax = 78;
  if (/Low water|succulent|arid|desert/i.test(`${water} ${type}`) || mediterranean) {
    humidityMin = 20;
    humidityMax = 62;
  }
  if (/Moist|Even moisture|humid|tropical|banana|citrus/i.test(`${water} ${type}`) || tropical) {
    humidityMin = 50;
    humidityMax = 92;
  }
  if (category === "vegetables") {
    humidityMin = Math.max(humidityMin, 40);
    humidityMax = Math.min(Math.max(humidityMax, 72), 88);
  }

  return {
    summerHighMinC: highMin,
    summerHighMaxC: highMax,
    humidityMin,
    humidityMax
  };
}

const plants = bases.flatMap((base, baseIndex) => {
  const [commonName, scientificName, category, type, zoneMin, zoneMax, sun, water, origin] = base;
  return forms.map((form, formIndex) => {
    const adjustedMin = clamp(zoneMin + Math.min(0, form.shift), 1, 13);
    const adjustedMax = clamp(zoneMax + Math.max(0, form.shift), 1, 13);
    const climate = climateProfile({
      category,
      type,
      zoneMin: adjustedMin,
      zoneMax: adjustedMax,
      water,
      origin,
      formShift: form.shift
    });
    return {
      id: `${category}-${baseIndex + 1}-${formIndex + 1}`,
      commonName: `${form.name} ${commonName}`,
      scientificName,
      category,
      type,
      zoneMin: adjustedMin,
      zoneMax: Math.max(adjustedMin, adjustedMax),
      sun,
      water,
      origin,
      ...climate,
      popularity: form.pop + (zoneMax - zoneMin)
    };
  });
});

await mkdir(new URL("../public/", import.meta.url), { recursive: true });
writeFileSync(
  new URL("../public/plants.json", import.meta.url),
  `${JSON.stringify(plants, null, 2)}\n`
);

console.log(`Generated ${plants.length} plant records.`);
