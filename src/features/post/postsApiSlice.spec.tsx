import {postsApi, useGetPostsQuery} from "./postsApiSlice";

import {configureStore, Store} from '@reduxjs/toolkit';

import React, {PropsWithChildren} from "react";
import {Provider} from "react-redux";
import fetchMock from "jest-fetch-mock";
import {renderHook, waitFor} from "@testing-library/react";

function getStore(): Store {
    return configureStore({
        reducer: {
            [postsApi.reducerPath]: postsApi.reducer,
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware().concat(postsApi.middleware),
    });
}

describe('postsApi', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    const data = [
        { id: 1, title: 'Mock Post 1', body: 'This is the body of mock post 1', userId: 1 },
        { id: 2, title: 'Mock Post 2', body: 'This is the body of mock post 2', userId: 2 },
    ]

    it('fetches the list of posts successfully', async () => {
        const wrapper = ({ children }: PropsWithChildren) => {
            return <Provider store={getStore()}>{children}</Provider>;
        }

        fetchMock.mockOnceIf('https://jsonplaceholder.typicode.com/posts', () =>
            Promise.resolve({
                status: 200,
                body: JSON.stringify(data),
            })
        );

        const { result } = renderHook(() => useGetPostsQuery(), {
            wrapper
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(result.current.isSuccess).toBeTruthy();
        expect(result.current.data).toEqual(data);
    });

    it('handles error responses gracefully', async () => {
        function wrapper({ children }: PropsWithChildren) {
            return <Provider store={getStore()}>{children}</Provider>;
        }

        const data = { error: 'Internal Server Error' }

        fetchMock.mockOnceIf('https://jsonplaceholder.typicode.com/posts', () =>
            Promise.resolve({
                status: 500,
                body: JSON.stringify(data),
            })
        );

        const { result } = renderHook(() => useGetPostsQuery(), {
            wrapper
        });

        await waitFor(() => expect(result.current.isError).toBeTruthy());

        expect(fetchMock).toHaveBeenCalledTimes(1);

        expect(result.current.isError).toBeTruthy(); // Ensure the request was rejected
        expect(result.current.error).toHaveProperty('status', 500); // Check the status code
        expect(result.current.error).toHaveProperty('data.error', 'Internal Server Error'); // Check the error content
    });
});
