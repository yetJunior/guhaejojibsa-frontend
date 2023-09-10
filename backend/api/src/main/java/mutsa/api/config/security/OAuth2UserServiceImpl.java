package mutsa.api.config.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class OAuth2UserServiceImpl extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String registrationId = userRequest
                .getClientRegistration()
                .getRegistrationId();
        String nameAttribute = "";
        // 사용할 데이터를 다시 정리하는 목적의 Map
        Map<String, Object> attributes = new HashMap<>();
        // Kakao 로직
        if (registrationId.equals("google")) {
            attributes.put("provider", "google");
            attributes.put("id", oAuth2User.getAttribute("id"));
            Map<String, Object> googleAttri = oAuth2User.getAttributes();
            attributes.put("email", (String) googleAttri.get("email"));
            nameAttribute = "email";
            String profilePictureUrl = (String) googleAttri.get("picture");
            attributes.put("picture", profilePictureUrl);
        }

        log.info(attributes.toString());
        // 기본설정으로는 여기까지 오면 인증 성공
        return new DefaultOAuth2User(
                null,
                attributes,
                nameAttribute
        );
    }
}
