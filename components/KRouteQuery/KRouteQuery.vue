<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {replaceRouteQuery, restoreRouteQuery} from '@klipper/bow/utils/router';
import {defineComponent, PropType} from '@vue/composition-api';
import {CreateElement, Props, RenderContext, VNode} from 'vue';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KRouteQuery',

    props: {
        query: {
            type: String,
            required: true,
        },

        queryPrefix: {
            type: String,
            default: undefined,
        },

        defaultValue: {
            default: undefined,
        },

        valueType: {
            type: String,
            default: undefined,
        },

        /**
         * Inject the query value in route if query is not defined in the route.
         */
        forceQuery: {
            type: Boolean,
            default: false,
        },

        slotProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    data(): Dictionary<any> {
        return {
            isMounted: false as boolean,
            queryValue: undefined as string|number,
        };
    },

    computed: {
        genSlotProps(): Dictionary<any> {
            return {
                ...this.slotProps,
                attrs: this.genAttrsProps,
                on: this.genOnProps,
                queryValue: this.queryValue,
            };
        },

        genAttrsProps(): Dictionary<any> {
            return {
                value: this.queryValue,
            };
        },

        genOnProps(): Dictionary<any> {
            return {
                change: this.onChange,
            };
        },
    },

    mounted(): void {
        const queryValue = restoreRouteQuery<any>(
            this.query,
            this.$route,
            this.queryPrefix,
            this.defaultValue,
            this.valueType,
        );

        if (undefined !== queryValue) {
            this.queryValue = queryValue;
        }

        this.isMounted = true;

        if (this.forceQuery) {
            this.onChange(this.queryValue);
        }
    },

    methods: {
        onChange(value: string|number): void {
            this.queryValue = value;

            if (this.isMounted) {
                replaceRouteQuery(
                    {
                        [this.query]: this.queryValue,
                    },
                    this.$route,
                    this.queryPrefix,
                );
            }
        },
    },

    render(createElement: CreateElement, context: RenderContext<Props>): VNode | VNode[] {
        const defaultSlot = this.$scopedSlots.default ? this.$scopedSlots.default(this.genSlotProps) : undefined;

        if (0 === defaultSlot.length) {
            return defaultSlot;
        }

        return createElement('div', {
            class: 'k-route-query',
            props: this.$attrs,
            on: this.$listeners,
        }, defaultSlot);
    },
});
</script>
