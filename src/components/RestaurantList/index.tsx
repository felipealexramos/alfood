import { useShowcaseRestaurants } from '../../hooks/useShowcaseRestaurants';
import styles from './RestaurantList.module.scss';
import Restaurant from './Restaurant';

const RestaurantList = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isError,
  } = useShowcaseRestaurants();

  if (isLoading) {
    return (
      <section className={styles.RestaurantList}>
        <p>Loading restaurants…</p>
      </section>
    );
  }

  if (isError) {
    return (
      <section className={styles.RestaurantList}>
        <p>Could not load restaurants. Please try again.</p>
      </section>
    );
  }

  const restaurants = data?.pages.flatMap((page) => page.results) ?? [];

  return (
    <section className={styles.RestaurantList}>
      <h1>The coolest <em>restaurants</em>!</h1>
      {restaurants.map((item) => <Restaurant restaurant={item} key={item.id} />)}
      {hasNextPage && <button onClick={() => fetchNextPage()}>
        Load more
      </button>}
    </section>
  );
};

export default RestaurantList;
