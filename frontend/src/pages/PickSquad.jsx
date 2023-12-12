import { useEffect } from 'react';
import AppGrid from '@layout/AppGrid';
import GameweekPreview from '@components/widgets/GameweekPreview';
import { useParams } from 'react-router-dom';

const widgets = {
    gameweek_preview: <GameweekPreview/>,
}

const PickSquad = ({setTitle}) => {
    let {tokenId} = useParams();
    useEffect(() => {
        setTitle('Pick Squad')
    }, []);
    return (
        <>
            Pick Squad: {tokenId}
            {/* <AppGrid id="tournament_lobby" widgets={widgets}/> */}
        </>
    )
}

export default PickSquad