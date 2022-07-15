function extractMetaData(el) {
    let headerContent = el.querySelector(".bt-artikel__title").textContent.trim().split("\n"),
        date = headerContent[0].trim(),
        session = headerContent[1].split(".")[0].trim(),
        fullAgendaTitle = headerContent[1].split(",")[1].replace("TOP ", "").trim(),
        agendaItem = fullAgendaTitle.substring(0, fullAgendaTitle.indexOf(" ")),
        agendaItemText = fullAgendaTitle.substring(fullAgendaTitle.indexOf(" ") + 1);
    return {
        date: date,
        session: session,
        agendaItem: agendaItem,
        agendaItemText: agendaItemText,
    };
}

function extractSpeakerData(el) {
    let speechesElements = el.querySelectorAll(".bt-tagesordnungspunkt-reden .bt-open-in-overlay"),
        records = [];
    speechesElements.forEach((element, index) => {
        let videoId, speakerImage, speakerDescription, speakerName, speakerOffice, speakerGroup, record;
        try {
            videoId = element.getAttribute("data-videoid");
        } catch (error) {
            console.error(error);
        }
        try {
            speakerImage = element.querySelector("img").src;
        } catch (error) {
            console.error(error);
        }
        try {
            speakerDescription = element.querySelector("img").getAttribute("title");
        } catch (error) {
            console.error(error);
        }
        try {
            speakerName = element.querySelector(".bt-teaser-person-text h3").innerHTML;
        } catch (error) {
            console.error(error);
        }
        try {
            speakerOffice = element.querySelector(".bt-person-funktion").innerHTML;
        } catch (error) {
            console.error(error);
        } try {
            speakerGroup = element.querySelector(".bt-person-fraktion").innerHTML;
        } catch (error) {
            console.error(error);
        }
        if (videoId === undefined) {
            videoId = "";
        }
        record = {
            position: index + 1,
            name: speakerName || "",
            office: speakerOffice || "",
            group: speakerGroup || "",
            imageURL: speakerImage || "",
            description: speakerDescription || "",
            mediaURL: `https://cldf-od.r53.cdn.tv1.eu/1000153copo/ondemand/app144277506/145293313/${videoId}/${videoId}_mp3_128kb_stereo_de_128.mp3?fdl=1`,
        };
        records.push(record);
    });
    return records;
}

class OverlayProxy {

    #el;

    constructor(el) {
        this.#el = el;
    }

    showsAgenda() {
        let topTitle = this.#el.querySelector(".bt-tagesordnungspunkt-reden");
        if (topTitle) {
            return true;
        }
        return false;
    }

    ensureSpeakerListIsExpanded() {
        return new Promise((resolve, reject) => {
            let expandSpeakerListButton = this.#el.querySelector(".bt-show-more-text");
            if (expandSpeakerListButton) {
                expandSpeakerListButton.click();
                setTimeout(() => {
                    resolve();
                }, 1000);
            } else {
                resolve();
            }
        });
    }

    extractDataSet() {
        let metaData = extractMetaData(this.#el),
            speakerData = extractSpeakerData(this.#el);
        return {
            session: metaData,
            speeches: speakerData,
        };
    }

    appendDownloadButton(csvTable) {
        let downloadButton = document.createElement("span");
        downloadButton.classList.add("bt-button");
        downloadButton.innerHTML = "Copy CSV";
        downloadButton.title = "Copy data set to clipboard";
        downloadButton.addEventListener("click", async (event) => {
            console.log("[Bundesdownloader] \"Copy CSV\"-Button clicked");
            try {
                await navigator.clipboard.writeText(csvTable);
            } catch (error) {
                console.error(error);
            }
            console.log("[Bundesdownloader] Data set copied to clipboard");
            event.preventDefault();
        });
        this.#el.insertBefore(downloadButton, this.#el.firstChild);
    }

}

export default OverlayProxy;