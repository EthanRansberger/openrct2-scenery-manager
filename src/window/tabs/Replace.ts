/*****************************************************************************
 * Copyright (c) 2020-2021 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import * as Context from "../../core/Context";
import * as MapIO from "../../core/MapIO";
import * as Objects from "../../utils/Objects";
import * as Strings from "../../utils/Strings";

import GUI from "../../gui/GUI";
import Property from "../../config/Property";

const types: SceneryObjectType[] = [
    "footpath_surface",
    "footpath_railings",
    "footpath_addition",
    "small_scenery",
    "large_scenery",
    "wall",
];

const library = {
    footpath_surface: {} as { [key: string]: SceneryObjectInfo },
    footpath_railings: {} as { [key: string]: SceneryObjectInfo },
    footpath_addition: {} as { [key: string]: SceneryObjectInfo },
    small_scenery: {} as { [key: string]: SceneryObjectInfo },
    large_scenery: {} as { [key: string]: SceneryObjectInfo },
    wall: {} as { [key: string]: SceneryObjectInfo },
}

function reload(): void {
    reloadButton.setText("loading...");

    types.forEach(type => {
        library[type] = {};
        context.getAllObjects(type).forEach(
            object => library[type][Context.getIdentifierFromObject(object)] = {
                type: type,
                name: object.name,
                identifier: Context.getIdentifierFromObject(object),
                mapCount: 0,
                parkCount: 0,
            }
        );
    });

    MapIO.async_forEachElement((element, tile) => {
        switch (element.type) {
            case "footpath_addition":
            case "large_scenery":
            case "small_scenery":
            case "wall":
                library[element.type][element.identifier].mapCount++;
                if (MapIO.hasOwnership(tile))
                    library[element.type][element.identifier].parkCount++;
                return;
            case "footpath":
                library["footpath_surface"][element.surfaceIdentifier].mapCount++;
                library["footpath_railings"][element.railingsIdentifier].mapCount++;
                if (MapIO.hasOwnership(tile)) {
                    library["footpath_surface"][element.surfaceIdentifier].parkCount++;
                    library["footpath_railings"][element.railingsIdentifier].parkCount++;
                }
                return;
        }
    }, (done, progress) => {
        reloadButton.setText(done ? "reload" : `loading ${Math.round(progress * 100)}%`);
        updateItems();
    });
}

const listView: GUI.ListView = new GUI.ListView({
    showColumnHeaders: true,
    columns: [{
        header: "Type",
        width: 128,
        canSort: true,
    }, {
        header: "Name",
        width: 256,
        canSort: true,
    }, {
        header: "Identifier",
        width: 256,
        canSort: true,
    }, {
        header: "On Map",
        width: 64 - 12,
        canSort: true,
    }, {
        header: "In Park",
        canSort: true,
    },],
}, 384);

const reloadButton = new GUI.TextButton({
    onClick: reload,
});

const filterProp = new Property<"all" | SceneryObjectType>("all");
const searchProp = new Property<string>("");

function updateItems(): void {
    const filterType = filterProp.getValue();
    const items = types.filter(
        type => filterType === "all" || filterType === type
    ).map(
        type => library[type]
    ).reduce(
        (acc, val) => acc.concat(Objects.values(val)), [] as SceneryObjectInfo[]
    ).filter(
        info => {
            const name = info.name.toLowerCase();
            const identifier = info.identifier.toLowerCase();
            const search = searchProp.getValue().toLowerCase();
            return name.includes(search) || identifier.includes(search);
        }
    );
    listView.setItemsAndOnClick(items, info => [
        Strings.toDisplayString(info.type),
        info.name,
        info.identifier,
        String(info.mapCount),
        String(info.parkCount),
    ], onClick);
}
filterProp.bind(updateItems);
searchProp.bind(updateItems);

function onClick(info: SceneryObjectInfo): void {
    new GUI.WindowManager(
        {
            width: 384,
            height: 0,
            classification: "scenery-manager.objectInfo",
            title: `${info.name} (${Strings.toDisplayString(info.type)})`,
            colours: [1, 1, 0,], // shades of gray
        },
        new GUI.Window().add(
            new GUI.HBox([1, 3]).add(
                new GUI.VBox().add(
                    new GUI.Label({
                        text: "Type:",
                    }),
                    new GUI.Label({
                        text: "Name:",
                    }),
                    new GUI.Label({
                        text: "Identifier:",
                    }),
                    new GUI.Label({
                        text: "Count:",
                    }),
                ),
                new GUI.VBox().add(
                    new GUI.Label({
                        text: Strings.toDisplayString(info.type),
                    }),
                    new GUI.Label({
                        text: info.name,
                    }),
                    new GUI.Label({
                        text: info.identifier,
                    }),
                    new GUI.Label({
                        text: String(info.mapCount),
                    }),
                    new GUI.Label({
                        text: String(info.parkCount),
                    }),
                ),
            ),
            new GUI.Space(),
            new GUI.HBox([1, 1]).add(
                new GUI.TextButton({
                    text: `Delete all ${info.parkCount} instances`,
                    isDisabled: info.parkCount === 0,
                    onClick: () => {
                        MapIO.remove(
                            MapIO.find({
                                type: info.type,
                                identifier: info.identifier,
                            })
                        );
                    },
                })
            ),
        ),
    ).open(listView.getWindow());
}

export default new GUI.Tab({
    frameBase: 5221,
    frameCount: 8,
    frameDuration: 4,
}, undefined, undefined, 768, reload).add(
    reloadButton,
    new GUI.HBox([3, 8, 1,]).add(
        new GUI.Label({
            text: "Search for name or identifier:",
        }),
        new GUI.TextBox({
        }).bindValue(searchProp),
        new GUI.TextButton({
            text: "clear",
            onClick: () => searchProp.setValue(""),
        })
    ),
    new GUI.GroupBox({
        text: "Filter",
    }).add(
        new GUI.HBox([10, 10, 2, 8, 1, 2, 8, 1, 2, 8, 1]).add(
            new GUI.Label({
                text: "Type:"
            }),
            new GUI.Dropdown({
            }).bindValue(filterProp, [
                "all",
                ...types,
            ], Strings.toDisplayString),
            new GUI.Space(),
            new GUI.Checkbox({
                text: "Primary Colour:",
            }),
            new GUI.ColourPicker({
            }),
            new GUI.Space(),
            new GUI.Checkbox({
                text: "Secondary Colour:",
            }),
            new GUI.ColourPicker({
                isDisabled: true,
            }),
            new GUI.Space(),
            new GUI.Checkbox({
                text: "Secondary Colour:",
            }),
            new GUI.ColourPicker({
            }),
        ),
    ),
    listView,
);
