/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {AbstractRequestDataEvent} from '@klipper/bow/http/event/AbstractRequestDataEvent';
import {Dictionary} from '@klipper/bow/generic/Dictionary';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class PushRequestDataEvent<D = Dictionary<any>> extends AbstractRequestDataEvent {
    public data: D;

    public isCreate(): boolean {
        return !(this.data as any).id || 'create' === (this.data as any).id;
    }

    public getMethod(): PushRequestDataEventMethod {
        return undefined !== (this.data as any).id ? PushRequestDataEventMethod.PATCH : PushRequestDataEventMethod.POST;
    }

    public getPushUrl(url: string): string {
        return url + ((this.data as any).id ? '/' + (this.data as any).id : '');
    }
}

export enum PushRequestDataEventMethod {
    PATCH = 'PATCH',
    POST = 'POST',
}
