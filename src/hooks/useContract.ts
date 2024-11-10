import { useEffect, useState } from 'react';
import { Betting } from '../contracts/betting';
import { useTonClient } from './useTonClient';
import { useAsyncInitialize } from './useAsyncInitialize';
import { Address, OpenedContract } from '@ton/core';
import { useTonConnect } from './useTonConnect';
import { BettingContractAddress } from '../const';
import { sleep } from '../utils/utils';
export function useContract() {

    const client = useTonClient();
    const [adminAddress, setAdminAddress] = useState<null | Address>();

    const [lotIndex, setLotIndex] = useState<undefined | number>(0);
    const [lotAuctoinIndex, setLotAuctoinIndex] = useState<undefined | number>(0);
    const [nowTime, setNowTime] = useState<number>(0);
    const { sender, wallet } = useTonConnect();

    const betting = useAsyncInitialize(async () => {
        if (!client) return;
        const new_contract = new Betting(
            Address.parse(BettingContractAddress) // replace with your address from tutorial 2 step 8
        );
        return client.open(new_contract) as unknown as OpenedContract<Betting>;
    }, [client]);
    useEffect(() => {
        async function getValue() {

            try {
                if (!betting || !wallet) return;
                console.log('\\============= get Value -=================', betting)
                setAdminAddress(null);
                const val = await betting.getAdminAddress();
                await sleep(1000)
                const lotIndex = await betting.getLotIndex();
                await sleep(1000)
                const lot_auction_index = await betting.getLotAuctionIndex();
                await sleep(1000)
                const time = await betting?.getNowTime();
                await sleep(1000)
                console.log(lotIndex)
                setNowTime(time)
                setAdminAddress(val);
                setLotIndex(Number(lotIndex));
                setLotAuctoinIndex(Number(lot_auction_index))

            } catch (e) {
                console.log(e)
            }
        }

        getValue();

    }, [wallet, betting]);
    return {
        value: adminAddress,
        lotIndex,
        lotAuctoinIndex,
        nowTime,

        getUserData: (address: string, bet_lot_auction_type: bigint) => { return betting?.getUserData(address, bet_lot_auction_type); },
        getLotData: (lot: bigint) => { return betting?.getLotData(lot); },
        getUserClaimData: (address: string, bet_lot_auction_type: bigint) => { return betting?.getUserClaimData(address, bet_lot_auction_type); },
        withdrawToAdmin: () => { return betting?.sendWithdraw(sender); },
        changeAdmin: (newBlack: string) => { return betting?.sendChangeBlack(sender, Address.parse(newBlack)); },
        getNowTime: () => { return betting?.getNowTime(); },
        createLot: (lotType: bigint, start_time: bigint, end_time: bigint, title: string, description: string) => { return betting?.sendCreateLOT(sender, lotType, start_time, end_time, title, description); },
        sendBetting: (bet_lot_type: bigint, bet_lot_auction_type: bigint, betAmount: string) => { return betting?.sendBet(sender, bet_lot_type, bet_lot_auction_type, betAmount); },
        sendBetWin: (bet_lot_type: bigint, bet_winner: bigint) => { return betting?.sendBetWin(sender, bet_lot_type, bet_winner); },
        claimTon: (bet_lot_type: bigint) => { return betting?.getClaim(sender, bet_lot_type); },
    };
}
