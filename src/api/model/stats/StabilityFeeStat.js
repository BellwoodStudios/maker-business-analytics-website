import { Stat, StatTypes, StatTargets } from 'api/model';

export default class StabilityFeeStat extends Stat {

    constructor () {
        super({
            name: "Stability Fee",
            color: "#1AAB9B",
            type: StatTypes.PERCENT,
            targets: StatTargets.VAULT,

            // Stability fee is made up of the base fee and the vault-specific fee
            stats: [
                new BaseFeeStat(),
                new VaultFeeStat()
            ]
        });
    }

}

export class BaseFeeStat extends Stat {

    constructor () {
        super({
            name: "Base Fee",
            color: "#F4B731",
            type: StatTypes.PERCENT,
            targets: StatTargets.VAULT
        });
    }

}

export class VaultFeeStat extends Stat {

    constructor () {
        super({
            name: "Vault Fee",
            color: "#00E676",
            type: StatTypes.PERCENT,
            targets: StatTargets.VAULT
        });
    }

}