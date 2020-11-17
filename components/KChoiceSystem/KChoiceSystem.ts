/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {SystemChoice} from '@klipper/bow/metadata/SystemChoice';
import {SlotWrapper} from '@klipper/bow/mixins/SlotWrapper';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KChoiceSystem extends mixins(
    SlotWrapper,
) {
    @Prop({type: String})
    public type!: string|undefined;

    private get genValue(): any {
        const value = this.$attrs.choice;

        if (!!value
                && this.type
                && !!this.$store.state.metadata.systemChoices
                && !!this.$store.state.metadata.systemChoices[this.type]) {
            const choices = this.$store.state.metadata.systemChoices[this.type] as SystemChoice[];

            for (const choice of choices) {
                if (value === choice.value) {
                    return choice;
                }
            }
        }

        return value;
    }
}
