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

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    metaInfoData: MetaInfo;
    metaInfoTitleGenerator: (data: Dictionary<any>) => string|null;
    refreshOnInit: boolean;
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
         * Override default method.
         */
        isCreate(): boolean {
            if (undefined !== this.value && null !== this.value && typeof this.value === 'object') {
                return !(this.value as any).id;
            }

            return !this.$route.params.id || 'create' === this.$route.params.id;
        },

        /**
         * Override default method.
         */
        id(): string|number|undefined {
            if (undefined !== this.value && null !== this.value && typeof this.value === 'object') {
                return (this.value as any).id;
            }

            const id = this.data && this.data.id ? this.data.id : this.$route.params.id;

            return 'create' !== id ? id : undefined;
        },

        /**
         * Override default method.
         */
        refreshOnCreated(): boolean {
            return this.refreshOnInit;
        },
    },

    metaInfo(): MetaInfo {
        const title = !!this.metaInfoTitleGenerator && !!this.data && !this.isCreate
            ? this.metaInfoTitleGenerator(this.data)
            : this.metaInfoTitle;

        return Object.assign({
            title: this.$ml(this.metadataName || '') + ' : ' + (title || (this.isCreate ? this.$t('new') : '~')),
        }, this.metaInfoData);
    },

    methods: {
        onGlobalKeyDown(event: KeyboardEvent): void {
            if (event.shiftKey && event.altKey && event.code === 'KeyE') {
                this.toggleEdit();
            }
        },
    },
});
