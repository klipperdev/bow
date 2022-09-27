<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        ref="field"
        v-if="!invisible"
        :class="classes"
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            v-if="!genEditMode && loader && isLoading"
            name="loading"
            :skeletonLoaderPropsValue="skeletonLoaderPropsValue"
        >
            <v-skeleton-loader
                v-bind="skeletonLoaderPropsValue"
            />
        </slot>

        <slot
            v-else-if="!genEditMode || quickEdit"
            name="read"
            v-bind="genSlotReadProps"
        >
            <slot
                name="default"
                v-bind="genSlotReadProps"
            >
                {{ $oc(fieldValue)(defaultValue) }}
            </slot>
        </slot>

        <slot
            v-else
            name="edit"
            v-bind="genSlotEditProps"
        >
            <slot
                name="read"
                v-bind="genSlotReadProps"
            >
                <slot
                    name="default"
                    v-bind="genSlotReadProps"
                >
                    {{ $oc(fieldValue)(defaultValue) }}
                </slot>
            </slot>
        </slot>

        <v-menu
            v-if="quickEdit"
            v-bind="genQuickEditMenuProps"
            :attach="$refs.field"
            :value="quickEditOpen"
            @input="quickEditOpen = $event"
        >
            <slot
                v-if="quickEditOpened"
                name="edit"
                v-bind="genSlotEditProps"
            />
        </v-menu>
    </div>
</template>

<style lang="scss">
.k-field {
    &.k-field--quick-edit {
        position: relative;
    }
}
</style>

