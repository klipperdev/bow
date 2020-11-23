/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AjaxContent} from '@klipper/bow/mixins/http/AjaxContent';
import {Canceler} from '@klipper/http-client/Canceler';
import {mixins} from 'vue-class-component';
import {Component, Model, Prop} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KDeleteAction extends mixins(
    AjaxContent,
) {
    @Prop({type: String})
    public title?: string;

    @Prop({type: String})
    public message?: string;

    @Prop({type: String, default: '400'})
    public maxWidth: string;

    @Prop({type: String, default: 'error'})
    public color!: string;

    @Prop({type: String})
    public classes?: string;

    @Prop({type: Boolean, default: true})
    public ripple: boolean;

    @Prop({type: Boolean, default: false})
    public rounded: boolean;

    @Prop({type: Boolean, default: true})
    public text: boolean;

    @Prop({type: Boolean, default: false})
    public depressed: boolean;

    @Prop({type: Boolean, default: false})
    public outlined: boolean;

    @Prop({type: Boolean, default: false})
    public disabled: boolean;

    @Prop({type: Boolean, default: false})
    public small: boolean;

    @Prop({type: Function, required: true})
    public deleteCall: (data: any, canceler: Canceler) => Promise<any|null>;

    @Model()
    @Prop()
    private data: any;

    private dialog: boolean = false;

    private async deleteAction(): Promise<void> {
        const res = await this.fetchData<any>((canceler: Canceler) => {
            return this.deleteCall(this.data, canceler);
        }, true);

        if (res) {
            this.loading = false;
            this.dialog = false;
            this.$emit('deleted', res);
        }
    }
}
