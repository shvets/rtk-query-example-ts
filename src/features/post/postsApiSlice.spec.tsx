import {postsApi, useGetPostNyIdMutMutation, useGetPostsQuery} from "./postsApiSlice"

import fetchMock from "jest-fetch-mock"
import {act, renderHook, waitFor} from "@testing-library/react"

import {createApiWrapper} from "./apiSlice-test-helper"

const wrapper = createApiWrapper(postsApi)

describe('postsApi', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    const data = [
        { id: 1, title: 'Mock Post 1', body: 'This is the body of mock post 1', userId: 1 },
        { id: 2, title: 'Mock Post 2', body: 'This is the body of mock post 2', userId: 2 },
    ]

    describe('#useGetPostsQuery', () => {
        it('fetches the list of posts successfully', async () => {
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
    })

    describe('#useGetPostsQueryMut', () => {
        it('fetches the list of posts successfully', async () => {
            const query = 1 as any

            fetchMock.mockOnceIf('https://jsonplaceholder.typicode.com/posts/1', () =>
                Promise.resolve({
                    status: 200,
                    body: JSON.stringify(data),
                })
            );

            const { result } = renderHook(() => useGetPostNyIdMutMutation(), {
                wrapper
            });

            await act(async () => {
                const [mutate] = result.current

                await mutate(query)
            })

            expect(result.current[1].data).toEqual(data);
            expect(result.current[1].isLoading).toEqual(false);
            expect(result.current[1].isSuccess).toEqual(true);
        });
    })
});
