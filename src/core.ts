import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";
import {getOctokit} from "@actions/github";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

export function run(input: Inputs): Outputs {
    let page = 2;
    if (input.limit_tags > 0) {
        octokit.repos.listTags({owner, repo, page, per_page: input.limit_tags}).then(({data}) => {
            // let sortData = data.sort((a, b) => a?.name > b?.name ? 1 : -1);
            debugPrintf('github.context', data);

        });
    }


    // octokit.repos.delete
    // octokit.repos.deleteRelease({
    //     owner, repo, release_id: dat1.data.id
    // })
    // let context = github.context;

    return {};
}
