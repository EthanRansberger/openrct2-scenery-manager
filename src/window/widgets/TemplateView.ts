/*****************************************************************************
 * Copyright (c) 2020-2021 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import * as Coordinates from "../../utils/Coordinates";

import FileView from "./FileView";

export default class extends FileView<TemplateData> {
    constructor(height?: number) {
        super(
            [{
                header: "Name",
                ratioWidth: 5,
            }, {
                header: "Width",
                ratioWidth: 1,
            }, {
                header: "Length",
                ratioWidth: 1,
            }, {
                header: "Size",
                ratioWidth: 1,
            }],
            height,
        );
    }

    getItem(file: IFile<TemplateData>): ListViewItem {
        const data = file.getContent();
        if (data === undefined)
            console.log("TemplateView_34: undefined");
        if (data === undefined)
            return [file.getName()];
        const size = Coordinates.getSize(Coordinates.toMapRange(data.tiles));
        return [file.getName(), String(size.tx), String(size.ty), String(data.elements.length)];
    }
};
