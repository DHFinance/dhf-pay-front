import type { NextPage } from 'next'
import SliderContainer from "../src/components/Layout/SliderContainer";
import WithAuth from "../hoc/withAuth";

const Home: NextPage = () => {
  return (
    <WithAuth><SliderContainer>This is the start page, no content yet</SliderContainer></WithAuth>
  )
}

export default Home
