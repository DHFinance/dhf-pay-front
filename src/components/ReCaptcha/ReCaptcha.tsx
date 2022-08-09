//@ts-nocheck
import React, {useEffect, useRef} from "react";
import ReCAPTCHA from 'react-google-recaptcha';
import {useDispatch, useSelector} from "react-redux";
import {setCaptchaToken} from "../../../store/actions/user";

const ReCaptchaComponent = () => {
  const dispatch = useDispatch()
  const update = useSelector((state) => state.user.update);
  const captchaRef = useRef(null);
  function getValue (value) {
    dispatch(setCaptchaToken(value));
  }

  useEffect(() => {
    if (update) {
      console.log('updated captcha');
      dispatch(setCaptchaToken(''))
      captchaRef.current.reset();
    }
  }, [update])

  return (
      <ReCAPTCHA
          ref={captchaRef}
          sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
          onChange={(v) => getValue(v)}
      />
  )
}

export {ReCaptchaComponent};