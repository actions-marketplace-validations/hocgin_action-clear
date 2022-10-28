import * as github from '@actions/github';
import {debugPrintf, Inputs, Outputs} from "./main";

const {owner} = github.context.repo;
const {repo} = github.context.repo;
const octokit = github.getOctokit(process.env.GITHUB_TOKEN!);

const MAX_LIMIT = 2000;

async function listAllTags(limit: number, maxLimit: number = MAX_LIMIT) {
    let page = 1;
    let result: string[] = [];
    let perPage = 100;
    do {
        debugPrintf(`perPage=${perPage}, page=${page}`);
        let {data} = await octokit.repos.listTags({
            owner,
            repo,
            page: page++,
            per_page: perPage
        });
        debugPrintf('listAllTags.data', data);
        result.push(...data.map(({name}) => name));
        // 数量满足 maxLimit，查询发现还有下一页
    } while (result.length < maxLimit && result.length % perPage === 0)
    if (limit > result.length) {
        return [];
    }
    return result.slice(Math.min(limit, result.length), Math.min(maxLimit, result.length));
}

async function listAllReleases(limit: number, maxLimit: number = MAX_LIMIT) {
    let page = 1;
    let result: number[] = [];
    let perPage = 100;
    do {
        debugPrintf(`perPage=${perPage}, page=${page}`);
        let {data} = await octokit.repos.listReleases({
            owner,
            repo,
            page: page++,
            per_page: perPage
        });
        debugPrintf('listReleases.data', data);
        result.push(...data.map(({id}) => id));
        // 数量满足 maxLimit，查询发现还有下一页
    } while (result.length < maxLimit && result.length % perPage === 0)
    if (limit > result.length) {
        return [];
    }

    return result.slice(Math.min(limit, result.length), Math.min(maxLimit, result.length));
}

export async function run(input: Inputs) {
    if (input.limit_tags > 0) {
        try {
            debugPrintf(`正在处理 listAllTags.limit_tags`, input.limit_tags)
            let result = await listAllTags(input.limit_tags);
            debugPrintf(`正在处理 listAllTags.size`, result.length)
            result.forEach((name) => {
                debugPrintf(`删除 tag.name=${name}`)
                octokit.git.deleteRef({owner, repo, ref: `tags/${name}`});
            });
        } catch (e) {
            console.warn('limit_tags.error', e);
        }
    }

    if (input.limit_release > 0) {
        try {
            debugPrintf(`正在处理 listAllReleases.limit_release`, input.limit_release)
            let result = await listAllReleases(input.limit_release);
            debugPrintf(`正在处理 listAllReleases.size`, result.length)
            result.forEach((id) => {
                debugPrintf(`删除 release.id=${id}`)
                octokit.repos.deleteRelease({owner, repo, release_id: id});
            });
        } catch (e) {
            console.warn('limit_release.error', e);
        }
    }
    return {} as Outputs;
}
