import {createContext, useContext, useEffect, useState} from 'react';

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({children}) => {
    
    const [theme, setTheme] = useState('dark');


    return (
        <ThemeContext.Provider
            value={{
                theme
            }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useThemeProvider = () => useContext(ThemeContext);