/*****************************************************************************
 * Copyright (c) 2020-2021 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import * as ObjectIndex from "../../core/ObjectIndex";

import BooleanProperty from "../../config/BooleanProperty";
import GUI from "../../gui/GUI";
import Loading from "../widgets/Loading";
import ObjectList from "../widgets/ObjectList";
import OverlayTab from "../widgets/OverlayTab";
import ReplaceWindow from "../ReplaceWindow";
import Selector from "../../tools/Selector";

const objectList: ObjectList = new ObjectList(
    ObjectIndex.getSceneryObjectIndex(() => { }, []),
    true,
    info => new ReplaceWindow(info).open(objectList.getWindow()),
);

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

    const index = ObjectIndex.getSceneryObjectIndex(
        (done, progress) => updateProgress(done, progress, index),
        selectionOnlyProp.getValue() ? (ui.tileSelection.range || ui.tileSelection.tiles) : undefined,
    );
}
function updateProgress(done: boolean, progress: number, index: SceneryObjectIndex): void {
    refreshButton.setText(done ? "Refresh" : `Refreshing ${Math.round(progress * 100)}%`);
    loading.setProgress(progress);
    objectList.setIndex(index);
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

const loading = new Loading();

const selectionOnlyProp = new BooleanProperty(false);
selectionOnlyProp.bind(refresh);
Selector.onSelect(() => {
    if (selectionOnlyProp.getValue())
        refresh();
});

export default new OverlayTab(loading, {
    frameBase: 5245,
    frameCount: 8,
    frameDuration: 4,
}, undefined, undefined, 768, () => refresh(true)).add(
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
