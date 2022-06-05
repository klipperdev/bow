/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardComponent} from '@klipper/bow/composables/mixins/standardComponent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import Vue, {PropType} from 'vue';
import {MetaInfo} from 'vue-meta';
import {getPropertyFromItem} from '../../utils/object';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    metaInfoData: MetaInfo;
    metaInfoTitleGenerator: (data: Dictionary<any>) => string|null;
    refreshOnInit: boolean;
    noCreation: boolean;
}

interface Data {
    metaInfoTitle: string|null;
}

interface Methods {
    onGlobalKeyDown(event: KeyboardEvent): void;
}

export const StandardMainComponent = Vue.extend<Data, Methods, {}, Props>({
    name: 'standardMainComponent',

    mixins: [
        StandardComponent,
    ],

    props: {
        metaInfoData: {
            type: Object as PropType<MetaInfo>,
            default: () => ({}),
        },

        metaInfoTitleGenerator: {
            type: Function as PropType<(data: Dictionary<any>) => string|null>,
        },

        refreshOnInit: {
            type: Boolean,
            default: true,
        },

        noCreation: {
            type: Boolean,
            default: false,
        }
    },

    data() {
        return {
            /**
             * Override default value of StandardComponent.
             */
            replaceLocaleRoute: true,
            metaInfoTitle: null,
        };
    },

    computed: {
        /**
         * Check if the component can be use the route and meta info.
         */
        isMain(): boolean {
            return true;
        },

        /**
         * Override default method.
         */
        isCreate(): boolean {
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
        },

        /**
         * Override default method.
         */
        id(): string|number|undefined {
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
        },

        /**
         * Override default method.
         */
        refreshOnCreated(): boolean {
            return this.isMain && this.refreshOnInit;
        },
    },

    metaInfo(): MetaInfo {
        if (this.isMain) {
            const title = !!this.metaInfoTitleGenerator && !!this.data && !this.isCreate
                ? this.metaInfoTitleGenerator(this.data)
                : this.metaInfoTitle;

            return Object.assign({
                title: this.$ml(this.metadataName || '') + ' : ' + (title || (this.isCreate ? this.$t('new') : '~')),
            }, this.metaInfoData);
        }

        return {};
    },

    methods: {
        onGlobalKeyDown(event: KeyboardEvent): void {
            if (this.isMain && event.shiftKey && event.altKey && event.code === 'KeyE') {
                this.toggleEdit();
            }
        },
    },

    watch: {
        data: {
            handler(): void {
                if (!!this.objectMetadata && !!this.data && !this.isCreate) {
                    this.metaInfoTitle = getPropertyFromItem(this.data, this.objectMetadata.fieldLabel, null);
                } else {
                    this.metaInfoTitle = null;
                }
            },
        },

        isMetadataInitialized: {
            handler(): void {
                if (!!this.objectMetadata && !!this.data && !this.isCreate) {
                    this.metaInfoTitle = getPropertyFromItem(this.data, this.objectMetadata.fieldLabel, null);
                } else {
                    this.metaInfoTitle = null;
                }
            },
        },
    },
});
