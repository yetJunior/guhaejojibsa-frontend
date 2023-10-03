import {
  List,
  Typography,
  Select,
  MenuItem,
  Pagination,
  SelectChangeEvent,
  styled,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import ReviewItemList from './ReviewItemList';
import { useEffect, useState } from 'react';
import { Review } from '../../types/review';
import { getAllReview } from '../../store/auth-action';

const StyledSelect = styled(Select)`
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const ReviewListForm = () => {
  const params: any = useParams();
  const articleApiId: any = params.articleApiId;

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortType, setSortType] = useState('descByDate'); // 초기값: 최신순

  const [totalItems, setTotalItems] = useState(0);

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchReviews(currentPage, itemsPerPage, sortType);
  }, [currentPage, sortType]);

  const fetchReviews = async (page: number, limit: number, sort: string) => {
    getAllReview(articleApiId, page, limit, sort)
      .then((response: any) => {
        setReviews(response.data.content);
        setTotalItems(response.data.totalElements);
      })
      .catch((error: any) => {
        console.error('Error fetching reviews:', error);
      });
  };

  const reviewItems = reviews.map((review, index) => (
    <ReviewItemList key={index} review={review} />
  ));

  const handleSortTypeChange = (event: any) => {
    const selectedSort = event.target.value;
    setSortType(selectedSort);
    // sortType이 변경되면 데이터를 다시 불러옴
    fetchReviews(currentPage, itemsPerPage, selectedSort);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // 한 페이지당 아이템 개수 변경 핸들러
  const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
    const newItemsPerPage = event.target.value as number;
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchReviews(1, newItemsPerPage, sortType);
  };

  return (
    <div>
      {reviews.length > 0 ? (
        <List>
          <Typography variant="h5" gutterBottom>
            Review
          </Typography>
          <List style={{ textAlign: 'left' }}>
            <StyledSelect
              size="small"
              value={sortType}
              onChange={handleSortTypeChange}>
              <MenuItem value="descByDate">최신순</MenuItem>
              <MenuItem value="ascByDate">오래된 순</MenuItem>
              <MenuItem value="descByPoint">높은 별점 순</MenuItem>
              <MenuItem value="ascByPoint">낮은 별점 순</MenuItem>
            </StyledSelect>
            <Select
              size="small"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}>
              <MenuItem value={5}>5개씩</MenuItem>
              <MenuItem value={10}>10개씩</MenuItem>
            </Select>
          </List>
          <List>{reviewItems}</List>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(totalItems / itemsPerPage)}
              page={currentPage}
              onChange={(_event, newPage) => handlePageChange(newPage)}
            />
          </div>
        </List>
      ) : (
        <List>
          <Typography variant="body1">
            해당 게시글의 리뷰가 존재하지 않습니다.
          </Typography>
          <Typography variant="body1">첫 리뷰를 작성해주세요!!</Typography>
          <br></br>
        </List>
      )}
    </div>
  );
};

export default ReviewListForm;
