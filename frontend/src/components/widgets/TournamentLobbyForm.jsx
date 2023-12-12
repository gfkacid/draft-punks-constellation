import styles from './tounament-create-form-styles.module.scss';
import { useState } from 'react';
import Spring from '@components/Spring';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';
import FormControl from '@mui/material/FormControl';

const TournamentLobbyForm = ({tournament}) => {

    return (
        <Spring className="card d-flex flex-column h-4">
            {tournament ? (
            <>
            <div className="card_header d-flex flex-column g-10" style={{paddingBottom: 20}}>
                <div className="d-flex justify-content-between align-items-center">
                    <h3>{tournament.name} - <small style={{fontStyle: 'italic', textTransform: 'uppercase'}}>{tournament.status}</small></h3>
                </div>
            </div>
            <div className={styles.grid}>
            <div className="d-flex flex-column justify-content-between flex-1 border-top card-padded  g-20">
                <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} disabled noValidate autoComplete="off">
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <TextField label="Start" variant="standard"
                            value={tournament.gameweek_start.name}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <TextField label="End" variant="standard"
                            value={tournament.gameweek_end.name}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <TextField label="Tournament Size" variant="standard"
                            value={tournament.min_entries === tournament.max_entries 
                                ? tournament.min_entries 
                                : tournament.min_entries+' - '+tournament.max_entries
                            }
                        />
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <TextField label="Buy In" variant="standard"
                            value={tournament.buy_in}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    $
                                    </InputAdornment>
                                ),
                                }}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <TextField label="Prize Pool" variant="standard"
                            value={tournament.prize_pool}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                    $
                                    </InputAdornment>
                                ),
                                }}
                        />
                    </FormControl>
                    
                    {/* ADD PRIZE STRUCTURE TABLE */}
                    
                </Box>
            </div>
            </div>
            </>
            ) : (<></>)}
        </Spring>
    );
}

export default TournamentLobbyForm;