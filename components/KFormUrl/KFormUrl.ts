/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {RuleValidate} from '@klipper/bow/validator/Rule';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KFormUrl extends mixins(
    SlotWrapper,
) {
    @Prop({type: Boolean, default: false})
    public noProtocol!: boolean;

    protected get genProps(): Dictionary<any> {
        const prependInnerIcon = this.$attrs['prepend-inner-icon'];
        const rules = Array.isArray(this.$attrs.rules) ? this.$attrs.rules as RuleValidate[] : [] as RuleValidate[];

        rules.push(this.$r('url', {withHttp: !this.noProtocol}));

        return Object.assign({
            'prepend-inner-icon': undefined !== prependInnerIcon ? prependInnerIcon : 'public',
            rules,
        }, this.$attrs);
    }
}
