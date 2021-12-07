import type { NextPage } from 'next'
import SliderContainer from "../src/components/Layout/SliderContainer";
import WithAuth from "../hoc/withAuth";

const Home: NextPage = () => {
  return (
    <WithAuth><SliderContainer>Это стартовая страница, контент пока что отсутствует</SliderContainer></WithAuth>
  )
}

export default Home
