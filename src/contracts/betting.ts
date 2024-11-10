import {
    Dictionary,

    Address,
    beginCell,
    Cell,
    Contract,
    contractAddress,
    ContractProvider,
    Sender,
    SendMode,
    toNano,
} from '@ton/core';
// import TonWeb from 'tonweb';
// let cell = new TonWeb.boc.Cell();
// function writeStringTail(str: string, cell: any) {
//     const bytes = Math.floor(cell.bits.getFreeBits() / 8); // 1 symbol = 8 bits
//     if (bytes < str.length) { // if we can't write all string
//         cell.bits.writeString(str.substring(0, bytes)); // write part of string
//         const newCell = writeStringTail(str.substring(bytes), new TonWeb.boc.Cell()); // create new cell
//         cell.refs.push(newCell); // add new cell to current cell's refs
//     } else {
//         cell.bits.writeString(str); // write all string
//     }

//     return cell;
// }

// function readStringTail(slice: any) {
//     const str = new TextDecoder('ascii').decode(slice.array); // decode uint8array to string
//     if (cell.refs.length > 0) {
//         return str + readStringTail(cell.refs[0].beginParse()); // read next cell
//     } else {
//         return str;
//     }
// }


export type BettingConfig = {
    admin: Address;
    black: Address;
    // merkleRoot: bigint;
};


export function bettingConfigToCell(config: BettingConfig): Cell {
    return beginCell()
        .storeAddress(config.admin)
        .storeAddress(config.black)
        .storeInt(0, 64)
        .storeInt(0, 64)
        .storeDict(Dictionary.empty())
        .storeDict(Dictionary.empty())
        .storeDict(Dictionary.empty())
        .endCell();
}


// export type AirdropEntry = {
//     address: Address;
//     amount: bigint;
// };


// export const airdropEntryValue = {
//     serialize: (src: AirdropEntry, buidler: Builder) => {
//         buidler.storeAddress(src.address).storeCoins(src.amount);
//     },
//     parse: (src: Slice) => {
//         return {
//             address: src.loadAddress(),
//             amount: src.loadCoins(),
//         };
//     },
// };

// export function generateEntriesDictionary(entries: AirdropEntry[]): Dictionary<bigint, AirdropEntry> {
//     let dict: Dictionary<bigint, AirdropEntry> = Dictionary.empty(Dictionary.Keys.BigUint(256), airdropEntryValue);

//     for (let i = 0; i < entries.length; i++) {
//         dict.set(BigInt(i), entries[i]);
//     }

//     return dict;
// }


