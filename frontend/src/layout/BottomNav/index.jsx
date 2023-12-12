// styling
import styles from './styles.module.scss'

// components
import {NavLink} from 'react-router-dom';

const BottomNav = () => {

    return (
        <div className={styles.container}>
            <NavLink className={styles.button} to="/settings" aria-label="Account">
                <i className="icon-user"/>
            </NavLink>
            <NavLink className={styles.button} to="/" aria-label="Home">
                <i className="icon-house"/>
            </NavLink>

        </div>
    )
}

export default BottomNav