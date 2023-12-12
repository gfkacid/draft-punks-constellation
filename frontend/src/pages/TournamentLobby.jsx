import { useEffect, useState } from 'react';
import AppGrid from '@layout/AppGrid';
import { useParams } from 'react-router-dom';
import TournamentLobbyForm from '@components/widgets/TournamentLobbyForm';
import TournamentEntries from '@components/widgets/TournamentEntries';


const TournamentLobby = ({setTitle}) => {
    const[tournament,setTournament] = useState(null);
    const widgets = {
        tournament_entries_list: <TournamentEntries tournament={tournament} />,
        tournament_lobby_form: <TournamentLobbyForm tournament={tournament}/>,
    }
    let {id} = useParams();
    useEffect(() => {
        const fetchTournament = async() => {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/tournament-info/${id}`);
        
            if (!res.ok) {
                console.error("Failed to fetch tournament");
                return [];
            }
            const tournamentData = await res.json();
            setTournament(tournamentData);
        }
        if(!tournament){
            fetchTournament();
        }
        
    }, [id,tournament]);

    useEffect(() => {
        setTitle('Tournament Lobby');
      }, [setTitle]);
    
    return (
        <>
            <AppGrid id="tournament_lobby" widgets={widgets}/>
        </>
    )
}

export default TournamentLobby