/**
 * Replace these values to match your exported YOLO ONNX model.
 * Class order MUST match the training dataset / YAML `names` list.
 */
export const INPUT_WIDTH = 640;
export const INPUT_HEIGHT = 640;
export const CONFIDENCE_THRESHOLD = 0.4;
export const IOU_THRESHOLD = 0.45;

/** Stretch resize to INPUT_WIDTH x INPUT_HEIGHT. Set true if you trained with Ultralytics letterbox. */
export const USE_LETTERBOX = false;

/** YOLO pixel values are divided by 255 (typical). Set false only if your export used another scheme. */
export const NORMALIZE_0_1 = true;

export const PADDY_CLASSES = [
  "Rice Leaf Roller",
  "Rice Leaf Caterpillar",
  "Paddy Stem Maggot",
  "Stem Borer",
  "Brown Plant Hopper",
  "Leaf Folder",
  "Stink Bug",
  "Pyrilla",
  "Healthy Leaf",
];

/**
 * Optional: IP102 names from pest-detection-model/pests.yaml (102 classes).
 * To use the IP102-trained weights, set `CLASS_NAMES = IP102_CLASSES`.
 */
export const IP102_CLASSES = [
  "rice leaf roller",
  "rice leaf caterpillar",
  "paddy stem maggot",
  "asiatic rice borer",
  "yellow rice borer",
  "rice gall midge",
  "Rice Stemfly",
  "brown plant hopper",
  "white backed plant hopper",
  "small brown plant hopper",
  "rice water weevil",
  "rice leafhopper",
  "grain spreader thrips",
  "rice shell pest",
  "grub",
  "mole cricket",
  "wireworm",
  "white margined moth",
  "black cutworm",
  "large cutworm",
  "yellow cutworm",
  "red spider",
  "corn borer",
  "army worm",
  "aphids",
  "Potosiabre vitarsis",
  "peach borer",
  "english grain aphid",
  "green bug",
  "bird cherry-oataphid",
  "wheat blossom midge",
  "penthaleus major",
  "longlegged spider mite",
  "wheat phloeothrips",
  "wheat sawfly",
  "cerodonta denticornis",
  "beet fly",
  "flea beetle",
  "cabbage army worm",
  "beet army worm",
  "Beet spot flies",
  "meadow moth",
  "beet weevil",
  "sericaorient alismots chulsky",
  "alfalfa weevil",
  "flax budworm",
  "alfalfa plant bug",
  "tarnished plant bug",
  "Locustoidea",
  "lytta polita",
  "legume blister beetle",
  "blister beetle",
  "therioaphis maculata Buckton",
  "odontothrips loti",
  "Thrips",
  "alfalfa seed chalcid",
  "Pieris canidia",
  "Apolygus lucorum",
  "Limacodidae",
  "Viteus vitifoliae",
  "Colomerus vitis",
  "Brevipoalpus lewisi McGregor",
  "oides decempunctata",
  "Polyphagotars onemus latus",
  "Pseudococcus comstocki Kuwana",
  "parathrene regalis",
  "Ampelophaga",
  "Lycorma delicatula",
  "Xylotrechus",
  "Cicadella viridis",
  "Miridae",
  "Trialeurodes vaporariorum",
  "Erythroneura apicalis",
  "Papilio xuthus",
  "Panonchus citri McGregor",
  "Phyllocoptes oleiverus ashmead",
  "Icerya purchasi Maskell",
  "Unaspis yanonensis",
  "Ceroplastes rubens",
  "Chrysomphalus aonidum",
  "Parlatoria zizyphus Lucus",
  "Nipaecoccus vastalor",
  "Aleurocanthus spiniferus",
  "Tetradacus c Bactrocera minax",
  "Dacus dorsalis(Hendel)",
  "Bactrocera tsuneonis",
  "Prodenia litura",
  "Adristyrannus",
  "Phyllocnistis citrella Stainton",
  "Toxoptera citricidus",
  "Toxoptera aurantii",
  "Aphis citricola Vander Goot",
  "Scirtothrips dorsalis Hood",
  "Dasineura sp",
  "Lawana imitata Melichar",
  "Salurnis marginella Guerr",
  "Deporaus marginatus Pascoe",
  "Chlumetia transversa",
  "Mango flat beak leafhopper",
  "Rhytidodera bowrinii white",
  "Sternochetus frigidus",
  "Cicadellidae",
];

/** Active label list used by post-processing. */
export const CLASS_NAMES = PADDY_CLASSES;

export const MODEL_ASSET = require("../../assets/models/paddy_pest_model.onnx");

export function severityFromConfidence(confidence: number): "Low" | "Moderate" | "High" {
  if (confidence >= 0.85) return "High";
  if (confidence >= 0.6) return "Moderate";
  return "Low";
}
