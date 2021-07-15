/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KImportAction extends Vue {
    @Prop({type: String})
    public metadata!: string;

    @Prop({type: String})
    public uploadEndpoint!: string;

    @Prop({type: String, default: 'fa-fw fa-file-upload'})
    public icon!: string;

    @Prop({type: Boolean, default: false})
    public btnIcon!: boolean;

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
            small: !!this.$attrs.small || '' === this.$attrs.small,
        };
    }

    public async openWizard(): Promise<void> {
        this.open = true;
    }

    public async closeWizard(): Promise<void> {
        this.open = false;
    }

    private async onClickButton(): Promise<void> {
        this.open = true;
    }

    private onLoading(loading: boolean): void {
        this.loading = loading;
    }

    @Watch('open')
    private watchOpen(open: boolean): void {
        const $wizard = this.$refs.wizard as any;

        if ($wizard) {
            if (open) {
                $wizard.openWizard();
            } else {
                $wizard.closeWizard();
            }
        }
    }
}
