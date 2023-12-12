import { useEffect } from 'react';
import Error404 from '@components/Error404';

const PageNotFound = ({setTitle}) => {
    useEffect(() => {
        setTitle('Page not found')
    }, []);
    return (
        <>
            <Error404/>
        </>
    )
}

export default PageNotFound