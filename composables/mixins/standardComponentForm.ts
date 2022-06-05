/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxFormContent} from '@klipper/bow/composables/mixins/http/ajaxFormContent';
import {StandardBaseComponent} from '@klipper/bow/composables/mixins/standardBaseComponent';
import {StandardViewData} from '@klipper/bow/standardView/StandardViewData';
import {StandardViewItem} from '@klipper/bow/standardView/StandardViewItem';
import Vue from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Computed {
    get pushLoading(): boolean;
    get genStandardData(): StandardViewData;
}

interface Methods {
    push(): Promise<void>;
    beforeCancelEdit(): void;
}

export const StandardComponentForm = Vue.extend<{}, Methods, Computed>({
    name: 'standardComponentForm',

    mixins: [
        StandardBaseComponent,
        AjaxFormContent,
    ],

    computed: {
        pushLoading(): boolean {
            return this.loading && this.editMode;
        },

        genStandardData(): StandardViewData {
            return {
                metadata: this.metadataName || null,
                currentLocale: this.currentLocale,
                editMode: this.editMode,
                vertical: this.isVertical,
                dense: this.isDense,
                loading: this.loading,
                isCreate: this.isCreate,
                id: this.id || null,
                data: this.data,
                error: this.previousError,
                pushAction: this.push,
            };
        },
    },

    methods: {
        async push(): Promise<void> {
            // Override this method
        },

        beforeCancelEdit(): void {
            this.resetPreviousError();
        },
    },

    watch: {
        loading() {
            this.standardItems.forEach((standardItem: StandardViewItem) => {
                standardItem.setStandardData(this.genStandardData);
            });
        },

        previousError() {
            this.standardItems.forEach((standardItem: StandardViewItem) => {
                standardItem.setStandardData(this.genStandardData);
            });
        },
    },
});
