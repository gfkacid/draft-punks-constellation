// components
import Spring from '@components/Spring';
import SelectionList from '@ui/SelectionList';
import Fixture from '@components/Fixture';
import ScrollContainer from '@components/ScrollContainer';

// hooks
import {useState, useRef, useEffect} from 'react';
import useMeasure from 'react-use-measure';

import { getCurrentGameweek } from '@utils/helpers';
import moment from 'moment';

const GameweekPreview = ({gameweeks, fixtures}) => {
    
    const [ref, {height}] = useMeasure();
    const trackRef = useRef(null);
    const currentUnixTimestamp = moment().unix();
    const availableGameweeks = gameweeks.filter(gameweek => gameweek.start - 3600 > currentUnixTimestamp);
    
    const [selected, setSelected] = useState(availableGameweeks[0].id);

    const [gwFixtures, setGwFixtures] = useState([])

    useEffect(() => {
        trackRef.current && trackRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }, [selected]);
    useEffect(() => {
        const fix = fixtures.filter(match => match.gameweek_id === selected)
        setGwFixtures(fix)
    }, [selected]);

    useEffect(() => {
        const currgw = getCurrentGameweek(gameweeks)
    }, [gameweeks]);

    return (
        <Spring className="card h-4">
            {gameweeks.length > 0 &&
            <> 
                <SelectionList options={gameweeks} active={selected} setActive={setSelected} innerRef={ref}/>
                <ScrollContainer height={height}>
                    <div className="track d-flex flex-column g-20" ref={trackRef} style={{padding: 20}}>
                        {
                            gwFixtures.map((match, index) => (
                                <Fixture key={match.id} match={match} index={index}/>
                            ))
                        }
                    </div>
                </ScrollContainer>
            </>
            }
        </Spring>
    )
}

export default GameweekPreview