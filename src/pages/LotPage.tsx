import React, { useEffect } from 'react';
import { useContractContext } from '../context/ContractContext';
import { useContract } from '../hooks/useContract';
import LotBox from './LotBox';
interface LotPageProps {
    filter: number[] | null;
    bottomFilter: number | null;
}
export const LotPage: React.FC<LotPageProps> = ({ filter, bottomFilter }) => {
    const { lotDataList, resetInitialization } = useContractContext();
    const { nowTime } = useContract();
    console.log(lotDataList, nowTime)
    let filteredLotDataList = filter?.length === 3
        ? lotDataList
        : []
    const filteredLotSet = new Set();
    if (filter?.includes(0)) {
        //@ts-ignore
        const upcomingLots = lotDataList.filter((lot) => lot.start_time > nowTime)
        // filteredLotDataList = [...filteredLotDataList, ...temp]
        //@ts-ignore
        upcomingLots.forEach((lot) => filteredLotSet.add(lot));
    }
    if (filter?.includes(1)) {
        //@ts-ignore
        const activeLots = lotDataList.filter((lot) => lot.start_time < nowTime && lot.end_time > nowTime)
        // filteredLotDataList = [...filteredLotDataList, ...temp]
        //@ts-ignore
        activeLots.forEach((lot) => filteredLotSet.add(lot));
    }
    if (filter?.includes(2)) {
        //@ts-ignore
        const expiredLots = lotDataList.filter((lot) => lot.end_time < nowTime && lot.start_time < nowTime)
        // filteredLotDataList = [...filteredLotDataList, ...temp]
        //@ts-ignore
        expiredLots.forEach((lot) => filteredLotSet.add(lot));
    }

    if (filteredLotDataList.length === 0)
        //@ts-ignore
        filteredLotDataList = Array.from(filteredLotSet);
    // Apply bottomFilter
    if (bottomFilter === 2) {
        //@ts-ignore
        filteredLotDataList = filteredLotDataList.filter(lot => {
            let flag = false;
            Object.keys(lot.user_data).filter(key => {
                //@ts-ignore
                if (lot.user_data[key] > 0) flag = true
            });
            return flag
        })
    }
    useEffect(() => {
        resetInitialization();
    }, []);
    return (
        <>
            {
                !nowTime ? <></> :
                    //@ts-ignore
                    filteredLotDataList.map(lotData => (
                        <LotBox
                            nowTime={nowTime}
                            key={lotData.lot_index}
                            title={lotData.title}
                            lot_index={lotData.lot_index}
                            start_time={lotData.start_time}
                            end_time={lotData.end_time}
                            bettingNumber={lotData.lot_type}
                            total_amount={lotData.total_amount}
                            winner={lotData.winner}
                            auctionIndex={lotData.auction_index}
                            description={lotData.description}
                            user_data={lotData.user_data}
                        />
                    ))}
        </>
    )
}

