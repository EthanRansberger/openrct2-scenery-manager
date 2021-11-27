/*****************************************************************************
 * Copyright (c) 2020-2021 Sadret
 *
 * The OpenRCT2 plug-in "Scenery Manager" is licensed
 * under the GNU General Public License version 3.
 *****************************************************************************/

import * as Direction from "../utils/Direction";

import BaseElement from "./BaseElement";

export default new class extends BaseElement<TrackElement, TrackData> {
    createFromTileData(element: TrackElement, coords: CoordsXY): TrackData | undefined {
        if (element.sequence !== 0)
            return undefined;
        return {
            type: "track",
            x: coords.x,
            y: coords.y,
            z: element.baseZ,
            direction: element.direction,
            ride: element.ride,
            trackType: element.trackType,
            rideType: element.rideType,
            brakeSpeed: element.brakeBoosterSpeed || 0,
            colour: element.colourScheme || 0,
            seatRotation: element.seatRotation || 0,
            trackPlaceFlags:
                Number(element.isInverted) << 1 |
                Number(element.hasCableLift) << 2,
            isFromTrackDesign: false,
        };
    }

    rotate(element: TrackData, rotation: number): TrackData {
        return {
            ...super.rotate(element, rotation),
            direction: Direction.rotate(element.direction, rotation),
        };
    }
    mirror(element: TrackData): TrackData {
        return {
            ...super.mirror(element),
            direction: Direction.mirror(element.direction),
            trackType: mirrorMap[element.trackType],
        }
    }

    getPlaceArgs(element: TrackData): TrackPlaceArgs {
        return {
            ...element,
            z: element.z - trackBlock[element.trackType],
        };
    }
    getRemoveArgs(element: TrackData): TrackRemoveArgs {
        return {
            ...element,
            sequence: 0,
        };
    }

    getPlaceAction(): "trackplace" {
        return "trackplace";
    }
    getRemoveAction(): "trackremove" {
        return "trackremove";
    }
}();

const mirrorMap: number[] = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    17,
    16,
    19,
    18,
    21,
    20,
    23,
    22,
    25,
    24,
    27,
    26,
    29,
    28,
    31,
    30,
    33,
    32,
    35,
    34,
    37,
    36,
    39,
    38,
    41,
    40,
    43,
    42,
    45,
    44,
    47,
    46,
    49,
    48,
    51,
    50,
    53,
    52,
    55,
    54,
    56,
    57,
    59,
    58,
    61,
    60,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    82,
    81,
    84,
    83,
    86,
    85,
    88,
    87,
    90,
    89,
    92,
    91,
    94,
    93,
    96,
    95,
    98,
    97,
    99,
    100,
    101,
    103,
    102,
    105,
    104,
    107,
    106,
    109,
    108,
    111,
    110,
    112,
    113,
    114,
    116,
    115,
    117,
    118,
    119,
    120,
    121,
    122,
    123,
    124,
    125,
    126,
    127,
    128,
    129,
    130,
    131,
    132,
    134,
    133,
    136,
    135,
    138,
    137,
    140,
    139,
    141,
    142,
    143,
    144,
    145,
    146,
    147,
    148,
    149,
    150,
    151,
    152,
    153,
    154,
    155,
    156,
    157,
    159,
    158,
    161,
    160,
    163,
    162,
    165,
    164,
    167,
    166,
    169,
    168,
    171,
    170,
    172,
    173,
    175,
    174,
    177,
    176,
    179,
    178,
    181,
    180,
    182,
    184,
    183,
    186,
    185,
    188,
    187,
    190,
    189,
    191,
    192,
    194,
    193,
    196,
    195,
    197,
    198,
    200,
    199,
    201,
    202,
    203,
    205,
    204,
    206,
    207,
    208,
    210,
    209,
    212,
    211,
    213,
    214,
    215,
    216,
    218,
    217,
    220,
    219,
    222,
    221,
    224,
    223,
    226,
    225,
    228,
    227,
    230,
    229,
    232,
    231,
    234,
    233,
    236,
    235,
    238,
    237,
    240,
    239,
    242,
    241,
    244,
    243,
    246,
    245,
    248,
    247,
    250,
    249,
    252,
    251,
    253,
    254,
    255,
];

const trackBlock: number[] = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    48,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16,
    16,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    - 32,
    0,
    0,
    - 32,
    - 32,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    8,
    8,
    0,
    0,
    8,
    8,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    40,
    80,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    - 32,
    - 32,
    0,
    0,
    16,
    16,
    0,
    0,
    0,
    - 32,
    - 32,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    - 32,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    16,
    16,
    0,
    0,
    48,
    48,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    - 32,
    32,
];
