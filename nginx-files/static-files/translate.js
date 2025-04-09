const defaultLocale = "ENG";
const lang = localStorage.getItem("language");
if (!lang)
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
        "prof-avatar": "Change Avatar: ",
        "edit-sub": "Save Changes",
        "prof-me-color": "Color of my paddle:",
        "prof-other-color": "Color of opponent's paddle:",
        "prof-ball-color": "Color of the ball:",
        "prof-counter-color": "Color of the counter:",
        "no-find": "Nothing to see here...",
        "see-prof": "See Profile",
        "add-friend": "Add Friend",
        "del-friend": "Delete Friend",
        "make-local": "Create new Local room",
        "make-online": "Create new Online room",
        "make-tourn": "Create new Tournament",
        "join-room": "Join room",
        "crea-submit": "Submit",
        "join-submit": "Submit",
        "max-time": "Maximum time of the game in seconds",
        "max-score": "Maximum score for a player",
        "map-select": "Map selection",
        "map-default": "Default map",
        "map-two": "Two balls map",
        "map-float": "Floating things map",
        "col-back": "Color picker for backgound color",
        "col-play1": "Color picker for player1 color",
        "col-play2": "Color picker for player2 color",
        "col-ball": "Color picker for ball color",
        "col-count": "Color picker for count color",
        "join-form": "Input room code",
        "game-mode": "Choose Game Mode",
        "mod-tourn": "Tournament",
        "WIN!": "WIN!",
        "LOSE!": "LOSE!",
        "TIE!": "TIE!",
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
        "prof-avatar": "Cambiar Imagen: ",
        "edit-sub": "Guardar Cambios",
        "prof-me-color": "Color de mi pala:",
        "prof-other-color": "Color de la pala del oponente:",
        "prof-ball-color": "Color de la bola:",
        "prof-counter-color": "Color del contador:",
        "no-find": "Nada de na..",
        "see-prof": "Ver Perfil",
        "add-friend": "Añadir Amigo",
        "del-friend": "Eliminar Amigo",
        "make-local": "Crear Sala Local nueva",
        "make-online": "Crear Sala Online nueva",
        "make-tourn": "Crear Torneo nuevo",
        "join-room": "Unirse a Sala",
        "crea-submit": "Crea",
        "join-submit": "Entra",
        "max-time": "Tiempo de juego máximo en segundos",
        "max-score": "Puntuación máxima por jugador",
        "map-select": "Selección de mapa",
        "map-default": "Mapa normal",
        "map-two": "Mapa con par de bolas",
        "map-float": "Mapa con cosas flotando",
        "col-back": "Selector de color para fondo",
        "col-play1": "Selector de color para jugador 1",
        "col-play2": "Selector de color para jugador 2",
        "col-ball": "Selector de color para bola",
        "col-count": "Selector de color para contador",
        "join-form": "Poner código de sala",
        "game-mode": "Elige Modo de Juego",
        "mod-tourn": "Torneo",
        "WIN!": "¡VICTORIA!",
        "LOSE!": "¡DERROTA!",
        "TIE!": "¡EMPATE!",
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
        "prof-avatar": "Cambiar Imatge: ",
        "edit-sub": "Guardar Cambis",
        "prof-me-color": "Color de la meva pala:",
        "prof-other-color": "Color de la pala de l'oponent:",
        "prof-ball-color": "Color de la pilota:",
        "prof-counter-color": "Color del comptador:",
        "no-find": "Res de res...",
        "see-prof": "Veure perfil",
        "add-friend": "Afegir Amic",
        "del-friend": "Borrar Amic",
        "make-local": "Crear Sala Local nova",
        "make-online": "Crear Sala Online nova",
        "make-tourn": "Crear Torneig nou",
        "join-room": "Entrar a Sala",
        "crea-submit": "Crea",
        "join-submit": "Entra",
        "max-time": "Temps màxim de joc en segons",
        "max-score": "Puntuació màxima per jugador",
        "map-select": "Selecció de mapa",
        "map-default": "Mapa Normal",
        "map-two": "Mapa amb dos pilotes",
        "map-float": "Mapa amb objectes flotants",
        "col-back": "Selector de color de fons",
        "col-play1": "Selector de color de jugador 1",
        "col-play2": "Selector de color de jugador 2",
        "col-ball": "Selector de color de pilota",
        "col-count": "Selector de color de contador",
        "join-form": "Posar codi de sala",
        "game-mode": "Escull Mode de Joc",
        "mod-tourn": "Torneix",
        "WIN!": "VICTÒRIA!",
        "LOSE!": "DERROTA!",
        "TIE!": "EMPAT!",
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
    if (!switcher)
        return ;
    if (!locale)
      switcher.value = defaultLocale;
    else
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
    if (key==="reg-sub" || key=== "login-sub" || key=== "edit-sub")
     element.setAttribute("value", translation);
    else if (key==="search-bar")
     element.setAttribute("placeholder", translation);
    else
     element.innerText = translation;
  }
