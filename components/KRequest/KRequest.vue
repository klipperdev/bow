<!--
This file is part of the Klipper package.

(c) François Pluchino <francois.pluchino@klipper.dev>

For the full copyright and license information, please view the LICENSE
file that was distributed with this source code.
-->

<script lang="ts">
import {AjaxContent} from '@klipper/bow/composables/mixins/http/ajaxContent';
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
            type: Function as PropType<<D, P = any>(canceler: Canceler, payload?: P) => Promise<D|null>>,
            required: true,
        },

        payload: {
            default: undefined,
        },

        noErrorMessage: {
            type: Boolean,
            default: false,
        },

        hookAfterRequest: {
            type: Function,
            default: undefined,
        },
    },

    computed: {
        genSlotProps(): RequestSlotProps {
            return {
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

    methods: {
        async fetch<D>(): Promise<D|null> {
            const res = await this.fetchData<any>(async (canceler: Canceler) => {
                return await this.request(canceler, this.payload);
            }, !this.noErrorMessage, true);

            if (!this.previousError) {
                this.$emit('success', res);
            } else {
                this.$emit('error', {
                    error: this.previousError,
                    previousRequests: this.previousRequests,
                    errorCode: this.errorCode,
                    errorMessage: this.errorMessage,
                    fieldErrors: this.fieldErrors,
                    resetPreviousError: this.resetPreviousError,
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

    render(createElement: CreateElement, context: RenderContext<Props>): VNode | VNode[] {
        const defaultSlot = this.$scopedSlots.default ? this.$scopedSlots.default(this.genSlotProps) : undefined;

        if (0 === defaultSlot.length) {
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
