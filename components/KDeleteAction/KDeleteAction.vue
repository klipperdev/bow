<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn
        :id="'deleteAction_' + _uid"
        :color="color"
        :class="classes"
        :ripple="ripple"
        :rounded="rounded"
        :depressed="depressed"
        :outlined="outlined"
        :text="text"
        :icon="icon"
        :disabled="disabled"
        :small="small"
    >
        <slot
            name="btn-icon"
        >
            <v-icon
                :small="small"
            >
                delete
            </v-icon>
        </slot>

        <v-dialog
            :activator="'#deleteAction_' + _uid"
            v-model="dialog"
            persistent
            :max-width="maxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
            transition=""
        >
            <v-card>
                <v-card-title
                    :class="$classes('primary--text', 'text--lighten-2')"
                >
                    <slot
                        name="title"
                    >
                        {{ title ? title : $t('delete.confirmation.title') }}
                    </slot>
                </v-card-title>

                <v-card-text
                    class="pt-4"
                >
                    <slot
                        name="text"
                    >
                        {{ message ? message : $t('delete.confirmation.text') }}
                    </slot>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        text
                        rounded
                        ripple
                        color="primary"
                        :disabled="loading"
                        @click="dialog = false"
                    >
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn
                        color="error"
                        depressed
                        rounded
                        ripple
                        :loading="loading"
                        :disabled="loading"
                        @click="deleteAction"
                    >
                        {{ $t('delete') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script lang="ts">
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Model, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDeleteAction extends mixins(
    AjaxContent,
) {
    @Prop({type: String})
    public title?: string;

    @Prop({type: String})
    public message?: string;

    @Prop({type: String, default: '400'})
    public maxWidth: string;

    @Prop({type: String, default: 'error'})
    public color!: string;

    @Prop({type: String})
    public classes?: string;

    @Prop({type: Boolean, default: true})
    public ripple: boolean;

    @Prop({type: Boolean, default: false})
    public rounded: boolean;

    @Prop({type: Boolean, default: true})
    public text: boolean;

    @Prop({type: Boolean, default: false})
    public icon: boolean;

    @Prop({type: Boolean, default: false})
    public depressed: boolean;

    @Prop({type: Boolean, default: false})
    public outlined: boolean;

    @Prop({type: Boolean, default: false})
    public disabled: boolean;

    @Prop({type: Boolean, default: false})
    public small: boolean;

    @Prop({type: Function, required: true})
    public deleteCall: (data: any, canceler: Canceler) => Promise<any|null>;

    @Model()
    @Prop()
    private data: any;

    private dialog: boolean = false;

    public confirm(): void {
        this.dialog = true;
    }

    public cancel(): void {
        this.dialog = false;
    }

    private async deleteAction(): Promise<void> {
        const res = await this.fetchData<any>((canceler: Canceler) => {
            return this.deleteCall(this.data, canceler);
        }, true);

        if (res) {
            this.loading = false;
            this.dialog = false;
            this.$emit('deleted', res);
        }
    }
}
</script>
