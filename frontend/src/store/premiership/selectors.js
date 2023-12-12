const selectPremiershipReducer = (state) => state.premiership;

export const selectTeams = (state) => selectPremiershipReducer(state).teams || [];

export const selectGameweeks = (state) => selectPremiershipReducer(state).gameweeks || [];

export const selectFixtures = (state) => selectPremiershipReducer(state).fixtures || [];

export const selectPlayers = (state) => selectPremiershipReducer(state).players || [];