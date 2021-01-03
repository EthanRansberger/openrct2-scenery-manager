/*****************************************************************************
 * Copyright (c) 2020 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import { BoxBuilder } from "../gui/WindowBuilder";

class FootpathAdditions {
    public static instance: FootpathAdditions = new FootpathAdditions();
    private constructor() { }

    public build(builder: BoxBuilder): void {
        builder.addLabel({ text: "coming soon" });
    }
}
export default FootpathAdditions.instance;
