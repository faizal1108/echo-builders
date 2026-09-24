# ECHO — Smart Crop Intelligence for Indian Farmers

Frontend-only demonstration dashboard for Smart India Hackathon / college presentations. A farmer (or jury) selects a field with **browser GPS**, a **Leaflet map**, or typed coordinates, then receives a field intelligence report from **SoilGrids**, **Open-Meteo**, optional **Bhuvan / NRSC**, a local **risk engine**, and **Google Gemini**.

**There is no Node.js backend.** All API calls run from the browser.

> **Security warning:** This project is a demonstration prototype. API keys exposed in frontend applications can be extracted by users. Never expose unrestricted production API keys in a public frontend. For production deployment, move Bhuvan/Gemini authentication to a backend service.

---

## Commands

```bash
cd demo-site
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
npm run build
npm run preview
```

Opening `index.html` as a `file://` page is **not supported**: Vite uses ES modules and environment variables. After `npm run build`, serve `dist/` with `npm run preview` (or any static file server).

Windows: use PowerShell or Command Prompt; Node.js 18+ is required.

---

## Project overview

ECHO combines:

1. Browser Geolocation  
2. Interactive OpenStreetMap (Leaflet)  
3. SoilGrids modelled soil properties  
4. Open-Meteo current + ~16-day forecast  
5. Bhuvan adapter (official catalog only — no invented endpoints)  
6. Deterministic preliminary risk rules  
7. Gemini crop-planning JSON advisory (4-month outlook, pest/disease monitoring)  
8. Printable HTML field report  

UI languages: **English, Tamil, Hindi, Marathi**. Gemini is asked to write the advisory in the selected language while keeping numeric values unchanged.

---

## Architecture

```
             ┌───────────────┐
             │    FARMER     │
             └───────┬───────┘
                     │
                     ▼
             ┌───────────────┐
             │   ECHO WEB    │
             │   DASHBOARD   │
             └───────┬───────┘
                     │
       ┌─────────────┼─────────────┐
       │             │             │
       ▼             ▼             ▼
   Browser GPS    Leaflet       Crop Input
       │
       └──────────────┬──────────────┘
                      │
             ┌────────▼────────┐
             │ External APIs   │
             └────────┬────────┘
                      │
       ┌──────────────┼──────────────┐
       ▼              ▼              ▼
    Bhuvan         SoilGrids      Open-Meteo
       │              │              │
       └──────────────┼──────────────┘
                      ▼
                Risk Engine
                      │
                      ▼
                 Gemini AI
                      │
                      ▼
             Crop Intelligence
```

All HTTP calls live in `src/services/` so they can later be pointed at a Node/Express proxy without rewriting the UI.

```
demo-site/
  src/
    components/
    services/
    utils/
    data/
    App.jsx
    main.jsx
    index.css
  public/
  package.json
  README.md
  .env.example
```

---

## Environment variables

Copy `.env.example` to `.env` (do not commit `.env`):

```
VITE_GEMINI_API_KEY=
VITE_BHUVAN_API_URL=
VITE_BHUVAN_API_TOKEN=
VITE_BHUVAN_DEMO_MODE=true
```

The app **runs with all of these empty**. You can also paste keys in **Settings** (stored in `localStorage` for this demo only).

---

## How to get a Gemini API key

