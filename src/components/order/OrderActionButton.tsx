import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import RateReviewIcon from '@mui/icons-material/RateReview';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import useStores from '../../store/useStores';

interface OrderActionButtonProps {
    consumerName: string,
    sellerName: string
    orderStatus: string;
    handleReviewClick: () => void;
    handleOrderCancellation: (cancelReason: string) => void;
    handleOrderCompletionWithWaiting: () => void;
    handleOrderEnd: () => void;
}

const OrderActionButton: React.FC<OrderActionButtonProps> = ({
    consumerName,
    sellerName,
    orderStatus,
    handleReviewClick,
    handleOrderCancellation,
    handleOrderCompletionWithWaiting,
    handleOrderEnd,
}) => {
    const [open, setOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const authStore = useStores().authStore;

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCancelConfirm = () => {
        if (cancelReason.trim()) {
            handleOrderCancellation(cancelReason);
            setOpen(false);
        } else {
            alert("최소 사유를 작성해주세요.");
        }
    };

    const handleCancelReasonChange = (event) => {
        setCancelReason(event.target.value);
    };

    return (
        <div>
            {orderStatus === 'END' && consumerName === authStore.userInfo?.username && (
                <Button
                    style={{ margin: '0.5rem' }}
                    variant="outlined"
                    color="success"
                    startIcon={<RateReviewIcon />}
                    onClick={handleReviewClick}>
                    리뷰 작성하기
                </Button>
            )}

            {orderStatus === 'PROGRESS' && (
                <div>
                    <Button
                        style={{ margin: '0.5rem' }}
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={handleClickOpen}>
                        주문 취소
                    </Button>
                    {sellerName === authStore.userInfo?.username && (
                        <Button
                            style={{ margin: '0.5rem' }}
                            variant="outlined"
                            color="success"
                            startIcon={<HourglassTopIcon />}
                            onClick={handleOrderCompletionWithWaiting}>
                            주문 확인(주문 대기)
                        </Button>
                    )}
                </div>
            )}

            {orderStatus === 'WAIT' && (
                <Button
                    style={{ margin: '0.5rem' }}
                    variant="outlined"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={handleOrderEnd}>
                    주문 완료
                </Button>
            )}

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">주문 취소</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        주문을 취소하는 이유를 간단히 적어주세요.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="취소 사유"
                        type="text"
                        fullWidth
                        value={cancelReason}
                        onChange={handleCancelReasonChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleCancelConfirm} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default OrderActionButton;
