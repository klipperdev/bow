/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue} from 'vue-property-decorator';
import {ListResponse} from '@klipper/http-client/models/responses/ListResponse';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KSelectEntityUser extends Vue {
    private static resultTransformer(res: ListResponse<any>): void {
        const values = res.results;
        res.results = [];

        values.forEach((value) => {
            res.results.push(value.user);
        });
    }

    @Prop({type: Number, default: 24})
    public selectedAvatarSize!: number;

    @Prop({type: Number, default: 28})
    public listAvatarSize!: number;

    private get selectAttrs(): Dictionary<any> {
        return Object.assign({
            'target-metadata': 'organization_user',
            'item-text': 'full_name',
            'item-value': 'id',
            'fields': ['user', 'user.image_url', 'user.username'],
            'resultTransformer': KSelectEntityUser.resultTransformer,
        }, this.$attrs);
    }
}
