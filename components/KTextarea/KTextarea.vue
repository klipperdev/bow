<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import KText from '@klipper/bow/components/KText/KText.vue';
import {defineComponent} from '@vue/composition-api';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KTextarea',

    extends: KText,

    computed: {
        classes(): object {
            return {
                'k-textarea': true,
                ...this.themeClasses,
                ...this.textColorClasses,
            };
        },

        genValue(): string|undefined {
            let value = this.value;

            if (undefined !== value && null !== value) {
                if (this.prepend) {
                    value = this.prepend + ' ' + value;
                }

                if (this.append) {
                    value += ' ' + this.append;
                }
            }

            if (value) {
                return typeof value === 'string'
                    ? value.replace(/\r\n|\r|\n/g, '<br />')
                    : value;
            }

            return value;
        },
    },
});
</script>
