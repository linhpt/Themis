# Themis

## Development server

Clone project: `git clone https://github.com/linhpt/themis.git`

Go to the source folder: `npm install` for installing dependencies

Run `npm run electron` for a dev server

## Build

Run `electron-packager <sourcedir> <appname> --platform=win32 --arch=x64` to .exe app. The build artifacts will be stored in the `<appname>-win32-x64` directory. Open the folder you will see the <appname>.exe file
