import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import {
  useTonWallet
} from '@tonconnect/ui-react';
import { useContract } from './hooks/useContract';
import { ContractProvider } from './context/ContractContext';
import AdminCreateLot from './pages/CreateLotPage';
import Header from './pages/Header';
import BottomBar from './pages/ButtomBar';
import LotDetail from './pages/LotDetail/LotDetail';
import { LotPage } from './pages/LotPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const { value, } = useContract();
  const wallet = useTonWallet();
  const [filter, setFilter] = useState<number[] | null>([0, 1, 2]);
  const [bottomFilter, setBottomFilter] = useState<number | null>(null);
  // const { lotDataList } = useContractContext();
  // Filtered lot data based on selected filter


  return (

    <Router>
      <div>
        <ContractProvider>
          <Header onFilterChange={setFilter} />
          <div className='main-content'>
            <Routes>

              <Route
                path="/"
                element={
                  <>

                    <>
                      {wallet && value?.toRawString() === wallet?.account.address && (
                        <>
                          <p>Welcome Admin! You can add Lot and withdraw all TON from the contract.</p>
                          <AdminCreateLot />
                        </>
                      )}
                      <LotPage
                        filter={filter}
                        bottomFilter={bottomFilter}
                      />
                      {/* {filteredLotDataList.map(lotData => (
                      <LotBox
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
                    ))} */}
                    </>

                  </>
                }
              />
              <Route path="/lot/:lotIndex" element={<LotDetail />} />
            </Routes>
          </div>
          <BottomBar onBottomFilterChange={setBottomFilter} />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
        </ContractProvider>
      </div>
    </Router>

  );
}

export default App

