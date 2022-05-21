<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <span
        class="k-link-phone"
    >
        <a
            v-if="!!src"
            v-bind="$attrs"
            v-on="$listeners"
            :href="emailLink"
        >
            <slot
                name="default"
                :src="src"
                :href="emailLink"
            >
                {{ src }}
            </slot>
        </a>

        <slot
            v-if="!!src && icon"
            name="icon"
            :src="src"
            :href="emailLink"
            :iconColor="iconColor"
        >
            <k-btn-helper
                :href="emailLink"
                :color="iconColor"
                icon="fa-fw fa-envelope"
            />
        </slot>

        <span
            v-if="!src"
        >
            {{ defaultValue }}
        </span>
    </span>
</template>

<script lang="ts">
import {getEmailLink} from '@klipper/bow/utils/email';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KLinkEmail extends Vue {
    @Prop({type: String})
    public src!: string|undefined;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: Boolean, default: false})
    public icon: boolean;

    @Prop({type: [String, Object], default: 'primary'})
    public iconColor: string|object;

    @Prop({type: String})
    public emailCc!: string|undefined;

    @Prop({type: String})
    public emailBcc!: string|undefined;

    @Prop({type: String})
    public emailSubject!: string|undefined;

    @Prop({type: String})
    public emailBody!: string|undefined;

    private get emailLink(): string|undefined {
        return getEmailLink(this.src, this.emailCc, this.emailBcc, this.emailSubject, this.emailBody);
    }
}
</script>
