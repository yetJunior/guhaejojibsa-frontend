type OrderStatus = 'Progress' | 'End' | 'Cancled';

interface OrderConsumer {
  orderApiId : string;
  articleApiId : string;
  sellerName : string;
  date : string;
  articleTitle: string;
  orderStatus: OrderStatus;
}

interface OrderSeller {
  orderApiId : string;
  articleApiId : string;
  consumerName : string;
  date : string;
  productName: string;
  orderStatus: OrderStatus;
}
interface OrderSellerWithArticle {
  orderApiId : string;
  articleApiId : string;
  articleTitle : string;
  consumerName : string;
  date : string;
  productName: string;
  orderStatus: OrderStatus;
}

interface OrderDetail {
  orderApiId : string;
  articleApiId : string;
  sellerName : string;
  consumerName : string;
  date : string;
  articleTitle: string;
  orderStatus: OrderStatus;
}

interface OrderConsumerResponse {
  content: OrderConsumer[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
  };
}

interface OrderConsumerFilter {
  orderStatus: string;
  status: string;
}

interface OrderSellerResponse {
  content: OrderSeller[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    numberOfElements: number;
  };
}

interface OrderSellerFilter {
  articleApiId : string;
  orderStatus: OrderStatus;
  status: string;
}
interface OrderSellerFilterResponse {
  orderResponseDtos: OrderSellerResponse;
  orderConsumerFilter: OrderConsumerFilter;
}