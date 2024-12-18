import {describe} from '@jest/globals';

import axios from "axios";

describe("test axios", () => {
    it("test1", async () => {
        const instance = axios.create({baseURL: 'https://jsonplaceholder.typicode.com/users'});

        const result = await instance.get("/")

        console.log(result)
    })
})