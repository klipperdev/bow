/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class SkeletonLoaderable extends Vue {
    @Prop({type: Boolean, default: false})
    public loading: boolean;

    @Prop({type: Object})
    public skeletonLoaderProps!: Dictionary<any>|undefined;

    @Prop({type: Boolean, default: false})
    public disableLoading: boolean;

    /**
     * Content width average used to create the skeleton loader
     */
    @Prop({type: String, default: 'random'})
    public contentWidth!: string|undefined;

    protected get skeletonLoaderPropsValue(): Dictionary<any> {
        let contentWidth = this.contentWidth || undefined;

        if ('random' === contentWidth) {
            contentWidth = randomNumberBetween(30, 80) + '%';
        }

        return Object.assign(
            {class: 'mt-1', type: 'text', width: contentWidth},
            this.skeletonLoaderProps || {},
        );
    }
}
