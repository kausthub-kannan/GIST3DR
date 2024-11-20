import { isAbsoluteUrl } from "next/dist/shared/lib/utils";
import {create} from "zustand"

const useAuthStore = create((set) => ({
    isAuthenticated: null,
    token: null,
    user_email: null,
    user_first_name: null,
    user_last_name: null,

    //actions to update the store
    setAuthData: ({isAuthenticated, token, user_email, user_first_name, user_last_name}) => set(()=>({
        isAuthenticated,
        token,
        user_email,
        user_first_name,
        user_last_name,
    })),

    clearAuthData: () =>set(()=>({
        isAuthenticated: null,
        token: null,
        user_email: null,
        user_first_name: null,
        user_last_name: null,
    }))
}));

export default useAuthStore;