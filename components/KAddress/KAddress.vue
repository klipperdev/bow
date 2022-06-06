<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import KTextarea from '@klipper/bow/components/KTextarea/KTextarea.vue';
import {defineComponent} from '@vue/composition-api';
import {PropType} from 'vue';


/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KAddress',

    extends: KTextarea,

    props: {
        value: {
            type: [Object, null] as PropType<Dictionary<any>|null>,
            default: null,
            required: true,
        },

        hideStreet: {
            type: Boolean,
            default: false,
        },

        hideStreetComplement: {
            type: Boolean,
            default: false,
        },

        hidePostalCode: {
            type: Boolean,
            default: false,
        },

        hideCity: {
            type: Boolean,
            default: false,
        },

        hideState: {
            type: Boolean,
            default: false,
        },

        hideCountry: {
            type: Boolean,
            default: false,
        },

        inline: {
            type: Boolean,
            default: false,
        },
    },

    computed: {
        classes(): object {
            return {
                'k-address': true,
                ...this.themeClasses,
                ...this.textColorClasses,
            };
        },
    },

    methods: {
        beforeGenValue(value?: string): string|undefined {
            let address = '';

            if (typeof this.value === 'object') {
                const street = this.value?.street;
                const streetComplement = this.value?.street_complement;
                const postalCode = this.value?.postal_code;
                const city = this.value?.city;
                const state = this.value?.state;
                const country = this.value?.country;

                if (street && !this.hideStreet) {
                    address += street;
                }

                if (streetComplement && !this.hideStreetComplement) {
                    address += (address ? '\n' : '') + streetComplement;
                }

                if (postalCode && !this.hidePostalCode) {
                    address += (address ? '\n' : '') + postalCode;

                    if (city) {
                        address += ' ' + city;
                    }
                } else if (city && !this.hideCity) {
                    address += (address ? '\n' : '') + city;
                }

                if (state && !this.hideState) {
                    address += (address ? '\n' : '') + state;
                }

                if (country && !this.hideCountry) {
                    address += (address ? '\n' : '') + this.$country(country);
                }
            }

            if (this.inline && address) {
                return address.replaceAll('\n', ' ');
            }

            return address || undefined;
        },
    },
});
</script>
