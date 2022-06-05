<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        :class="classes"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <v-badge
            bordered
            :color="requiredColor"
            dot
            :value="genEditMode && isRequired"
        >
            <slot
                name="default"
                v-bind="genSlotProps"
            >
                {{ genLabel }}
            </slot>
        </v-badge>

        <slot
            name="translate-badge"
            v-bind="genSlotProps"
        >
            <v-badge
                :content="badgeTranslateContent"
                :icon="badgeTranslateIcon"
                :color="translateColor"
                offset-x="-12"
                :value="genEditMode && isTranslatable"
            />
        </slot>
    </div>
</template>

<script lang="ts">
import {StandardViewBaseField} from '@klipper/bow/composables/mixins/standardViewBaseField';
import {defineComponent} from '@vue/composition-api';
import {PropType} from 'vue';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KFieldLabel',

    mixins: [
        StandardViewBaseField,
    ],

    props: {
        editMode: {
            type: Boolean,
            default: false,
        },

        editTranslate: {
            type: [Boolean, String] as PropType<boolean|string>,
            default: false,
        },

        requiredColor: {
            type: String,
            default: 'error',
        },

        translateColor: {
            type: String,
            default: 'secondary',
        },
    },

    computed: {
        isField(): boolean {
            return false;
        },

        genEditMode(): boolean {
            return this.standardData.editMode || this.editMode;
        },

        hasBadgeTranslate(): boolean {
            return !!this.editTranslate || this.isTranslatable;
        },

        badgeTranslateContent(): string|undefined {
            if (typeof this.editTranslate === 'string') {
                return this.editTranslate;
            }

            return typeof this.editTranslate === 'boolean' && !this.editTranslate ? this.standardData.currentLocale : undefined;
        },

        badgeTranslateIcon(): string|undefined {
            return typeof this.editTranslate === 'boolean' && this.editTranslate ? 'translate' : undefined;
        },

        classes(): Dictionary<any> {
            return {
                'k-field-label': true,
                'k-field-label--edit': this.genEditMode,
                'k-field-label--empty': this.isEmpty,
                'k-field-label--required': this.isRequired,
                'k-field-label--readonly': this.isReadonly,
                'k-field-label--loading': this.isLoading,
            };
        },

        isLoading(): boolean {
            return this.standardData.loading || false;
        },

        genLabel(): string|undefined {
            return this.isMetadataInitialized && this.metadataName
                ? this.$metadata.getFieldOrAssociationLabel(this.metadataName, this.name)
                : undefined;
        },

        genSlotProps() {
            return {
                isMetadataInitialized: this.isMetadataInitialized,
                getObjectMetadata: this.getObjectMetadata,
                metadataName: this.metadata,
                objectMetadata: this.objectMetadata,
                fieldMetadata: this.fieldMetadata,
                associationMetadata: this.associationMetadata,
                propertyPath: this.genPropertyPath,
                isEmpty: this.isEmpty,
                isRequired: this.isRequired,
                isTranslatable: this.isTranslatable,
                isReadonly: this.isReadonly,
                defaultValue: this.defaultValue,
                value: this.fieldValue,
                editMode: this.genEditMode,
                label: this.genLabel,
                hasBadgeTranslate: this.hasBadgeTranslate,
                badgeTranslateContent: this.badgeTranslateContent,
                badgeTranslateIcon: this.badgeTranslateIcon,
            };
        },
    },
});
</script>