<script lang="ts">
import {ajaxSelectFormable} from '@klipper/bow/composables/mixins/formable';
import {SkeletonLoaderable} from '@klipper/bow/composables/mixins/skeletonLoaderable';
import {StandardViewBaseField} from '@klipper/bow/composables/mixins/standardViewBaseField';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {genSubRefName} from '@klipper/bow/utils/vnode';
import {Filter} from '@klipper/sdk/models/filters/Filter';
import {Sort} from '@klipper/sdk/requests/Sort';
import {mergeFilters} from '@klipper/sdk/utils/filter';
import {defineComponent, PropType} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KField',

    mixins: [
        StandardViewBaseField,
        SkeletonLoaderable,
        ajaxSelectFormable('edit'), // Allow to call all available methods for fields and associations
    ],

    props: {
        quickEdit: {
            type: Boolean,
            default: false,
        },

        quickEditMenuProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },

        editMode: {
            type: Boolean,
            default: undefined,
        },

        loader: {
            type: Boolean,
            default: false,
        },

        invisible: {
            type: Boolean,
            default: false,
        },
    },

    data(): Dictionary<any> {
        return {
            quickEditOpen : false as boolean,
            quickEditOpened: false as boolean,
        };
    },

    computed: {
        classes(): Dictionary<any> {
            return {
                'k-field': true,
                'k-field--quick-edit': this.quickEdit,
                'k-field-association': !this.isField && this.isAssociation,
                'k-field--edit': this.genEditMode,
                'k-field--empty': this.isEmpty,
                'k-field--loading': this.isLoading,
            };
        },

        isLoading(): boolean {
            return this.standardData.loading ?? this.loading;
        },

        isMultiple(): boolean {
            if (!this.objectMetadata) {
                return false;
            }

            if (!!this.associationMetadata && ['one-to-many', 'many-to-many'].includes(this.associationMetadata.type)) {
                return true;
            }

            return !!this.fieldMetadataChoiceInputConfig && !!this.fieldMetadataChoiceInputConfig.multiple;
        },

        targetMetadata(): string {
            if (!!this.associationMetadata) {
                return this.associationMetadata.target;
            }

            return this.fieldMetadataChoiceTargetMetadata ?? this.name;
        },

        itemText(): string {
            if (!!this.$attrs['item-text']) {
                return this.$attrs['item-text'];
            }

            if (!!this.targetMetadata) {
                const targetObjectMetadata = this.getObjectMetadata(this.targetMetadata);

                if (!!targetObjectMetadata && !!targetObjectMetadata.fieldLabel) {
                    return targetObjectMetadata.fieldLabel;
                }
            }

            return this.itemValue;
        },

        itemValue(): string {
            if (!!this.targetMetadata) {
                const targetObjectMetadata = this.getObjectMetadata(this.targetMetadata);

                if (!!targetObjectMetadata) {
                    if (!!this.fieldMetadataChoiceInputConfig && this.fieldMetadataChoiceInputConfig.name_path) {
                        return this.fieldMetadataChoiceInputConfig.name_path;
                    }

                    if (!!this.associationMetadataChoiceInputConfig && this.associationMetadataChoiceInputConfig.name_path) {
                        return this.associationMetadataChoiceInputConfig.name_path;
                    }

                    if (!!targetObjectMetadata.fieldIdentifier) {
                        return targetObjectMetadata.fieldIdentifier;
                    }
                }
            }

            return 'id';
        },

        fieldChoiceInputConfig(): string|undefined {
            if (!!this.fieldMetadata
                && 'choice' === this.fieldMetadata.input
                && typeof this.fieldMetadata.inputConfig.choices === 'string'
                && this.fieldMetadata.inputConfig.choices.startsWith('#/choices/')) {
                return this.fieldMetadata.inputConfig;
            }

            return undefined;
        },

        fieldChoiceTargetMetadata(): string|undefined {
            return !!this.fieldChoiceInputConfig
            && typeof this.fieldChoiceInputConfig.choices === 'string'
                ? this.fieldChoiceInputConfig.choices.substr(10)
                : undefined;
        },

        fieldMetadataChoiceInputConfig(): Dictionary<any>|undefined {
            if (!!this.fieldMetadata
                && 'choice' === this.fieldMetadata.input
                && typeof this.fieldMetadata.inputConfig.choices === 'string'
                && this.fieldMetadata.inputConfig.choices.startsWith('#/metadatas/')) {
                return this.fieldMetadata.inputConfig;
            }

            return undefined;
        },

        fieldMetadataChoiceTargetMetadata(): string|undefined {
            return !!this.fieldMetadataChoiceInputConfig
            && typeof this.fieldMetadataChoiceInputConfig.choices === 'string'
                ? this.fieldMetadataChoiceInputConfig.choices.substr(12)
                : undefined;
        },

        associationMetadataChoiceInputConfig(): Dictionary<any>|undefined {
            if (!!this.associationMetadata
                && 'choice' === this.associationMetadata.input
                && typeof this.associationMetadata.inputConfig.choices === 'string'
                && this.associationMetadata.inputConfig.choices.startsWith('#/metadatas/')) {
                return this.associationMetadata.inputConfig;
            }

            return undefined;
        },

        genQuickEditMenuProps(): Dictionary<any> {
            return Object.assign({
                'disabled': this.disabled,
                'close-on-content-click': false,
            }, this.quickEditMenuProps);
        },

        genViewProps(): Dictionary<any> {
            let props = this._genViewProps;

            // Input Config Field Choice
            if (!!this.fieldChoiceTargetMetadata) {
                props = Object.assign(props, {
                    type: this.fieldChoiceTargetMetadata,
                });
            }

            return props;
        },

        genEditProps(): Dictionary<any> {
            let props = this._genEditProps;

            if (!this.isField && this.isAssociation) {
                let targetMetadata = this.targetMetadata;

                if ('user' === targetMetadata) {
                    targetMetadata = 'organization_user';
                }

                const metadataTarget = this.$store.state?.metadata?.metadatas[targetMetadata];
                props.sort = props.sort ?? [];
                props.fields = props.fields ?? [];
                props.searchFields = props.searchFields ?? [];

                props = Object.assign(props, {
                    'multiple': props.multiple ?? this.isMultiple,
                    'target-metadata': props['target-metadata'] ?? targetMetadata,
                    'return-object': props['return-object'] ?? !this.fieldMetadataChoiceInputConfig,
                    'item-text': props['item-text'] ?? this.itemText,
                    'item-value': props['item-value'] ?? this.itemValue,
                });

                // Organization User
                if ('organization_user' === targetMetadata) {
                    ['user', 'user.image_url', 'user.username'].forEach((field: string) => {
                        if (!props.fields.includes(field)) {
                            props.fields.push(field);
                        }
                    });

                    ['user.first_name', 'user.last_name', 'user.username'].forEach((field: string) => {
                        if (!props.searchFields.includes(field)) {
                            props.searchFields.push(field);
                        }
                    });

                    props.resultTransformer = props['result-transformer'] ?? ((res: ListResponse<any>): void => {
                        const values = res.results;
                        res.results = [];

                        values.forEach((value) => {
                            res.results.push(value.user);
                        });
                    });
                }

                // Sort
                if (0 === props.sort.length && !!metadataTarget && metadataTarget.sortable && metadataTarget.defaultSortable) {
                    Object.keys(metadataTarget.defaultSortable).forEach((key: string) => {
                        props.sort.push(new Sort(key, metadataTarget.defaultSortable[key]));
                    });
                }

                // Input Config Choice
                if (!!this.associationMetadataChoiceInputConfig) {
                    if ('#/metadatas/choice' === this.associationMetadataChoiceInputConfig.choices) {
                        ['position', 'color'].forEach((field: string) => {
                            if (!props.fields.includes(field)) {
                                props.fields.push(field);
                            }
                        });
                    }

                    [this.itemText].forEach((field: string) => {
                        if (!props.searchFields.includes(field)) {
                            props.searchFields.push(field);
                        }
                    });
                }

                // Input Config Criteria
                if (!!this.associationMetadata?.inputConfig?.criteria) {
                    const rules: Filter = [];

                    Object.keys(this.associationMetadata?.inputConfig?.criteria).forEach((key: string) => {
                        rules.push({
                            field: key,
                            operator: 'equal',
                            value: this.associationMetadata?.inputConfig?.criteria[key],
                        });
                    });

                    props.filters = mergeFilters(
                        'AND',
                        ...rules,
                        typeof props.filters === 'object' ? props.filters : null,
                    );
                }
            }

            if (!!this.fieldChoiceInputConfig) {
                // Input Config Field Choice
                const type = this.fieldChoiceTargetMetadata;
                const items = this.$store?.state?.metadata?.systemChoices[type] ?? [];

                props = Object.assign(props, {
                    type,
                    items,
                });
            }

            return props;
        },

        genEditMode(): boolean {
            return (undefined === this.editMode && this.standardData.editMode) || true === this.editMode;
        },

        genSlotReadProps() {
            return {
                ref: genSubRefName(this, 'read'),
                attrs: this.genViewProps,
                on: this.genViewListeners,
                enableQuickEdit: this.enableQuickEdit,
                cancelQuickEdit: this.cancelQuickEdit,
                toggleQuickEdit: this.toggleQuickEdit,
                ...this.genStdCommonProps,
            };
        },

        genSlotEditProps() {
            return Object.assign({
                ref: genSubRefName(this, 'edit'),
                attrs: this.genEditProps,
                on: this.genEditListeners,
                rules: this.genRules,
                getDefaultRules: this.getDefaultRules,
                ...this.genStdCommonProps,
            });
        },

        genStdCommonProps() {
            const props = {
                isMetadataInitialized: this.isMetadataInitialized,
                getObjectMetadata: this.getObjectMetadata,
                metadataName: this.metadataName,
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
                setValue: this.setValue,
                setValueAndPush: this.setValueAndPush,
            };

            if (!!this.fieldChoiceTargetMetadata) {
                props.type = this.fieldChoiceTargetMetadata;
            }

            return props;
        },
    },

    methods: {
        toggleQuickEdit(): void {
            this.quickEditOpen = !this.quickEditOpen;
        },

        enableQuickEdit(): void {
            this.quickEditOpen = true;
        },

        cancelQuickEdit(): void {
            this.quickEditOpen = false;
        },

        setValue(value?: any): void {
            this.fieldValue = value;
        },

        async setValueAndPush(value?: any, showLoading: boolean = true): Promise<void> {
            this.setValue(value);
            await this.standardData.pushAction(showLoading);
        },
    },

    watch: {
        quickEditOpen: {
            handler(value: boolean): void {
                if (value) {
                    this.quickEditOpened = true;
                    this.$emit('open-quick-edit');

                    this.$nextTick(() => {
                        this.$emit('opened-quick-edit');
                    });
                } else {
                    this.$emit('close-quick-edit');

                    this.$nextTick(() => {
                        this.quickEditOpened = false;
                        this.$emit('closed-quick-edit');
                    });
                }
            },
        },

        isLoading: {
            handler(value: boolean): void {
                if (value) {
                    this.cancelQuickEdit();
                }
            },
        },

        'standardData.data': {
            async handler(data: Dictionary<any>|null): Promise<void> {
                if (!!data) {
                    this.cancelQuickEdit();
                }
            }
        },
    },
});
</script>
