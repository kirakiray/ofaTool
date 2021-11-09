window.addEventListener('DOMContentLoaded', () => {
    const fs = require("fs");

    const { contextBridge } = require('electron');

    contextBridge.exposeInMainWorld('mainAPI', {
        fs
    })
})