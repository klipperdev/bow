/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardComponentActionable} from '@klipper/bow/mixins/StandardComponentActionable';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {mixins} from 'vue-class-component';
import {MetaInfo} from 'vue-meta';
import {Component, Prop, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardView extends mixins(
    StandardComponentActionable,
) {
    @Prop({type: Object, default: () => {}})
    public metaInfoData!: MetaInfo;

    @Prop({type: Function})
    public metaInfoTitleGenerator: (data: Dictionary<any>) => string|null;

    @Prop({type: Boolean, default: true})
    public editModeKeepList!: boolean;

    protected replaceLocaleRoute: boolean = true;

    protected metaInfoTitle: string|null = null;

    protected get isCreate(): boolean {
        return !this.$route.params.id || 'create' === this.$route.params.id;
    }

    protected get id(): string|number|undefined {
        const id = this.data && this.data.id ? this.data.id : this.$route.params.id;

        return 'create' !== id ? id : undefined;
    }

    private get displayLists(): boolean {
        return !this.isCreate && (!this.editMode || (this.editMode && this.editModeKeepList));
    }

    protected get refreshOnCreated(): boolean {
        return true;
    }

    private get bindSlotData(): any {
        return Object.assign({
            displayLists: this.displayLists,
        }, this.genSlotProps);
    }

    public metaInfo(): MetaInfo {
        const title = !!this.metaInfoTitleGenerator && !!this.data && !this.isCreate
            ? this.metaInfoTitleGenerator(this.data)
            : this.metaInfoTitle;

        return Object.assign({
            title: this.$ml(this.metadata) + ' : ' + (title || (this.isCreate ? this.$t('new') : '~')),
        }, this.metaInfoData);
    }

    protected onGlobalKeyDown(event: KeyboardEvent): void {
        if (event.shiftKey && event.altKey && event.code === 'KeyE') {
            this.toggleEdit();
        }
    }

    @Watch('data')
    @Watch('isMetadataInitialized')
    private watchData() {
        if (!!this.objectMetadata && !!this.data && !this.isCreate) {
            this.metaInfoTitle = getPropertyFromItem(this.data, this.objectMetadata.fieldLabel, null);
        } else {
            this.metaInfoTitle = null;
        }
    }
}
