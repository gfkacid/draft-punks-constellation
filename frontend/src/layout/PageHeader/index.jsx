// styling
import styles from './styles.module.scss';

// components
import {Helmet} from 'react-helmet';
import SidebarTrigger from '@components/SidebarTrigger';
import User from './User';
// import TruncatedText from '@components/TruncatedText';

// hooks
import {useWindowSize} from 'react-use';
import useMeasure from 'react-use-measure';

// utils
import PropTypes from 'prop-types';

const TabletHeader = ({title}) => {
    const [ref, {width}] = useMeasure();

    return (
        <div className={`${styles.tablet} d-flex align-items-center justify-content-between g-20`}>
            <div className="d-flex align-items-center flex-1 g-30">
                <SidebarTrigger/>
                <div className="flex-1" ref={ref}>
                    {/* <TruncatedText className={`${styles.title} h2`} text={title} width={width} lines={1}/> */}
                    {title}
                </div>
            </div>
            <div className="d-flex align-items-center g-20">
                <User/>
            </div>
        </div>
    )
}

const DesktopHeader = ({title}) => {
    const {width} = useWindowSize();
    const [ref, {width: titleWidth}] = useMeasure();
    
    return (
        <div className={`${styles.desktop} d-flex justify-content-between align-items-center g-20`}>
            <div className="d-flex align-items-center flex-1 g-30">
                {width < 1920 && <SidebarTrigger/>}
                <div className="flex-1" ref={ref}>
                    {/* <TruncatedText className={`${styles.title} h2`} text={title} width={titleWidth} lines={1}/> */}
                    {title}
                </div>
            </div>
            <div className="d-flex align-items-center">
                <User/>
            </div>
        </div>
    )
}

const PageHeader = ({title}) => {
    const {width} = useWindowSize();

    return (
        <>
            <Helmet>
                <title>{title} | Draft Punks</title>
            </Helmet>
            {
                width < 1280 ?
                    (
                        width < 768 ?
                            <h1 className={`${styles.title} h2`}>{title}</h1>
                            :
                            <TabletHeader title={title}/>
                    )
                    :
                    <DesktopHeader title={title}/>
            }
        </>
    )
}

PageHeader.propTypes = {
    title: PropTypes.string.isRequired
}

export default PageHeader