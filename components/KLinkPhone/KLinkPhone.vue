<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <span class="k-link-phone">
        <a v-if="!!src" v-bind="$attrs" v-on="$listeners" :href="aLink">
            <slot name="default" :src="src" :href="aLink">
                {{ src }}
            </slot>
        </a>

        <slot name="icon" :src="src" :href="telLink" :iconColor="iconColor" v-if="!!src && telIcon">
            <v-btn :href="telLink" small icon depressed :color="iconColor" class="ml-2 mt-n1">
                <v-icon small>fa fa-fw fa-phone</v-icon>
            </v-btn>
        </slot>

        <slot name="sms-icon" :src="src" :href="smsLink" :iconColor="iconColor" v-if="!!src && smsIcon">
            <v-btn :href="smsLink" small icon depressed :color="iconColor" class="ml-2 mt-n1">
                <v-icon small>fa fa-fw fa-sms</v-icon>
            </v-btn>
        </slot>

        <slot name="fax-icon" :src="src" :href="faxLink" :iconColor="iconColor" v-if="!!src && faxIcon">
            <v-btn :href="faxLink" small icon depressed :color="iconColor" class="ml-2 mt-n1">
                <v-icon small>fa fa-fw fa-fax</v-icon>
            </v-btn>
        </slot>

        <span v-if="!src">
            {{ defaultValue }}
        </span>
    </span>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KLinkPhone extends Vue {
        @Prop({type: String, default: 'tel'})
        public type!: string;

        @Prop({type: String})
        public src!: string|undefined;

        @Prop({type: String, default: '~'})
        public defaultValue!: string;

        @Prop({type: Boolean, default: false})
        public telIcon: boolean;

        @Prop({type: Boolean, default: false})
        public smsIcon: boolean;

        @Prop({type: Boolean, default: false})
        public faxIcon: boolean;

        @Prop({type: String|Object, default: 'accent'})
        public iconColor: string|object;

        @Prop({type: String})
        public smsBody!: string|undefined;

        public get aLink(): string|undefined {
            switch (this.type) {
                case 'fax':
                    return this.faxLink;
                case 'sms':
                    return this.smsLink;
                case 'tel':
                default:
                    return this.telLink;
            }
        }

        public get telLink(): string|undefined {
            return undefined !== this.src ? 'tel:' + this.src.replace(/ /g, '') : undefined;
        }

        public get smsLink(): string|undefined {
            return undefined !== this.src
                ? 'sms:' + this.src.replace(/ /g, '') + (this.smsBody ? '?body=' + encodeURIComponent(this.smsBody) : '')
                : undefined;
        }

        public get faxLink(): string|undefined {
            return undefined !== this.src ? 'fax:' + this.src.replace(/ /g, '') : undefined;
        }
    }
</script>
