import { ChartDialogProp } from '@/type'
import { Dialog } from '@mui/material'
import React from 'react'
import DataChart from './DataChart';

export default function ChartDialog({openDialog, setOpenDialog} : ChartDialogProp) {

    const handleClose = () => {
        setOpenDialog(false);
    }

    return (
        <Dialog open={openDialog} onClose={handleClose} fullWidth={true}>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                <DataChart />
            </div>
        </Dialog>
    )
}
