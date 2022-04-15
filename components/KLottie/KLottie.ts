/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import lottie, {AnimationConfigWithData, AnimationItem, RendererType} from 'lottie-web';
import {Component, Prop, Ref, Vue} from 'vue-property-decorator';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class Lottie extends Vue {
    @Prop({type: String, default: '100%'})
    public width: string;

    @Prop({type: String, default: '100%'})
    public height: string;

    @Prop({type: String})
    public maxWidth: string;

    @Prop({type: String})
    public transform: string;

    @Prop({type: Boolean, default: false})
    public center: boolean;

    @Prop({type: Boolean, default: false})
    public inline: boolean;

    @Prop({type: Object, required: true})
    public options: AnimationConfigWithData<RendererType>;

    @Ref('lavContainer')
    private readonly lavContainerRef!: Vue|HTMLElement;

    private animation?: AnimationItem;

    private get style(): Dictionary<any> {
        return {
            'width': this.width,
            'height': this.height,
            'max-width': this.maxWidth,
            'overflow': 'hidden',
            'margin': this.center ? '0 auto' : undefined,
            'display': this.inline ? 'inline-block' : 'block',
        };
    }

    public mounted(): void {
        const defaultParams = {
            container: this.lavContainerRef,
            renderer: 'svg',
            loop: false,
            autoplay: true,
        } as AnimationConfigWithData<RendererType>;
        const params = Object.assign({}, defaultParams, this.options);

        this.animation = lottie.loadAnimation(params);
        this.updateTransform();
        this.$emit('lottie-created', this.animation);
    }

    public beforeUpdate(): void {
        this.updateTransform();
    }

    public destroyed(): void {
        if (this.animation) {
            this.animation = undefined;
        }
    }

    private updateTransform(): void {
        if (this.animation && this.transform) {
            const svgs: HTMLCollection = this.$el.getElementsByTagName('svg');
            (svgs[0] as HTMLElement).style.transform = this.transform;
        }
    }
}
