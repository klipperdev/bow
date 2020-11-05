<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-card-section
        :title="$t('system.info')"
        dense
        close
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot name="prepend" v-bind="bindSlotData"></slot>

        <v-row v-if="timestamp">
            <k-col-label :label="$mfl(metadata, 'created_at')" :empty="!loading && !$oc(data).created_at()">
                {{ $datetime($oc(data).created_at()) }}
            </k-col-label>

            <k-col-label :label="$mfl(metadata, 'updated_at')" :empty="!loading && !$oc(data).updated_at()">
                {{ $datetime($oc(data).updated_at()) }}
            </k-col-label>
        </v-row>

        <v-row v-if="userTrack">
            <k-col-label :label="$mal(metadata, 'created_by')" :empty="!loading && !$oc(data).created_by()">
                <k-user-avatar v-if="userAvatar" :size="userAvatarSize" vertical-adjust label :user="$oc(data).created_by()"></k-user-avatar>

                <template v-else>
                    {{ $oc(data).created_by.full_name('~') }}
                </template>
            </k-col-label>

            <k-col-label :label="$mal(metadata, 'updated_by')" :empty="!loading && !$oc(data).updated_by()">
                <k-user-avatar v-if="userAvatar" :size="userAvatarSize" vertical-adjust label :user="$oc(data).updated_by()"></k-user-avatar>

                <template v-else>
                    {{ $oc(data).updated_by.full_name('~') }}
                </template>
            </k-col-label>
        </v-row>

        <slot name="append" v-bind="bindSlotData"></slot>

        <slot name="default" v-bind="bindSlotData"></slot>
    </k-card-section>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        inheritAttrs: false,
    })
    export default class KCardSectionSystem extends Vue {
        @Prop({type: String, required: true})
        public metadata!: string;

        @Prop({type: Object|undefined, required: true})
        public data!: object;

        @Prop({type: Boolean, default: true})
        public timestamp!: boolean;

        @Prop({type: Boolean, default: true})
        public userTrack!: boolean;

        @Prop({type: Boolean, default: true})
        public userAvatar!: boolean;

        @Prop({type: Number, default: 24})
        public userAvatarSize!: number;

        @Prop({type: Boolean, default: false})
        public loading!: boolean;

        public get bindSlotData(): any {
            return {
                metadata: this.metadata,
                timestamp: this.timestamp,
                userTrack: this.userTrack,
                userAvatar: this.userAvatar,
                userAvatarSize: this.userAvatarSize,
            };
        }
    }
</script>
