/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue, {ComponentOptions} from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export const AppFillHeightable: ComponentOptions<Vue|any> = {
    name: 'appFillHeightable',

    created(): void {
        if (0 === initializedCount) {
            const htmlEl = getHtmlElement();

            if (null !== htmlEl) {
                htmlEl.classList.add('app-fill-height');
            }
        }

        ++initializedCount;
    },

    destroyed(): void {
        --initializedCount;

        if (0 === initializedCount) {
            const htmlEl = getHtmlElement();

            if (null !== htmlEl) {
                htmlEl.classList.remove('app-fill-height');
            }
        }
    },

    computed: {
        initializedCount: function () {
            return initializedCount;
        }
    },
}

/**
 * Global helper.
 */
let initializedCount: number = 0
let htmlEl: HTMLElement|null = null;

function getHtmlElement(): HTMLElement|null {
    if (null === htmlEl) {
        htmlEl = document.querySelector('html');
    }

    return htmlEl;
}
