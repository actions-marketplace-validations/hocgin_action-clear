import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

export function run(input: Inputs): Outputs {
    if (input.limit_tags > 0) {
        let result = listAllTags(input.limit_tags);
        result.forEach((name) => {
            debugPrintf(`删除 tag.name=${name}`)
            octokit.git.deleteRef({owner, repo, ref: `tags/${name}`});
        });
    }

    if (input.limit_release > 0) {
        let result = listAllReleases(input.limit_release);
        result.forEach((id) => {
            debugPrintf(`删除 release.id=${id}`)
            octokit.repos.deleteRelease({owner, repo, release_id: id});
        });
    }
    return {};
}

function listAllTags(limit: number) {
    let page = 1;
    let result: string[] = [];
    let perPage = 200;
    do {
        octokit.repos.listTags({
            owner,
            repo,
            page: page++,
            per_page: perPage
        }).then(({data}) => result.push(...data.map(({name}) => name)));
    } while (result.length % perPage === 0)
    return result.slice(Math.min(limit, result.length), result.length);
}

function listAllReleases(limit: number) {
    let page = 1;
    let result: number[] = [];
    let perPage = 200;
    do {
        octokit.repos.listReleases({
            owner,
            repo,
            page: page++,
            per_page: perPage
        }).then(({data}) => result.push(...data.map(({id}) => id)));
    } while (result.length % perPage === 0)
    return result.slice(Math.min(limit, result.length), result.length);
}

function listAllErrorWorkflowLog(limit: number) {
    // octokit.actions.listWorkflowRuns()
}
