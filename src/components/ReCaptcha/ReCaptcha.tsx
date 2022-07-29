//@ts-nocheck
import React from "react";
import ReCAPTCHA from 'react-google-recaptcha';
import {useDispatch} from "react-redux";
import {setCaptchaToken} from "../../../store/actions/user";

const ReCaptchaComponent = () => {
  const dispatch = useDispatch()
  function getValue (value) {
    dispatch(setCaptchaToken(value));
  }

  return (
      <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}
          onChange={(v) => getValue(v)}
      />
  )
}

export {ReCaptchaComponent};