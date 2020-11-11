/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardViewItem} from '@klipper/bow/mixins/StandardViewItem';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewTitle extends mixins(
    StandardViewItem,
) {
    @Prop({type: String, default: 'primary--text'})
    public color: string;

    @Prop({type: String, default: 'text--lighten-3'})
    public darkColor: string;

    @Prop({type: Boolean, default: false})
    public loading: boolean;

    @Prop({type: Object})
    public skeletonLoaderProps!: object|undefined;

    @Prop({type: String})
    public title!: string|undefined;

    @Prop({type: String, default() {
        return this.$t('new');
    }})
    public defaultTitle!: string;

    @Prop({type: String})
    public prefix!: string|undefined;

    /**
     * Content width average used to create the skeleton loader
     */
    @Prop({type: String, default: 'random'})
    public contentWidth!: string|undefined;

    private get displayDefaultTitle(): boolean {
        return Object.keys(this.$slots).length ? false : !this.genTitle;
    }

    private get isLoading(): boolean {
        return this.loading || this.standardData.loading;
    }

    private get skeletonLoaderPropsValue(): Dictionary<any> {
        let contentWidth = this.contentWidth || undefined;

        if ('random' === contentWidth) {
            contentWidth = randomNumberBetween(30, 80) + '%';
        }

        return Object.assign(
            {type: 'heading', width: contentWidth},
            this.skeletonLoaderProps || {},
        );
    }

    private get classes(): Dictionary<boolean> {
        return this.$classes({
            'text-h6': true,
            'flex-grow-1': true,
            [this.color]: true,
        }, {
            [this.darkColor]: true,
        });
    }

    private get genTitle(): string|undefined {
        if (!this.title && !!this.objectMetadata && this.objectMetadata.fieldLabel && this.standardData.data) {
            const title = getPropertyFromItem(this.standardData.data, this.objectMetadata.fieldLabel);

            return !title ? getPropertyFromItem(this.standardData.data, this.objectMetadata.fieldIdentifier) : title;
        }

        return this.title;
    }
}
