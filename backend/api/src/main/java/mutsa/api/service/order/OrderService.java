package mutsa.api.service.order;

import lombok.RequiredArgsConstructor;
import mutsa.api.dto.order.OrderDetailResponseDto;
import mutsa.api.dto.order.OrderResponseDto;
import mutsa.api.service.article.ArticleModuleService;
import mutsa.api.service.user.UserModuleService;
import mutsa.common.domain.models.article.Article;
import mutsa.common.domain.models.user.User;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class OrderService {
    private final UserModuleService userService;
    private final ArticleModuleService articleModuleService;
    private final OrderModuleService orderModuleService;

    public OrderDetailResponseDto findDetailOrder(String articleApiId, String orderApiId, String currentUserApiId) {
        User user = userService.getByUsername(currentUserApiId);
        Article article = articleModuleService.getByApiId(articleApiId);

        return orderModuleService.findDetailOrder(article, user, orderApiId);
    }

    public List<OrderResponseDto> findAllOrder(String articleApiId, String currentUserApiId) {
        User user = userService.getByUsername(currentUserApiId);
        Article article = articleModuleService.getByApiId(articleApiId);

        return orderModuleService.findAllOrder(article, user);
    }

    public OrderDetailResponseDto saveOrder(String articleApiId, String currentUserApiId) {
        User user = userService.getByUsername(currentUserApiId);
        Article article = articleModuleService.getByApiId(articleApiId);

        return orderModuleService.saveOrder(article, user);
    }

    public void deleteOrder(String articleApiId, String orderApiId, String currentUserApiId) {
        User user = userService.getByUsername(currentUserApiId);
        Article article = articleModuleService.getByApiId(articleApiId);

        orderModuleService.deleteOrder(article, user, orderApiId);
    }
}
