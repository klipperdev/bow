/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ContentConfig} from '@klipper/bow/api/ContentConfig';

/**
 * Add the locale interceptor.
 *
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export function getQueries(el: HTMLElement, config: ContentConfig): Record<string, string|number> {
    const queries: Record<string, string|number> = {};

    const mode: string|null = config.mode || null;
    const keepOriginal: boolean|null = undefined !== config.keepOriginal ? config.keepOriginal : null;
    let scale: number|null = config.scale || null;
    let width: number|null = config.width || null;
    let height: number|null = config.height || null;

    if (null !== mode) {
        if (null === scale) {
            scale = undefined !== window.devicePixelRatio ? window.devicePixelRatio : null;
        }

        if (null === width) {
            width = parseInt(window.getComputedStyle(el).width, 10) || null;
        }

        if (null === height) {
            height = parseInt(window.getComputedStyle(el).height, 10) || null;
        }
    }

    if (mode) {
        queries.m = mode;
    }

    if (scale) {
        queries.s = scale;
    }

    if (null !== keepOriginal) {
        queries.o = keepOriginal ? 1 : 0;
    }

    if (width) {
        queries.w = width;
    }

    if (height) {
        queries.h = height;
    }

    return queries;
}
