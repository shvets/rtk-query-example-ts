import {configureStore, Store} from "@reduxjs/toolkit"
import {PropsWithChildren} from "react";
import {Provider} from "react-redux";

const getStore = (sliceApi: any): Store => {
    return configureStore({
        reducer: {
            [sliceApi.reducerPath]: sliceApi.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(sliceApi.middleware)
    })
}

export const createApiWrapper = (sliceApi: any) =>
    ({children}: PropsWithChildren) => {
        return<Provider store={getStore(sliceApi)}>{children}</Provider>
    }

