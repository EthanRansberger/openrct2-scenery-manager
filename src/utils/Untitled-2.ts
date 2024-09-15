/*****************************************************************************
 * Copyright (c) 2020-2022 Sadret
 *
 * The OpenRCT2 plugin "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 * 0x1 = 1 hex, & is intersect, ^
 *****************************************************************************/

export function rotate(direction: number, rotation: number): Direction;
export function rotate(direction: number | null, rotation: number): Direction | null;
export function rotate(direction: number | null, rotation: number): Direction | null {
    if (direction === null)
        return null;
    return ((direction + rotation) & 0x3) as Direction;
}


/* ethans stuff */




export function mirror(direction: number, rotation: number, mirrored?: boolean): Direction;
export function mirror(direction: number | null, rotation: number, mirrored?: boolean): Direction | null;
export function mirror(direction: number | null, rotation: number,  mirrored: boolean = true): Direction | null {
    if (direction && mirrored && direction & 0x1)
        return (((direction+rotation) ^ 0x2) & 0x3) as Direction;
    return direction && (direction & 0x3) as Direction;
}
    
  

 