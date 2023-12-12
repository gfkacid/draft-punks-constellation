// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// components
import Spring from '@components/Spring';
import Score from '@ui/Score';

// utils
import PropTypes from 'prop-types';
import moment from 'moment';

const StyledItem = styled.div`
  background: var(--tooltip-bg);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  border-left: 4px solid ${props => props.color1};
  border-right: 4px solid ${props => props.color2};
  box-shadow: 0 1px 8px rgba(110, 110, 110, .1);
  overflow: hidden;

  .main {
    padding: 15px 10px;
    
    // iPhone XR
    @media screen and (min-width: 414px) {
      padding: 30px;
    }
  }
  
  &.active {
    min-height: calc(220px + var(--widget-scale));
    height: 100%;
  }

  .match {
    padding: var(--card-padding);
    background: ${theme('theme', {
      light: 'transparent',
      dark: 'rgba(17,19,18, .4)'
    })};
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .player-number {
    border-color: ${theme('theme', {
      light: 'var(--border)',
      dark: 'var(--black-3)'
    })};
  }
`;

const Fixture = ({match, index, standalone = false}) => {

    return (
        <Spring type={standalone ? 'fade' : 'slideUp'} index={index}>
            <StyledItem color1={match.team_home.color} color2={match.team_away.color}>
                <div className="main d-flex align-items-center justify-content-between p-relative" style={{padding: '16px'}}>
                    <div className="d-flex align-items-center p-relative" style={{maxWidth: '40%'}}>
                        <div className='club-logo' style={{paddingRight: '8px'}}>
                            <img src={process.env.PUBLIC_URL+'/clubs/'+match.team_home.crest} alt={match.team_home.name}></img>
                        </div>
                        <div>
                            <h3>{match.team_home.short_name}</h3>
                            <span className="text-12">{match.team_home.name}</span>
                        </div>
                    </div>
                    {match.status === "ended" ? (
                        <Score team_home={match.goals_home} team_away={match.goals_away}/>
                    ) : (
                        <div className="score" style={{border:'none', display: 'block', textAlign: 'center'}}>
                            <div>{moment.unix(match.kickoff_time).format('D MMM')}</div>
                            <div>{moment.unix(match.kickoff_time).format('HH:mm')}</div>
                        </div>
                    )}
                    <div className="d-flex align-items-center p-relative" style={{maxWidth: '40%'}}>
                        <div className="text-right">
                            <h3>{match.team_away.short_name}</h3>
                            <span className="text-12">{match.team_away.name}</span>
                        </div>
                        <div className='club-logo' style={{paddingLeft: '8px'}}>
                            <img src={process.env.PUBLIC_URL+'/clubs/'+match.team_away.crest} alt={match.team_away.name}></img>
                        </div>
                        
                    </div>
                </div>
            </StyledItem>
        </Spring>
    )
}

Fixture.propTypes = {
    match: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    type: PropTypes.oneOf(['group', 'final']),
    standalone: PropTypes.bool
}

export default Fixture