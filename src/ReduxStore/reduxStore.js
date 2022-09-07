let initialState = {
    currentUser: undefined,
    softwares: null,
    token: ''
};

const data = (state = initialState, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                currentUser: action.currentUser
            }
        case "SET_TOKEN":
            return {
                ...state,
                token: action.token
            }
        case "SET_SOFTWARES":
            return {
                ...state,
                softwares: action.softwares
            }
        default:
            return state
    }
}

export default data