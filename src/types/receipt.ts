
interface Receipt {
    mid: string;             // 가맹점 ID. 고유 식별자
    version: string;         // API 버전
    paymentKey: string;      // 결제 키. 결제 식별자
    orderId: string;         // 주문 ID. Toss API 호출 키
    orderName: string;       // 주문 이름
    currency: string;        // 화폐 단위
    method: string;          // 결제 방식
    totalAmount: string;     // 총 결제 금액
    balanceAmount: string;   // 잔액. 결제 후 남은 금액
    suppliedAmount: string;  // 공급 가격. 부가세를 제외한 실제 상품/서비스의 가격
    vat: string;             // 부가세
    status: string;          // 결제 상태
    requestedAt: string;     // 결제 요청 시각
    approvedAt: string;      // 결제 승인 시각
    useEscrow: string;       // 에스크로 사용 여부
    cultureExpense: string;  // 문화비 지출 여부
    card: ReceiptCard;       // 카드 결제 내역
    type: string;            // 결제 유형
}

interface ReceiptCard {
    company: string;         // 회사명
    number: string;          // 카드번호
    installmentPlanMonths: string;  // 할부 개월
    isInterestFree: string;
    approveNo: string;       // 승인번호
    useCardPoint: string;    // 카드 포인트 사용 여부
    cardType: string;        // 카드 타입
    ownerType: string;       // 소유자 타입
    acquireStatus: string;   // 승인 상태
    receiptUrl: string;      // 영수증 URL
}

export { Receipt, ReceiptCard };
