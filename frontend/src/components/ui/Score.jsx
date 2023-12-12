// utils
import PropTypes from 'prop-types';

const Score = ({teamHome = 0, teamAway = 0}) => {
    return (
        <div className="score">
            <span>{teamHome}</span>
            <span>:</span>
            <span>{teamAway}</span>
        </div>
    )
}

Score.propTypes = {
    teamHome: PropTypes.number,
    teamAway: PropTypes.number,
    variant: PropTypes.oneOf(['main', 'alt']),
}

export default Score