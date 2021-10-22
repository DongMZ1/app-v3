import './HomePage.scss';
import { Hero, Menu, Grid } from '../../Components';

const Home = (): JSX.Element => {
  return (
    <>
      <Menu />
      <Hero />
      <Grid />
    </>
  );
};

export default Home;
