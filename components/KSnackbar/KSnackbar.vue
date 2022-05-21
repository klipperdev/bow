<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <v-snackbar
        v-model="show"
        bottom
        right
        :rounded="multiLine ? false : 'pill'"
        :multi-line="multiLine"
        :timeout="timeout"
        :color="color"
    >
        <span
            v-html="message"
        />

        <template v-slot:action="{attrs}">
            <v-btn
                v-if="showCloseButton"
                text
                dark
                ripple
                rounded
                :fab="0 === items.length"
                small
                v-bind="attrs"
                @click="show = false"
            >
                <span
                    v-if="items.length > 0"
                >
                    {{ $t('next.count', {count: items.length}) }}
                </span>

                <v-icon
                    v-else
                    small
                >
                    close
                </v-icon>
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
    private show: boolean = false;

    private items: SnackbarMessage[] = [];

    private color: string | null = null;

    private message: string = '';

    private showCloseButton: boolean = true;

    private timeout: number = 6000;

    private multiLine: boolean = false;

    public mounted(): void {
        window.addEventListener('klipper-snackbar-push-snack', this.onReceiveMessage);
    }

    public beforeDestroy(): void {
        this.reset();
    }

    public destroyed(): void {
        window.removeEventListener('klipper-snackbar-push-snack', this.onReceiveMessage);
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

    @Watch('show')
    private async watchShow(show: boolean): Promise<void> {
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
}
</script>
