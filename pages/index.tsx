import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import SliderContainer from "../src/components/Layout/SliderContainer";

const Home: NextPage = () => {
  return (
    <SliderContainer>Это стартовая страница, контент пока что отсутствует</SliderContainer>
  )
}

export default Home
