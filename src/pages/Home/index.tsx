import { Link } from 'react-router-dom';
import Banner from '../../components/Banner';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import styles from './Home.module.scss';

function Home() {
  return (
    <>
      <NavBar />
      <Banner />
      <div className={styles.MiniBanners}>
        <img src="/images/cooking_01.jpg" alt="A conceptual dish" />
        <div className={styles.CenterCard}>
          <h2>The best restaurant network!</h2>
          <div>
            <p>become a partner now:</p>
            <p>call <a href="callto:99999999999">(99) 99999-999</a></p>
          </div>
        </div>
        <img src="/images/cooking_02.jpg" alt="A deconstructed burger" />
      </div>
      <div className={styles.Categories}>
        <div className={styles.DishType}>
          <img src="/images/breakfast.png" alt="Breakfast" />
          <h4>Breakfast</h4>
        </div>
        <div className={styles.DishType}>
          <img src="/images/lunch.png" alt="Lunch" />
          <h4>Lunch</h4>
        </div>
        <div className={styles.DishType}>
          <img src="/images/dinner.png" alt="Dinner" />
          <h4>Dinner</h4>
        </div>
        <div className={styles.DishType}>
          <img src="/images/dessert.png" alt="Desserts" />
          <h4>Desserts</h4>
        </div>
      </div>
      <div className={styles.Links}>
        <h3>Discover the best restaurants</h3>
        <p>Click <Link to='/restaurants'>here</Link></p>
      </div>
      <Footer />
    </>
  );
}

export default Home;
