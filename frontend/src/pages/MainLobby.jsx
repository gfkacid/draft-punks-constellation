import AppGrid from '@layout/AppGrid';
import LobbyTable from '@components/widgets/LobbyTable';
import { useEffect } from 'react';

const widgets = {
    lobby_table: <LobbyTable/>
}

const MainLobby = ({setTitle}) => {
    useEffect(() => {
        setTitle('Lobby')
    }, []);
    return (
        <>
            <AppGrid id="main_lobby" widgets={widgets}/>
        </>
    )
}

export default MainLobby