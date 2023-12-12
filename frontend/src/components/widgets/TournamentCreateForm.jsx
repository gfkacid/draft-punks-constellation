import styles from './tounament-create-form-styles.module.scss';
import { useState } from 'react';
import Spring from '@components/Spring';
import Box from '@mui/material/Box';
import {Button, FormHelperText} from '@mui/material';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { InputAdornment } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Slider from '@mui/material/Slider';
import moment from 'moment';
import { contractAddresses } from '@utils/data';
import useSendTransaction from '@hooks/useSendTransaction';
import { useAccount } from 'wagmi';

const TournamentCreateForm = ({gameweeks}) => {
    const [name, setName] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [tourneySize,setTourneySize] = useState([2,16]);
    const [buyin, setBuyIn] = useState(10);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const {setAddress, setFunctionData, sendTransaction} = useSendTransaction();
    const {address} = useAccount();

    const currentUnixTimestamp = moment().unix();
    const availableGameweeks = gameweeks.filter(gameweek => gameweek.start - 3600 > currentUnixTimestamp);
    
    const handleChangeStart = (event) => {
      setStart(event.target.value);
    };
    
    const handleChangeEnd = (event) => {
      setEnd(event.target.value);
    };

    const handleChangeTourneySize = (event, newValue) => {
        setTourneySize(newValue);
    };

    const handleChangeBuyIn = (event) => {
        let val = parseInt(event.target.value);
        if(isNaN(val))setBuyIn(null);
        if(Number.isInteger(val) && val > 0 && val <= 1000){
            setBuyIn(val);
        }      
    };

    const handleSubmit = () => {
        setAddress(contractAddresses.lobby);
        setFunctionData([address,name,start-1,end-1,buyin * 10**18,tourneySize[0],tourneySize[1]]);
        sendTransaction();
    }

    return (
        <Spring className="card d-flex flex-column h-4">
            <div className="card_header d-flex flex-column g-10" style={{paddingBottom: 20}}>
                <div className="d-flex justify-content-between align-items-center">
                    <h3>Create Tournament</h3>
                </div>
            </div>
            <div className={styles.grid}>
            <div className="d-flex flex-column justify-content-between flex-1 border-top card-padded  g-20">
                <Box component="form" sx={{'& .MuiTextField-root': { m: 1, width: '25ch' },}} noValidate autoComplete="off">
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <TextField required id="tourney-name" label="Tournament Name" variant="standard"
                            value={name}
                            onChange={(event) => {
                            setName(event.target.value);
                            }}
                        />
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <InputLabel>Start</InputLabel>
                        <Select value={start} label="Start" onChange={handleChangeStart}>
                            {availableGameweeks.map((gameweek) => (
                                <MenuItem value={gameweek.id}>{gameweek.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <InputLabel>End</InputLabel>
                        <Select value={end} label="End" onChange={handleChangeEnd}>
                            {availableGameweeks.map((gameweek) => (
                                <MenuItem value={gameweek.id}>{gameweek.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '8px'}}>
                        <label>Tournament Size</label>
                        <Slider
                            getAriaLabel={() => 'Tournament Size'}
                            value={tourneySize}
                            onChange={handleChangeTourneySize}
                            valueLabelDisplay="auto"
                            min={2}
                            max={64}
                            step={1}
                        />
                        <FormHelperText> Min 2 / Max 64 entries</FormHelperText>
                    </FormControl>
                    <FormControl fullWidth style={{marginBottom: '16px'}}>
                        <TextField
                            id="buyin-TEXT-input"
                            min={1}
                            max={1000}
                            value={buyin}
                            onChange={handleChangeBuyIn}
                            label="Buy in"
                            type="number"
                            InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                $
                                </InputAdornment>
                            ),
                            }}
                            InputLabelProps={{ shrink: true }}
                            variant="standard"
                        />

                        <FormHelperText> Buy in range: $1-$1000</FormHelperText>
                    </FormControl>
                    <FormControl>
                        <Button variant="contained" onclick={handleSubmit}>Create Tournament</Button>
                    </FormControl>
                    
                </Box>
            </div>
            </div>
        </Spring>
    );
}

export default TournamentCreateForm;