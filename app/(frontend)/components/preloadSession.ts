export const PRELOAD_SESSION_KEY = "thimark:preloaded";

/** Runs in <head> before first paint so repeat visits in a session never flash the preloader. */
export const PRELOAD_SKIP_SCRIPT = `try{if(sessionStorage.getItem(${JSON.stringify(PRELOAD_SESSION_KEY)}))document.documentElement.dataset.preloaded="true"}catch(e){}`;
