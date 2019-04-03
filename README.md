# Public-Domains
**Public Domains: Gacha Game** is a mobile RPG that uses public domain art assets. It is an April Fool's Joke.

## License
All art is in the public domain. The only original artwork created for this game is the logo, which I guess is also in the public domain because sure. All code is licensed under the GNU Affero General Public License v3.0, with the exception of a chunk at the bottom of *rendering.js*, which is licensed under the MIT License. The [Press Start 2P font](https://www.dafont.com/press-start-2p.font) font is licensed under the SIL Open Font License 1.1.

## Building (Browser)
There is no building. Just open *index.html* in a browser. No nodes, no package managers, just eight JavaScript files. If you're on a desktop browser, you're probably gonna want to use the developer tools to emulate a mobile device.

## Building (Cordova)
Just create a new Cordova project, copy the *index*, *js*, and *img* folders into the project's *www* folder, uncomment the *cordova.js* include line in *index.html* and then build for whatever platform you want. It definitely works on Android, but has not been tested on iOS.