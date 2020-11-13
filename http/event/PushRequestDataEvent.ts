/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Dictionary} from '@klipper/bow/generic/Dictionary';
import {AbstractRequestDataEvent} from '@klipper/bow/http/event/AbstractRequestDataEvent';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class PushRequestDataEvent<D = Dictionary<any>> extends AbstractRequestDataEvent {
    public id: number|string|undefined;

    public data: D;

    public isCreate(): boolean {
        return !this.id || 'create' === this.id;
    }

    public getMethod(): PushRequestDataEventMethod {
        return undefined !== this.id ? PushRequestDataEventMethod.PATCH : PushRequestDataEventMethod.POST;
    }

    public getPushUrl(url: string): string {
        return url + (this.id ? '/' + this.id : '');
    }
}

export enum PushRequestDataEventMethod {
    PATCH = 'PATCH',
    POST = 'POST',
}
