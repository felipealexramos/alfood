import styles from './Footer.module.scss';

const Footer = () => {
  return (<footer className={styles.Footer}>
    <div>
      <p>Copyright &copy; {new Date().getFullYear()} Alfood</p>
    </div>
    <div>
      <ul className="social-icons">
        <li><i className="fa fa-facebook"></i></li>
        <li><i className="fa fa-twitter"></i></li>
        <li><i className="fa fa-linkedin"></i></li>
        <li><i className="fa fa-rss"></i></li>
        <li><i className="fa fa-dribbble"></i></li>
      </ul>
    </div>
    <div>
      <p>Joy <em>in every dish</em></p>
    </div>
  </footer>)
}

export default Footer
