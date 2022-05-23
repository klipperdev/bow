/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {StandardMainComponent} from '@klipper/bow/mixins/StandardMainComponent';
import {mixins} from 'vue-class-component';
import {Component, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export class StandardComponentActionable extends mixins(
    StandardMainComponent,
) {
    @Prop({type: Boolean, default: false})
    public disableStandardActions!: boolean;

    @Prop({type: Boolean, default: false})
    public disableEditStandardActions!: boolean;

    @Prop({type: Boolean, default: false})
    public hideStandardHeader!: boolean;

    @Prop({type: [Boolean, Function], default: true})
    public standardEditAction!: boolean|((data: Dictionary<any>|null) => boolean);

    @Prop({type: [Boolean, Function], default: true})
    public standardDeleteAction!: boolean|((data: Dictionary<any>|null) => boolean);

    @Prop({type: Boolean, default: false})
    public disableLocaleActions!: boolean;

    protected get displayStandardActions(): boolean {
        return !!this.$scopedSlots['standard-actions-prepend']
            || !!this.$scopedSlots['standard-actions']
            || !!this.$scopedSlots['standard-actions-append']
            || this.displayStandardEditAction
            || this.displayStandardDeleteAction
            ;
    }

    protected get displayStandardEditAction(): boolean {
        return (this.hasPushAction || !!this.objectMetadata)
            && !this.isCreate
            && (typeof this.standardEditAction === 'function' ? this.standardEditAction(this.data) : this.standardEditAction);
    }

    protected get displayStandardDeleteAction(): boolean {
        return (this.hasDeleteAction || (!!this.objectMetadata && !!this.$listeners.deleted))
            && !this.isCreate
            && (typeof this.standardDeleteAction === 'function' ? this.standardDeleteAction(this.data) : this.standardDeleteAction);
    }

    protected get displayEditStandardDeleteAction(): boolean {
        return !this.disableEditStandardActions && this.editMode;
    }
}
