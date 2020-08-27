<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-snackbar v-model="show"
                bottom
                right
                rounded="pill"
                :multi-line="multiLine"
                :timeout="timeout"
                :color="color"
    >
        <span>{{ message }}</span>

        <template v-slot:action="{attrs}">
            <v-btn v-if="showCloseButton"
                   text
                   dark
                   ripple
                   rounded
                   small
                   v-bind="attrs"
                   @click="show = false"
            >
                <span v-if="items.length > 0">
                    {{ $t('next.count', {count: items.length}) }}
                </span>

                <v-icon v-else small>close</v-icon>
            </v-btn>
        </template>
    </v-snackbar>
</template>

<script lang="ts">
    import {SnackbarMessage} from '@klipper/bow/snackbar/SnackbarMessage';
    import {Component, Vue, Watch} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        components: {},
    })
    export default class KSnackbar extends Vue {
        public show: boolean = false;

        public items: SnackbarMessage[] = [];

        public color: string | null = null;

        public message: string = '';

        public showCloseButton: boolean = true;

        public timeout: number = 6000;

        public multiLine: boolean = false;

        public mounted(): void {
            window.addEventListener('klipper-snackbar-push-snack', this.onReceiveMessage);
        }

        public beforeDestroy(): void {
            this.reset();
        }

        public destroyed(): void {
            window.removeEventListener('klipper-snackbar-push-snack', this.onReceiveMessage);
        }

        @Watch('show')
        public async watchShow(show: boolean): Promise<void> {
            if (show) {
                const item = this.items.shift();

                if (item) {
                    this.message = item.isTranslatable() ? this.$t(item.getMessage()) as string : item.getMessage();
                    this.color = item.getColor();
                    this.showCloseButton = item.getCloseButton();
                    this.timeout = item.getTimeout();
                    this.multiLine = item.isMultiline();
                } else {
                    this.show = false;
                }
            } else {
                await (new Promise((res) => setTimeout(res, 400)));

                if (this.items.length > 0) {
                    this.show = true;
                } else {
                    this.reset();
                }
            }
        }

        public reset(): void {
            this.items = [];
            this.color = null;
            this.message = '';
            this.showCloseButton = true;
            this.timeout = 6000;
            this.multiLine = false;
        }

        private onReceiveMessage(event: Event): void {
            if (event instanceof MessageEvent && event.data instanceof SnackbarMessage) {
                const message = event.data;
                this.items.push(message);

                if (!this.show) {
                    this.show = true;
                }
            }
        }
    }
</script>
