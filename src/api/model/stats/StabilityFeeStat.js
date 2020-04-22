import { Stat, StatTypes, StatTargets, StatAggregations, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { feeToAPY, sumFees } from 'utils/MathUtils';

export default class StabilityFeeStat extends Stat {

    constructor () {
        super({
            name: "Stability Fee",
            color: "#1AAB9B",
            type: StatTypes.PERCENT,
            targets: StatTargets.VAULT,
            aggregation: StatAggregations.REPLACE,

            // Stability fee is made up of the base fee and the vault-specific fee
            stats: [
                new BaseFeeStat(),
                new VaultFeeStat()
            ]
        });
    }

    async fetch (query) {
        const combined = await this.fetchAllChildStats(query);

        let baseFee = 0;
        let vaultFee = 0;
        for (const stat of combined) {
            if (stat.vault != null) {
                // Vault fee
                vaultFee = stat.extraData.compoundingFee;
            } else {
                // Base fee
                baseFee = stat.extraData.compoundingFee;
            }

            stat.value = feeToAPY(sumFees(baseFee, vaultFee));
        }

        return new StatData({
            stat:this,
            data:combined
        });
    }

}

export class BaseFeeStat extends Stat {

    constructor () {
        super({
            name: "Base Fee",
            color: "#F4B731",
            type: StatTypes.PERCENT,
            targets: StatTargets.ALL,
            aggregation: StatAggregations.REPLACE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allJugFileBases {
                    nodes {
                        id,
                        headerId,
                        what,
                        data,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allJugFileBases.nodes.filter(n => n.what === "base").map(n => {
            return new StatDataItem({
                block: new Block(n.headerByHeaderId),
                value: feeToAPY(n.data),
                extraData: {
                    compoundingFee: n.data,
                    fee: feeToAPY(n.data)
                }
            });
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}

export class VaultFeeStat extends Stat {

    constructor () {
        super({
            name: "Vault Fee",
            color: "#00E676",
            type: StatTypes.PERCENT,
            targets: StatTargets.VAULT,
            aggregation: StatAggregations.REPLACE
        });
    }

    async fetch (query) {
        const result = await fetchGraphQL(`
            {
                allJugFileIlks {
                    nodes {
                        id,
                        headerId,
                        ilkId,
                        what,
                        data,
                        headerByHeaderId {
                            blockNumber,
                            blockTimestamp
                        }
                    }
                }
            }
        `);

        // TODO - shouldn't be filtering on client for performance reasons
        const data = result.data.allJugFileIlks.nodes.filter(n => n.what === "duty" && n.ilkId === query.vault.id).map(n => {
            return {
                block: new Block(n.headerByHeaderId),
                value: feeToAPY(n.data),
                extraData: {
                    compoundingFee: n.data,
                    fee: feeToAPY(n.data)
                }
            };
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}