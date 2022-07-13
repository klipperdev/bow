/*
 * This file is part of the Klipper package.
 *
 * (c) François Pluchino <francois.pluchino@klipper.dev>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import {VoterInterface} from '@klipper/bow/security/voters/VoterInterface';

/**
 * @author François Pluchino <francois.pluchino@klipper.dev>
 */
export class SecurityManager {
    private readonly voters: Array<VoterInterface>;

    public constructor(voters: Array<VoterInterface> = []) {
        this.voters = voters;
    }

    public isGranted(attribute: string, subject?: any): boolean {
        for (const voter of this.voters) {
            if (voter.supports(attribute, subject)) {
                return voter.voteOnAttribute(attribute, subject);
            }
        }

        return false;
    }
}
