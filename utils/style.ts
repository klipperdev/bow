/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {deepMerge} from '@klipper/bow/utils/object';

type CSSMatrix = DOMMatrix;
declare var CSSMatrix: typeof DOMMatrix;

type MSCSSMatrix = DOMMatrix;
declare var MSCSSMatrix: typeof DOMMatrix;

/**
 * Get the horizontal position of target element.
 */
export function getTargetPosition(el: HTMLElement): number {
    const transformCss = getComputedStyle(el).transform;
    let transform = {e: 0, f: 0};
    let reMatrix;
    let match;

    if (transformCss) {
        if ('function' === typeof CSSMatrix) {
            transform = new CSSMatrix(transformCss);
        } else if ('function' === typeof WebKitCSSMatrix) {
            transform = new WebKitCSSMatrix(transformCss);
        } else if ('function' === typeof MSCSSMatrix) {
            transform = new MSCSSMatrix(transformCss);
        } else {
            reMatrix = new RegExp('matrix\\(\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*-?\\d+(?:\\.\\d+)?\\s*,'
                + '\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*-?\\d+(?:\\.\\d+)?\\s*,\\s*(-?\\d+(?:\\.\\d+)?)\\s*,'
                + '\\s*(-?\\d+(?:\\.\\d+)?)\\s*\\)');
            match = transformCss.match(reMatrix);

            if (match) {
                transform.e = parseInt(match[1], 10);
                transform.f = parseInt(match[2], 10);
            }
        }
    }

    return transform.e;
}

export function mergeClassesToString(originalClasses: string|string[]|undefined, newClasses: string|string[]|undefined): string|undefined {
    const values = mergeClasses(originalClasses, newClasses);

    return values.length > 0 ? values.join(' ') : undefined;
}

export function mergeClasses(originalClasses: string|string[]|undefined, newClasses: string|string[]|undefined): string[] {
    const oClasses = getClasses(originalClasses);
    const nClasses = getClasses(newClasses);

    return oClasses.concat(nClasses.filter((item: string) => oClasses.indexOf(item) < 0));
}

export function getClasses(classes: string|string[]|undefined): string[] {
    if (Array.isArray(classes)) {
        return classes;
    }

    return typeof classes === 'string' ? classes.split(' ') : [];
}

export function getMapClasses(classes: string|string[]|Dictionary<boolean>|undefined): Dictionary<boolean> {
    if (typeof classes === 'object') {
        return classes as Dictionary<boolean>;
    }

    const res = {} as Dictionary<any>;
    const values = getClasses(classes);

    for (const val of values) {
        res[val] = true;
    }

    return res;
}

export function mergeMapClasses(
    originalClasses: string|string[]|Dictionary<boolean>|undefined,
    newClasses: string|string[]|Dictionary<boolean>|undefined,
): Dictionary<boolean> {
    const oClasses = getMapClasses(originalClasses);
    const nClasses = getMapClasses(newClasses);

    return deepMerge<Dictionary<boolean>>(oClasses, nClasses) as Dictionary<boolean>;
}
