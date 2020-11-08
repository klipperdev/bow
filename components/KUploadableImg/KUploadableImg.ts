/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Prop, Vue} from 'vue-property-decorator';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component
export default class KUploadableImg extends Vue {
    @Prop({type: String, default: null})
    public apiSrc!: string|null;

    @Prop({type: String, default: null})
    public apiUploadSrc!: string|null;

    @Prop({type: Boolean, default: false})
    public rounded!: boolean;

    @Prop({type: Boolean, default: false})
    public tile!: boolean;

    @Prop({type: Number, default: 48})
    public size!: number;

    private get classes(): Dictionary<boolean> {
        return {
            'k-uploadable-img': true,
        };
    }

    private get styles(): Dictionary<string> {
        return {
            'width': this.size + 'px',
            'min-width': this.size + 'px',
            'height': this.size + 'px',
        };
    }

    private get iconSize(): number|undefined {
        return this.size ? (Math.round(this.size / 2)) : undefined;
    }

    private get allowedFileTypes(): string[] {
        return ['image/*', '.jpg', '.jpeg', '.png', '.tif', '.tiff', '.gif', '.svg', '.webp'];
    }

    private onUploadComplete(result: any): void {
        this.$emit('complete', result);
    }
}
