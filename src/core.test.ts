import {setOutput} from "@actions/core";

jest.mock('@actions/core');
jest.mock('@actions/github');

import * as core from '@actions/core';
import {run} from './core';

describe('action env [core.js] test', () => {
    beforeEach(() => {
        console.log('-> beforeEach');
    });

    test('DEMO TEST', async () => {
        console.log('-> DEMO TEST');
        // core.getInput = jest.fn()
        //     // .mockReturnValueOnce('upload_url')
        //     // .mockReturnValueOnce('asset_path')
        //     // .mockReturnValueOnce('asset_name')
        //     .mockReturnValueOnce('asset_content_type');
        run({} as any);
        let numbers = listAllReleases(10);
        console.log('numbers', numbers);
    });
});


function listAllReleases(limit: number, maxLimit: number = 40) {
    let page = 1;
    let result: number[] = [];
    let perPage = 40;
    do {
        result.push(...[page + 1, page + 2, page + 3, page + 4, page + 5])
        page++;
    } while (result.length < maxLimit)
    console.log('result', result);
    return result.slice(Math.min(limit, result.length), Math.min(maxLimit, result.length));
}
