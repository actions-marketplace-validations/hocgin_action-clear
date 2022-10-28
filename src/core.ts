import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

function listAllTags(limit: number, max: number = 100) {
    let page = 1;
    let result: string[] = [];
    let perPage = 100;
    do {
        octokit.repos.listTags({
            owner,
            repo,
            page: page++,
            per_page: perPage
        }).then(({data}) => result.push(...data.map(({name}) => name)));
    } while (result.length % perPage === 0 || result.length >= max)
    return result.slice(Math.min(limit, result.length), Math.min(max, result.length));
}

function listAllReleases(limit: number, max: number = 100) {
    let page = 1;
    let result: number[] = [];
    let perPage = 100;
    do {
        octokit.repos.listReleases({
            owner,
            repo,
            page: page++,
            per_page: perPage
        }).then(({data}) => result.push(...data.map(({id}) => id)));
    } while (result.length % perPage === 0 || result.length >= max)
    return result.slice(Math.min(limit, result.length), Math.min(max, result.length));
}

export function run(input: Inputs): Outputs {
    if (input.limit_tags > 0) {
        debugPrintf(`正在处理 listAllTags.limit_tags`, input.limit_tags)
        let result = listAllTags(input.limit_tags);
        debugPrintf(`正在处理 listAllTags.size`, result.length)
        result.forEach((name) => {
            debugPrintf(`删除 tag.name=${name}`)
            octokit.git.deleteRef({owner, repo, ref: `tags/${name}`});
        });
    }

    if (input.limit_release > 0) {
        debugPrintf(`正在处理 listAllReleases.limit_release`, input.limit_release)
        let result = listAllReleases(input.limit_release);
        debugPrintf(`正在处理 listAllReleases.size`, result.length)
        result.forEach((id) => {
            debugPrintf(`删除 release.id=${id}`)
            octokit.repos.deleteRelease({owner, repo, release_id: id});
        });
    }
    return {};
}
