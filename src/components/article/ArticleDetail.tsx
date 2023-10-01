import {
  Close,
  Edit,
  Flag,
  Help,
  Share,
  ShoppingCart,
  Sms,
} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Skeleton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createChatroom, createOrder } from '../../store/auth-action.tsx';
import useStores from '../../store/useStores.ts';
import {
  ArticleImpl,
  getChipColorByArticleStatus,
} from '../../types/article.ts';
import { Chatroom } from '../../types/chat.ts';
import { loadingTime } from '../../util/loadingUtil.ts';
import ReviewListForm from '../review/ReviewListForm.tsx';
import { formatPrice } from '../../util/formatPrice.ts';
import { Carousel } from 'react-responsive-carousel';
import axiosUtils from '../../uitls/axiosUtils.ts';
import DeleteIcon from "@mui/icons-material/Delete";

// const baseUrl = 'http://localhost:8080/api/articles/';
const baseUrl = import.meta.env.VITE_API + '/api/articles/';

function getArticleApiId() {
  const pathnames = location.pathname.split('/');
  return `${pathnames.pop()}`;
}

const StyledArticleDetail = styled('div')({
  display: 'flex',
  flexDirection: 'column', // Align content in column
  alignItems: 'center', // Center content horizontally
  padding: '20px',
  position: 'relative', // Make it relative
});

const StyledCard = styled(Card)({
  width: '100%',
  maxWidth: '800px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  overflow: 'hidden',
});

const StyledCardMedia = styled(CardMedia)({
  height: '400px',
  maxWidth: '800px',
  margin: '0 auto',
});

const StyledCardContent = styled(CardContent)({
  padding: '20px',
});

const StyledCardActions = styled(CardActions)({
  justifyContent: 'center',
  borderTop: '1px solid #f0f0f0',
  padding: '10px 0',
});

const StyledSpeedDial = styled(SpeedDial)({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
});

