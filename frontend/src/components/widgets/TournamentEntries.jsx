// components
import Spring from '@components/Spring';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import ScrollContainer from '@components/ScrollContainer';
import { TableVirtuoso } from 'react-virtuoso';
// hooks
import {useState, useRef, useEffect, forwardRef} from 'react';
import useMeasure from 'react-use-measure';
import { truncateAddress } from '@utils/helpers';

const TournamentEntries = ({tournament}) => {
   
    const [ref, {height}] = useMeasure();
    const trackRef = useRef(null);
    useEffect(() => {
        trackRef.current && trackRef.current.scrollTo({top: 0, behavior: 'smooth'});
    }, [tournament])
    
    const VirtuosoTableComponents = {
        Scroller: forwardRef((props, ref) => (
          <TableContainer component={Paper} {...props} ref={ref} />
        )),
        Table: (props) => (
          <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
        ),
        TableHead,
        TableRow: ({ item: _item, ...props }) => <TableRow {...props} />,
        TableBody: forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
      };
      
      function fixedHeaderContent() {
        return (
          <TableRow>
              <TableCell
                variant="head"
                align={'left'}
                // style={{ width: column.width }}
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                Entry
              </TableCell>
              {tournament.status !== "Registering" && (

              <TableCell
                variant="head"
                align={'center'}
                // style={{ width: column.width }}
                sx={{
                    backgroundColor: 'background.paper',
                }}
                >
                    Points
                </TableCell>
              )}
              {tournament.status === "Ended" && (

              <TableCell
                variant="head"
                align={'center'}
                // style={{ width: column.width }}
                sx={{
                    backgroundColor: 'background.paper',
                }}
                >
                    Prize
                </TableCell>
              )}
              <TableCell
                variant="head"
                align={'center'}
                // style={{ width: 10 }}
                sx={{
                  backgroundColor: 'background.paper',
                }}
              >
                Squad
              </TableCell>
          </TableRow>
        );
      }
      
      function rowContent(_index, row) {
        return (
          <>
              <TableCell align={'left'}>
                {truncateAddress(row.user.address)}
              </TableCell>
              {tournament.status !== "Registering" && (
                <TableCell align={'center'}>
                    {row.points}
              </TableCell>
              )}

              {tournament.status === "Ended" && (
                <TableCell align={'center'}>
                    ${row?.prize}
              </TableCell>
              )}
              <TableCell align={'center'}>
                <span onClick={console.log('entry '+row.id)}>
                    <img style={{display: 'inline-block', height: '1.25em', width: 'auto'}} src={process.env.PUBLIC_URL+'/squad.png'} alt={'squad '+row.id}></img>
                </span>
              </TableCell>
          </>
        );
      }

    return (
        <Spring className="card h-4">
            {tournament && (
            <div className="card_header d-flex flex-column g-10" style={{paddingBottom: 20}}>
                <div className="d-flex justify-content-between align-items-center">
                    <h3>{tournament.status === 'Registering' ? 'Entries' : 'Standings'}</h3>
                </div>
            </div>
            )}
            {tournament?.entries.length > 0 ? (
            <> 
                <Paper style={{ height: '100%', width: '100%' }}>
                    <TableVirtuoso
                        data={tournament.entries}
                        components={VirtuosoTableComponents}
                        fixedHeaderContent={fixedHeaderContent}
                        itemContent={rowContent}
                    />
                </Paper>
                {/* <ScrollContainer height={height}>
                    <div className="track d-flex flex-column g-20" ref={trackRef} style={{padding: 20}}>
                        {tournament.status === "Running" ? (
                            <>
                            {tournament.entries.map((entry, index) => (
                                <div>entry {index}</div>
                            ))}
                            </>
                        ) : (
                            <>
                            {tournament.entries.map((entry, index) => (
                                <div>entry {index}</div>
                            ))}
                            </>
                        )
                            
                        }
                    </div>
                </ScrollContainer> */}
            </>
            ) : (
                <>
                </>
            )
            }
        </Spring>
    )
}

export default TournamentEntries