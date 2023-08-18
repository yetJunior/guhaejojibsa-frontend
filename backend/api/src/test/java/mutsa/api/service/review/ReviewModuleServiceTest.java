package mutsa.api.service.review;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;
import mutsa.api.ApiApplication;
import mutsa.api.dto.review.ReviewRequestDto;
import mutsa.api.dto.review.ReviewResponseDto;
import mutsa.api.dto.review.ReviewUpdateDto;
import mutsa.common.domain.models.article.Article;
import mutsa.common.domain.models.order.Order;
import mutsa.common.domain.models.order.OrderStatus;
import mutsa.common.domain.models.review.Review;
import mutsa.common.domain.models.user.User;
import mutsa.common.repository.article.ArticleRepository;
import mutsa.common.repository.order.OrderRepository;
import mutsa.common.repository.review.ReviewRepository;
import mutsa.common.repository.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest(classes = ApiApplication.class)
@Transactional
@Slf4j
public class ReviewModuleServiceTest {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private ReviewModuleService reviewModuleService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private OrderRepository orderRepository;

    private User reviewer1, reviewer2;
    private Article article;
    private Order order;

    @BeforeEach
    public void init() {

        reviewer1 = User.of("user1", "password", "email1@", "oauthName1", null, null);
        reviewer1 = userRepository.save(reviewer1);

        reviewer2 = User.of("user3", "password", "email3@", "oauthName3", null, null);
        reviewer2 = userRepository.save(reviewer2);

        User seller = User.of("seller", "password", "sellerEmail@", "sellerOauthName", null, null);
        seller = userRepository.save(seller);

        article = Article.builder()
            .title("Pre Article 1")
            .description("Pre Article 1 desc")
            .user(seller)
            .build();
        article = articleRepository.save(article);

        order = Order.of(article, reviewer1);
        order.setOrderStatus(OrderStatus.END);
        order = orderRepository.save(order);
    }

    @Test
    void test() {
        String content = "testContent";
        Integer point = 5;
        Review review = Review.of(reviewer1, article, content, point);
        reviewRepository.save(review);

        log.info(article.getReviews().toString());
    }

    @DisplayName("후기 생성 모듈 서비스 테스트")
    @Test
    void createReview() {
        // given
        ReviewRequestDto reviewRequestDto = new ReviewRequestDto();

        reviewRequestDto.setContent("Review Test");
        reviewRequestDto.setPoint(5);
        reviewRequestDto.setUsername(reviewer1.getUsername());

        // when
        ReviewResponseDto responseDto = reviewModuleService.createReview(article, order, reviewer1, reviewRequestDto);

        // then
        log.info(article.getReviews().toString());
        assertThat(reviewRequestDto.getUsername()).isEqualTo(responseDto.getUsername());
        assertThat(reviewRequestDto.getContent()).isEqualTo(responseDto.getContent());
        assertThat(reviewRequestDto.getPoint()).isEqualTo(responseDto.getPoint());
    }

    @DisplayName("후기 단일 조회 모듈 서비스 테스트")
    @Test
    void getReview() {
        // given
        String content = "testContent";
        Integer point = 5;
        Review review = Review.of(reviewer1, article, content, point);
        review = reviewRepository.save(review);

        // when
        ReviewResponseDto getReview = reviewModuleService.getReview(review.getApiId());

        // then
        assertThat(getReview.getUsername()).isEqualTo(review.getUser().getUsername());
        assertThat(getReview.getApiId()).isEqualTo(review.getApiId());
        assertThat(getReview.getContent()).isEqualTo(review.getContent());
    }

    @DisplayName("후기 전체 조회 모듈 서비스 테스트")
    @Test
    void findAllReview() {
        // given
        Review review1 = reviewRepository.save(Review.of(reviewer1, article, "content1", 1));
        Review review2 = reviewRepository.save(Review.of(reviewer2, article, "content2", 2));

        log.info(review1.getApiId());
        log.info(review2.getApiId());

        // when
        List<ReviewResponseDto> allReviews = reviewModuleService.findAllReview(article);

        // then
        assertThat(allReviews.size()).isEqualTo(2);
    }

    @DisplayName("후기 수정 모듈 서비스 테스트")
    @Test
    void updateReview() {
        // given
        String content = "testContent";
        Integer point = 5;
        Review review = Review.of(reviewer1, article, content, point);

        ReviewUpdateDto updateDto = new ReviewUpdateDto();
        updateDto.setContent("test Content");
        updateDto.setPoint(3);

        // when
        ReviewResponseDto responseDto = reviewModuleService.updateReview(reviewer1, review.getApiId(), updateDto);

        // then
        assertThat(updateDto.getContent()).isEqualTo(responseDto.getContent());
        assertThat(updateDto.getPoint()).isEqualTo(responseDto.getPoint());
    }

    @DisplayName("후기 삭제 모듈 서비스 테스트")
    @Test
    void deleteReview() {
        // given
        Review review = reviewRepository.save(Review.of(reviewer1, article, "content1", 1));

        // when
        reviewModuleService.deleteReview(reviewer1, review.getApiId());

        // then
        Optional<Review> deletedReview = reviewRepository.findByApiId(article.getApiId());
        assertThat(deletedReview.isPresent()).isFalse();
    }

    @Test
    void getById() {
        // given
        Review review = reviewRepository.save(Review.of(reviewer1, article, "content1", 1));

        // when
        Review getByApiId = reviewModuleService.getByApiId(review.getApiId());

        // then
        assertThat(getByApiId.getApiId()).isEqualTo(review.getApiId());
    }
}