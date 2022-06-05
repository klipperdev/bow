<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-col
        v-bind="colPropsValue"
        v-if="!unwrap"
    >
        <v-row
            v-bind="rowPropsValue"
        >
            <v-col
                v-if="!hideLabel"
                v-bind="labelPropsValue"
            >
                <v-badge
                    bordered
                    color="error"
                    dot
                    :value="editMode && editLabelRequired"
                >
                    <slot
                        name="label"
                    >
                        <span>
                            {{ label }}
                        </span>
                    </slot>
                </v-badge>

                <v-badge
                    bottom
                    :content="badgeTranslateContent"
                    :icon="badgeTranslateIcon"
                    color="accent"
                    offset-x="8"
                    offset-y="-4"
                    :value="editMode && hasBadgeTranslate"
                    class="k-col-label-badge-trans"
                ></v-badge>
            </v-col>

            <v-col
                v-if="isLoading"
                key="loading"
                v-bind="labelContentPropsValue"
            >
                <slot
                    name="loading"
                    :skeletonLoaderPropsValue="skeletonLoaderPropsValue"
                >
                    <v-skeleton-loader
                        v-bind="skeletonLoaderPropsValue"
                    />
                </slot>
            </v-col>

            <v-col
                v-else
                key="data"
                v-bind="labelContentPropsValue"
            >
                <slot
                    name="default"
                    v-bind="bindSlotData"
                >
                    <div
                        v-if="editMode"
                        class="k-col-label-content-wrapper edit"
                        key="edit"
                    >
                        <slot
                            name="edit-prepend"
                            v-bind="bindSlotData"
                        />

                        <slot
                            name="edit"
                            v-bind="bindSlotData"
                        />

                        <slot
                            name="edit-append"
                            v-bind="bindSlotData"
                        />
                    </div>

                    <div
                        v-else
                        key="read"
                        :class="{
                            'k-col-label-content-wrapper': true,
                            'text-right': contentRight,
                        }"
                    >
                        <slot
                            name="read-prepend"
                            v-bind="bindSlotData"
                        />

                        <slot
                            name="read"
                            v-bind="bindSlotData"
                        />

                        <slot
                            name="read-append"
                            v-bind="bindSlotData"
                        />
                    </div>
                </slot>
            </v-col>
        </v-row>
    </v-col>


    <div
        v-else-if="editMode"
        class="k-col-label-content-unwrap edit"
        key="edit"
    >
        <slot
            name="edit-prepend"
            v-bind="bindSlotData"
        />

        <slot
            name="edit"
            v-bind="bindSlotData"
        />

        <slot
            name="edit-append"
            v-bind="bindSlotData"
        />
    </div>

    <div
        v-else
        key="read"
        class="k-col-label-content-unwrap"
    >
        <slot
            name="default"
            v-bind="bindSlotData"
        >
            <slot
                name="read-prepend"
                v-bind="bindSlotData"
            />

            <slot
                name="read"
                v-bind="bindSlotData"
            />

            <slot
                name="read-append"
                v-bind="bindSlotData"
            />
        </slot>
    </div>
</template>

<style lang="scss" src="./KColLabel.scss" />

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {inject as RegistrableInject} from '@klipper/bow/mixins/Registrable';
import {SkeletonLoaderable} from '@klipper/bow/mixins/SkeletonLoaderable';
import {Themeable} from '@klipper/bow/mixins/Themeable';
import {mergeMapClasses} from '@klipper/bow/utils/style';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KColLabel extends mixins(
    Themeable,
    SkeletonLoaderable,
    RegistrableInject<'loaderWrapper', any>('loaderWrapper'),
) {
    @Prop({type: String})
    public label?: string;

    @Prop({type: Boolean, default: false})
    public hideLabel: boolean;

    @Prop({type: Boolean, default: false})
    public unwrap: boolean;

    @Prop({type: String, default: undefined})
    public labelColor: string;

    @Prop({type: String, default: undefined})
    public labelDarkColor: string;

    @Prop({type: Boolean, default: false})
    public vertical: boolean;

    @Prop({type: Boolean, default: false})
    public single: boolean;

    @Prop({type: Boolean, default: false})
    public editMode: boolean;

    @Prop({type: Boolean, default: false})
    public editLabelRequired: boolean;

    @Prop({type: [Boolean, String], default: false})
    public editTranslate!: boolean|string;

    @Prop({type: Object})
    public rowProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public colProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public labelProps!: Dictionary<any>|undefined;

    @Prop({type: Object})
    public labelContentProps!: Dictionary<any>|undefined;

    @Prop({type: Boolean, default: false})
    public empty: boolean;

    @Prop({type: Boolean, default: false})
    public contentRight: boolean;

    private dynamicLoading: boolean = false;

    private get isEmpty(): boolean {
        return this.empty && !this.editMode;
    }

    private get isLoading(): boolean {
        return this.loading || (this.dynamicLoading && !this.disableLoading);
    }

    private get bindSlotData(): any {
        return {
            label: this.label,
            hideLabel: this.hideLabel,
            labelColor: this.labelColor,
            labelDarkColor: this.labelDarkColor,
            vertical: this.vertical,
            editMode: this.editMode,
        };
    }

    private get rowPropsValue(): Dictionary<any> {
        return {
            ...this.rowProps,
            class: mergeMapClasses({}, this.rowClasses, this.rowProps?.class || {}),
        };
    }

    private get colPropsValue(): Dictionary<any> {
        return Object.assign({
            cols: 12,
            sm: this.single ? undefined : 6,
        }, this.colProps || {});
    }

    private get labelPropsValue(): Dictionary<any> {
        return Object.assign({
            cols: 12,
            sm: 5,
            lg: 3,
            class: this.labelClasses,
        }, this.labelProps || {});
    }

    private get labelContentPropsValue(): Dictionary<any> {
        return {
            ...this.labelContentProps,
            class: mergeMapClasses({}, this.labelContentClasses, this.labelContentProps?.class || {}),
        };
    }

    private get rowClasses(): Dictionary<any> {
        return {
            'k-col-label-row': true,
            'k-col-label-vertical': this.vertical,
            'k-col-label-empty': this.isEmpty,
            ...this.themeClasses,
        };
    }

    private get labelClasses(): Dictionary<any> {
        return this.$classes({
            'k-col-label': true,
            'font-weight-bold': true,
            'word-break-word': true,
            [this.labelColor]: true,
        }, {
            [this.labelDarkColor]: true,
        });
    }

    private get labelContentClasses(): Dictionary<any> {
        return this.$classes({
            'k-col-label-content': true,
            'd-flex': this.contentRight,
            'justify-end': this.contentRight,
        });
    }

    private get hasBadgeTranslate(): boolean {
        return !!this.editTranslate;
    }

    private get badgeTranslateContent(): string|undefined {
        return typeof this.editTranslate === 'string' ? this.editTranslate : undefined;
    }

    private get badgeTranslateIcon(): string|undefined {
        return typeof this.editTranslate === 'boolean' && this.editTranslate ? 'translate' : undefined;
    }

    public setLoading(loading: boolean): void {
        this.dynamicLoading = loading;
    }
}
</script>
