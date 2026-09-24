/**
 * YOLO11s rice pest detector — match export: 640x640, 102 classes, output [1, 106, 8400].
 */
export const INPUT_WIDTH = 640;
export const INPUT_HEIGHT = 640;
export const CONFIDENCE_THRESHOLD = 0.25;
export const IOU_THRESHOLD = 0.45;
export const USE_LETTERBOX = true;
export const NORMALIZE_0_1 = true;
export const LETTERBOX_PAD = 114 / 255;

/**
 * IP102 names from pest-detection-model/pests.yaml. Order must match training.
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

export const CLASS_NAMES = IP102_CLASSES;

export const MODEL_FILE_NAME = "rice_pest_model.onnx";

export function severityFromConfidence(confidence: number): "Low" | "Moderate" | "High" {
  if (confidence >= 0.85) return "High";
  if (confidence >= 0.6) return "Moderate";
  return "Low";
}
