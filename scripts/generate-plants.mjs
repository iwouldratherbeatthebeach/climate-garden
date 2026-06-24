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

const originCountries = {
  "South Asia": ["IND", "PAK", "BGD", "LKA", "NPL", "BTN"],
  "Southeast Asia": ["THA", "VNM", "KHM", "LAO", "MMR", "MYS", "IDN", "PHL", "SGP", "BRN", "TLS"],
  Mediterranean: ["ESP", "PRT", "FRA", "ITA", "GRC", "TUR", "CYP", "MLT", "MAR", "DZA", "TUN", "EGY", "ISR", "LBN", "SYR", "HRV", "ALB", "MNE"],
  "Western Asia": ["TUR", "IRN", "IRQ", "SYR", "LBN", "ISR", "JOR", "ARM", "AZE", "GEO"],
  Eurasia: ["FRA", "DEU", "POL", "UKR", "RUS", "KAZ", "MNG"],
  "East Asia": ["CHN", "JPN", "KOR", "PRK", "MNG", "TWN"],
  Europe: ["GBR", "IRL", "FRA", "ESP", "PRT", "DEU", "ITA", "GRC", "POL", "NLD", "BEL", "CHE", "AUT", "CZE", "SVK", "HUN", "ROU", "BGR", "HRV", "SRB", "UKR"],
  "Northern Hemisphere": ["CAN", "USA", "GBR", "FRA", "DEU", "RUS", "CHN", "JPN"],
  Mexico: ["MEX"],
  "Central Asia": ["KAZ", "KGZ", "TJK", "TKM", "UZB", "AFG"],
  "North America": ["CAN", "USA", "MEX"],
  "South America": ["ARG", "BOL", "BRA", "CHL", "COL", "ECU", "GUY", "PRY", "PER", "SUR", "URY", "VEN"],
  Asia: ["CHN", "IND", "JPN", "KOR", "THA", "VNM", "IDN", "PHL", "MYS", "PAK", "IRN", "TUR", "KAZ"],
  Americas: ["CAN", "USA", "MEX", "BRA", "ARG", "CHL", "PER", "COL", "ECU", "BOL", "VEN", "GTM", "CRI", "CUB"],
  China: ["CHN"],
  Iran: ["IRN"],
  Africa: ["ZAF", "ETH", "KEN", "TZA", "UGA", "NGA", "GHA", "CMR", "AGO", "ZMB", "ZWE", "MOZ", "MDG"],
  Andes: ["COL", "ECU", "PER", "BOL", "CHL", "ARG"],
  "Central America": ["BLZ", "GTM", "HND", "SLV", "NIC", "CRI", "PAN"],
  Balkans: ["ALB", "BIH", "BGR", "HRV", "GRC", "MNE", "MKD", "ROU", "SRB", "SVN"]
};

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

