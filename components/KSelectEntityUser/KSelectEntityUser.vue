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
            <k-user-avatar :size="selectedAvatarSize" vertical-adjust label :user="item"></k-user-avatar>
        </template>

        <template v-slot:item="{item}">
            <k-user-avatar :size="listAvatarSize" vertical-adjust label :user="item"></k-user-avatar>
        </template>

        <template v-for="(_, slot) of $scopedSlots" v-slot:[slot]="scope">
            <slot :name="slot" v-bind="scope" />
        </template>
    </k-select-entity>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';

    /**
     * @author François Pluchino <francois.pluchino@klipper.dev>
     */
    @Component({
        inheritAttrs: false,
    })
    export default class KSelectEntityUser extends Vue {
        @Prop({type: Number, default: 24})
        public selectedAvatarSize!: number;

        @Prop({type: Number, default: 28})
        public listAvatarSize!: number;

        public get selectAttrs(): any {
            return Object.assign({
                'target-metadata': 'organization_user',
                'item-text': 'full_name',
                'item-value': 'id',
                'fields': ['user', 'user.image_url', 'user.username'],
                'resultTransformer': KSelectEntityUser.resultTransformer,
            }, this.$attrs);
        }

        private static resultTransformer(res: ListResponse<any>): void {
            const values = res.results;
            res.results = [];

            values.forEach((value) => {
                res.results.push(value.user);
            });
        }
    }
</script>
