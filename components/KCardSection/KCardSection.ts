/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {mergeMapClasses} from '@klipper/bow/utils/style';
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KCardSection extends Vue {
    @Prop({type: String, default: null})
    public title!: string;

    @Prop({type: Boolean, default: false})
    public close!: boolean;

    @Prop({type: Boolean, default: false})
    public locked: boolean;

    @Prop({type: Boolean, default: true})
    public divider: boolean;

    @Prop({type: Boolean, default: false})
    public dense: boolean;

    @Prop({type: Boolean, default: false})
    public noContainer: boolean;

    @Prop({type: [Object, String, Array], default: undefined})
    public contentClass!: Dictionary<boolean>|string[]|string|undefined;

    private show: boolean = false;

    private previousValue: boolean|null = null;

    private get classes(): object {
        return {
            'k-card-section': true,
            'dense': this.dense,
            'locked': this.locked,
            'closed': !this.show,
        };
    }

    private get titleClasses(): object {
        return {
            'k-card-section-title': true,
            'locked': this.locked,
            'text-subtitle-2': true,
            'secondary--text': true,
        };
    }

    private get contentClasses(): object {
        return mergeMapClasses({
            'k-card-section--content': true,
            'container': !this.noContainer,
            'fluid': !this.noContainer,
            'pt-0': true,
            'pb-0': true,
        }, this.contentClass);
    }

    private get showDivider(): boolean {
        return this.title ? this.divider : false;
    }

    public created(): void {
        this.updateShowValue();
    }

    public mounted(): void {
        this.updateShowValue();
    }

    private updateShowValue(): void {
        this.show = this.locked || (!this.locked && !this.close);
    }

    @Watch('locked')
    private watchLocked(locked: boolean): void {
        if (locked) {
            this.previousValue = this.show;
            this.updateShowValue();
        } else if (null !== this.previousValue) {
            this.show = this.previousValue;
            this.previousValue = null;
        }
    }
}