const supplementalBases = [
  ["Lovage", "Levisticum officinale", "herbs", "perennial herb", 3, 8, "Sun to part shade", "Moist soil", "Europe"],
  ["Summer Savory", "Satureja hortensis", "herbs", "annual herb", 4, 10, "Full sun", "Low water", "Europe"],
  ["Winter Savory", "Satureja montana", "herbs", "perennial herb", 5, 9, "Full sun", "Low water", "Europe"],
  ["Caraway", "Carum carvi", "herbs", "biennial herb", 3, 8, "Full sun", "Moderate water", "Europe"],
  ["Angelica", "Angelica archangelica", "herbs", "biennial herb", 4, 7, "Part shade", "Moist soil", "Europe"],
  ["Borage", "Borago officinalis", "herbs", "annual herb", 3, 10, "Full sun", "Moderate water", "Mediterranean"],
  ["Hyssop", "Hyssopus officinalis", "herbs", "perennial herb", 4, 9, "Full sun", "Low water", "Europe"],
  ["Mugwort", "Artemisia vulgaris", "herbs", "perennial herb", 3, 9, "Full sun", "Low water", "Eurasia"],
  ["Yarrow", "Achillea millefolium", "herbs", "perennial herb", 3, 9, "Full sun", "Low water", "Europe"],
  ["Nettle", "Urtica dioica", "herbs", "perennial herb", 3, 10, "Sun to part shade", "Moist soil", "Europe"],
  ["Horseradish", "Armoracia rusticana", "herbs", "perennial herb", 2, 9, "Full sun", "Even moisture", "Europe"],
  ["Salad Burnet", "Sanguisorba minor", "herbs", "perennial herb", 4, 8, "Full sun", "Low water", "Europe"],
  ["Costmary", "Tanacetum balsamita", "herbs", "perennial herb", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Rue", "Ruta graveolens", "herbs", "woody herb", 4, 9, "Full sun", "Low water", "Europe"],
  ["Wormwood", "Artemisia absinthium", "herbs", "perennial herb", 4, 9, "Full sun", "Low water", "Europe"],
  ["Common Mallow", "Malva sylvestris", "herbs", "biennial herb", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Pot Marigold", "Calendula officinalis", "flowers", "annual flower", 3, 10, "Full sun", "Moderate water", "Europe"],
  ["Cornflower", "Centaurea cyanus", "flowers", "annual flower", 3, 9, "Full sun", "Low water", "Europe"],
  ["Poppy", "Papaver rhoeas", "flowers", "annual flower", 3, 9, "Full sun", "Low water", "Europe"],
  ["Sweet William", "Dianthus barbatus", "flowers", "biennial flower", 3, 9, "Full sun", "Moderate water", "Europe"],
  ["Garden Pink", "Dianthus plumarius", "flowers", "perennial flower", 3, 9, "Full sun", "Low water", "Europe"],
  ["Lupine", "Lupinus polyphyllus", "flowers", "perennial flower", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Foxglove", "Digitalis purpurea", "flowers", "biennial flower", 4, 9, "Part shade", "Moderate water", "Europe"],
  ["Hollyhock", "Alcea rosea", "flowers", "biennial flower", 3, 9, "Full sun", "Moderate water", "Europe"],
  ["Columbine", "Aquilegia vulgaris", "flowers", "perennial flower", 3, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Delphinium", "Delphinium elatum", "flowers", "perennial flower", 3, 7, "Full sun", "Even moisture", "Europe"],
  ["Bellflower", "Campanula persicifolia", "flowers", "perennial flower", 3, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Pasque Flower", "Pulsatilla vulgaris", "flowers", "perennial flower", 4, 8, "Full sun", "Low water", "Europe"],
  ["Primrose", "Primula vulgaris", "flowers", "perennial flower", 4, 8, "Part shade", "Moist soil", "Europe"],
  ["Cowslip", "Primula veris", "flowers", "perennial flower", 3, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Aster", "Aster amellus", "flowers", "perennial flower", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Oxeye Daisy", "Leucanthemum vulgare", "flowers", "perennial flower", 3, 8, "Full sun", "Low water", "Europe"],
  ["Tansy", "Tanacetum vulgare", "flowers", "perennial flower", 3, 8, "Full sun", "Low water", "Europe"],
  ["Globe Thistle", "Echinops ritro", "flowers", "perennial flower", 3, 9, "Full sun", "Low water", "Europe"],
  ["Sea Holly", "Eryngium planum", "flowers", "perennial flower", 4, 9, "Full sun", "Low water", "Europe"],
  ["Lily of the Valley", "Convallaria majalis", "flowers", "perennial flower", 3, 8, "Part shade", "Moist soil", "Europe"],
  ["Snowdrop", "Galanthus nivalis", "flowers", "spring bulb", 3, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Crocus", "Crocus vernus", "flowers", "spring bulb", 3, 8, "Full sun", "Moderate water", "Europe"],
  ["Grape Hyacinth", "Muscari armeniacum", "flowers", "spring bulb", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["European Cranberry", "Vaccinium oxycoccos", "fruits", "berry shrub", 2, 7, "Full sun", "Moist acidic soil", "Europe"],
  ["Red Currant", "Ribes rubrum", "fruits", "berry shrub", 3, 7, "Sun to part shade", "Even moisture", "Europe"],
  ["Black Currant", "Ribes nigrum", "fruits", "berry shrub", 3, 7, "Sun to part shade", "Even moisture", "Europe"],
  ["White Currant", "Ribes rubrum 'White Grape'", "fruits", "berry shrub", 3, 7, "Sun to part shade", "Even moisture", "Europe"],
  ["Gooseberry", "Ribes uva-crispa", "fruits", "berry shrub", 3, 8, "Sun to part shade", "Even moisture", "Europe"],
  ["Elderberry", "Sambucus nigra", "fruits", "fruit shrub", 4, 8, "Sun to part shade", "Moist soil", "Europe"],
  ["Sea Buckthorn", "Hippophae rhamnoides", "fruits", "fruit shrub", 3, 7, "Full sun", "Low water", "Europe"],
  ["Cornelian Cherry", "Cornus mas", "fruits", "fruit shrub", 4, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Quince", "Cydonia oblonga", "fruits", "fruit tree", 5, 9, "Full sun", "Moderate water", "Western Asia"],
  ["Medlar", "Mespilus germanica", "fruits", "fruit tree", 5, 8, "Full sun", "Moderate water", "Europe"],
  ["European Chestnut", "Castanea sativa", "fruits", "nut tree", 5, 8, "Full sun", "Moderate water", "Europe"],
  ["English Walnut", "Juglans regia", "fruits", "nut tree", 5, 9, "Full sun", "Moderate water", "Europe"],
  ["Damson Plum", "Prunus domestica subsp. insititia", "fruits", "fruit tree", 5, 8, "Full sun", "Moderate water", "Europe"],
  ["Mirabelle Plum", "Prunus domestica subsp. syriaca", "fruits", "fruit tree", 5, 8, "Full sun", "Moderate water", "Europe"],
  ["Wild Strawberry", "Fragaria vesca", "fruits", "perennial fruit", 4, 8, "Sun to part shade", "Even moisture", "Europe"],
  ["Lingonberry", "Vaccinium vitis-idaea", "fruits", "berry shrub", 2, 7, "Full sun", "Moist acidic soil", "Eurasia"],
  ["Aronia", "Aronia melanocarpa", "fruits", "fruit shrub", 3, 8, "Full sun", "Moderate water", "Europe"],
  ["Kohlrabi", "Brassica oleracea Gongylodes Group", "vegetables", "cool-season biennial", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Brussels Sprouts", "Brassica oleracea Gemmifera Group", "vegetables", "cool-season biennial", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Savoy Cabbage", "Brassica oleracea var. sabauda", "vegetables", "cool-season biennial", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Celeriac", "Apium graveolens var. rapaceum", "vegetables", "root crop", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Celery", "Apium graveolens", "vegetables", "biennial vegetable", 3, 9, "Full sun", "Moist soil", "Europe"],
  ["Parsnip", "Pastinaca sativa", "vegetables", "root crop", 2, 9, "Full sun", "Even moisture", "Europe"],
  ["Leek", "Allium ampeloprasum var. porrum", "vegetables", "biennial vegetable", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Fava Bean", "Vicia faba", "vegetables", "cool-season annual", 3, 8, "Full sun", "Even moisture", "Mediterranean"],
  ["Runner Bean", "Phaseolus coccineus", "vegetables", "annual vine", 7, 11, "Full sun", "Even moisture", "Central America"],
  ["Jerusalem Artichoke", "Helianthus tuberosus", "vegetables", "perennial vegetable", 3, 9, "Full sun", "Moderate water", "North America"],
  ["Salsify", "Tragopogon porrifolius", "vegetables", "root crop", 4, 9, "Full sun", "Even moisture", "Europe"],
  ["Scorzonera", "Scorzonera hispanica", "vegetables", "root crop", 4, 9, "Full sun", "Even moisture", "Europe"],
  ["Rutabaga", "Brassica napus var. napobrassica", "vegetables", "root crop", 3, 9, "Full sun", "Even moisture", "Europe"],
  ["Broadleaf Endive", "Cichorium endivia", "vegetables", "leafy annual", 4, 9, "Sun to part shade", "Even moisture", "Mediterranean"],
  ["Radicchio", "Cichorium intybus var. foliosum", "vegetables", "leafy biennial", 4, 9, "Full sun", "Even moisture", "Europe"],
  ["Lamb's Lettuce", "Valerianella locusta", "vegetables", "cool-season annual", 3, 8, "Sun to part shade", "Even moisture", "Europe"],
  ["Garden Cress", "Lepidium sativum", "vegetables", "cool-season annual", 3, 9, "Sun to part shade", "Even moisture", "Europe"],
  ["European Beech", "Fagus sylvatica", "decorative", "shade tree", 4, 7, "Full sun", "Moderate water", "Europe"],
  ["English Oak", "Quercus robur", "decorative", "shade tree", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Sessile Oak", "Quercus petraea", "decorative", "shade tree", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Silver Birch", "Betula pendula", "decorative", "shade tree", 2, 7, "Full sun", "Moderate water", "Europe"],
  ["European Hornbeam", "Carpinus betulus", "decorative", "shade tree", 4, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Littleleaf Linden", "Tilia cordata", "decorative", "shade tree", 3, 8, "Full sun", "Moderate water", "Europe"],
  ["Norway Maple", "Acer platanoides", "decorative", "shade tree", 3, 7, "Full sun", "Moderate water", "Europe"],
  ["European Larch", "Larix decidua", "decorative", "conifer tree", 3, 6, "Full sun", "Moderate water", "Europe"],
  ["Norway Spruce", "Picea abies", "decorative", "conifer tree", 2, 7, "Full sun", "Moderate water", "Europe"],
  ["Scots Pine", "Pinus sylvestris", "decorative", "conifer tree", 2, 7, "Full sun", "Low water", "Eurasia"],
  ["European Yew", "Taxus baccata", "decorative", "evergreen tree", 5, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["European Rowan", "Sorbus aucuparia", "decorative", "small tree", 3, 7, "Full sun", "Moderate water", "Europe"],
  ["European Viburnum", "Viburnum opulus", "decorative", "flowering shrub", 3, 8, "Sun to part shade", "Moist soil", "Europe"],
  ["Common Hazel", "Corylus avellana", "decorative", "large shrub", 4, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["European Spindle", "Euonymus europaeus", "decorative", "large shrub", 4, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Common Broom", "Cytisus scoparius", "decorative", "flowering shrub", 5, 8, "Full sun", "Low water", "Europe"],
  ["Heather", "Calluna vulgaris", "decorative", "evergreen shrub", 4, 7, "Full sun", "Moist acidic soil", "Europe"],
  ["European Ivy", "Hedera helix", "decorative", "evergreen vine", 5, 9, "Part shade", "Moderate water", "Europe"],
  ["Honeysuckle", "Lonicera periclymenum", "decorative", "flowering vine", 4, 8, "Sun to part shade", "Moderate water", "Europe"],
  ["Traveller's Joy", "Clematis vitalba", "decorative", "flowering vine", 4, 8, "Full sun", "Moderate water", "Europe"],
  ["Feather Reed Grass", "Calamagrostis acutiflora", "decorative", "grass", 4, 9, "Full sun", "Moderate water", "Europe"],
  ["Blue Fescue", "Festuca glauca", "decorative", "grass", 4, 8, "Full sun", "Low water", "Europe"]
];

const allBases = [...bases, ...supplementalBases];

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

const plants = allBases.flatMap((base, baseIndex) => {
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
      baseName: commonName,
      climateForm: form.name,
      scientificName,
      category,
      type,
      zoneMin: adjustedMin,
      zoneMax: Math.max(adjustedMin, adjustedMax),
      sun,
      water,
      origin,
      originCountries: originCountries[origin] ?? [],
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
