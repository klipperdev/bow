<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <div
        :class="genWrapperClasses"
    >
        <k-wall-message
            v-if="!dense"
            :message="resultMessage"
        >
            <template v-slot:icon>
                <k-lottie
                    center
                    width="90%"
                    max-width="500px"
                    :options="{animationData: iconData, loop: false}"
                ></k-lottie>
            </template>

            <template v-slot:default>
                <slot name="default"/>
            </template>
        </k-wall-message>

        <div
            v-else
            class="d-flex justify-center align-center"
        >
            <k-lottie
                center
                inline
                width="72px"
                height="72px"
                :options="{animationData: iconData, loop: false}"
            ></k-lottie>

            <span
                class="ml-2 text-subtitle-1"
            >
                {{ resultMessage }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import iconData from '@klipper/bow/assets/animations/searchNoResult.json';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KNoResultMessage extends Vue {
    @Prop({type: String, required: false})
    public message!: string;

    @Prop({type: Boolean, default: false})
    public dense!: boolean;

    @Prop({type: Boolean, default: false})
    public start!: boolean;

    @Prop({type: Boolean, default: false})
    public center!: boolean;

    @Prop({type: Boolean, default: false})
    public end!: boolean;

    protected get iconData(): object {
        return  iconData;
    }

    private get resultMessage(): string {
        return this.message || this.$t('no-result') as string;
    }

    private get genWrapperClasses(): Dictionary<any> {
        return {
            'd-flex': true,
            'align-center': true,
            'justify-start': this.start,
            'justify-center': this.center || (!this.start && !this.end),
            'justify-end': this.end,
        };
    }
}
</script>
