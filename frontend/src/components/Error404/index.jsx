// styling
import styles from './styles.module.scss';

// components
import Spring from '@components/Spring';
import {NavLink} from 'react-router-dom';

// utils
import classNames from 'classnames';

// assets
import dark404 from '@assets/404.webp';

const Error404 = () => {

    return (
        <Spring className={`${styles.container} card d-flex align-items-center flex-1`}>
            <div className={styles.media}>
                <img className={classNames(`${styles.media_img} ${styles.dark} ${styles.visible}`)}
                     src={dark404}
                     alt="404"/>
            </div>
            <div className={styles.main}>
                <h2 className={styles.main_title}>
                    Oops! <span>The page you are looking for is not found.</span>
                </h2>
                <p className={styles.main_text}>
                    Please check the URL in the address bar and try again.
                </p>
                <NavLink className="btn" to="/">Go to Home</NavLink>
            </div>
        </Spring>
    )
}

export default Error404