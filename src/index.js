import OverlayObserver from "/src/overlay/OverlayObserver.js";

function init() {
    console.log("[Bundesdownloader] Initializing extension ...");
    OverlayObserver.start();
}

init();