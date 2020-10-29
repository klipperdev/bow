<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<template>
    <k-select-entity
        v-bind="selectAttrs"
        v-on="$listeners"
    >
        <template v-slot:selection="{item}">
            <k-user-avatar :size="selectedAvatarSize" vertical-adjust label :user="$oc(item).user(item)"></k-user-avatar>
        </template>

        <template v-slot:item="{item}">
            <k-user-avatar :size="listAvatarSize" vertical-adjust label :user="$oc(item).user(item)"></k-user-avatar>
        </template>
    </k-select-entity>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component
    export default class KSelectEntityUser extends Vue {
        @Prop({type: Number, default: 24})
        public selectedAvatarSize!: number;

        @Prop({type: Number, default: 28})
        public listAvatarSize!: number;

        public get selectAttrs(): any {
            return Object.assign({
                'target-metadata': 'organization_user',
                'item-text': 'user.full_name',
                'item-value': 'user.id',
                'fields': ['user', 'user.image_url', 'user.username'],
            }, this.$attrs);
        }
    }
</script>
