<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-btn
        :id="'btn_confirmation_' + _uid"
        v-bind="genButtonProps"
        v-on="$listeners"
    >
        <slot
            name="default"
        />

        <v-dialog
            :activator="'#btn_confirmation_' + _uid"
            v-model="dialog"
            persistent
            :max-width="dialogMaxWidth"
            class="v-btn"
            content-class="scroller-theme--dark"
            transition=""
        >
            <v-card>
                <v-card-title
                    :class="$classes('', 'text--lighten-2')"
                >
                    <slot
                        name="title"
                    >
                        {{ dialogTitle ? dialogTitle : $t('confirmation.title') }}
                    </slot>
                </v-card-title>

                <v-card-text
                    class="pt-4"
                >
                    <slot
                        name="text"
                    >
                        {{ dialogMessage ? dialogMessage : $t('confirmation.text') }}
                    </slot>
                </v-card-text>

                <v-card-actions>
                    <v-spacer />

                    <v-btn
                        text
                        ripple
                        :disabled="loading"
                        @click="dialog = false"
                    >
                        {{ $t('cancel') }}
                    </v-btn>

                    <v-btn
                        :color="dialogButtonColor"
                        depressed
                        ripple
                        :loading="loading"
                        :disabled="loading"
                        @click="confirmAction"
                    >
                        {{ dialogButtonTitle ? dialogButtonTitle : $t('confirm') }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Model, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KBtnConfirmation extends mixins(
    AjaxContent,
) {
    @Prop({type: String})
    public dialogTitle?: string;

    @Prop({type: String})
    public dialogMessage?: string;

    @Prop({type: String})
    public dialogButtonTitle?: string;

    @Prop({type: String, default: 'primary'})
    public dialogButtonColor!: string;

    @Prop({type: String, default: '400'})
    public dialogMaxWidth: string;

    @Prop({type: Function, required: true})
    public confirmCall: (data: any, canceler: Canceler) => Promise<any|null>;

    @Model()
    @Prop()
    private data: any;

    private dialog: boolean = false;

    private get genButtonProps(): Dictionary<any> {
        return Object.assign({}, this.$attrs || {});
    }

    public confirm(): void {
        this.dialog = true;
    }

    public cancel(): void {
        this.dialog = false;
    }

    private async confirmAction(): Promise<void> {
        const res = await this.fetchData<any>((canceler: Canceler) => {
            return this.confirmCall(this.data, canceler);
        }, true);

        if (res) {
            this.loading = false;
            this.dialog = false;
            this.$emit('success', res);
        }
    }
}
</script>
