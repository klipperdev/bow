<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import {defineComponent} from '@vue/composition-api';
import {VTextField} from 'vuetify/lib';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KFormText',

    extends: VTextField,

    methods: {
        setValue(value: any): void {
            this.$emit('input', value);
        },
    },
});
</script>
