import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Receipt} from '../../types/receipt';
import {Table, TableBody, TableCell, TableRow, Paper, Typography} from '@mui/material';
import styled from 'styled-components';
import {formatPrice} from "../../util/formatPrice.ts";

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin: 20px 0;
`;

const Title = styled(Typography)`
  margin-bottom: 20px;
`;


const ReceiptDetail: React.FC = () => {
    const {articleApiId, orderApiId, receiptApiId} = useParams<{
        articleApiId: string,
        orderApiId: string,
        receiptApiId: string
    }>();
    const [receipt, setReceipt] = useState<Receipt | null>(null);

    useEffect(() => {
        const fetchReceiptDetail = async () => {
            const response = await fetch(
                `${import.meta.env.VITE_API}api/articles/${articleApiId}/order/${orderApiId}/${receiptApiId}`
            );
            if (response.ok) {
                const data = await response.json();
                setReceipt(data);
            } else {
                console.error('Failed to fetch receipt details');
            }
        };

        fetchReceiptDetail();
    }, [articleApiId, orderApiId, receiptApiId]);

    if (!receipt) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <StyledPaper elevation={3}>
            <Title variant="h5">Receipt Details</Title>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell>가맹점 ID</TableCell>
                        <TableCell>{receipt.mid}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>API 버전</TableCell>
                        <TableCell>{receipt.version}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>주문 이름</TableCell>
                        <TableCell>{receipt.orderName}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>화폐 단위</TableCell>
                        <TableCell>{receipt.currency}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>결제 방식</TableCell>
                        <TableCell>{receipt.method}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>총 결제 금액</TableCell>
                        <TableCell>{formatPrice(receipt.totalAmount)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>잔액</TableCell>
                        <TableCell>{formatPrice(receipt.balanceAmount)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>공급 가격</TableCell>
                        <TableCell>{formatPrice(receipt.suppliedAmount)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>부가세</TableCell>
                        <TableCell>{formatPrice(receipt.vat)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>결제 상태</TableCell>
                        <TableCell>{receipt.status}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>결제 요청 시각</TableCell>
                        <TableCell>{receipt.requestedAt}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>결제 승인 시각</TableCell>
                        <TableCell>{receipt.approvedAt}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>에스크로 사용 여부</TableCell>
                        <TableCell>{receipt.useEscrow}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>문화비 지출 여부</TableCell>
                        <TableCell>{receipt.cultureExpense}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>결제 유형</TableCell>
                        <TableCell>{receipt.type}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>카드 회사명</TableCell>
                        <TableCell>{receipt.card?.company}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>카드번호</TableCell>
                        <TableCell>{receipt.card?.number}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>할부 개월</TableCell>
                        <TableCell>{receipt.card?.installmentPlanMonths}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>무이자 여부</TableCell>
                        <TableCell>{receipt.card?.isInterestFree}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>승인번호</TableCell>
                        <TableCell>{receipt.card?.approveNo}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>카드 포인트 사용 여부</TableCell>
                        <TableCell>{receipt.card?.useCardPoint}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>카드 타입</TableCell>
                        <TableCell>{receipt.card?.cardType}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>소유자 타입</TableCell>
                        <TableCell>{receipt.card?.ownerType}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>승인 상태</TableCell>
                        <TableCell>{receipt.card?.acquireStatus}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>영수증 URL</TableCell>
                        <TableCell><a href={receipt.card?.receiptUrl} target="_blank" rel="noopener noreferrer">영수증 보기</a></TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </StyledPaper>
    );
};

export default ReceiptDetail;
