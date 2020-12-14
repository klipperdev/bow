/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Component, Vue} from 'vue-property-decorator';
import colors from 'vuetify/lib/util/colors';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
@Component({
    inheritAttrs: false,
})
export default class KFormColor extends Vue {
    public mounted(): void {
        if (!this.$attrs.value) {
            this.$emit('input', colors.blueGrey.base);
        }
    }
}
