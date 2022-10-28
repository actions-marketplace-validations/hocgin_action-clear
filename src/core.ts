import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";
import {getOctokit} from "@actions/github";

const {owner} = github.context.repo;
const {repo} = github.context.repo;

export function run(input: Inputs): Outputs {
    const octokit = getOctokit(process.env.GITHUB_TOKEN!, {});

    octokit.repos.listTags({owner, repo}).then(({data}) => {
        let sortData = data.sort((a, b) => a?.name > b?.name ? 1 : -1);
        debugPrintf('github.context', data, sortData);

    });


    // octokit.repos.delete
    // octokit.repos.deleteRelease({
    //     owner, repo, release_id: dat1.data.id
    // })
    // let context = github.context;

    return {};
}
