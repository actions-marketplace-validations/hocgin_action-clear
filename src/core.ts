import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";
import {getOctokit} from "@actions/github";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

export function run(input: Inputs): Outputs {
    let page = 2;
    if (input.limit_tags > 0) {
        let result = [];
        do {
            octokit.repos.listTags({owner, repo, page: page++, per_page: input.limit_tags}).then(({data}) => {
                result = data;
                debugPrintf('listTags', result);
                for (let tag of result) {
                    debugPrintf(`delete tag name = ${tag.name}`);
                    octokit.git.deleteRef({owner, repo, ref: `tags/${tag.name}`});
                }
            });
        } while (result.length !== input.limit_tags)
    }

    page = 2;
    if (input.limit_release > 0) {
        let result = [];
        do {
            octokit.repos.listReleases({owner, repo, page: page++, per_page: input.limit_release}).then(({data}) => {
                result = data;
                debugPrintf('listReleases', result);
                for (let release of result) {
                    debugPrintf(`delete release.id = ${release.id}`);
                    octokit.repos.deleteRelease({owner, repo, release_id: release.id});
                }
            });
        } while (result.length !== input.limit_release)
    }
    return {};
}
