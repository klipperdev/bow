/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardComponent} from '@klipper/bow/mixins/StandardComponent';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardMainComponent extends mixins(
    StandardComponent,
) {
    @Prop({type: Object, default: () => ({})})
    public metaInfoData!: MetaInfo;

    @Prop({type: Function})
    public metaInfoTitleGenerator: (data: Dictionary<any>) => string|null;

    @Prop({type: Boolean, default: true})
    public refreshOnInit!: boolean;


    @Prop({type: Boolean, default: false})
    public noCreation!: boolean;

    /**
     * Override default value of StandardComponent.
     */
    protected replaceLocaleRoute: boolean = true;

    protected metaInfoTitle: string|null = null;

    /**
     * Check if the component can be use the route and meta info.
     */
    protected get isMain(): boolean {
        return true;
    }

    protected get isCreate(): boolean {
        if (this.isMain) {
            if (this.noCreation) {
                return false;
            }

            if (undefined !== this.value && null !== this.value && typeof this.value === 'object') {
                return !(this.value as any).id;
            }

            return !this.$route.params.id || 'create' === this.$route.params.id;
        }

        return !this.data || !this.data.id;
    }

    protected get id(): string|number|undefined {
        if (this.isMain) {
            if (this.noCreation) {
                return -1;
            }

            if (undefined !== this.value && null !== this.value && typeof this.value === 'object') {
                return (this.value as any).id;
            }

            const id = this.data && this.data.id ? this.data.id : this.$route.params.id;

            return 'create' !== id ? id : undefined;
        }

        return this.data && this.data.id ? this.data.id : undefined;
    }

    protected get refreshOnCreated(): boolean {
        return this.isMain && this.refreshOnInit;
    }

    public metaInfo(): MetaInfo {
        if (this.isMain) {
            const title = !!this.metaInfoTitleGenerator && !!this.data && !this.isCreate
                ? this.metaInfoTitleGenerator(this.data)
                : this.metaInfoTitle;

            return Object.assign({
                title: this.$ml(this.metadataName || '') + ' : ' + (title || (this.isCreate ? this.$t('new') : '~')),
            }, this.metaInfoData);
        }

        return {};
    }

    protected onGlobalKeyDown(event: KeyboardEvent): void {
        if (this.isMain && event.shiftKey && event.altKey && event.code === 'KeyE') {
            this.toggleEdit();
        }
    }

    @Watch('data')
    @Watch('isMetadataInitialized')
    protected watchData() {
        if (!!this.objectMetadata && !!this.data && !this.isCreate) {
            this.metaInfoTitle = getPropertyFromItem(this.data, this.objectMetadata.fieldLabel, null);
        } else {
            this.metaInfoTitle = null;
        }
    }
}
