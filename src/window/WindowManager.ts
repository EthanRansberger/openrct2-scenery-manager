/*****************************************************************************
 * Copyright (c) 2020-2021 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

/// <reference path="./../../../openrct2.d.ts" />

let handle: Window = undefined;

export function getHandle(): Window {
    return handle;
}

export function setHandle(win: Window): void {
    handle = win;
}

export function getWidget<T extends Widget>(name: string): T {
    return handle && handle.findWidget<T>(name);
}
