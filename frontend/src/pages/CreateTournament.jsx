import { useEffect } from 'react';
import AppGrid from '@layout/AppGrid';
import GameweekPreview from '@components/widgets/GameweekPreview';
import TournamentCreateForm from '@components/widgets/TournamentCreateForm';
import { useSelector } from 'react-redux';
import { selectFixtures, selectGameweeks } from '@store/premiership/selectors';


const CreateTournament = ({setTitle}) => {
    
    const gameweeks = useSelector((state) => selectGameweeks(state));
    const fixtures = useSelector((state) => selectFixtures(state));
    const widgets = {
        gameweek_preview: <GameweekPreview gameweeks={gameweeks} fixtures={fixtures}/>,
        tournament_form: <TournamentCreateForm gameweeks={gameweeks}/>,
    }
    
    useEffect(() => {
        setTitle('Create Tournament')
    }, []);
    return (
        <>
            <AppGrid id="create_tournament" widgets={widgets}/>
        </>
    )
}

export default CreateTournament