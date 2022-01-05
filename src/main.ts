/*****************************************************************************
 * Copyright (c) 2020-2022 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

/// <reference path="./../../openrct2.d.ts" />

import * as Configuration from "./config/Configuration";
import * as Shortcuts from "./Shortcuts";
import * as StartUp from "./StartUp";
import * as Updater from "./Updater";

import MainWindow from "./window/MainWindow";

registerPlugin({
    name: "scenery-manager",
    version: "1.2.1",
    authors: ["Sadret"],
    type: "local",
    licence: "GPL-3.0",
    minApiVersion: 40,
    targetApiVersion: 40,
    main: () => {
        if (typeof ui === "undefined")
            return console.log("[scenery-manager] Loading cancelled: game runs in headless mode.");

        Updater.update(() => {
            Configuration.load();
            ui.registerMenuItem("Scenery Manager", () => MainWindow.open());
            Shortcuts.register();
            // TODO: only used for TemplateView. eliminate? (maybe load when tab focuses or just direct call here)
            StartUp.execute();
        });
    },
});
