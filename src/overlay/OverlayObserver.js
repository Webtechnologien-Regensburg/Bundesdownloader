import OverlayProxy from "./OverlayProxy.js";

function buildCSVTable(dataSet) {
    let rows = [];
    dataSet.speeches.forEach((speech) => {
        rows.push(`"${dataSet.session.date}","${dataSet.session.session}","${dataSet.session.agendaItem}","${dataSet.session.agendaItemText}","${speech.position}","${speech.name}","${speech.office}","${speech.group}","${speech.description}",${speech.imageURL}","${speech.mediaURL}"`);
    });
    return rows.join("\n");
}

class OverlayObserver {

    #overlay;
    #observer;

    start() {
        console.log("[Bundesdownloader] Starting Observer");
        this.#overlay = document.querySelector(".bt-overlay-content");
        this.#observer = new MutationObserver(() => this.#onMutation());
        this.#observer.observe(this.#overlay, {
            childList: true,
            attributes: true,
        });
    }

    stop() {
        if (this.#observer) {
            this.#observer.disconnect();
        }
    }

    async #onMutation(record, observer) {
        console.log("[Bundesdownloader] Mutation in Overlay detected");
        let overlay = new OverlayProxy(this.#overlay);
        console.log("[Bundesdownloader] OverlayProxy created");
        if (overlay.showsAgenda()) {
            let csvExport;
            console.log("[Bundesdownloader] Overlay shows agenda");
            console.log("[Bundesdownloader] Stopping Observer");
            this.stop();
            console.log("[Bundesdownloader] Expanding speaker list");
            await overlay.ensureSpeakerListIsExpanded();
            console.log("[Bundesdownloader] Extracting data set");
            csvExport = buildCSVTable(overlay.extractDataSet());
            console.log("[Bundesdownloader] Appending download button");
            overlay.appendDownloadButton(csvExport);
            console.log("[Bundesdownloader] Restarting Observer");
            this.start();
        }

    }

}

export default new OverlayObserver();