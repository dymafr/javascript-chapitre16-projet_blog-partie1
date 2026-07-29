import "../assets/styles/styles.scss";
import { initializeTopbar } from "../assets/javascripts/topbar.js";
import "./form.scss";

const API_URL = "https://restapi.fr/api/article";
const form = document.querySelector("#article-form");
const errorElement = document.querySelector("#errors");

const displayErrors = errors => {
  const errorItems = errors.map(error => {
    const item = document.createElement("li");
    item.textContent = error;
    return item;
  });

  errorElement.replaceChildren(...errorItems);
};

const getValidationErrors = article => {
  const requiredFields = [
    article.author,
    article.img,
    article.category,
    article.title,
    article.content,
  ];
  const hasEmptyField = requiredFields.some(
    value => typeof value !== "string" || !value.trim(),
  );
  const errors = [];

  if (hasEmptyField) {
    errors.push("Vous devez renseigner tous les champs.");
  }

  if (article.content?.trim() && article.content.trim().length < 20) {
    errors.push("Le contenu de votre article est trop court.");
  }

  return errors;
};

form.addEventListener("reset", () => {
  displayErrors([]);
});

form.addEventListener("submit", async event => {
  event.preventDefault();

  const currentForm = event.currentTarget;
  const article = Object.fromEntries(new FormData(currentForm));
  const errors = getValidationErrors(article);

  displayErrors(errors);
  if (errors.length > 0) {
    return;
  }

  const submitButton = currentForm.querySelector('[type="submit"]');
  submitButton.disabled = true;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(article),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    await response.json();
    currentForm.reset();
  } catch (error) {
    displayErrors(["Impossible d’enregistrer l’article pour le moment."]);
    console.error(error);
  } finally {
    submitButton.disabled = false;
  }
});

initializeTopbar();
