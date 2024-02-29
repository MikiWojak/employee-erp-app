export const getters = {
    loggedUser: (state, getters, rootState) => rootState.auth?.user,

    isAdmin: (state, getters, rootState) =>
        rootState.auth?.user?.role?.name === 'admin',

    vacationDaysLeft: (state, getters, rootState) =>
        rootState.auth?.user?.vacationDaysSum -
            rootState.auth?.user?.vacationDaysUsed || 0
};
