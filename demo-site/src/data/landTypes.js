export const LAND_TYPES = [
  {
    id: "nanjai",
    nameEn: "Nanjai (wet land)",
    nameTa: "நஞ்சை (ஈர நிலம்)",
    short: "Nanjai",
    summary:
      "Irrigated wetland — canal, tank, well or drip. Typical along Noyyal, Aliyar and Pollachi garden-wet belts. Suited to paddy, sugarcane, banana, coconut and turmeric.",
  },
  {
    id: "punjai",
    nameEn: "Punjai (dry land)",
    nameTa: "புஞ்சை (உலர் நிலம்)",
    short: "Punjai",
    summary:
      "Rainfed dry land — depends on Aadi / Purattasi–Aippasi rains. Typical of Annur, Avinashi, Sulur uplands. Suited to cholam, cumbu, ragi, cotton, groundnut and pulses.",
  },
];

export const TAMIL_MONTHS = [
  { index: 0, en: "January", ta: "தை", taEn: "Thai", season: "Post-NE monsoon / cool dry" },
  { index: 1, en: "February", ta: "மாசி", taEn: "Masi", season: "Late winter, dry" },
  { index: 2, en: "March", ta: "பங்குனி", taEn: "Panguni", season: "Summer onset, hot" },
  { index: 3, en: "April", ta: "சித்திரை", taEn: "Chithirai", season: "Peak summer" },
  { index: 4, en: "May", ta: "வைகாசி", taEn: "Vaikasi", season: "Pre-monsoon heat / local showers" },
  { index: 5, en: "June", ta: "ஆனி", taEn: "Aani", season: "SW monsoon fringe (light in Coimbatore)" },
  { index: 6, en: "July", ta: "ஆடி", taEn: "Aadi", season: "Aadi rains — main punjai sowing window" },
  { index: 7, en: "August", ta: "ஆவணி", taEn: "Aavani", season: "Vegetative / Kar paddy" },
  { index: 8, en: "September", ta: "புரட்டாசி", taEn: "Purattasi", season: "Transition to NE monsoon" },
  { index: 9, en: "October", ta: "ஐப்பசி", taEn: "Aippasi", season: "NE monsoon peak for Kongu" },
  { index: 10, en: "November", ta: "கார்த்திகை", taEn: "Karthigai", season: "NE monsoon / Pisanam grain fill" },
  { index: 11, en: "December", ta: "மார்கழி", taEn: "Margazhi", season: "Harvest / cool residual rain" },
];

export const KONGU_NOTES = {
  region: "Coimbatore / Kongu Nadu",
  rainfall:
    "Coimbatore lies in a rain-shadow. The North-East monsoon (Aippasi–Karthigai) is more reliable than the South-West monsoon.",
  nanjaiCulture:
    "Nanjai farmers time Kar (Jun–Sep) and Pisanam / Samba (Sep–Jan) paddy, plus sugarcane and banana with well or canal water. Organic manures (farmyard manure, green leaf) before planting is traditional.",
  punjaiCulture:
    "Punjai farmers sow with Aadi rains, keep contingency pulses if the monsoon fails, and practise summer ploughing in Panguni–Chithirai. Bunds, farm ponds and mulching are local water-saving practices.",
  disclaimer:
    "This calendar is Kongu agronomic guidance for demonstration. Confirm sowing dates with Coimbatore / Pollachi KVK and the local agricultural officer.",
};

export function suggestedLandType(crop) {
  const wet = new Set(["Rice", "Sugarcane", "Banana", "Coconut", "Turmeric", "Jasmine"]);
  return wet.has(crop) ? "nanjai" : "punjai";
}

export function getLandType(id) {
  return LAND_TYPES.find((item) => item.id === id) || LAND_TYPES[1];
}
