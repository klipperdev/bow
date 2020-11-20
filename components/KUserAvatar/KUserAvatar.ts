/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {randomNumberBetween} from '@klipper/bow/utils/number';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KUserAvatar extends Vue {
    @Prop({type: Object})
    public user!: Dictionary<any>;

    @Prop({type: Number, default: 48})
    public size!: number;

    @Prop({type: String, default: 'primary'})
    public color!: string;

    @Prop({type: Boolean, default: false})
    public loading!: boolean;

    @Prop({type: Boolean, default: true})
    public tooltip!: boolean;

    @Prop({type: Boolean, default: false})
    public label!: boolean;

    @Prop({type: Boolean, default: false})
    public right!: boolean;

    @Prop({type: Boolean, default: false})
    public left!: boolean;

    @Prop({type: Boolean, default: false})
    public top!: boolean;

    @Prop({type: Boolean, default: false})
    public bottom!: boolean;

    @Prop({type: Boolean, default: true})
    public emptyMessage!: boolean;

    @Prop({type: Number, default: 8})
    public tooltipNudge!: number;

    @Prop({type: Number, default: 220})
    public tooltipOpenDelay!: number;

    @Prop({type: String, default: 'slide'})
    public tooltipTransition!: string;

    @Prop({type: String})
    public imgClass!: string|undefined;

    @Prop({type: Object})
    public imgStyle!: object|undefined;

    @Prop({type: [String, Boolean]})
    public verticalAdjust!: string|boolean|undefined;

    private tooltipDisabled: boolean = false;

    protected get skeletonWidth(): string {
        return randomNumberBetween(30, 60) + '%';
    }

    private get imgClasses(): Dictionary<boolean> {
        const classes = {} as Dictionary<boolean>;

        if (this.imgClass) {
            classes[this.imgClass] = true;
        }

        return classes;
    }

    private get imgStyles(): Dictionary<string> {
        const styles = {} as any;

        if ('' === this.verticalAdjust) {
            styles.marginTop = Math.floor(this.size / 6) * -1 + 'px';
        } else if (this.verticalAdjust) {
            styles.marginTop = this.verticalAdjust as string;
        }

        Object.assign(styles, this.imgStyle);

        return styles;
    }

    private get imageUrl(): string|undefined {
        return this.user && this.user.image_url
            ? this.user.image_url
            : undefined;
    }

    private get alias(): string|undefined {
        return this.user && this.user.alias
            ? this.user.alias
            : undefined;
    }

    private get initial(): string|undefined {
        return this.user && this.user.initial
            ? this.user.initial
            : undefined;
    }

    private get aliasSize(): string {
        return this.size ? (Math.round(this.size / 3.5)) + 'px' : '';
    }

    private get initialSize(): string {
        return this.size ? (Math.round(this.size / 2.8)) + 'px' : '';
    }

    private get tooltipContent(): string|undefined {
        if (this.user) {
            if (this.user.full_name) {
                return this.user.full_name;
            }

            if (this.user.first_name || this.user.last_name) {
                return (this.user.first_name + ' ' + this.user.last_name).trim();
            }
        } else if (!this.loading && this.emptyMessage) {
            return this.$t('component.user_avatar.empty') as string;
        }

        return undefined;
    }

    private get tooltipTransitionValue(): string|undefined {
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
        return !this.tooltip || !this.tooltipContent || this.label;
    }


    public mounted(): void {
        this.watchIsTooltipDisabled(this.isTooltipDisabled);
    }

    @Watch('isTooltipDisabled')
    private watchIsTooltipDisabled(disabled: boolean): void {
        this.tooltipDisabled = disabled;
    }
}
