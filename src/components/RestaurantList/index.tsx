import { useEffect, useState } from 'react';
import { httpV1 } from '../../http';
import { IPagination } from '../../interfaces/IPagination';
import IRestaurant from '../../interfaces/IRestaurant';
import styles from './RestaurantList.module.scss';
import Restaurant from './Restaurant';

const RestaurantList = () => {

  const [restaurants, setRestaurants] = useState<IRestaurant[]>([])
  const [nextPage, setNextPage] = useState('')

  useEffect(() => {
    // fetch restaurants
    httpV1.get<IPagination<IRestaurant>>('restaurantes/')
      .then(response => {
        setRestaurants(response.data.results)
        setNextPage(response.data.next)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const loadMore = () => {
    // the "next" URL comes absolute from the backend; axios ignores baseURL for absolute URLs
    httpV1.get<IPagination<IRestaurant>>(nextPage)
      .then(response => {
        setRestaurants([...restaurants, ...response.data.results])
        setNextPage(response.data.next)
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (<section className={styles.RestaurantList}>
    <h1>The coolest <em>restaurants</em>!</h1>
    {restaurants?.map(item => <Restaurant restaurant={item} key={item.id} />)}
    {nextPage && <button onClick={loadMore}>
      Load more
    </button>}
  </section>)
}

export default RestaurantList
