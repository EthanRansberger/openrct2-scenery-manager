/*****************************************************************************
 * Copyright (c) 2020-2022 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import * as Events from "../../utils/Events";
import * as MapIO from "../../core/MapIO";
import * as Selector from "../../tools/Selector";

import BooleanProperty from "../../config/BooleanProperty";
import GUI from "../../gui/GUI";
import Loading from "../widgets/Loading";
import ObjectDetails from "../ObjectDetails";
import ObjectList from "../widgets/ObjectList";
import OverlayTab from "../widgets/OverlayTab";
import SceneryIndex from "../../core/SceneryIndex";

const objectList: ObjectList = new ObjectList([], object => {
    const window = new ObjectDetails(object);
    const main = objectList.getWindow();
    if (main === undefined)
        window.open();
    else
        window.open(main);
});

let busy = false;
let requested = false;
function refresh(force = false): void {
    if (!force && objectList.getWindow() === undefined)
        return;
    if (busy) {
        requested = true;
        return;
    }
    requested = false;
    busy = true;

    loading.setIsVisible(true);
    refreshButton.setText("Refreshing...");

    new SceneryIndex(
        updateProgress,
        selectionOnlyProp.getValue() ? MapIO.getTileSelection() : undefined,
    );
}
function updateProgress(done: boolean, progress: number, index: SceneryIndex): void {
    refreshButton.setText(done ? "Refresh" : `Refreshing ${Math.round(progress * 100)}%`);
    loading.setProgress(progress);
    objectList.setObjects(index.getAllObjects());
    if (done) {
        loading.setIsVisible(false);
        loading.setProgress(undefined);
        busy = false;
        if (requested)
            refresh();
    }
}

const refreshButton = new GUI.TextButton({
    onClick: refresh,
});

const loading = new Loading(1 << 6);

const selectionOnlyProp = new BooleanProperty(false);
selectionOnlyProp.bind(refresh);
Events.tileSelection.register(() => {
    if (selectionOnlyProp.getValue())
        refresh();
});

Events.mainWindowOpen.register(reOpen => reOpen || refresh(true));

export default new OverlayTab({
    overlay: loading,
    image: {
        frameBase: 5245,
        frameCount: 8,
        frameDuration: 4,
    },
    width: 768,
}).add(
    new GUI.GroupBox({
        text: "Filter",
    }).add(
        new GUI.HBox([1, 3, 1, 1, 2, 1, 2, 3, 1]).add(
            ...objectList.typeWidgets,
            new GUI.Space(),
            ...objectList.usageWidgets,
            new GUI.Space(),
            ...objectList.searchWidgets,
        ),
    ),
    objectList,
    new GUI.HBox([1, 1, 1,]).add(
        refreshButton,
        new GUI.Checkbox({
            text: "Selected area only",
        }).bindValue(selectionOnlyProp),
        new GUI.TextButton({
            text: "Select area",
            onClick: Selector.activate,
        }),
    ),
);
