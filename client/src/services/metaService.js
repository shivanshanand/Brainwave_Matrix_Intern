import API from "../api/axios";

// === CATEGORY APIs ===
export async function fetchParentCategories() {
  const { data } = await API.get("/meta/categories/parents");
  return data?.categories || [];
}

export async function fetchChildCategories(parentSlug) {
  const { data } = await API.get(`/meta/categories/parent/${parentSlug}`);
  return data?.categories || [];
}

export async function fetchAllCategories(query = "", type = "all") {
  const { data } = await API.get("/meta/categories", {
    params: { q: query, type },
  });
  return data?.items || [];
}

// Suggest categories from content/title
export async function suggestCategoriesFromContent({
  title,
  content,
  max = 7,
}) {
  const { data } = await API.post("/meta/suggest-categories", {
    title,
    content,
    max,
  });
  return data?.items || [];
}

// === TAG APIs ===
export async function fetchAllTags(query = "") {
  const { data } = await API.get("/meta/tags", { params: { q: query } });
  return data?.items || [];
}

export async function suggestTagsFromContent({ title, content, max = 8 }) {
  const { data } = await API.post("/meta/suggest-tags", {
    title,
    content,
    max,
  });
  return data?.items || [];
}

export const categoryAPI = {
  getParents: fetchParentCategories,
  getChildren: fetchChildCategories,
  getAll: fetchAllCategories,
  suggest: suggestCategoriesFromContent,
};

export const tagAPI = {
  getAll: fetchAllTags,
  suggest: suggestTagsFromContent,
};
