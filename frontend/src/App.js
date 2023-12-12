// utils
import {lazy, Suspense, useState} from 'react';

// styles
import ThemeStyles from './styles/theme';
import './style.scss';

// libs styles
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-grid-layout/css/styles.css';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

// fonts
import '@fonts/icomoon/icomoon.woff';

// contexts
import {SidebarProvider} from '@contexts/sidebarContext';
import {ThemeProvider} from 'styled-components';

// hooks
import {useThemeProvider} from '@contexts/themeContext';
import {useEffect, useRef} from 'react';
import { useDispatch } from 'react-redux';
import {useWindowSize} from 'react-use';

// actions
import { getPremiershipData } from '@store/premiership/actions';

// utils
import {StyleSheetManager} from 'styled-components';
import {ThemeProvider as MuiThemeProvider, createTheme} from '@mui/material/styles';
import {preventDefault} from 'utils/helpers';

// components
import {Route, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';
import LoadingScreen from '@components/LoadingScreen';
import Sidebar from '@layout/Sidebar';
import BottomNav from '@layout/BottomNav';
import Navbar from '@layout/Navbar';
import ScrollToTop from '@components/ScrollToTop';
import PageHeader from '@layout/PageHeader';
import { getTournaments } from '@store/lobby/actions';

// pages
const MainLobby = lazy(() => import('@pages/MainLobby'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));
const CreateTournament = lazy(() => import('@pages/CreateTournament'));
const TournamentLobby = lazy(() => import('@pages/TournamentLobby'));
const PickSquad = lazy(() => import('@pages/PickSquad'));
const MyTournaments = lazy(() => import('@pages/MyTournaments'));

const App = () => {
    const dispatch = useDispatch();
    const appRef = useRef(null);
    const {theme} = useThemeProvider();
    const {width} = useWindowSize();
    const [pageTitle,setPageTitle] = useState('Draft Punks');
    const muiTheme = createTheme({
        palette: {
          mode: 'dark',
        },
      });

    useEffect(() => {
        // scroll to top on route change
        appRef.current && appRef.current.scrollTo(0, 0);

        preventDefault();
    }, []);

    useEffect(() => {
        dispatch(getPremiershipData());
        dispatch(getTournaments());
      }, [dispatch]);

    return (
            <MuiThemeProvider theme={muiTheme}>
              <SidebarProvider>
                <ThemeProvider theme={{theme: theme}}>
                  <ThemeStyles/>
                  <ToastContainer autoClose={2500} position={'top-right'}/>
                  <StyleSheetManager>
                      <div className="app" ref={appRef}>
                          <ScrollToTop/>
                          <Sidebar/>
                          {
                              width < 768 && <Navbar/>
                          }
                          {
                              width < 768 && <BottomNav/>
                          }
                          <div className="app_container">
                              <div className="app_container-content d-flex flex-column flex-1">
                                  <Suspense fallback={<LoadingScreen/>}>
                                  <PageHeader title={pageTitle}/>
                                      <Routes>
                                          <Route path="*" element={<PageNotFound setTitle={setPageTitle}/>}/>
                                          <Route path="/" element={<MainLobby setTitle={setPageTitle}/>}/>
                                          <Route path="/create-tournament" element={<CreateTournament setTitle={setPageTitle}/>}/>
                                          <Route path="/tournament-lobby/:id" element={<TournamentLobby setTitle={setPageTitle}/>}/>
                                          <Route path="/pick-squad/:tokenId" element={<PickSquad setTitle={setPageTitle}/>}/>
                                          <Route path="/my-tournaments" element={<MyTournaments setTitle={setPageTitle}/>}/>
                                      </Routes>
                                  </Suspense>
                              </div>
                          </div>
                      </div>
                  </StyleSheetManager>
                </ThemeProvider>
              </SidebarProvider>
            </MuiThemeProvider>
    );
}

export default App
