import { applyLocale } from "@/lib/game/variants";
import type { CategoryId, Locale } from "@/lib/game/types";

export type CategoryInfo = {
  id: CategoryId;
  label: string;
  description: string;
  hint: string;
  properNouns: boolean;
  words: string[];
};

const lists = {
  nature: [
    "sun", "sea", "sky", "mud", "bog", "dew", "ice", "fog", "ash", "oak", "elm", "ivy",
    "tree", "rain", "snow", "wind", "leaf", "rock", "lake", "pond", "hill", "cave", "sand", "soil", "moss", "fern", "pine", "reed", "dune", "reef", "wave", "mist", "fire",
    "river", "ocean", "storm", "cloud", "stone", "cliff", "beach", "shore", "creek", "brook", "frost", "flame", "earth", "water", "grove", "oasis", "fjord", "delta", "ridge", "coast",
    "forest", "desert", "canyon", "valley", "meadow", "island", "stream", "spring", "summer", "winter", "autumn", "nature", "jungle", "lagoon", "geyser", "cavern", "summit", "marsh", "swamp", "tundra", "prairie",
    "volcano", "glacier", "rainbow", "thunder", "boulder", "pebble", "seaside", "woodland", "hillside",
    "waterfall", "lightning", "hurricane", "avalanche", "sandstone", "tributary", "limestone", "grassland",
    "rainforest", "wilderness", "whirlpool", "cloudburst",
  ],
  animals: [
    "cat", "dog", "fox", "bat", "ant", "bee", "elk", "ape", "yak", "rat", "pig", "cow", "ram", "ewe", "pup", "cub", "hog", "hen",
    "lion", "bear", "wolf", "deer", "frog", "goat", "seal", "crab", "mole", "hare", "lynx", "puma", "orca", "toad", "newt", "ibex", "boar", "mule", "bull", "calf", "fawn", "lamb", "mare", "colt", "pony", "fish", "moth", "wasp", "flea", "worm", "slug",
    "tiger", "horse", "zebra", "whale", "shark", "mouse", "sheep", "snake", "moose", "otter", "rhino", "panda", "koala", "camel", "bison", "hyena", "lemur", "llama", "tapir", "viper", "cobra", "squid", "prawn", "snail", "puppy", "kitty",
    "badger", "beaver", "rabbit", "monkey", "donkey", "turtle", "lizard", "gecko", "iguana", "walrus", "jaguar", "cougar", "bobcat", "gopher", "marmot", "ferret", "weasel", "possum", "wombat", "dingo", "buffalo",
    "giraffe", "gorilla", "cheetah", "panther", "leopard", "meerkat", "raccoon", "dolphin", "octopus", "lobster", "hamster", "terrier",
    "squirrel", "hedgehog", "elephant", "kangaroo", "platypus", "aardvark", "goldfish",
    "porcupine", "alligator", "crocodile", "armadillo", "chameleon", "butterfly", "dragonfly", "salamander",
    "chimpanzee", "rhinoceros", "wildebeest", "orangutan",
  ],
  birds: [
    "owl", "emu", "tit", "jay", "crow", "dove", "swan", "duck", "gull", "wren", "lark", "hawk",
    "robin", "eagle", "heron", "stork", "goose", "finch", "quail", "raven", "macaw", "crane",
    "sparrow", "penguin", "falcon", "condor", "parrot", "pigeon", "turkey", "osprey", "puffin", "toucan", "canary", "mallard", "peacock",
    "ostrich", "pelican", "buzzard", "kestrel", "skylark", "bluejay", "pheasant",
    "flamingo", "starling", "swallow", "vulture", "seagull", "bluebird", "cardinal",
    "albatross", "blackbird", "goldfinch", "kingfisher", "woodpecker",
  ],
  technology: [
    "app", "web", "net", "cpu", "ram", "gpu", "url", "bot", "log", "api",
    "code", "data", "chip", "byte", "disk", "file", "link", "site", "blog", "wifi",
    "cloud", "pixel", "robot", "laser", "modem", "cable", "mouse", "email", "cache", "debug", "codec", "linux",
    "screen", "laptop", "server", "router", "sensor", "drone", "tablet", "mobile", "webcam", "binary", "python", "portal",
    "browser", "network", "digital", "monitor", "printer", "scanner", "speaker", "program", "desktop", "android",
    "keyboard", "software", "hardware", "internet", "database", "firewall", "compiler", "ethernet",
    "algorithm", "processor", "bandwidth", "interface",
    "smartphone", "encryption", "blockchain", "javascript",
  ],
  science: [
    "lab", "dna", "ion",
    "atom", "cell", "gene", "acid", "base", "mass", "heat", "wave", "lens", "math", "test",
    "force", "prism", "radar", "sonar", "virus", "flask", "laser", "orbit", "comet",
    "energy", "matter", "oxygen", "carbon", "helium", "sodium", "copper", "silver", "photon", "fossil", "magnet", "theory", "method", "sample", "enzyme", "beaker", "nucleus",
    "biology", "physics", "geology", "climate", "gravity", "protein", "calcium", "lithium", "silicon", "uranium", "quantum", "isotope", "solvent", "reagent", "vaccine", "neutron", "proton", "electron", "molecule", "bacteria",
    "astronomy", "chemistry", "nitrogen", "hydrogen", "microscope", "evolution", "experiment", "radiation", "laboratory",
    "hypothesis", "molecule", "telescope", "scientist", "particles",
  ],
  food: [
    "pie", "tea", "ham", "egg", "nut", "jam", "pea", "fig", "yam", "bun", "ale", "rum", "gin",
    "soup", "cake", "rice", "milk", "wine", "beer", "soda", "cola", "pear", "plum", "kiwi", "lime", "corn", "bean", "beef", "pork", "fish", "salt", "taco", "stew", "oven",
    "bread", "apple", "grape", "peach", "mango", "lemon", "melon", "berry", "pasta", "pizza", "salad", "steak", "sauce", "sugar", "honey", "cream", "bacon", "olive", "flour", "yeast", "syrup", "juice", "cider", "cocoa", "latte", "mocha", "bagel", "donut", "sushi", "curry", "ramen", "cheese", "butter", "yogurt", "coffee", "orange", "banana", "tomato", "potato", "carrot", "onion", "garlic", "pepper", "cookie", "noodle", "cereal", "waffle", "pastry", "shrimp", "salmon", "turkey",
    "biscuit", "chicken", "mustard", "ketchup", "vinegar", "vanilla", "coconut", "avocado", "spinach", "lettuce", "cabbage", "pumpkin", "apricot", "pretzel", "popcorn", "oatmeal", "seafood", "lobster", "sausage", "pancake", "cinnamon",
    "broccoli", "cucumber", "mushroom", "eggplant", "zucchini", "sandwich", "meatball",
    "chocolate", "pineapple", "spaghetti", "hamburger", "asparagus", "blueberry", "raspberry",
    "strawberry", "watermelon", "blackberry",
  ],
  sports: [
    "run", "gym", "ski", "box",
    "golf", "ball", "team", "goal", "kick", "surf", "dive", "yoga", "swim",
    "tennis", "score", "match", "court", "field", "track", "coach", "medal", "rugby", "hockey",
    "soccer", "boxing", "racing", "trophy", "skiing", "sailing", "fencing", "rowing", "jockey", "sprint", "athlete",
    "cricket", "cycling", "archery", "bowling", "surfing", "baseball", "football", "marathon", "stadium", "referee",
    "wrestling", "volleyball", "badminton", "basketball", "gymnasium",
    "gymnastics", "skateboard",
  ],
  countries: [
    "usa", "mali", "chad", "laos", "oman", "fiji", "togo",
    "peru", "cuba", "iran", "iraq", "guam", "niue",
    "spain", "italy", "china", "india", "japan", "egypt", "kenya", "ghana", "chile", "nepal", "yemen", "sudan", "libya", "qatar", "syria", "haiti", "samoa", "malta", "palau", "nauru", "tonga", "benin", "gabon", "congo", "niger",
    "france", "brazil", "canada", "mexico", "greece", "sweden", "norway", "poland", "turkey", "israel", "jordan", "kuwait", "bhutan", "taiwan", "cyprus", "serbia", "angola", "zambia", "rwanda", "uganda", "panama", "belize", "guyana",
    "germany", "belgium", "denmark", "finland", "hungary", "ireland", "iceland", "austria", "croatia", "ukraine", "romania", "algeria", "morocco", "tunisia", "nigeria", "senegal", "jamaica", "bahamas", "ecuador", "uruguay", "bolivia", "vietnam", "myanmar", "georgia", "armenia", "albania", "andorra", "belarus", "moldova", "czechia",
    "portugal", "slovakia", "slovenia", "bulgaria", "pakistan", "mongolia", "tanzania", "zimbabwe", "botswana", "cameroon", "honduras", "colombia", "paraguay", "malaysia", "cambodia", "maldives", "barbados", "dominica", "kiribati", "australia", "argentina", "indonesia", "venezuela",
    "guatemala", "nicaragua", "singapore", "lithuania", "greenland", "mauritius",
    "kazakhstan", "azerbaijan", "bangladesh", "madagascar", "mozambique", "kyrgyzstan", "uzbekistan", "tajikistan", "montenegro", "luxembourg", "seychelles", "mauritania", "antarctica", "micronesia",
  ],
  geography: [
    "bay", "cape", "gulf", "alps", "gobi", "nile",
    "asia", "city", "town", "port", "reef", "east", "west",
    "andes", "delta", "basin", "atlas", "globe", "world", "north", "south", "taiga", "sahara", "amazon", "thames", "danube", "europe", "africa", "arctic", "indian", "island", "desert", "ocean", "river", "coast", "beach", "valley", "canyon",
    "pacific", "amazon", "yangtze", "rockies", "outback", "isthmus", "plateau", "equator", "capital", "continent", "steppe", "pampas", "fjords", "region", "border",
    "atlantic", "himalaya", "meridian", "latitude", "everest",
    "peninsula", "longitude", "greenland", "caribbean",
    "archipelago", "hemisphere",
  ],
  movies: [
    "her", "saw", "elf", "big", "red", "fly", "kin", "ray",
    "jaws", "heat", "thor", "coco", "soul", "dune", "bolt", "babe", "cars", "argo", "juno", "milk",
    "alien", "rocky", "shrek", "moana", "mulan", "bambi", "dumbo", "brave", "joker", "tenet",
    "avatar", "frozen", "batman", "matrix", "hobbit", "skyfall", "psycho", "hamlet", "platoon",
    "aladdin", "tangled", "encanto", "gravity", "arrival", "birdman", "amadeus",
    "whiplash", "parasite",
    "inception", "gladiator", "pinocchio", "chinatown", "moonlight", "spotlight", "elemental",
    "cinderella", "casablanca", "goodfellas", "braveheart", "titanic",
  ],
  education: [
    "pen", "book", "exam", "test", "read", "math",
    "class", "learn", "study", "essay", "pupil", "tutor", "grade", "notes",
    "school", "pencil", "lesson", "campus", "degree", "thesis", "lecture", "seminar", "history", "science", "biology", "grammar", "library", "college", "teacher", "student",
    "algebra", "spelling", "homework", "textbook", "research", "semester", "language", "literacy",
    "chemistry", "geography", "professor", "classroom", "knowledge",
    "education", "university", "curriculum", "dictionary",
    "scholarship", "laboratory",
  ],
  music: [
    "rap", "pop", "ode",
    "jazz", "rock", "song", "tune", "beat", "bass", "drum", "folk", "soul", "punk", "harp", "note",
    "blues", "piano", "flute", "opera", "tempo", "chord", "scale", "brass", "cello", "banjo", "organ", "lyric", "disco", "salsa", "tango", "waltz", "choir", "tenor", "alto", "album", "genre", "melody", "rhythm",
    "violin", "guitar", "drums", "chorus", "singer", "ballad", "anthem", "sonata", "octave",
    "soprano", "symphony", "orchestra", "composer", "concerto", "trombone", "clarinet", "harmonic",
    "harmonica", "saxophone",
  ],
  space: [
    "sun", "sky", "star",
    "moon", "mars", "nasa", "orbit", "comet", "earth", "venus", "pluto",
    "saturn", "nebula", "galaxy", "cosmos", "meteor", "rocket", "planet", "lunar", "solar", "crater", "aurora", "zodiac", "quasar", "pulsar",
    "jupiter", "mercury", "uranus", "neptune", "asteroid", "eclipse", "gravity", "cosmos", "shuttle", "capsule",
    "meteorite", "telescope", "astronaut", "satellite", "universe", "starlight", "supernova",
    "constellation", "interstellar",
  ],
  plants: [
    "oak", "elm", "ash", "ivy", "bud", "sap", "yam",
    "tree", "fern", "moss", "vine", "rose", "lily", "iris", "palm", "pine", "reed", "herb", "aloe", "sage", "mint", "leaf", "root", "stem", "seed",
    "bloom", "petal", "tulip", "daisy", "poppy", "peony", "cactus", "bamboo", "willow", "maple", "cedar", "birch", "basil", "clove", "grass", "shrub", "wheat", "maize", "barley",
    "orchid", "spruce", "clover", "thyme", "fennel", "ginger", "kelp", "algae", "hedge",
    "redwood", "sequoia", "lavender", "rosemary", "jasmine", "heather", "parsley", "oregano", "seaweed", "dandelion",
    "magnolia", "hibiscus", "sunflower", "cilantro", "turmeric",
    "blueberry",
  ],
  objects: [
    "key", "cup", "pen", "bag", "hat", "bed", "mug", "pan", "pot", "lid", "fan",
    "lamp", "desk", "door", "book", "shoe", "coat", "ring", "coin", "card", "lock", "bell", "rope", "tool", "sofa", "oven",
    "chair", "table", "phone", "clock", "watch", "spoon", "knife", "plate", "glass", "towel", "soap", "brush", "couch", "stove", "shelf", "frame", "purse", "scarf",
    "mirror", "pillow", "window", "bottle", "candle", "basket", "bucket", "ladder", "hammer", "wallet", "camera", "laptop", "kettle", "fridge", "remote", "button", "zipper", "needle", "thread", "sponge", "drawer", "closet", "hanger", "carpet", "curtain", "blanket",
    "toaster", "blender", "freezer", "battery", "charger", "scissors", "notebook", "envelope", "calendar", "suitcase", "backpack", "umbrella",
    "microwave", "headphone",
    "screwdriver",
  ],
} satisfies Record<Exclude<CategoryId, "random">, string[]>;

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  random: {
    id: "random",
    label: "Random",
    description: "A general English word from the selected difficulty.",
    hint: "This puzzle is not tied to a specialist theme.",
    properNouns: false,
    words: [],
  },
  nature: {
    id: "nature",
    label: "Nature",
    description: "Landscapes, weather, and the outdoors.",
    hint: "Think about landscapes, weather, or the natural world.",
    properNouns: false,
    words: lists.nature,
  },
  animals: {
    id: "animals",
    label: "Animals",
    description: "Creatures from land and sea, excluding the bird list.",
    hint: "The answer is a living animal.",
    properNouns: false,
    words: lists.animals,
  },
  birds: {
    id: "birds",
    label: "Birds",
    description: "Birds you might find in a field guide.",
    hint: "The answer is a bird.",
    properNouns: false,
    words: lists.birds,
  },
  technology: {
    id: "technology",
    label: "Technology",
    description: "Computing, devices, and digital vocabulary.",
    hint: "Think about computers, networks, or devices.",
    properNouns: false,
    words: lists.technology,
  },
  science: {
    id: "science",
    label: "Science",
    description: "Labs, matter, and scientific ideas.",
    hint: "The answer comes from science.",
    properNouns: false,
    words: lists.science,
  },
  food: {
    id: "food",
    label: "Food & Drinks",
    description: "Meals, ingredients, and drinks.",
    hint: "Think about something you could eat or drink.",
    properNouns: false,
    words: lists.food,
  },
  sports: {
    id: "sports",
    label: "Sports",
    description: "Games, matches, and athletic words.",
    hint: "The answer is connected to sports.",
    properNouns: false,
    words: lists.sports,
  },
  countries: {
    id: "countries",
    label: "Countries",
    description: "Country names. Proper nouns are allowed in this category.",
    hint: "The answer is a country name.",
    properNouns: true,
    words: lists.countries,
  },
  geography: {
    id: "geography",
    label: "Geography",
    description: "Places, landforms, and map vocabulary.",
    hint: "Think about places, landforms, or maps.",
    properNouns: true,
    words: lists.geography,
  },
  movies: {
    id: "movies",
    label: "Movies & Entertainment",
    description: "One-word film titles and entertainment words. Proper nouns are allowed.",
    hint: "The answer is a one-word film title or entertainment word.",
    properNouns: true,
    words: lists.movies,
  },
  education: {
    id: "education",
    label: "Education",
    description: "School, study, and learning.",
    hint: "The answer belongs in a classroom or a course of study.",
    properNouns: false,
    words: lists.education,
  },
  music: {
    id: "music",
    label: "Music",
    description: "Instruments, genres, and musical terms.",
    hint: "Think about music, an instrument, or a song.",
    properNouns: false,
    words: lists.music,
  },
  space: {
    id: "space",
    label: "Space",
    description: "Planets, stars, and spaceflight.",
    hint: "The answer is connected to space.",
    properNouns: false,
    words: lists.space,
  },
  plants: {
    id: "plants",
    label: "Plants",
    description: "Trees, flowers, and growing things.",
    hint: "The answer is a plant or a part of one.",
    properNouns: false,
    words: lists.plants,
  },
  objects: {
    id: "objects",
    label: "Everyday Objects",
    description: "Things you might find around a home.",
    hint: "The answer is a familiar object.",
    properNouns: false,
    words: lists.objects,
  },
};

export const CATEGORY_ORDER = Object.keys(CATEGORIES) as CategoryId[];

export function wordsForCategory(id: CategoryId, length: number, locale: Locale) {
  if (id === "random") return [];
  const localized = CATEGORIES[id].words.map((word) => applyLocale(word, locale));
  return [...new Set(localized.filter((word) => word.length === length))].sort();
}

export function categoryHasLength(id: CategoryId, length: number, locale: Locale) {
  if (id === "random") return true;
  return wordsForCategory(id, length, locale).length > 0;
}
