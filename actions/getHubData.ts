
interface Hubdata {
    name: string;
    user: string;
    pullCount: number;
    starCount: number;
    dateRegistered: Date;
    lastUpdated: Date;
}

async function getHubData(): Promise<Hubdata> {

    const hubDataResponse = await fetch(process.env.DOCKER_ENDPOINT!);
    const hubData = await hubDataResponse.json();

    return {
        name: hubData.name,
        user: hubData.user,
        pullCount: hubData.pull_count,
        starCount: hubData.star_count,
        dateRegistered: new Date(hubData.date_registered),
        lastUpdated: new Date(hubData.last_updated),
    }
}

export {
    getHubData
}