1. Open [Google AI Studio](https://aistudio.google.com/apikey).  
2. Create an API key.  
3. Paste it in ECHO **Settings → Gemini API Key → Save Key**, or set `VITE_GEMINI_API_KEY`.  

The key is sent **only** to `generativelanguage.googleapis.com`.

---

## How to configure Bhuvan

Official catalog: [https://bhuvan-app1.nrsc.gov.in/api/](https://bhuvan-app1.nrsc.gov.in/api/)

Documented themes include **LULC 50K / 250K statistics** (access token required). ECHO **does not invent** an undocumented public land-use endpoint.

1. Register / sign in on Bhuvan API.  
2. Create an access token for the theme you are allowed to use (for example LULC AOI-wise statistics).  
3. Copy the **exact URL from Bhuvan’s documentation / API page** into Settings → Bhuvan API URL.  
4. Paste the token into Bhuvan API Token.  

If URL or token is missing:

- Status: **NOT CONFIGURED**  
- Message: Bhuvan API endpoint not configured  
- With **Demo Mode** on: labelled **DEMO DATA** land-use sample (never claimed as live Bhuvan)

Browser calls to Bhuvan often fail due to **CORS**. That is expected in a frontend-only demo; production should proxy Bhuvan from a server.

---

## SoilGrids

- Base: `https://rest.isric.org/`  
- Query: `https://rest.isric.org/soilgrids/v2.0/properties/query`  
- Properties: `phh2o`, `clay`, `sand`, `silt`, `soc`, `nitrogen`, `cec`  
- Depths: `0-5cm`, `5-15cm`  
- Value: `mean`  

Parser: `parseSoilGridsResponse()` in `src/services/soilGridsService.js`. Values are converted using SoilGrids `d_factor`.

SoilGrids is a **modelled estimate**. The UI states that field soil testing is recommended.

If the API fails and Demo Mode is on, cached sample values appear as **DEMO DATA**.

---

## Weather (Open-Meteo)

- `https://api.open-meteo.com/v1/forecast`  
- No API key  
- Current weather + daily forecast (~16 days)  
- Charts: temperature and rainfall (Recharts)  

The UI separates **Weather Forecast** (short range) from **4-Month Crop Planning Outlook** (agronomic reasoning beyond the forecast horizon). ECHO does **not** claim 3–4 month weather precision.

---

## Demo mode

Toggle **Demo Mode** in the header, or click **Load Demo Field** (Coimbatore peri-urban example, crop = Chilli).

| Source     | Typical behaviour in demo |
|------------|---------------------------|
| Bhuvan     | Labelled demo LULC if not configured or request fails |
| SoilGrids  | Live if reachable; labelled demo fallback if unavailable |
| Weather    | Live Open-Meteo when the network allows |
| Gemini     | Live only if a key is present |

Every non-live value is labelled **DEMO DATA**. Status is never **LIVE** unless the request succeeded.

---

## Which APIs are live vs demo/fallback

| Capability | Live without extra keys? | Notes |
|------------|--------------------------|--------|
| GPS        | Yes (browser permission) | Friendly message if denied |
| Map        | Yes                      | OpenStreetMap tiles |
| SoilGrids  | Yes                      | Public REST; CORS/rate-limit handled |
| Open-Meteo | Yes                      | Public REST |
| Gemini     | No                       | Needs API key in Settings or `.env` |
| Bhuvan     | No                       | Needs official URL + token; CORS likely |

---

## Production architecture

```
React frontend  →  Node.js / Express backend  →  Bhuvan, SoilGrids, Weather, Gemini
```

Keep UI as-is; move `src/services/*` to server routes and restrict API keys to the server.

---

## Limitations

- Frontend-only; keys in the browser are visible to users.  
- Bhuvan LULC is not called unless you supply the official endpoint + token.  
- SoilGrids is modelled, not a lab test.  
- Weather is ~16 days, not seasonal forecast.  
- Risk rules are simplified heuristics, labelled preliminary.  
- Pest/disease lists are monitoring guidance, not diagnosis.  
- Gemini may be rate-limited or blocked by browser extensions.

---

## Future improvements

- Server proxy for Bhuvan and Gemini  
- Field boundary drawing (polygon AOI for LULC statistics)  
- Offline / PWA cache of last report  
- Link to local KVK / agri-officer directory  
- Optional YOLO pest image model already explored elsewhere in the ECHO repo  

---

## Disclaimer

ECHO provides decision-support information, not a substitute for agricultural extension officers, soil testing laboratories or crop-disease experts. AI-generated recommendations should be verified before taking high-impact agricultural actions. ECHO does not provide pesticide dosages.
