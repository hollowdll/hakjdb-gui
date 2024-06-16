# Overview

kvdb-gui is a cross-platform GUI desktop application for [kvdb](https://github.com/hollowdll/kvdb) in-memory key-value store project.

It allows you to manage kvdb servers visually with a graphical user interface. It is an alternative tool for the kvdb CLI tool.

kvdb-cli is a CLI tool for kvdb that allows you to manage kvdb servers from the command line. kvdb-gui is more user friendly for people who are not familiar with the command line, allowing you to manage kvdb servers by clicking buttons and filling forms.

NOTE: This project is in early development.

# Build

This section explains how to build the app from source and run it in development mode. Only Windows and Linux are tested.

## Prerequisites

Coming soon.

## Linux

Running the app may vary between Linux distributions.

In some cases you might need to set the following environment variable
```sh
export WEBKIT_DISABLE_COMPOSITING_MODE=1
```

## Install

Clone with git
```sh
git clone https://github.com/hollowdll/kvdb-gui.git
```

Go to the directory depending on where you cloned it
```sh
cd kvdb-gui
```

Install node dependencies
```sh
npm i
```

Run the app. This will compile the Rust crates and therefore may take some time.
```sh
npm run tauri dev
```

