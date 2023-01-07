<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {defineComponent, PropType} from '@vue/composition-api';
import {CreateElement, Props, RenderContext, VNode} from 'vue';

export interface RequestSlotProps {
    loading: boolean;
    error: HttpClientRequestError|null;
    previousRequests: CancelerBag,
    get errorCode(): number;
    get errorMessage(): string;
    finishLoading(): void;
    fieldErrors(field: string): string[];
    resetPreviousError(): void;
}

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export default defineComponent({
    name: 'KRequest',

    mixins: [
        AjaxContent,
    ],

    props: {
        request: {
            type: Function as PropType<<R, P = any>(canceler: Canceler, payload?: P) => Promise<R>>,
            required: true,
        },

        requestOnInit: {
            type: [Boolean, Function] as PropType<Boolean|(<P>(payload?: P) => boolean)>,
            default: false,
        },

        payload: {
            default: undefined,
        },

        refetchOnPayloadChange: {
            type: Boolean,
            default: false,
        },

        noErrorMessage: {
            type: Boolean,
            default: false,
        },

        hookAfterRequest: {
            type: Function,
            default: undefined,
        },

        slotProps: {
            type: Object as PropType<Dictionary<any>>,
            default: () => ({}),
        },
    },

    computed: {
        genSlotProps(): RequestSlotProps {
            return {
                ...this.slotProps,
                loading: this.loading,
                error: this.previousError,
                previousRequests: this.previousRequests,
                errorCode: this.errorCode,
                errorMessage: this.errorMessage,
                finishLoading: this.finishLoading,
                fieldErrors: this.fieldErrors,
                resetPreviousError: this.resetPreviousError,
                fetch: this.fetch,
            };
        },
    },

    mounted(): void {
        if ((typeof this.requestOnInit === 'boolean' && this.requestOnInit)
            || (typeof this.requestOnInit === 'function' && this.requestOnInit(this.payload))
        ) {
            this.fetch().then();
        }
    },

    methods: {
        async fetch<D>(): Promise<D|null> {
            const res = await this.fetchData<any>(async (canceler: Canceler) => {
                return await this.request(canceler, this.payload);
            }, !this.noErrorMessage, true);

            if (!this.previousError) {
                this.$emit('success', res, this.payload);
            } else {
                this.$emit('error', {
                    error: this.previousError,
                    previousRequests: this.previousRequests,
                    errorCode: this.errorCode,
                    errorMessage: this.errorMessage,
                    fieldErrors: this.fieldErrors,
                    resetPreviousError: this.resetPreviousError,
                    payload: this.payload,
                    result: res,
                });
            }

            return res;
        },

        hookAfterFetchDataRequest(): void {
            if (!!this.hookAfterRequest) {
                this.hookAfterRequest();
            } else {
                this.finishLoading();
            }
        },
    },

    watch: {
        payload: {
            handler(): void {
                if (this.refetchOnPayloadChange) {
                    this.fetch().then();
                }
            },
        },

        loading: {
            handler(loading: boolean): void {
                this.$emit('changeloading', loading);
            },
        },

        fetching: {
            handler(fetching: boolean): void {
                this.$emit('changefetching', fetching);
            },
        },
    },

    render(createElement: CreateElement, context: RenderContext<Props>): VNode | VNode[] {
        const defaultSlot = this.$scopedSlots.default ? this.$scopedSlots.default(this.genSlotProps) : undefined;

        if (undefined === defaultSlot || 0 === defaultSlot.length) {
            return defaultSlot;
        }

        return createElement('div', {
            class: 'k-request',

            props: this.$attrs,

            on: this.$listeners,
        }, defaultSlot);
    },
});
</script>
