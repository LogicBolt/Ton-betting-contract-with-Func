// LotBox.tsx
import React, { useEffect, useState } from 'react';
import "./style.css"
// import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useContract } from '../hooks/useContract';
import {
    useTonWallet
} from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import { sleep, getStatusMessage, getlotState } from '../utils/utils';
import { toast } from 'react-toastify';
import { Loading } from '../utils/Loading';
interface LotBoxProps {
    title: string;
    start_time: number;
    end_time: number;
    description: string;
    total_amount: number;
    winner: number;
    user_data: object;
    bettingNumber: number;
    auctionIndex: number;
    lot_index: number;
    nowTime: number;
    // onClick: () => void;
}
// Track selected betting numbers


// Toggle selected betting number

const LotBox: React.FC<LotBoxProps> = ({
    //@ts-ignore
    title, lot_index, description, start_time, end_time, bettingNumber, total_amount, winner, user_data, auctionIndex, nowTime }) => {

    const {
        value,
        lotIndex,
        sendBetWin,
    } = useContract();
    const navigate = useNavigate()
    // @ts-ignore
    // const [tonConnectUI, setOptions] = useTonConnectUI();
    const [selectedNumbers, setSelectedNumbers] = useState<number>(0);
    // const [bettingAmount, setBettingAmount] = useState<string>('0');
    const wallet = useTonWallet();
    const [mybet, setMyBet] = useState<object>({});
    const handleBettingClick = (index: number) => {
        setSelectedNumbers(index)
    };
    useEffect(() => {
        if (typeof bettingNumber === 'number' && bettingNumber > 0 && wallet?.account.address !== "") {
            // Fetch all lot data
            const fetchLotData = async () => {
                // const lotsData = [];
                for (let i = 0; i < bettingNumber; i++) {
                    let obj = {};
                    const index = auctionIndex + i;
                    //@ts-ignore
                    const data = user_data[index];
                    //@ts-ignore
                    obj[index] = data
                    setMyBet(prevMyBet => ({
                        ...prevMyBet,
                        ...obj
                    }));
                    // console.log(data)
                    await sleep(700)
                }
                // console.log(lotsData)
                //@ts-ignore
                // setLotDataList(lotsData);
            };
            fetchLotData();
        }
    }, [lotIndex, wallet?.account.address]);
    return (
        <>
            {
                nowTime === 0 ?
                    <Loading />
                    :
                    <div className="lot-box" onClick={() => navigate(`/lot/${lot_index}`)}>
                        <div className="lot-title">{title}</div>
                        <span>{description}</span>
                        <div className='lot-time'>{getStatusMessage(start_time, end_time, nowTime)}</div>
                        {/* <div className="lot-time">{start_time}</div>
                <div className="lot-time">{end_time}</div>
                <div className="lot-time">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div> */}
                        <div className="betting-numbers">
                            {Array.from({ length: bettingNumber }, (_, index) => (
                                <div
                                    key={index}
                                    className={`betting-number ${selectedNumbers === auctionIndex + index ? 'selected' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent triggering lot-box click
                                        handleBettingClick(auctionIndex + index);
                                    }}
                                >
                                    <span>Bet {auctionIndex + index} - {
                                        //@ts-ignore
                                        mybet[auctionIndex + index]
                                    } Ton </span>
                                </div>
                            ))}
                        </div>
                        <span>{total_amount / (10 ** 9)}Ton Betted</span>
                        <span>{winner === 0 ? "no winner yet" : "bet" + winner + " Winner"} </span>

                    </div>
            }

            {
                wallet && value?.toRawString() === wallet?.account.address &&
                <>
                    Admin!!!
                    you can set winner after betting ended.
                    <div>
                        <button
                            className="center-button"
                            style={{ margin: '10px auto', width: '50%', textAlign: 'center' }}
                            onClick={() => {
                                if (selectedNumbers === 0)
                                    toast.error("Please select any to set as winner.");
                                else {
                                    console.log(lot_index, selectedNumbers)
                                    if (getlotState(start_time, end_time, nowTime) === 1)
                                        sendBetWin(BigInt(lot_index), BigInt(selectedNumbers));
                                    else
                                        toast.error("Bet not ended or started yet");
                                }

                            }}
                        >Set Winner</button>
                    </div>
                </>
            }
        </>
    );
}
export default LotBox;