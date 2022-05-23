/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {StandardMainComponent} from '@klipper/bow/composables/mixins/standardMainComponent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import Vue, {PropType} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
interface Props {
    disableStandardActions: boolean;
    disableEditStandardActions: boolean;
    hideStandardHeader: boolean;
    standardEditAction: boolean|((data: Dictionary<any>|null) => boolean);
    standardDeleteAction: boolean|((data: Dictionary<any>|null) => boolean);
    disableLocaleActions: boolean;
}

interface Computed {
    get displayStandardActions(): boolean;
    get displayStandardEditAction(): boolean;
    get displayStandardDeleteAction(): boolean;
    get displayEditStandardDeleteAction(): boolean;
}

export const StandardComponentActionable = Vue.extend<{}, {}, Computed, Props>({
    name: 'standardComponentActionable',

    mixins: [
        StandardMainComponent,
    ],

    props: {
        disableStandardActions: {
            type: Boolean,
            default: false,
        },

        disableEditStandardActions: {
            type: Boolean,
            default: false,
        },

        hideStandardHeader: {
            type: Boolean,
            default: false,
        },

        standardEditAction: {
            type: [Boolean, Function] as PropType<boolean|((data: Dictionary<any>|null) => boolean)>,
            default: true,
        },

        standardDeleteAction: {
            type: [Boolean, Function] as PropType<boolean|((data: Dictionary<any>|null) => boolean)>,
            default: true,
        },

        disableLocaleActions: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        displayStandardActions(): boolean {
            return !!this.$scopedSlots['standard-actions-prepend']
                || !!this.$scopedSlots['standard-actions']
                || !!this.$scopedSlots['standard-actions-append']
                || this.displayStandardEditAction
                || this.displayStandardDeleteAction
            ;
        },

        displayStandardEditAction(): boolean {
            return (this.hasPushAction || !!this.objectMetadata)
                && !this.isCreate
                && (typeof this.standardEditAction === 'function' ? this.standardEditAction(this.data) : this.standardEditAction);
        },

        displayStandardDeleteAction(): boolean {
            return (this.hasDeleteAction || (!!this.objectMetadata && !!this.$listeners.deleted))
                && !this.isCreate
                && (typeof this.standardDeleteAction === 'function' ? this.standardDeleteAction(this.data) : this.standardDeleteAction);
        },

        displayEditStandardDeleteAction(): boolean {
            return !this.disableEditStandardActions && this.editMode;
        },
    },
});
