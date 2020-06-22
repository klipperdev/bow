/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {User} from '../../account/User';
import {Organization} from '../../account/Organization';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export interface InitSuccess {
    user: User;
    currentOrganization: Organization;
    totalOrganizations: number;
    searchOrganization?: string;
    organizations: Organization[];
}
