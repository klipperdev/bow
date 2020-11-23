/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {StandardViewItem as StandardViewItemInterface} from '@klipper/bow/standardView/StandardViewItem';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardViewItem extends mixins(
    RegistrableInject<'standardView', any>('standardView'),
) implements StandardViewItemInterface {
    @Prop({type: String})
    public metadata!: string;

    protected standardData: StandardViewData = {
        metadata: null,
        currentLocale: '',
        editMode: false,
        vertical: false,
        dense: false,
        loading: false,
        isCreate: true,
        id: null,
        data: null,
        pushAction: async () => {},
        error: null,
    };

    protected get metadataName(): string|undefined {
        return this.metadata || (this.standardData && this.standardData.metadata ? this.standardData.metadata : undefined);
    }

    protected get isMetadataInitialized(): boolean {
        return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
    }

    protected get objectMetadata(): ObjectMetadata|null {
        if (!this.isMetadataInitialized || !this.metadataName || !this.$store.state.metadata.metadatas[this.metadataName]) {
            return null;
        }

        return this.$store.state.metadata.metadatas[this.metadataName];
    }

    public created(): void {
        if (this.standardView) {
            this.standardView.register(this);
        }
    }

    public beforeDestroy(): void {
        if (this.standardView) {
            this.standardView.unregister(this);
        }
    }

    public setStandardData(data: StandardViewData): void {
        this.standardData = data;
    }
}
