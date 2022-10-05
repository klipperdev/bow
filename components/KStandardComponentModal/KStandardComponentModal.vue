<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-dialog
        v-model="dialog"
        v-bind="dialogProps"
        transition=""
    >
        <k-standard-component
            ref="stdView"
            :value="value"
            v-bind="$attrs"
            v-on="$listeners"
            :metadata="metadata"
            :refresh-on-init="false"
            @upserted="onUpserted"
        >
            <template v-slot:default="props">
                <v-card>
                    <slot name="header" v-bind="getSlotProps(props)">
                        <v-card-title>
                            <slot name="header.title" v-bind="getSlotProps(props)">
                                {{ $ml(metadata) }}
                            </slot>
                        </v-card-title>
                    </slot>

                    <v-container
                        class="v-card__content-scroller pt-0 pb-0"
                        style="max-height: calc(82vh - 120px);"
                    >
                        <k-form-alert
                            dismissible
                            :http-error="props.error"
                            :metadata="metadata"
                            :excluded-fields="['price', 'internal_comment', 'public_comment']"
                        />

                        <slot
                            name="default"
                            v-bind="getSlotProps(props)"
                        />
                    </v-container>

                    <v-card-actions>
                        <v-spacer />

                        <slot
                            name="actions"
                            v-bind="getSlotProps(props)"
                        >
                            <slot
                                v-if="props.editMode"
                                name="actions.cancel"
                                v-bind="getSlotProps(props)"
                            >
                                <v-btn
                                    text
                                    ripple
                                    :disabled="props.loading"
                                    large
                                    @click="close"
                                >
                                    {{ $t('cancel') }}
                                </v-btn>
                            </slot>

                            <slot
                                v-if="props.editMode"
                                name="actions.save"
                                v-bind="getSlotProps(props)"
                            >
                                <v-btn
                                    :color="saveButtonColor"
                                    dark
                                    depressed
                                    ripple
                                    large
                                    :loading="props.loading"
                                    @click="props.push"
                                >
                                    {{ $t('save') }}
                                </v-btn>
                            </slot>

                            <slot
                                v-if="!props.editMode"
                                name="actions.close"
                                v-bind="getSlotProps(props)"
                            >
                                <v-btn
                                    text
                                    ripple
                                    :disabled="props.loading"
                                    large
                                    @click="close"
                                >
                                    {{ $t('close') }}
                                </v-btn>
                            </slot>
                        </slot>
                    </v-card-actions>
                </v-card>
            </template>
        </k-standard-component>
    </v-dialog>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardComponentModal extends Vue {
    @Prop({type: String, required: true})
    public metadata!: string;

    @Prop({type: String, default: ''})
    public emitPrefix!: string;

    @Prop({type: Object, default: () => {}})
    public dialogProps!: Dictionary<any>;

    @Prop({type: Boolean, default: false})
    public noSnackbar!: boolean;

    @Prop({type: Boolean, default: false})
    public keepOpenAfterCreated!: boolean;

    @Prop({type: String, default: 'primary'})
    public saveButtonColor!: string;

    @Prop({type: Boolean, default: false})
    public editOnly!: boolean;

    @Prop({type: String, default() {
        return this.$t('component.standard-component-modal.message.success-created');
    }})
    public messageCreatedSuccess!: string;

    @Prop({type: String, default() {
        return this.$t('component.standard-component-modal.message.success-updated');
    }})
    public messageUpdatedSuccess!: string;

    public value: Dictionary<any>|null = null;

    private dialog: boolean = false;

    private isCreate: boolean = false;

    public get emitOpenName(): string {
        return (!!this.emitPrefix ? this.emitPrefix : this.metadata.replaceAll('_', '-'))
            + '-modal-open';
    }

    public created(): void {
        this.$root.$on(this.emitOpenName, this.open);
    }

    public destroyed(): void {
        this.$root.$off(this.emitOpenName + this._uid, this.open);
    }

    public open(value?: Dictionary<any>): void {
        this.value = !!value ? value : null;
        this.isCreate = !!this.value && typeof this.value === 'object' && Object.keys(this.value).length === 0;
        this.dialog = true;
    }

    public close(): void {
        this.dialog = false;
        this.value = null;
        this.isCreate = false;
    }

    private getSlotProps(props?: Dictionary<any>): Dictionary<any> {
        return Object.assign({
            metadata: this.metadata,
            dialogProps: this.dialogProps,
            noSnackbar: this.noSnackbar,
            keepOpenAfterCreated: this.keepOpenAfterCreated,
            messageCreatedSuccess: this.messageCreatedSuccess,
            messageUpdatedSuccess: this.messageUpdatedSuccess,
            value: this.value,
            isOpened: this.dialog,
            isCreate: this.isCreate,
        }, props);
    }

    private onUpserted(): void {
        if (this.isCreate) {
            if (!this.noSnackbar) {
                this.$snackbar.success(this.messageCreatedSuccess);
            }

            this.close();

            if (this.keepOpenAfterCreated) {
                this.$nextTick(() => {
                    this.open({});
                });
            }
        } else {
            if (!this.noSnackbar) {
                this.$snackbar.success(this.messageUpdatedSuccess);
            }

            this.close();
        }
    }

    @Watch('dialog')
    private watchDialog(dialog: boolean): void {
        if (dialog) {
            this.$nextTick(() => {
                (this.$refs.stdView as any).enableEdit();
            });
        } else {
            (this.$refs.stdView as any).cancelEdit();
        }
    }
}
</script>
