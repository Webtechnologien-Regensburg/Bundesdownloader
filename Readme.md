# Bundesdownloader

This Firefox extensions allows for easy extracting of meta data from the _Mediathek_ of the [German Bundestag](https://www.bundestag.de/mediathek). While the user browses single agenda items for any plenary debate, the extension automatically adds an additional button to the user interface. By clicking on this button a _CSV_-formatted string containing meta data for every speech for the currently viewed agenda item is copied to the clipboard.  

## Data

For each speech for the selected agenda item, the following data is extracted:

- Session number and date
- Agenda item (number) and title
- Position (of the speech)
- Speaker's name, office, party or parliamentary group,
- Link to an image of the speaker
- Link to the recorded speech

## Build

- Install dependencies by running `npm install`
- Build extension by running `npm run build`