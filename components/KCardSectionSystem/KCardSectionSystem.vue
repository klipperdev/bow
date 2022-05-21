<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-card-section
        :title="self.$t('system.info')"
        :dense="undefined === $attrs.dense ? true : $attrs.dense"
        close
        v-bind="$attrs"
        v-on="$listeners"
    >
        <slot
            name="prepend"
            v-bind="bindSlotData"
        />

        <v-row
            v-if="timestamp"
        >
            <k-col-label
                :label="self.$mfl(metadata, 'created_at')"
                :empty="!loading && !self.$oc(data).created_at()"
                :vertical="undefined !== $attrs.vertical"
                :single="single"
                :label-props="labelPropsValue"
            >
                {{ $datetime($oc(data).created_at()) }}
            </k-col-label>

            <k-col-label
                :label="self.$mfl(metadata, 'updated_at')"
                :empty="!loading && !self.$oc(data).updated_at()"
                :vertical="undefined !== $attrs.vertical"
                :single="single"
                :label-props="labelPropsValue"
            >
                {{ $datetime($oc(data).updated_at()) }}
            </k-col-label>
        </v-row>

        <v-row
            v-if="userTrack"
        >
            <k-col-label
                :label="self.$mal(metadata, 'created_by')"
                :empty="!loading && !self.$oc(data).created_by()"
                :vertical="undefined !== $attrs.vertical"
                :single="single"
                :label-props="labelPropsValue"
            >
                <k-user-avatar
                    v-if="userAvatar"
                    :size="userAvatarSize"
                    vertical-adjust
                    label
                    :user="self.$oc(data).created_by()"
                />

                <template v-else>
                    {{ $oc(data).created_by.full_name('~') }}
                </template>
            </k-col-label>

            <k-col-label
                :label="self.$mal(metadata, 'updated_by')"
                :empty="!loading && !self.$oc(data).updated_by()"
                :vertical="undefined !== $attrs.vertical"
                :single="single"
                :label-props="labelPropsValue"
            >
                <k-user-avatar
                    v-if="userAvatar"
                    :size="userAvatarSize"
                    vertical-adjust
                    label
                    :user="self.$oc(data).updated_by()"
                />

                <template v-else>
                    {{ $oc(data).updated_by.full_name('~') }}
                </template>
            </k-col-label>
        </v-row>

        <slot
            name="append"
            v-bind="bindSlotData"
        />

        <slot
            name="default"
            v-bind="bindSlotData"
        />
    </k-card-section>
</template>

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Selfable} from '@klipper/bow/mixins/Selfable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KCardSectionSystem extends mixins(
    Selfable,
) {
    @Prop({type: String, required: true})
    declare public metadata: string;

    @Prop({type: Object})
    public data!: Dictionary<any>|undefined;

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

    @Prop({type: Object})
    public labelProps!: object|undefined;

    @Prop({type: Boolean, default: false})
    public single: boolean;

    private get bindSlotData(): any {
        return {
            metadata: this.metadata,
            timestamp: this.timestamp,
            userTrack: this.userTrack,
            userAvatar: this.userAvatar,
            userAvatarSize: this.userAvatarSize,
        };
    }

    private get labelPropsValue(): object {
        return Object.assign({
            cols: 12,
            sm: 5,
            lg: 3,
        }, this.labelProps || {});
    }
}
</script>
