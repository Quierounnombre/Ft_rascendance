const defaultLocale = "ENG";
localStorage.setItem("language", defaultLocale);

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
        "login-sub": "Login",
        "reg-usname": "Username:",
        "reg-finame": "First Name:",
        "reg-laname": "Last Name:",
        "reg-pass": "Password:",
        "reg-pass2": "Repeat Password:",
        "reg-sub": "Sign Up",
        "navbar-profile": "Profile",
        "navbar-game": "Game",
        "navbar-social": "Social",
        "badge-hi": "Hi",
        "search-bar":"Search other users",
        "no-friends": "Seems like you don't have any friends...",
        "log-out": "Log Out",
        "prof-edit": "Edit",
        "history": "History",
        "prof-email": "Email :",
        "prof-uname": "Username: ",
        "prof-font": "Font size: ",
        "prof-lang": "Prefered Language: ",
        "no-find": "Nothing to see here...",
        "see-prof": "See Profile",
        "add-friend": "Add Friend",
        "del-friend": "Delete Friend",
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
        "login-sub": "Entrar",
        "reg-usname": "Apodo:",
        "reg-finame": "Nombre:",
        "reg-laname": "Apellido:",
        "reg-pass": "Contraseña:",
        "reg-pass2": "Repetir Contraseña:",
        "reg-sub": "Registrar",
        "navbar-profile": "Perfil",
        "navbar-game": "Juega",
        "navbar-social": "Amigos",
        "badge-hi": "Hola",
        "search-bar":"Buscar otros usuarios",
        "no-friends": "Parece que aún no tienes amigos...",
        "log-out": "Salir",
        "prof-edit": "Editar",
        "history": "Historial",
        "prof-email": "Correo: ",
        "prof-uname": "Apodo: ",
        "prof-font": "Tamaño fuente: ",
        "prof-lang": "Idioma preferido: ",
        "no-find": "Nada de na..",
        "see-prof": "Ver Perfil",
        "add-friend": "Añadir Amigo",
        "del-friend": "Eliminar Amigo",
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
        "login-sub": "Entra",
        "reg-usname": "Sobrenom:",
        "reg-finame": "Nom:",
        "reg-laname": "Cognom:",
        "reg-pass": "Contrasenya:",
        "reg-pass2": "Repetir Contrasenya:",
        "reg-sub": "Registrarse",
        "navbar-profile": "Perfil",
        "navbar-game": "Juga",
        "navbar-social": "Amics",
        "badge-hi": "Bones",
        "search-bar":"Buscar altres usuaris",
        "no-friends": "Aparentment encara no tens amics...",
        "log-out": "Sortir",
        "prof-edit": "Cambiar",
        "history": "Historial",
        "prof-email": "Correu: ",
        "prof-uname": "Sobrenom: ",
        "prof-font": "Mida lletra: ",
        "prof-lang": "Idioma preferit: ",
        "no-find": "Res de res...",
        "see-prof": "Veure perfil",
        "add-friend": "Afegir Amic",
        "del-friend": "Eliminar Amic",
    },
};

function setLocale(newLocale) {
    localStorage.setItem("language", newLocale);
    document.documentElement.lang = newLocale;
    translatePage();
  }
  

// ...
// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
  bindLocaleSwitcher();
});



// ...
// Whenever the user selects a new locale, we
// load the locale's translations and update
// the page
export function bindLocaleSwitcher() {
    const locale = localStorage.getItem("language");
    const switcher = document.getElementById("lang-switcher");
    console.log("Hola");
      switcher.value = locale;
      switcher.addEventListener("change", (event) => {
        // Set the locale to the selected option[value]
        setLocale (event.target.value);
      });
}

export default function translatePage() {
    document
      .querySelectorAll("[data-i18n-key]")
      .forEach(translateElement);
  }
  // Replace the inner text of the given HTML element
  // with the translation in the active locale,
  // corresponding to the element's data-i18n-key
  function translateElement(element) {
    const locale = localStorage.getItem("language");
    const key = element.getAttribute("data-i18n-key");
    const translation = translations[locale][key];
    if (key==="reg-sub" || key=== "login-sub")
     element.setAttribute("value", translation);
    else if (key==="search-bar")
     element.setAttribute("placeholder", translation);
    else
     element.innerText = translation;
  }
