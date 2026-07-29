import "./assets/styles/styles.scss";
import { initializeTopbar } from "./assets/javascripts/topbar.js";
import "./index.scss";

const API_URL = "https://restapi.fr/api/article";
const articleListElement = document.querySelector(".articles-list");
const statusElement = document.querySelector(".articles-status");

const toText = value => (value == null ? "" : String(value));

const createArticleElement = article => {
  const articleElement = document.createElement("article");
  articleElement.classList.add("article");

  const profileImage = document.createElement("img");
  profileImage.src = toText(article.img);
  profileImage.alt = article.author
    ? `Portrait de ${toText(article.author)}`
    : "Portrait de l’auteur de l’article";
  profileImage.loading = "lazy";
  profileImage.decoding = "async";
  profileImage.width = 60;
  profileImage.height = 60;

  const titleElement = document.createElement("h2");
  titleElement.classList.add("article-title");
  titleElement.textContent = toText(article.title);

  const authorElement = document.createElement("p");
  authorElement.classList.add("article-author");
  authorElement.textContent = `${toText(article.author)} — ${toText(
    article.category,
  )}`;

  const contentElement = document.createElement("p");
  contentElement.classList.add("article-content");
  contentElement.textContent = toText(article.content);

  const actionsElement = document.createElement("div");
  actionsElement.classList.add("article-actions");

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.dataset.articleId = toText(article._id);
  deleteButton.textContent = "Supprimer";

  actionsElement.append(deleteButton);
  articleElement.append(
    profileImage,
    titleElement,
    authorElement,
    contentElement,
    actionsElement,
  );

  return articleElement;
};

const normalizeArticles = payload => {
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload && typeof payload === "object" ? [payload] : [];
};

const renderArticles = articles => {
  articleListElement.replaceChildren(...articles.map(createArticleElement));
  statusElement.textContent =
    articles.length === 0 ? "Aucun article n’est disponible." : "";
};

const fetchArticles = async () => {
  statusElement.textContent = "Chargement des articles…";

  const response = await fetch(API_URL, {
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Chargement impossible : HTTP ${response.status}`);
  }

  renderArticles(normalizeArticles(await response.json()));
};

const deleteArticle = async articleId => {
  const response = await fetch(`${API_URL}/${encodeURIComponent(articleId)}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Suppression impossible : HTTP ${response.status}`);
  }
};

articleListElement.addEventListener("click", async event => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return;
  }

  const deleteButton = target.closest(
    'button[data-action="delete"][data-article-id]',
  );

  if (!deleteButton || !articleListElement.contains(deleteButton)) {
    return;
  }

  const articleId = deleteButton.dataset.articleId;
  const confirmed =
    articleId &&
    window.confirm("Voulez-vous vraiment supprimer cet article ?");

  if (!confirmed) {
    return;
  }

  deleteButton.disabled = true;
  statusElement.textContent = "Suppression de l’article…";

  try {
    await deleteArticle(articleId);
    await fetchArticles();
  } catch (error) {
    statusElement.textContent =
      "La suppression a échoué. Veuillez réessayer.";
    deleteButton.disabled = false;
    console.error(error);
  }
});

initializeTopbar();
fetchArticles().catch(error => {
  articleListElement.replaceChildren();
  statusElement.textContent =
    "Impossible de charger les articles pour le moment.";
  console.error(error);
});
