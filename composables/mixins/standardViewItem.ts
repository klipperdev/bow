/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {inject as RegistrableInject} from '@klipper/bow/composables/mixins/registrable';
import {ObjectMetadata} from '@klipper/bow/metadata/ObjectMetadata';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    metadata?: string;
}

interface Data {
    standardData: StandardViewData;
}

interface Computed {
    get metadataName(): string|undefined;
    get isMetadataInitialized(): boolean;
    get objectMetadata(): ObjectMetadata|null;
}

interface Methods {
    setStandardData(data: StandardViewData): void;
}

export const StandardViewItem = Vue.extend<Data, Methods, Computed, Props>({
    name: 'standardViewItem',

    mixins: [
        RegistrableInject<'standardView', any>('standardView'),
    ],

    props: {
        metadata: {
            type: String,
        },
    },

    data() {
        return {
            standardData: {
                metadata: null,
                currentLocale: '',
                editMode: false,
                vertical: false,
                dense: false,
                loading: false,
                showLoading: false,
                isCreate: true,
                id: null,
                data: null,
                pushAction: async () => {},
                error: null,
            },
        };
    },

    computed: {
        metadataName(): string|undefined {
            return this.metadata || (this.standardData && this.standardData.metadata ? this.standardData.metadata : undefined);
        },

        isMetadataInitialized(): boolean {
            return undefined === this.$store.state.metadata || this.$store.state.metadata.initialized;
        },

        objectMetadata(): ObjectMetadata|null {
            if (!this.isMetadataInitialized || !this.metadataName || !this.$store.state.metadata.metadatas[this.metadataName]) {
                return null;
            }

            return this.$store.state.metadata.metadatas[this.metadataName];
        },
    },

    methods: {
        setStandardData(data: StandardViewData): void {
            this.standardData = data;
        },
    },
});
