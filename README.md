# Overview

HakjDB GUI is a cross-platform GUI desktop application for [HakjDB](https://github.com/hollowdll/hakjdb) in-memory key-value data store project.

It allows you to control and iteract with HakjDB servers visually with a graphical user interface. It is an alternative tool for the hakjctl CLI tool.

hakjctl is a CLI tool for HakjDB that allows you to control HakjDB servers from the command line. HakjDB GUI is more user friendly for people who are not familiar with the command line, allowing you to control HakjDB servers by clicking buttons and filling forms.

NOTE: This project is not finished. The `main` branch is currently unstable and being reworked to work with the API v1.

Tested platforms: Linux and Windows.

# Build

This section explains how to build the app from source and run it in development mode. Only Windows and Linux are tested.

## Prerequisites

This app uses Tauri framework and therefore requires you to have a few things. Read Tauri's prerequisites [here](https://tauri.app/v1/guides/getting-started/prerequisites).

You will also need Protobuf compiler. Instructions [here](https://github.com/protocolbuffers/protobuf#protobuf-compiler-installation).

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

