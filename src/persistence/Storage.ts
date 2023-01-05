/*****************************************************************************
 * Copyright (c) 2020-2022 Sadret
 *
 * The OpenRCT2 plugin "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import JsonFileSystem from "../libs/persistence/JsonFileSystem";

export const libraries = {
    templates: new JsonFileSystem<TemplateData>("libraries.templates"),
    scatterPattern: new JsonFileSystem<ScatterPattern>("libraries.scatterPattern"),
}
