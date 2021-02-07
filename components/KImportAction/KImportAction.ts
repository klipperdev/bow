/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImportAction extends Vue {
    @Prop({type: String, required: true})
    public metadata!: string;

    @Prop({type: String, default: 'fa-fw fa-file-upload'})
    public icon!: string;

    @Prop({type: Array, default() {
        return this.$klipper.defaultImportFormats;
    }})
    public formats!: string;

    @Prop({type: Object, default: () => {}})
    public wizardProps!: Dictionary<any>;

    private open: boolean = false;

    private loading: boolean = false;

    private get genIconProps(): Dictionary<any> {
        return {
            small: !!this.$attrs.small,
        };
    }

    private async onClickButton(): Promise<void> {
        this.open = true;
    }

    private onLoading(loading: boolean): void {
        this.loading = loading;
    }
}
