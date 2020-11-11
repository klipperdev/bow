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
import {getPropertyFromItem} from '@klipper/bow/utils/object';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KLinkAssociation extends mixins(
    SlotWrapper,
) {
    @Prop({type: Object})
    public value!: Dictionary<any>;

    @Prop({type: String, default: '~'})
    public defaultValue!: string;

    @Prop({type: String, default: undefined})
    public route!: string;

    @Prop({type: String, default: undefined})
    public routeIdentifier!: string;

    @Prop({type: String, default: 'id'})
    public fieldIdentifier!: string;

    @Prop({type: String, default: 'id'})
    public fieldLabel!: string;

    private get genIdentifier(): string|undefined {
        return !!this.value
            ? getPropertyFromItem(this.value, this.fieldIdentifier)
            : undefined;
    }

    private get genLabel(): string {
        let label = this.defaultValue;

        if (!!this.value) {
            let value = getPropertyFromItem(this.value, this.fieldLabel);

            if (!value) {
                value = getPropertyFromItem(this.value, this.fieldIdentifier);
            }

            if (!!value) {
                label = value;
            }
        }

        return label;
    }

    private get genTo(): Dictionary<any>|undefined {
        const routeIdentifier = this.routeIdentifier || this.fieldIdentifier;

        return !!this.route && !!this.genIdentifier
            ? {name: this.route, params: {org: this.$org, [routeIdentifier]: this.genIdentifier}}
            : undefined;
    }
}
