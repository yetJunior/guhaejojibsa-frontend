import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authStore from "../../store/user/authStore";
import useStores from "../../store/useStores";

interface TokenDto {
  token: string;
  expiredTime: number;
}

const OauthRedirect = () => {
  const param = useLocation();
  const navigate = useNavigate();
  const { authStore } = useStores();

  useEffect(() => {
    const search = param.search;
    const queryString = search.split('?')[1];
    const params = new URLSearchParams(queryString);

    const token = params.get('token');
    const isNewUser = params.get("isNewUser");

    if (token !== null) {

      const tokenMatch: string | null = token.match(/token=([^,]+)/)?.[1] ?? null;
      const expiredTimeMatch = token.match(/expiredTime=(\d+)/);
      
      const [bearer, tokenValue] = tokenMatch.split(' ');
      localStorage.setItem("accessToken", bearer + ' ' + tokenValue);

      authStore.findUserInfo()
        .then((res) => {
          if (isNewUser === 'true') {
            navigate('/oauth-signup');
          } else {
            navigate('/');
          }
        })
        .catch((res) => {
          alert('Could not obtain access token');
        });
    }
  }, []);

  return <></>;
};

export default OauthRedirect;
