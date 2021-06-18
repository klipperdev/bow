/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import Vue from 'vue';
import {Component} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class AppFillHeightable extends Vue {
    private static initializedCount: number = 0;

    private static htmlEl: HTMLElement|null = null;

    private static getHtmlElement(): HTMLElement|null {
        if (null === AppFillHeightable.htmlEl) {
            AppFillHeightable.htmlEl = document.querySelector('html');
        }

        return AppFillHeightable.htmlEl;
    }

    protected get initializedCount(): number {
        return AppFillHeightable.initializedCount;
    }

    public created(): void {
        if (0 === AppFillHeightable.initializedCount) {
            const htmlEl = AppFillHeightable.getHtmlElement();

            if (null !== htmlEl) {
                htmlEl.classList.add('app-fill-height');
            }
        }

        ++AppFillHeightable.initializedCount;
    }

    public destroyed(): void {
        --AppFillHeightable.initializedCount;

        if (0 === AppFillHeightable.initializedCount) {
            const htmlEl = AppFillHeightable.getHtmlElement();

            if (null !== htmlEl) {
                htmlEl.classList.remove('app-fill-height');
            }
        }
    }
}
