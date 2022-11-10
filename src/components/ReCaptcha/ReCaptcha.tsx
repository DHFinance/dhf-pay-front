import React, { useEffect, useRef } from 'react';
// @ts-ignore
import ReCAPTCHA from 'react-google-recaptcha';
import { useTypedDispatch } from '../../hooks/useTypedDispatch';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { setCaptchaToken } from '../../store/slices/user/user.slice';
const ReCaptchaComponent = () => {
  const update = useTypedSelector((state) => state.user.update);
  
  const dispatch = useTypedDispatch();
  const captchaRef = useRef<any>(null);
  
  function getValue(value: string) {
    dispatch(setCaptchaToken(value));
  }

  useEffect(() => {
    if (update) {
      console.log('updated captcha');
      dispatch(setCaptchaToken(''));
      captchaRef.current?.reset();
    }
  }, [update]);

  return (
    <ReCAPTCHA
      ref={captchaRef}
      sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
      onChange={(v: string) => getValue(v)}
    />
  );
};

export { ReCaptchaComponent };
