import {HideImage, InsertPhoto} from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';
import {
  Alert,
  Box,
  Button,
  Card,
  Collapse,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  styled, Select, MenuItem, SelectChangeEvent,
} from '@mui/material';
import {useState} from 'react';
import {Carousel} from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import {useNavigate} from 'react-router-dom';
import {
  postArticleHandler
} from '../../store/auth-action.tsx';
import {
  ArticleType,
  checkArticleInputValidation
} from '../../types/article.ts';
import {uploadImagesToS3} from '../../util/s3Client.ts';
import {priceValidation, textValidation} from '../../util/validationUtil.ts';
import {DateTimePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DemoContainer, DemoItem} from "@mui/x-date-pickers/internals/demo";
import dayjs, {Dayjs} from "dayjs";
import {getFormattedISODateTime} from "../../util/dateUtil.ts";

const StyledArticleDetail = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  position: 'relative',
});

const StyledCard = styled(Card)({
  width: '100%',
  maxWidth: '800px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '10px',
  padding: '20px', // Increased padding
  overflow: 'hidden',
});

const StyledTextField = styled(TextField)({
  marginBottom: '15px',
});

export function ArticlePost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [alertMsg, setAlertMsg] = useState<string>();
  const [alertOpen, setAlertOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const navigate = useNavigate();
  const [errorTitle, setErrorTitle] = useState<boolean>(false);
  const [errorPrice, setErrorPrice] = useState<boolean>(false);
  const [errorDescription, setErrorDescription] = useState<boolean>(false);
  const [articleType, setArticleType] = useState<ArticleType>("SELL");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().add(5, 'minute'));
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().add(1, 'hour'));

  const handleImageChange = (event) => {
    let newImageFiles = Array.from(event.target.files);

    if (newImageFiles.length > 5) {
      setAlertMsg('이미지 갯수는 최대 5개까지만 가능합니다.');
      setAlertOpen(true);
      newImageFiles = newImageFiles.slice(0, 5);
    }

    setImageFiles((newImageFiles as (Blob | MediaSource)[]).slice(0, 5));
    const newImagePreviews = newImageFiles.map((file) =>
      URL.createObjectURL(file as Blob) // 타입 단언을 사용하여 'Blob' 타입으로 변환
    );
    setImagePreviews(newImagePreviews);
  };

  const articleTypeHandleChange = (event: SelectChangeEvent) => {
    setArticleType(event.target.value as ArticleType);
  }

  const validation = () => {
    const str = checkArticleInputValidation(title, description, price);

    setAlertMsg(str);
    return !str;
  };

  const onClickRemoveImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  const handleSubmit = async () => {
    if (!validation()) {
      setAlertOpen(true);
      return;
    }

    try {
      uploadImagesToS3(imageFiles, 'article').then((result) => {
        if (result) {
          postArticleHandler(
            title, description, price, result,
            articleType, getFormattedISODateTime(startDate.toDate()), getFormattedISODateTime(endDate.toDate())).then(
            (response) => {
              if (response != null) {
                console.log('Article posted successfully:', response.data);
                navigate(`/article/detail/${response.data.apiId}`, {
                  replace: false,
                });
                return;
              }

              console.log('Response Data is null');
            }
          );
        }
      });
    } catch (error) {
      console.error('Error posting article:', error);
    }
  };

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    !textValidation(event.target.value)
      ? setErrorTitle(true)
      : setErrorTitle(false);
    setTitle(event.target.value);
  };

  const onChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    !priceValidation(Number(event.target.value))
      ? setErrorPrice(true)
      : setErrorPrice(false);
    setPrice(Number(event.target.value));
  };

  const onChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    !textValidation(event.target.value)
      ? setErrorDescription(true)
      : setErrorDescription(false);
    setDescription(event.target.value);
  };

  return (
    <StyledArticleDetail>
      <StyledCard>
        <Box>
          <Carousel showArrows={true} infiniteLoop={true} selectedItem={0}>
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '300px', // Set the desired height
                }}>
                <img
                  src={preview}
                  alt={`Image Preview ${index}`}
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
        <Box sx={{marginBottom: '20px'}}>
          <Collapse in={alertOpen}>
            <Stack>
              <Alert
                sx={{whiteSpace: 'pre-line', textAlign: 'start'}}
                severity="error"
                onClose={() => {
                  setAlertOpen(false);
                }}>
                {alertMsg}
              </Alert>
            </Stack>
          </Collapse>
        </Box>
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <FormControl sx={{marginY: '10px', marginX: '10px'}}>
            <InputLabel htmlFor="article-price">가격</InputLabel>
            <OutlinedInput
              id="article-price"
              defaultValue={price}
              size="medium"
              onChange={onChangePrice}
              label="가격"
              startAdornment={
                <InputAdornment position="start">￦</InputAdornment>
              }
              value={price}
              error={errorPrice}
              maxRows="1"
            />
          </FormControl>
          <FormControl sx={{marginY: '10px', marginX: '10px'}}>
            <InputLabel id="article-type-select-label">구매/판매</InputLabel>
            <Select
              labelId="article-type-select-label"
              id="article-type-select"
              value={articleType}
              label="구매/판매"
              onChange={articleTypeHandleChange}
            >
              <MenuItem value={"SELL"}>판매</MenuItem>
              <MenuItem value={"BUY"}>구매</MenuItem>
            </Select>
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer
              components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
            >
              <DemoItem
                label={'시작 날짜'}
              >
                <DateTimePicker
                  value={startDate}
                  disablePast
                  onChange={(newValue: Dayjs) => {
                    setStartDate(newValue)
                  }}
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                />
              </DemoItem>
              <DemoItem
                label={'끝 날짜'}
              >
                <DateTimePicker
                  value={endDate}
                  disablePast
                  onChange={(newValue: Dayjs) => {
                    setEndDate(newValue)
                  }}
                  views={['year', 'month', 'day', 'hours', 'minutes']}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </Box>
        <Box>
          <StyledTextField
            id="article-title"
            label="게시글 제목"
            value={title}
            inputProps={{maxLength: 100}}
            onChange={onChangeTitle}
            error={errorTitle}
            style={{width: '100%'}} // 여기에서 너비 조절
          />
        </Box>
        <Box>
          <StyledTextField
            id="article-description"
            label="게시글 내용"
            fullWidth
            multiline
            rows={7}
            value={description}
            inputProps={{maxLength: 255, 'aria-rowcount': 5}} // Set maximum character length
            onChange={onChangeDescription}
            error={errorDescription}
          />
        </Box>

        <Box display="flex" justifyContent="space-between">
          <Box>
            <input
              accept="image/*"
              id="image-file"
              type="file"
              multiple
              onChange={handleImageChange}
              style={{display: 'none'}}
            />
            <label htmlFor="image-file">
              <Button
                variant="contained"
                color="primary"
                component="span"
                startIcon={<InsertPhoto/>}
                sx={{marginTop: '15px', marginEnd: '10px'}}>
                이미지 첨부
              </Button>
            </label>
            {imagePreviews.length > 0 ? (
              <Button
                variant="contained"
                color="error"
                component="span"
                startIcon={<HideImage/>}
                onClick={onClickRemoveImages}
                sx={{marginTop: '15px', marginX: '10px'}}>
                이미지 삭제
              </Button>
            ) : null}
          </Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            startIcon={<EditIcon/>}
            sx={{marginTop: '15px'}}>
            게시글 작성
          </Button>
        </Box>
      </StyledCard>
    </StyledArticleDetail>
  );
}

export default ArticlePost;
