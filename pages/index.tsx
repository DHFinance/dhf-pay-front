import type { NextPage } from 'next'
import SliderContainer from "../src/components/Layout/SliderContainer";
import WithAuth from "../hoc/withAuth";

const Home: NextPage = () => {
  return (
    <WithAuth><SliderContainer>Welcome to platform for payment operations on CSPR blockchain. We provides a reliable payments infrastructure that caters for the needs of both merchants and their customers: accessible, convenient and customer oriented.</SliderContainer></WithAuth>
  )
}

export default Home
