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
import {consoleError} from '@klipper/bow/utils/console';
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import Vue, {PropType} from 'vue';
import {MetaInfo} from 'vue-meta';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    disableMainMetaInfo: boolean;
    metaInfoData: MetaInfo;
    metaInfoTitleGenerator: (data: Dictionary<any>) => string|null;
    refreshOnInit: boolean;
    mainNoCreation: boolean;
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
        disableMainMetaInfo: {
            type: Boolean,
            default: false,
        },

        metaInfoData: {
            type: Object as PropType<MetaInfo>,
            default: () => ({}),
        },

        metaInfoTitleGenerator: {
            type: Function as PropType<(data: Dictionary<any>) => string|null>,
            default: null,
        },

        refreshOnInit: {
            type: Boolean,
            default: true,
        },

        mainNoCreation: {
            type: Boolean,
            default: false,
        },
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
                if (this.mainNoCreation) {
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
            if (this.isMain) {
                if (this.create) {
                    consoleError('The "create" props cannot be used with the "main" props');
                }

                return this.refreshOnInit && null === this.value;
            }

            return this.create;
        },
    },

    metaInfo(): MetaInfo {
        if (this.isMain && !this.disableMainMetaInfo) {
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
