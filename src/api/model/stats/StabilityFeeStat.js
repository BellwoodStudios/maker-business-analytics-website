import { Stat, StatTypes, StatTargets, StatFormats, Block, StatData, StatDataItem } from 'api/model';
import { fetchGraphQL } from 'api';
import { feeToAPY, sumFees } from 'utils/MathUtils';
import BigNumber from 'bignumber.js';

export default class StabilityFeeStat extends Stat {

    constructor () {
        super({
            name: "Stability Fee",
            color: "#1AAB9B",
            type: StatTypes.VALUE,
            format: StatFormats.PERCENT,
            targets: StatTargets.VAULT,

            // Stability fee is made up of the base fee and the vault-specific fee
            stats: [
                new BaseFeeStat(),
                new VaultFeeStat()
            ]
        });
    }

    /**
     * Stat sum requires use of BigNumber.
     */
    combine (values) {
        let total = new BigNumber(0);
        for (const v of values) if (v != null) total = sumFees(total, v.extraData.compoundingFee);
        const apy = feeToAPY(total);
        return apy >= 0 ? apy : null;
    }

}

export class BaseFeeStat extends Stat {

    constructor () {
        super({
            name: "Base Fee",
            color: "#F4B731",
            type: StatTypes.VALUE,
            format: StatFormats.PERCENT,
            targets: StatTargets.VAULT,
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
            type: StatTypes.VALUE,
            format: StatFormats.PERCENT,
            targets: StatTargets.VAULT,
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
        const data = result.data.allJugFileIlks.nodes.filter(n => query.filterByIlk(n)).map(n => {
            return {
                block: new Block(n.headerByHeaderId),
                value: feeToAPY(n.data),
                extraData: {
                    compoundingFee: n.data,
                    fee: feeToAPY(n.data),
                    group: n.ilkId
                }
            };
        });

        return new StatData({
            stat: this,
            data: data
        });
    }

}