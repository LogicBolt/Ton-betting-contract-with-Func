import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';
import { useContract } from '../hooks/useContract';
import { useTonConnect } from '../hooks/useTonConnect';
import { sleep } from '../utils/utils';
interface ContractContextType {
    lotDataList: any;
    resetInitialization: () => void; // Add this line
    setLotDataList: (data: any) => void;
    // contract: any;
    // connectWallet: () => void;
    // disconnectWallet: () => void;
    // isWalletConnected: boolean;
    // isWalletConnecting: boolean;  
}

interface ContractProviderProps {
    children: ReactNode;
}

const ContractContext = createContext<ContractContextType | null>(null);

export const useContractContext = (): ContractContextType => {
    const context = useContext(ContractContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};


export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
    const { lotIndex, getLotData, getUserData
    } = useContract();
    const { wallet } = useTonConnect();
    const [lotDataList, setLotDataList] = useState<{ lot_index: number, auction_index: number; title: string, lot_type: number, start_time: number; end_time: number; total_amount: number; winner: number, bettingNumber: number, description: string, claim_flag: number, user_data: object }[]>([]);
    const hasInitialized = useRef(false);
    const resetInitialization = useCallback(() => {
        hasInitialized.current = false;
    }, []);

    // const getAllData = async () => {
    //     try {


    //         if (typeof lotIndex === 'number' && lotIndex > 0 && wallet?.account.address) {
    //             for (let i = 1; i < lotIndex; i++) {
    //                 const data = await getLotData(BigInt(i));
    //                 console.log("=====================", data)
    //                 if (data) {
    //                     const obj = {};
    //                     for (let j = 0; j < data.lot_type; j++) {
    //                         const index = data.auction_index + j;
    //                         //@ts-ignore
    //                         const userData = await getUserData(wallet?.account.address.toString(), BigInt(index));
    //                         console.log(userData)
    //                         if (userData) {
    //                             //@ts-ignore
    //                             obj[index] = Number(userData.total_amount) / (10 ** 9)

    //                             // console.log(data)
    //                         }
    //                         await sleep(700)
    //                     }

    //                     //@ts-ignore
    //                     data.user_data = obj

    //                     lotsData.push(data);
    //                 }
    //             }
    //             console.log(lotsData)

    //         }
    //         //@ts-ignore
    //         setLotDataList(lotsData);
    //         hasInitialized.current = true;
    //     } catch (error) {
    //         console.error("Error fetching user status:", error);

    //     }
    // };

    const initializeState = useCallback(async () => {
        console.log("initializeState", hasInitialized, wallet?.account.address, lotIndex)
        if (hasInitialized.current || !wallet?.account?.address || !lotIndex) return;
        console.log("=============initializeState==========", hasInitialized, wallet?.account.address, lotIndex)
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
        hasInitialized.current = true;
        // await getAllData();



    }, [lotIndex, wallet]);
    useEffect(() => {
        initializeState();
    }, [initializeState]);
    return (
        <ContractContext.Provider value={{
            lotDataList,
            resetInitialization,
            setLotDataList
        }}>
            {children}
        </ContractContext.Provider>
    )
}