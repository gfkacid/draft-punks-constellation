import { useEffect } from 'react';
import AppGrid from '@layout/AppGrid';
import PlayerTournaments from '@components/widgets/PlayerTournaments';

const widgets = {
    player_tournaments: <PlayerTournaments></PlayerTournaments>,
}

const CreateTournament = ({setTitle}) => {
    useEffect(() => {
        setTitle('My Tournaments')
    }, []);
    return (
        <>
            <AppGrid id="my_tournaments" widgets={widgets}/>
        </>
    )
}

export default CreateTournament