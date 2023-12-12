// styled components
import {
    Link,
    SingleLink,
    StyledDrawer
}
    from './styles';

// components
import Logo from '@components/Logo';
import {NavLink, useLocation} from 'react-router-dom';

// hooks
import {useSidebar} from '@contexts/sidebarContext';
import {useWindowSize} from 'react-use';

const Sidebar = () => {
    const {open, setOpen} = useSidebar();
    const {pathname} = useLocation();
    const {width} = useWindowSize();

    return (
        <StyledDrawer
            variant={width < 1920 ? 'temporary' : 'permanent'}
            anchor="left"
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiDrawer-paper': {
                    width: 250,
                }
            }}
            className="main-sidebar">
            <div className="logo-wrapper">
                <Logo size="sm"/>
            </div>
            <nav className="d-flex flex-column g-8 flex-1">
                <NavLink to="/">
                    <Link className={`${pathname === '/' ? 'active' : ''} h4`}>
                        <i className="icon icon-ball"/> Lobby
                    </Link>
                </NavLink>
                <NavLink to="/my-tournaments">
                    <Link className={`${pathname === '/my-tournaments' ? 'active' : ''} h4`}>
                        <i className="icon icon-ticket-regular"/> My Tournaments
                    </Link>
                </NavLink>
                <NavLink to="/create-tournament">
                    <Link className={`${pathname === '/create-tournament' ? 'active' : ''} h4`}>
                        <i className="icon icon-circle-plus"/> Create Tournament
                    </Link>
                </NavLink>
            </nav>
            <SingleLink className={pathname === '/settings' ? 'pinned active' : 'pinned'} as="div">
                <NavLink to="/settings">
                    <Link className={`${pathname === '/settings' ? 'active' : ''} h4`}>
                        <i className="icon icon-sliders"/> Settings
                    </Link>
                </NavLink>
            </SingleLink>
        </StyledDrawer>
    );
}

export default Sidebar