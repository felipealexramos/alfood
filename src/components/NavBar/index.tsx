import styles from './NavBar.module.scss';
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (<nav className={styles.Link}>
    <ul>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/restaurants">Restaurants</Link>
      </li>
    </ul>
  </nav>)
}

export default NavBar