export class Betting implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }


    static createFromAddress(address: Address) {
        return new Betting(address);
    }

    static createFromConfig(config: BettingConfig, code: Cell, workchain = 0) {
        const data = bettingConfigToCell(config);
        const init = { code, data };
        return new Betting(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,

        });
    }


    static changeBlackMessage(newBlack: Address) {
        return beginCell().storeUint(0x4840664f, 32).storeUint(0, 64) // op, queryId
            .storeAddress(newBlack)
            .endCell();
    }

    async sendChangeBlack(provider: ContractProvider, via: Sender, newBlack: Address) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Betting.changeBlackMessage(newBlack),
            value: toNano("0.02"),
        });
    }

    static createLOT(lotType: bigint, startTime: bigint, endTime: bigint, title: string, description: string) {
        // const str = "Lorem ipsum dolor sit amet,Lorem ipsum ";

        // const des = writeStringTail(str, cell);
        return beginCell()
            .storeUint(0x610ca46f, 32)
            .storeUint(0, 64) // op, queryId

            .storeUint(lotType, 64) // op, queryId
            .storeUint(startTime, 64) // op, queryId
            .storeUint(endTime, 64) // op, queryId
            // .storeStringTail(str)
            .storeRef(
                beginCell()
                    .storeStringTail(description)
                    .endCell()
            )
            .storeRef(
                beginCell()
                    .storeStringTail(title)
                    .endCell()

            )
            .endCell();
    }

    async sendCreateLOT(provider: ContractProvider, via: Sender, lotType: bigint, startTime: bigint, endTime: bigint, title: string, description: string) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Betting.createLOT(lotType, startTime, endTime, title, description),
            value: toNano('0.1')
        });

    }

    static withdrawMessage() {
        return beginCell().storeUint(0x46ed2e94, 32).storeUint(0, 64) // op, queryId
            .endCell();
    }

    async sendWithdraw(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Betting.withdrawMessage(),
            value: toNano('0.01')
        });

    }

    static sendBetting(bet_lot_type: bigint, bet_lot_auction_type: bigint) {
        return beginCell().storeUint(0x58ca5362, 32).storeUint(0, 64).storeUint(bet_lot_type, 64).storeUint(bet_lot_auction_type, 64)
            .endCell();
    }
    async sendBet(provider: ContractProvider, via: Sender, bet_lot_type: bigint, bet_lot_auction_type: bigint, betAmount: string) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Betting.sendBetting(bet_lot_type, bet_lot_auction_type),
            value: toNano(betAmount)
        });

    }
    static getClaimTon(bet_lot_type: bigint) {
        return beginCell().storeUint(0x43c7d5d9, 32).storeUint(0, 64).storeUint(bet_lot_type, 64)
            .endCell();
    }
    async getClaim(provider: ContractProvider, via: Sender, bet_lot_type: bigint) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Betting.getClaimTon(bet_lot_type),
            value: toNano('0.1')
        });

    }

    static sendBetWinner(bet_lot_type: bigint, bet_winner: bigint) {
        return beginCell().storeUint(0x4840666f, 32).storeUint(0, 64).storeUint(bet_lot_type, 64).storeUint(bet_winner, 64)
            .endCell();
    }
    async sendBetWin(provider: ContractProvider, via: Sender, bet_lot_type: bigint, bet_winner: bigint) {
        await provider.internal(via, {
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: Betting.sendBetWinner(bet_lot_type, bet_winner),
            value: toNano('0.05')
        });

    }
    async getLotData(provider: ContractProvider, lot: bigint) {
        try {
            const res = await provider.get('get_lot_data', [{ type: 'int', value: BigInt(lot) }]);
            console.log("=================== getLotData =======================", res)
            const result = res.stack;
            const lot_index = Number(result.readBigNumber());
            const title = result.readCell().beginParse().loadStringTail();
            // console.log(title_cell)
            // console.log(title_cell.beginParse().loadStringTail())
            const auction_index = Number(result.readBigNumber());
            const lot_type = Number(result.readBigNumber());
            const start_time = Number(result.readBigNumber());
            const end_time = Number(result.readBigNumber());
            const total_amount = Number(result.readBigNumber());
            const winner = Number(result.readBigNumber());
            const description = result.readCell().beginParse().loadStringTail();
            const claim_flag = Number(result.readBigNumber());
            return {
                lot_index,
                auction_index,
                title,
                lot_type,
                start_time,
                end_time,
                total_amount,
                winner,
                description,
                claim_flag
            }
        } catch (e) {
            console.log(e)
        }
    }
    async getUserData(provider: ContractProvider, address: string, bet_lot_auction_type: bigint) {
        try {
            const res = await provider.get('get_user_data', [{ type: 'slice', cell: beginCell().storeAddress(Address.parse(address)).endCell() }, { type: 'int', value: bet_lot_auction_type }]);
            const result = res.stack;

            const total_amount = result.readBigNumber();
            console.log(total_amount)
            return {
                total_amount
            }
        } catch (e) {
            console.log(e)
            return {
                total_amount: 0
            }
        }
    }
    async getUserClaimData(provider: ContractProvider, address: string, bet_lot_auction_type: bigint) {
        try {
            console.log(address, bet_lot_auction_type)
            const res = await provider.get('get_user_claim_data', [{ type: 'slice', cell: beginCell().storeAddress(Address.parse(address)).endCell() }, { type: 'int', value: bet_lot_auction_type }]);
            const result = res.stack;

            const claim_amount = result.readBigNumber() || 0n;
            // const claim_flag = result.readBigNumber() || 0n;
            console.log(claim_amount)
            // console.log(claim_flag)
            return {
                claim_amount,
                // claim_flag
            }
        } catch (e) {
            console.log(e)
            return {
                claim_amount: 0,
                // claim_flag: 0
            }
        }
    }
    async getContractData(provider: ContractProvider) {
        try {
            const res = await provider.get('get_contract_data', []);
            const result = res.stack;
            const adminAddress = result.readAddress();
            const deployAddress = result.readAddress();
            const lot_index = result.readBigNumber();
            const lot_auction_index = result.readBigNumber();

            return {
                adminAddress,
                deployAddress,
                lot_index,
                lot_auction_index


            }
        } catch (e) {
            console.log(e)
        }
    }
    async getAdminAddress(provider: ContractProvider) {
        const res = await this.getContractData(provider);
        return res?.adminAddress;
    }
    async getLotIndex(provider: ContractProvider) {
        const res = await this.getContractData(provider);
        return Number(res?.lot_index);
    }
    async getLotAuctionIndex(provider: ContractProvider) {
        const res = await this.getContractData(provider);
        return Number(res?.lot_auction_index);
    }
    async getLotInformation(provider: ContractProvider) {
        const res = await this.getContractData(provider);
        return {
            lot_index: Number(res?.lot_index),
            lot_auction_index: Number(res?.lot_auction_index)
        }
    }
    async getNowTime(provider: ContractProvider) {
        const res = await provider.get('get_now_time', []);
        const result = res.stack;
        const now_time = Number(result.readBigNumber());
        return now_time;
    }

}
