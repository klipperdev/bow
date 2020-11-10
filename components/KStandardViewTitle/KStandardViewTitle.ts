/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {randomNumberBetween} from '@klipper/bow/utils/number';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewTitle extends mixins(
    RegistrableInject<'loaderWrapper', any>('loaderWrapper'),
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

    private dynamicLoading: boolean = false;

    private get displayDefaultTitle(): boolean {
        return Object.keys(this.$slots).length ? false : !this.title;
    }

    private get isLoading(): boolean {
        return this.loading || this.dynamicLoading;
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

    public created(): void {
        if ((this as any).loaderWrapper) {
            (this as any).loaderWrapper.register(this);
        }
    }

    public beforeDestroy(): void {
        if ((this as any).loaderWrapper) {
            (this as any).loaderWrapper.unregister(this);
        }
    }

    public setLoading(loading: boolean): void {
        this.dynamicLoading = loading;
    }
}
