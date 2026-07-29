const MOBILE_BREAKPOINT = 480;

export const initializeTopbar = () => {
  const menu = document.querySelector(".header-menu");
  const button = menu?.querySelector(".header-menu-button");
  const navigation = menu?.querySelector("nav");
  const label = button?.querySelector(".visually-hidden");

  if (!menu || !button || !navigation || !label) {
    return;
  }

  const closeMenu = () => {
    menu.classList.remove("open");
    button.setAttribute("aria-expanded", "false");
    label.textContent = "Ouvrir le menu";
  };

  const openMenu = () => {
    menu.classList.add("open");
    button.setAttribute("aria-expanded", "true");
    label.textContent = "Fermer le menu";
  };

  button.addEventListener("click", event => {
    event.stopPropagation();

    if (button.getAttribute("aria-expanded") === "true") {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navigation.addEventListener("click", event => {
    event.stopPropagation();
  });

  window.addEventListener("click", closeMenu);
  window.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > MOBILE_BREAKPOINT) {
      closeMenu();
    }
  });
};
