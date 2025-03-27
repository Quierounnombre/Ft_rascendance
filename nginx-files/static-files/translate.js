const defaultLocale = "ENG";
let locale;

const translations = {
    "ENG": {
        "log-button": "Login",
        "reg-button": "Register",
        "oauth-button": "With 42",
        "anon-header": "Welcome to Rascendance🏓",
        "footer-1":`Rascendance is a project made by`,
        "footer-2":"In honor of ",
        "login-pass": "Password",
        "login-out": "Get Out",
        "reg-usname": "Username:",
        "reg-finame": "First Name:",
        "reg-laname": "Last Name:",
        "reg-pass": "Password:",
        "reg-pass2": "Repeat Password:",
        "reg-sub": "Sign Up",
    },

    "ESP": {
        "log-button": "Entrar",
        "reg-button": "Registro",
        "oauth-button": "Con 42",
        "anon-header": "Bienvenidos a Rascendance🏓",
        "footer-1":`Rascendance es un proyecto creado por`,
        "footer-2":"En memoria de ",
        "login-pass": "Contraseña",
        "login-out": "Volver",
        "reg-usname": "Apodo:",
        "reg-finame": "Nombre:",
        "reg-laname": "Apellido:",
        "reg-pass": "Contraseña:",
        "reg-pass2": "Repetir Contraseña:",
        "reg-sub": "Registrar",
    },

    "CAT": {
        "log-button": "Entra",
        "reg-button": "Registrat",
        "oauth-button": "Amb 42",
        "anon-header": "Benvinguts a Rascendance🏓",
        "footer-1":`Rascendance es un projecte creat per`,
        "footer-2":"Recordant ",
        "login-pass": "Contrasenya",
        "login-out": "Torna",
        "reg-usname": "Sobrenom:",
        "reg-finame": "Nom:",
        "reg-laname": "Cognom:",
        "reg-pass": "Contrasenya:",
        "reg-pass2": "Repetir Contrasenya:",
        "reg-sub": "Registrarse",
    },
};

async function setLocale(newLocale) {
    if (newLocale === locale) return;
  
    locale = newLocale;
    document.documentElement.lang = newLocale;
    translatePage();

  }
  

// ...
// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
  setLocale(defaultLocale);
  bindLocaleSwitcher(defaultLocale);

});
// ...
// Whenever the user selects a new locale, we
// load the locale's translations and update
// the page
function bindLocaleSwitcher(initialValue) {
  const switcher =
    document.querySelector("[data-i18n-switcher]");
  switcher.value = initialValue;
  switcher.onchange = (e) => {
    // Set the locale to the selected option[value]
    setLocale (e.target.value);
  };
}

function translatePage() {
    document
      .querySelectorAll("[data-i18n-key]")
      .forEach(translateElement);
  }
  // Replace the inner text of the given HTML element
  // with the translation in the active locale,
  // corresponding to the element's data-i18n-key
  function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const translation = translations[locale][key];
    if (key==="reg-sub")
    element.setAttribute("value", translation);
    else
    element.innerText = translation;
  }
