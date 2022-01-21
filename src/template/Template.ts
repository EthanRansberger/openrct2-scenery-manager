/*****************************************************************************
 * Copyright (c) 2020-2022 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import * as Banner from "./Banner";
import * as Coordinates from "../utils/Coordinates";
import * as Entrance from "./Entrance";
import * as Footpath from "./Footpath";
import * as LargeScenery from "./LargeScenery";
import * as SmallScenery from "./SmallScenery";
import * as Surface from "./Surface";
import * as Track from "./Track";
import * as Wall from "./Wall";

interface BaseElement<S extends TileElement, T extends ElementData> {
    getMissingObjects(
        element: T,
    ): MissingObject[];
    rotate(
        element: T,
        rotation: number,
    ): T;
    mirror(
        element: T,
    ): T;
    copyFrom(
        src: S,
        dst: T,
    ): void;
    copyTo(
        src: T,
        dst: S,
    ): void;
    getPlaceActionData(
        coords: CoordsXY,
        element: T,
        flags: number,
    ): PlaceActionData[];
    getRemoveActionData(
        coords: CoordsXY,
        element: T,
        flags: number,
    ): RemoveActionData[];
}

const map: {
    banner: BaseElement<BannerElement, BannerData>,
    entrance: BaseElement<EntranceElement, EntranceData>,
    footpath: BaseElement<FootpathElement, FootpathData>,
    large_scenery: BaseElement<LargeSceneryElement, LargeSceneryData>,
    small_scenery: BaseElement<SmallSceneryElement, SmallSceneryData>,
    surface: BaseElement<SurfaceElement, SurfaceData>,
    track: BaseElement<TrackElement, TrackData>,
    wall: BaseElement<WallElement, WallData>,
} = {
    banner: Banner,
    entrance: Entrance,
    footpath: Footpath,
    large_scenery: LargeScenery,
    small_scenery: SmallScenery,
    surface: Surface,
    track: Track,
    wall: Wall,
};

function get(element: TileElement | ElementData): BaseElement<TileElement, ElementData> {
    return map[element.type];
}

export default class Template {
    public data: TemplateData;

    public constructor(data: TemplateData) {
        this.data = data;
    }

    public transform(mirrored: boolean, rotation: number, offset: CoordsXYZ, filterZ: boolean): Template {
        return this.mirror(mirrored).rotate(rotation).translate(offset).filterZ(filterZ);
    }

    public translate(offset: CoordsXYZ): Template {
        if (Coordinates.equals(offset, Coordinates.NULL))
            return this;
        return new Template({
            tiles: this.data.tiles.map(tile => ({
                ...Coordinates.add(tile, offset),
                elements: tile.elements.map(element => ({
                    ...element,
                    baseHeight: element.baseHeight + offset.z / 8,
                    baseZ: element.baseZ + offset.z,
                    clearanceHeight: element.clearanceHeight + offset.z / 8,
                    clearanceZ: element.clearanceZ + offset.z,
                })),
            })),
            mapRange: {
                leftTop: Coordinates.add(this.data.mapRange.leftTop, offset),
                rightBottom: Coordinates.add(this.data.mapRange.rightBottom, offset),
            },
        });
    }

    public rotate(rotation: number): Template {
        if ((rotation & 3) === 0)
            return this;
        return new Template({
            tiles: this.data.tiles.map(tile => ({
                ...Coordinates.rotate(tile, rotation),
                elements: tile.elements.map(element => get(element).rotate(element, rotation)),
            })),
            mapRange: {
                leftTop: Coordinates.rotate(this.data.mapRange.leftTop, rotation),
                rightBottom: Coordinates.rotate(this.data.mapRange.rightBottom, rotation),
            },
        });
    }

    public mirror(mirrored: boolean = true): Template {
        if (!mirrored)
            return this;
        return new Template({
            tiles: this.data.tiles.map(tile => ({
                ...Coordinates.mirror(tile),
                elements: tile.elements.map(element => get(element).mirror(element)),
            })),
            mapRange: {
                leftTop: Coordinates.mirror(this.data.mapRange.leftTop),
                rightBottom: Coordinates.mirror(this.data.mapRange.rightBottom),
            },
        });
    }

    public filterZ(filterZ: boolean): Template {
        return filterZ ? new Template({
            tiles: this.data.tiles.map(tile => ({
                ...tile,
                elements: tile.elements.filter(element => element.baseZ > 0),
            })),
            mapRange: this.data.mapRange,
        }) : this;
    }

    public static get(element: TileElement | ElementData): BaseElement<TileElement, ElementData> {
        return get(element);
    }

    public static copyBase(
        src: ElementData | TileElement,
        dst: ElementData | TileElement
    ): void {
        dst.type = src.type;
        dst.baseHeight = src.baseHeight;
        dst.baseZ = src.baseZ;
        dst.clearanceHeight = src.clearanceHeight;
        dst.clearanceZ = src.clearanceZ;
        dst.occupiedQuadrants = src.occupiedQuadrants;
        dst.isGhost = src.isGhost;
        dst.isHidden = src.isHidden;
    }

    public static copyFrom(src: TileElement, dst: ElementData = {} as ElementData): ElementData {
        this.copyBase(src, dst);
        get(src).copyFrom(src, dst);
        return dst;
    }

    public static copyTo(src: ElementData, dst: TileElement): TileElement {
        this.copyBase(src, dst);
        get(src).copyTo(src, dst);
        return dst;
    }

    public static getPlaceActionData(
        coords: CoordsXY,
        element: ElementData,
        flags: number,
    ): PlaceActionData[] {
        return get(element).getPlaceActionData(Coordinates.toWorldCoords(coords), element, flags);
    }

    public static getRemoveActionData(
        coords: CoordsXY,
        element: ElementData,
        flags: number,
    ): RemoveActionData[] {
        return get(element).getRemoveActionData(Coordinates.toWorldCoords(coords), element, flags);
    }

    public static getMissingObjects(element: ElementData): MissingObject[] {
        return get(element).getMissingObjects(element);
    }

    public static isAvailable(element: ElementData): boolean {
        return Template.getMissingObjects(element).length === 0;
    }

    public isAvailable(): boolean {
        for (let tile of this.data.tiles)
            for (let element of tile.elements)
                if (!Template.isAvailable(element))
                    return false;
        return true;
    }

    // TODO: implement correctly
    public static copy(element: TileElement): TileElement {
        return Template.copyTo(Template.copyFrom(element), {} as TileElement);
    }
}
