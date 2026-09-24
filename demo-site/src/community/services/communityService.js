import {
  COMMENTS,
  DEMO_STATS,
  MODERATION,
  NOTIFICATIONS,
  POSTS,
  USERS,
} from "../data/communityDemo";

const STORE = "echo.community.state.v1";
const SESSION = "echo.community.user";

function clone(v) {
  return JSON.parse(JSON.stringify(v));
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        posts: parsed.posts?.length ? parsed.posts : clone(POSTS),
        comments: parsed.comments?.length ? parsed.comments : clone(COMMENTS),
        reports: parsed.reports || clone(MODERATION),
        saved: parsed.saved || [],
        hidden: parsed.hidden || [],
        blocked: parsed.blocked || [],
      };
    }
  } catch {
    /* ignore */
  }
  return {
    posts: clone(POSTS),
    comments: clone(COMMENTS),
    reports: clone(MODERATION),
    saved: [],
    hidden: [],
    blocked: [],
  };
}

let state = loadState();

function persist() {
  localStorage.setItem(STORE, JSON.stringify(state));
}

function jitter(n) {
  return Math.round((n + (Math.random() - 0.5) * 0.04) * 100) / 100;
}

export function getCurrentUser() {
  const id = localStorage.getItem(SESSION) || "u1";
  return USERS.find((u) => u.id === id) || USERS[0];
}

export function setCurrentUser(id) {
  localStorage.setItem(SESSION, id);
  return getCurrentUser();
}

export function getUsers() {
  return USERS;
}

export function getUser(id) {
  return USERS.find((u) => u.id === id);
}

export function getDemoStats() {
  return { ...DEMO_STATS };
}

export function getNotifications() {
  return NOTIFICATIONS;
}

export async function getPosts({ crop, category, village, query, savedOnly, type } = {}) {
  let list = state.posts.filter((p) => !state.hidden.includes(p.id));
  const blocked = new Set(state.blocked);
  list = list.filter((p) => !blocked.has(p.authorId));
  if (crop) list = list.filter((p) => p.crop === crop);
  if (category) list = list.filter((p) => p.category === category);
  if (village) list = list.filter((p) => p.location?.village === village);
  if (type) list = list.filter((p) => p.type === type);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter((p) => `${p.title} ${p.content} ${(p.tags || []).join(" ")}`.toLowerCase().includes(q));
  }
  if (savedOnly) list = list.filter((p) => state.saved.includes(p.id));
  return list
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(withAuthor);
}

export async function getPost(id) {
  const post = state.posts.find((p) => p.id === id);
  if (!post) return null;
  return withAuthor(post);
}

