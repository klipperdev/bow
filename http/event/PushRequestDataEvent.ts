/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {Canceler} from '@klipper/http-client/Canceler';
import {MapKey} from '@klipper/http-client/models/MapKey';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class PushRequestDataEvent<D = MapKey> {
    public data: D;

    public canceler?: Canceler;

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
