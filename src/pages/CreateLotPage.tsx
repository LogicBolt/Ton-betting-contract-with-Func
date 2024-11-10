// AdminCreateLot.tsx
import React, { useState } from 'react';
import "./style.css"
import { useContract } from '../hooks/useContract';
import { toast } from 'react-toastify';
const AdminCreateLot: React.FC = () => {
    const [bettingCount, setBettingCount] = useState<number>(0);
    const [lotTitle, setLotTitle] = useState<string>('');
    const [lotDescription, setLotDescription] = useState<string>('');
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [newAdminAdress, setNewAdminAdress] = useState<string>('');
    const { createLot, withdrawToAdmin, changeAdmin } = useContract();
    const handleCreate = async () => {
        // Handle lot creation logic
        try {
            console.log(lotTitle, lotDescription, typeof lotTitle, typeof lotDescription)
            if (bettingCount > 0 && startTime && endTime && lotTitle && lotDescription)
                await createLot(BigInt(bettingCount), BigInt(new Date(startTime).getTime() / 1000), BigInt(new Date(endTime).getTime() / 1000), lotTitle, lotDescription);
            else
                toast.error("Invalid input. Please fill out all fields correctly.");
        } catch (err) {
            toast.error("Error creating lot. Please try again.");
            console.log(err)
        }
    };

    return (
        <>
            <div className="create-lot">
                <label>Lot Title</label>
                <input
                    type="string"
                    value={lotTitle}
                    onChange={(e) => setLotTitle(e.target.value)}
                />
                <label>Lot Description</label>
                <input
                    type="string"
                    value={lotDescription}
                    onChange={(e) => setLotDescription(e.target.value)}
                />
                <label>Betting Count</label>
                <input
                    type="number"
                    value={bettingCount}
                    onChange={(e) => setBettingCount(parseInt(e.target.value))}
                />
                <label>Start Time</label>
                <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                <label>End Time</label>
                <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                <button onClick={handleCreate}>Create Lot</button>
                <button onClick={withdrawToAdmin}>WithDraw All Ton</button>
                <label>New admin address</label>
                <input
                    type="string"
                    value={newAdminAdress}
                    onChange={(e) => setNewAdminAdress(e.target.value)}
                />
                <button onClick={() => changeAdmin(newAdminAdress)}>Admin address change</button>
            </div>

        </>
    );
};

export default AdminCreateLot;