export async function getComments(postId) {
  return state.comments
    .filter((c) => c.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((c) => ({ ...c, author: getUser(c.authorId) }));
}

export async function getRelatedPosts(post) {
  if (!post) return [];
  const all = await getPosts({ crop: post.crop });
  return all.filter((p) => p.id !== post.id).slice(0, 4);
}

export async function createPost(input) {
  const user = getCurrentUser();
  const loc = publicLocation(input.location, input.visibility || "approximate");
  const post = {
    id: `p${Date.now()}`,
    authorId: user.id,
    title: input.title,
    content: input.content,
    crop: input.crop || "Other",
    category: input.category || "general",
    images: input.images || [],
    location: loc,
    visibility: input.visibility || "approximate",
    createdAt: new Date().toISOString(),
    tags: input.tags || [],
    aiDetection: input.aiDetection || null,
    helpfulCount: 0,
    commentCount: 0,
    type: input.type || "question",
  };
  state.posts.unshift(post);
  persist();
  return withAuthor(post);
}

export async function addComment({ postId, content, image, parentId }) {
  const user = getCurrentUser();
  const comment = {
    id: `c${Date.now()}`,
    postId,
    parentId: parentId || null,
    authorId: user.id,
    content,
    image: image || null,
    createdAt: new Date().toISOString(),
    helpfulCount: 0,
    isExpertAnswer: user.role === "expert" || user.role === "officer",
  };
  state.comments.push(comment);
  const post = state.posts.find((p) => p.id === postId);
  if (post) post.commentCount = (post.commentCount || 0) + 1;
  persist();
  return { ...comment, author: user };
}

export async function markHelpful(postId) {
  const post = state.posts.find((p) => p.id === postId);
  if (post) {
    post.helpfulCount = (post.helpfulCount || 0) + 1;
    persist();
  }
  return post;
}

export async function toggleSave(postId) {
  if (state.saved.includes(postId)) state.saved = state.saved.filter((id) => id !== postId);
  else state.saved.push(postId);
  persist();
  return state.saved.includes(postId);
}

export function isSaved(postId) {
  return state.saved.includes(postId);
}

export async function getVillagePosts(village) {
  return getPosts({ village });
}

export async function getCropPosts(crop) {
  return getPosts({ crop });
}

export async function markCommentHelpful(commentId) {
  const comment = state.comments.find((c) => c.id === commentId);
  if (comment) {
    comment.helpfulCount = (comment.helpfulCount || 0) + 1;
    persist();
  }
  return comment;
}

export async function reportComment({ commentId, reason }) {
  const row = {
    id: `m${Date.now()}`,
    commentId,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  state.reports.push(row);
  persist();
  return row;
}

export async function reportPost({ postId, reason }) {
  const row = {
    id: `m${Date.now()}`,
    postId,
    reason,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  state.reports.push(row);
  persist();
  return row;
}

export async function hidePost(postId) {
  if (!state.hidden.includes(postId)) state.hidden.push(postId);
  persist();
}

export async function blockUser(userId) {
  if (!state.blocked.includes(userId)) state.blocked.push(userId);
  persist();
}

export function getModeration() {
  return state.reports.map((r) => ({
    ...r,
    post: state.posts.find((p) => p.id === r.postId),
  }));
}

export function getCommunitySignals() {
  const pestPosts = state.posts.filter((p) => p.category === "pests");
  const groups = {};
  pestPosts.forEach((p) => {
    const key = `${p.crop}|${p.location?.village}|${p.aiDetection?.label || p.tags?.[0] || "pest"}`;
    groups[key] = groups[key] || { crop: p.crop, village: p.location?.village, pest: p.aiDetection?.label || p.tags?.[0], reports: [] };
    groups[key].reports.push(p);
  });
  return Object.values(groups)
    .filter((g) => g.reports.length >= 2)
    .map((g) => ({
      crop: g.crop,
      area: `${g.village} region`,
      pest: g.pest,
      reports: g.reports.length,
      recent: g.reports.filter((p) => Date.now() - new Date(p.createdAt).getTime() < 7 * 86400000).length,
      label: "Community signal",
    }));
}

export function getMapReports() {
  return state.posts
    .filter((p) => ["pests", "diseases", "weather", "irrigation"].includes(p.category))
    .map((p) => ({
      id: p.id,
      kind: p.category === "diseases" ? "disease" : p.category === "weather" ? "weather" : p.category === "irrigation" ? "water" : "pest",
      crop: p.crop,
      problem: p.aiDetection?.label || p.title.slice(0, 48),
      createdAt: p.createdAt,
      lat: p.location?.lat,
      lon: p.location?.lon,
      village: p.location?.village,
    }));
}

export function publicLocation(location = {}, visibility = "approximate") {
  const base = {
    village: location.village || "Coimbatore",
    district: location.district || "Coimbatore",
    state: location.state || "Tamil Nadu",
    visibility,
  };
  if (visibility === "private") {
    return { ...base, lat: null, lon: null, note: "Location kept private" };
  }
  if (visibility === "village") {
    return { ...base, lat: jitter(location.lat || 11.0), lon: jitter(location.lon || 76.96), note: "Village-level location" };
  }
  return {
    ...base,
    lat: jitter(location.lat || 11.0),
    lon: jitter(location.lon || 76.96),
    note: visibility === "exact" ? "Exact coordinates kept on device; map shows approximate area" : "Approximate area",
  };
}

export function looksUnsafeAdvice(text) {
  return /pesticide.{0,40}(dose|dosage|ml\/|litre|liter)|spray.{0,20}\d+\s*(ml|gm|g)|high dose|mix \d+/i.test(String(text || ""));
}

function withAuthor(post) {
  return { ...post, author: getUser(post.authorId), saved: state.saved.includes(post.id) };
}

export async function detectPestDemo(file) {
  await new Promise((r) => setTimeout(r, 900));
  const name = file?.name || "";
  const chilli = /chilli|chili|thrip/i.test(name);
  return {
    label: chilli ? "Scirtothrips dorsalis" : "Possible pest / disease symptoms",
    commonName: chilli ? "Chilli thrips (possible)" : "Unspecified field symptoms (possible)",
    confidence: chilli ? 0.66 : 0.48,
    cropGuess: chilli ? "Chilli" : "Other",
    kind: "pest",
    note: "Possible detection from a demo model placeholder. Not a confirmed diagnosis. Please verify with an agricultural expert.",
    imageName: name,
  };
}
