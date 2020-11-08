/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KChoiceAvatar extends Vue {
    @Prop({type: String, default: 'grey lighten-1'})
    public defaultColor!: string;

    @Prop({type: String, default: '~'})
    public defaultLabel!: string;

    @Prop({type: Object, required: true})
    public choice!: object;

    @Prop({type: Number, default: 28})
    public size!: number;

    @Prop({type: Boolean, default: true})
    public tooltip!: boolean;

    @Prop({type: Boolean, default: false})
    public right!: boolean;

    @Prop({type: Boolean, default: false})
    public left!: boolean;

    @Prop({type: Boolean, default: false})
    public top!: boolean;

    @Prop({type: Boolean, default: false})
    public bottom!: boolean;

    @Prop({type: Number, default: 8})
    public tooltipNudge!: number;

    @Prop({type: Number, default: 220})
    public tooltipOpenDelay!: number;

    @Prop({type: String, default: 'slide'})
    public tooltipTransition!: string;

    private tooltipDisabled: boolean = false;

    private get labelContent(): string {
        const value = this.$oc<any>(this.choice).label();

        if (typeof value === 'string' && value) {
            return (value as string).substr(0, 2).trim();
        }

        return this.defaultLabel;
    }

    private get labelSize(): string {
        return this.size ? (Math.round(this.size / 2)) + 'px' : '';
    }

    private get tooltipContent(): string | undefined {
        return this.$oc<any>(this.choice).label();
    }

    private get tooltipTransitionValue(): string | undefined {
        if ('slide' === this.tooltipTransition) {
            if (this.left) {
                return 'slide-x-reverse-transition';
            }

            if (this.right) {
                return 'slide-x-transition';
            }

            if (this.top) {
                return 'slide-y-reverse-transition';
            }

            if (this.bottom) {
                return 'slide-y-transition';
            }
        }

        return undefined;
    }

    private get isTooltipDisabled(): boolean {
        return !this.tooltip || !this.tooltipContent;
    }

    public mounted(): void {
        this.watchIsTooltipDisabled(this.isTooltipDisabled);
    }

    @Watch('isTooltipDisabled')
    private watchIsTooltipDisabled(disabled: boolean): void {
        this.tooltipDisabled = disabled;
    }
}
