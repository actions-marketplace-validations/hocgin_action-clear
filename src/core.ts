import * as github from '@actions/github';
import {Inputs, Outputs} from "./main";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

export function run(input: Inputs): Outputs {
    if (input.limit_tags > 0) {
        listAllTags(input.limit_tags).forEach(({name}) => {
            octokit.git.deleteRef({owner, repo, ref: `tags/${name}`});
        });
    }

    if (input.limit_release > 0) {
        listAllReleases(input.limit_release).forEach(({id}) => {
            octokit.repos.deleteRelease({owner, repo, release_id: id});
        });
    }
    return {};
}

function listAllTags(limit: number) {
    let page = 1;
    let result: any[] = [];
    let perPage = 200;
    do {
        octokit.repos.listTags({owner, repo, page: page++, per_page: perPage}).then(({data}) => {
            result.push(data);
        });
    } while (result.length !== perPage)
    return result.slice(Math.min(limit, result.length), result.length);
}

function listAllReleases(limit: number) {
    let page = 1;
    let result: any[] = [];
    let perPage = 200;
    do {
        octokit.repos.listReleases({owner, repo, page: page++, per_page: perPage}).then(({data}) => {
            result.push(data);
        });
    } while (result.length !== perPage)
    return result.slice(Math.min(limit, result.length), result.length);
}

function listAllErrorWorkflowLog(limit: number) {
    // octokit.actions.listWorkflowRuns()
}