export function ArticleDetail() {
  const [url, setURL] = useState(baseUrl + getArticleApiId());
  const [article, setAritcle] = useState<ArticleImpl>({
    apiId: null,
    title: '게시글 제목',
    description: '게시글 내용',
    username: '작성자',
    thumbnail: null,
    status: 'ACTIVE',
    articleStatus: 'LIVE',
    createdDate: '1970-01-01 12:00:00',
    price: 1000,
    images: null,
  });
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [moveToEditPage, setMoveToEditPage] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenMoveEdit = () => setMoveToEditPage(true);
  const handleCloseMoveEdit = () => setMoveToEditPage(false);

  const fetchData = async () => {
    axiosUtils
      .get(`/articles/${getArticleApiId()}`)
      .then((response) => {
        setAritcle({
          apiId: response.data.apiId,
          title: response.data.title,
          description: response.data.description,
          username: response.data.username,
          thumbnail: response.data.thumbnail,
          status: response.data.status,
          articleStatus: response.data.articleStatus,
          createdDate: response.data.createdDate,
          price: response.data.price,
          images: response.data.images,
        });
        //  TODO DEBUG용
        setTimeout(() => setLoading(false), loadingTime);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        alert('존재하지 않는 게시글 입니다.');
        navigate(`/article`, {
          replace: false,
        });
        return;
      });
  };

  const navigate = useNavigate();
  const handleOrderClick = () => {
    const id = getArticleApiId();
    navigate(`/article/${id}/order`);
  };

  const handleEditClick = () => {
    const id = getArticleApiId();
    navigate(`/article/edit/${id}`);
  };

  const handleChatRoomClick = (chatRoom: Chatroom) => {
    console.log(chatRoom.chatroomApiId + '을 클릭함');
    navigate(`/chatroom/${chatRoom.chatroomApiId}`);
  };

  const handleCreateOrderClick = () => {
    const id = getArticleApiId();
    navigate(`/article/detail/${id}/payment`);
  };

  const handleReportClick = () => {
    const type = 'article';
    const id = getArticleApiId();
    navigate(`/report/${type}/${id}`);
  };

  const actions = [
    {
      icon: <ShoppingCart color="primary" />,
      name: '주문하기',
      index: 'consumer',
      onClick: () => {
        console.log('onClick 주문하기');
        handleCreateOrderClick();
      },
    },
    {
      icon: <Sms color="primary" />,
      name: '채팅하기',
      index: 'consumer',
      onClick: () => {
        // console.log('onclick 채팅하기');
        createChatroom(getArticleApiId()).then(
          (response: { data: Chatroom }) => {
            const chatroom: Chatroom = response.data;
            handleChatRoomClick(chatroom);
          }
        );
      },
    },
    {
      icon: <Flag color="primary" />,
      name: '신고하기',
      index: 'consumer',
      onClick: () => {
        // console.log('onClick 신고하기');
        handleReportClick();
      },
    },
    {
      icon: <Share color="primary" />,
      name: '공유하기',
      index: 'all',
      onClick: () => {
        // console.log('onclick 공유하기');
      },
    },
    {
      icon: <EditIcon color="primary" />,
      name: '수정하기',
      index: 'seller',
      onClick: () => {
        handleOpenMoveEdit();
      },
    },
    {
      icon: <ListAltIcon color="primary" />,
      name: '게시글 주문 확인',
      index: 'seller',
      onClick: () => {
        handleOrderClick();
      },
    },
    // {
    //   icon: <DeleteIcon color="primary" />,
    //   name: '게시글 삭제',
    //   index: 'seller',
    //   onClock: () => {
    //     console.log('게시글 삭제')
    //     axiosUtils.delete(baseUrl + getArticleApiId()).then((res) => {
    //       if (res.status == 200) {
    //         navigate(`/article`, {
    //           replace: false,
    //         });
    //         return;
    //       }
    //     }).catch((err) => {
    //       console.log(err);
    //     })
    //   },
    // }
  ];

  useEffect(() => {
    fetchData();
  }, [url]);

  const authStore = useStores().authStore;

  const descriptionWithLineBreaks = article.description.replace(/\n/g, '<br>');

  return (
    <StyledArticleDetail>
      {loading ? (
        <Skeleton variant="rounded" width={888.875} height={639.172} />
      ) : (
        <StyledCard>
          {article.images.length == 0 ? (
            <StyledCardMedia
              image="https://via.placeholder.com/1920x1080.png?text=via%20placeholder.com"
              sx={{
                aspectRatio: ' 1 / 1', // 이미지의 가로세로 비율을 자동으로 조정합니다.
              }}
            />
          ) : (
            <Box>
              <Carousel showArrows={true} infiniteLoop={true} selectedItem={0}>
                {article.images.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '300px', // Set the desired height
                    }}>
                    <img
                      src={preview.fullPath}
                      alt={`Image ${index}`}
                      style={{
                        maxWidth: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  </div>
                ))}
              </Carousel>
            </Box>
          )}
          <StyledCardContent>
            <Box
              sx={{
                display: 'inline-block',
                flexDirection: 'column',
                alignItems: 'start',
                alignContent: 'start',
              }}>
              <Chip
                size="small"
                label={article.articleStatus}
                color={getChipColorByArticleStatus(article.articleStatus)}
              />
              <Typography gutterBottom variant="h4" component="div">
                {article.title}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center', // Center content horizontally
                marginBottom: '16px', // Add some spacing
              }}>
              <Typography variant="h6">{article.username}</Typography>
              <Typography
                variant="h6"
                style={{ fontWeight: 'bold', fontSize: '1.5em' }}>
                {formatPrice(article.price)}
              </Typography>
              <Typography variant="body2">{article.createdDate}</Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '16px', // Add spacing from the chip
              }}>
              <StyledSpeedDial
                ariaLabel="SpeedDial openIcon example"
                icon={<SpeedDialIcon openIcon={<Edit />} />}
                onOpen={handleOpen}
                onClose={handleClose}
                open={open}>
                {actions.map((action) =>
                  (action.index === 'seller' &&
                    article.username === authStore.userInfo?.username) ||
                    (action.index === 'consumer' &&
                      article.username != authStore.userInfo?.username) ||
                    action.index === 'all' ? (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      onClick={action.onClick}
                    />
                  ) : null
                )}
              </StyledSpeedDial>
            </Box>
            <Typography paragraph dangerouslySetInnerHTML={{ __html: descriptionWithLineBreaks }} />
            <Box>
              <Dialog
                open={moveToEditPage}
                onClose={handleCloseMoveEdit}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
                <Box
                  display={'flex'}
                  flexDirection={'row'}
                  justifyContent={'start'}
                  alignItems={'center'}
                  marginX={'10px'}>
                  <Help fontSize={'large'} />
                  <DialogTitle id="alert-dialog-title">{'알림'}</DialogTitle>
                </Box>
                <IconButton
                  aria-label="close"
                  onClick={handleCloseMoveEdit}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                  }}>
                  <Close />
                </IconButton>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    게시글 수정 페이지로 이동하시겠습니까?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseMoveEdit}>취소</Button>
                  <Button onClick={handleEditClick} autoFocus>
                    이동
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </StyledCardContent>
          <ReviewListForm />
        </StyledCard>
      )}
    </StyledArticleDetail>
  );
}
