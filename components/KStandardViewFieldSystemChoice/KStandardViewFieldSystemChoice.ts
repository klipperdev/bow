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
import {StandardViewFieldable} from '@klipper/bow/mixins/StandardViewFieldable';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KStandardViewFieldSystemChoice extends mixins(
    StandardViewFieldable,
    SlotWrapper,
) {
    @Prop({type: Boolean, default: undefined})
    public selectFirst!: boolean;

    private get isMultiple(): boolean {
        if (!this.objectMetadata) {
            return false;
        }

        return !!this.fieldSystemChoiceInputConfig && !!this.fieldSystemChoiceInputConfig.multiple;
    }

    private get fieldSystemChoiceInputConfig(): Dictionary<any>|undefined {
        if (!!this.fieldMetadata
                && 'choice' === this.fieldMetadata.input
                && typeof this.fieldMetadata.inputConfig.choices === 'string'
                && this.fieldMetadata.inputConfig.choices.startsWith('#/choices/')) {
            return this.fieldMetadata.inputConfig;
        }

        return undefined;
    }

    private get fieldSystemChoiceType(): string|undefined {
        return !!this.fieldSystemChoiceInputConfig
                && typeof this.fieldSystemChoiceInputConfig.choices === 'string'
            ? this.fieldSystemChoiceInputConfig.choices.substr(10)
            : undefined;
    }

    private get genSystemChoiceEditProps(): Dictionary<any> {
        return Object.assign({
            'type': this.fieldSystemChoiceType,
            'select-first': undefined !== this.selectFirst ? this.selectFirst : undefined,
        }, this.genEditProps);
    }
}
