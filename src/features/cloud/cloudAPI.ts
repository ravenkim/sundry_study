function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchCloudDetail(id: string): Promise<Cloud> {
    // 0 ~ 500ms 랜덤 지연
    const delay = Math.floor(Math.random() * 500);
    await sleep(delay);

    // 서버에서 받은 데이터 흉내
    return {
        id,
        provider: "AWS",
        name: "prod-aws-cloud",
        cloudGroupName: ["default", "finance", "devops"],
        eventProcessEnabled: true,
        userActivityEnabled: true,
        scheduleScanEnabled: true,
        scheduleScanSetting: {
            frequency: "DAY",
            hour: "2",
            minute: "0",
        },
        regionList: ["ap-northeast-2", "us-east-1"],
        credentials: {
            accessKeyId: "AKIA********18",
            secretAccessKey: "jZd1********0n",
        },
        credentialType: "ACCESS_KEY",
        eventSource: {
            cloudTrailName: "main-trail",
        },
    };
}
