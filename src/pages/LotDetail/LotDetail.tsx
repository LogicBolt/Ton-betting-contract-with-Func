// LotDetail.tsx
import React, { useEffect, useState } from 'react';
import "./LotDetail.css"
import { useContract } from '../../hooks/useContract';
import { useContractContext } from '../../context/ContractContext';
import { getStatusMessage, getlotState } from '../../utils/utils';
import {
    // useTonConnectUI,
    useTonWallet
} from '@tonconnect/ui-react';

import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { sleep } from '../../utils/utils';
interface LotDetailProps {
    // lot: {

    //     start_time: number;
    //     end_time: number;
    //     total_amount: number;
    //     winner: number;
    //     user_data: object;
    //     lot_type: number;
    //     lot_index: number;
    //     description: string;
    //     title: string;
    //     auction_index: number;
    // };
    // onBack: () => void;
    // onBet: (amount: number) => void;
}

const LotDetail: React.FC<LotDetailProps> = () => {
    const { lotDataList,
        resetInitialization,
        setLotDataList
    } = useContractContext();
    const navigate = useNavigate()
    const { lotIndex: lotUrlIndex } = useParams();
    //@ts-ignore
    const lot = lotDataList.filter(lot => lot.lot_index.toString() === lotUrlIndex)[0]
    console.log(lot)
    const wallet = useTonWallet();
    const [betAmount, setBetAmount] = useState<number>(0);
    const [selectedNumbers, setSelectedNumbers] = useState<number>(-1);
    const [claimAmount, setClaimAmount] = useState<number>(0);
    const {
        sendBetting,
        lotIndex, getLotData, getUserData,
        // getLotData 
        nowTime,
        getUserClaimData,
        claimTon
    } = useContract();
    const handleBettingClick = (index: number) => {
        setSelectedNumbers(index)
    };

    const handleBetClick = () => {
        // let index = 0;
        // if (selectedNumbers === -1) index = lot.auction_index
        // onBet(betAmount);

        console.log(lot.lot_index, selectedNumbers, betAmount)
        sendBetting(BigInt(lot.lot_index), BigInt(selectedNumbers), betAmount.toString())
        setBetAmount(0); // Reset after placing a bet
    };
    const handleClaimClick = () => {
        if (lot.claim_flag === 1)
            toast.error("you already claimed")
        else
            claimTon(BigInt(lot.lot_index))
        // sendBetting(BigInt(lot.lot_index), BigInt(selectedNumbers), claimAmount.toString())
    }

    const fetchLotData = async () => {
        try {
            //@ts-ignore
            const { claim_amount } = await getUserClaimData(wallet?.account.address, BigInt(lot.lot_index))
            // console.log(claim_amount, claim_flag)
            setClaimAmount(Number(claim_amount) / 10 ** 9 || 0);
            // setClaimFlag(Number(claim_flag) || 0);
        } catch (err) {
            console.log(err)
        }


    }
    console.log(lotIndex)
    const getLotAllData = async () => {
        const lotsData = []
        console.log(lotIndex, wallet?.account.address)
        if (typeof lotIndex === 'number' && lotIndex > 0 && wallet?.account.address) {
            for (let i = 1; i < lotIndex; i++) {
                const data = await getLotData(BigInt(i));
                console.log("=====================", data)
                if (data) {
                    const obj = {};
                    for (let j = 0; j < data.lot_type; j++) {
                        const index = data.auction_index + j;
                        //@ts-ignore
                        const userData = await getUserData(wallet?.account.address.toString(), BigInt(index));
                        console.log(userData)
                        if (userData) {
                            //@ts-ignore
                            obj[index] = Number(userData.total_amount) / (10 ** 9)

                            // console.log(data)
                        }
                        await sleep(700)
                    }

                    //@ts-ignore
                    data.user_data = obj

                    lotsData.push(data);
                }
            }
            console.log("======================== Lot Data Contet ====================", lotsData)

        }
        //@ts-ignore
        setLotDataList(lotsData);
    }
    // fetchLotData()
    useEffect(() => {
        fetchLotData();
    }, [wallet, lot.auction_index]);
    return (
        <div className="lot-detail">
            <button className="back-button" onClick={() => {
                resetInitialization()
                setLotDataList([])
                getLotAllData()
                navigate('/')
            }}>
                Back
            </button>
            {
                nowTime === 0 ?
                    <span>Loading...</span> :
                    <>
                        <div className="lot-detail-box">
                            <div className="lot-header">
                                <h1 className="lot-title">{lot.title}</h1>
                                <span className="lot-time">{getStatusMessage(lot.start_time, lot.end_time, nowTime)}</span>
                            </div>

                            <p className="lot-description">{lot.description}</p>

                            <div className="bet-options">
                                {/* <button className="bet-button">
                        bet1
                    </button>
                    <button className="bet-button">
                        bet2
                    </button> */}
                                {Array.from({ length: lot.lot_type }, (_, index) => (
                                    <div
                                        key={index}
                                        className={`betting-number ${selectedNumbers === lot.auction_index + index ? 'selected' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent triggering lot-box click
                                            handleBettingClick(lot.auction_index + index);
                                        }}
                                    >
                                        <span>Bet {index + 1} - {
                                            //@ts-ignore
                                            lot.user_data[lot.auction_index + index]
                                        } Ton </span>
                                    </div>
                                ))}
                                {/* {lot.betOptions.map((bet, index) => (
                        <button key={index} className="bet-button">
                            {bet}
                        </button>
                    ))} */}
                            </div>
                            {

                                getlotState(lot.start_time, lot.end_time, nowTime) === -1 ?
                                    <></> : getlotState(lot.start_time, lot.end_time, nowTime) === 0 ?
                                        <>
                                            <div className="bet-input">
                                                <input
                                                    type="number"
                                                    value={betAmount}
                                                    onChange={(e) => setBetAmount(Number(e.target.value))}
                                                    placeholder="Enter bet amount"
                                                />

                                            </div>
                                            <div className="bet-input">
                                                <button onClick={handleBetClick}> Bet</button>
                                            </div>
                                        </> :
                                        lot.winner === 0 ?
                                            <p className="lot-description">Winner is not yet decided</p> :
                                            lot.claim_flag === 0 ?
                                                claimAmount > 0 ?
                                                    <div className="bet-input">
                                                        <button onClick={handleClaimClick}> Claim {claimAmount} Ton</button>
                                                    </div>
                                                    : <p className="lot-description">You didn't win here. Don't worry, Keep it up!</p>
                                                : <p className="lot-description">You already claimed</p>
                            }

                        </div>
                    </>
            }



        </div>
    );
};

export default LotDetail;
