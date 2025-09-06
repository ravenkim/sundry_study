// 더미 클라우드 데이터 20개
export const cloudDummyList: Cloud[] = Array.from({ length: 200 }).map((_, idx) => {
    const id = `cloud-${(idx + 1).toString().padStart(3, "0")}`;
    const name = `aws-cloud-${idx + 1}`;
    const regions = [
        "ap-northeast-1",
        "ap-northeast-2",
        "us-east-1",
        "us-west-2",
        "eu-central-1",
    ];
    const cloudGroups = ["default", "finance", "devops", "staging", "research"];

    return {
        id,
        provider: "AWS",
        name,
        cloudGroupName: [cloudGroups[idx % cloudGroups.length]],
        eventProcessEnabled: idx % 2 === 0,
        userActivityEnabled: idx % 3 !== 0,
        scheduleScanEnabled: idx % 4 === 0,
        scheduleScanSetting:
            idx % 4 === 0
                ? {
                    frequency: ["HOUR", "DAY", "WEEK", "MONTH"][idx % 4] as
                        | "HOUR"
                        | "DAY"
                        | "WEEK"
                        | "MONTH",
                    date: idx % 4 === 3 ? String(((idx % 28) + 1)) : undefined,
                    weekday:
                        idx % 4 === 2
                            ? (["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"][
                            idx % 7
                                ] as
                                | "MON"
                                | "TUE"
                                | "WED"
                                | "THU"
                                | "FRI"
                                | "SAT"
                                | "SUN")
                            : undefined,
                    hour: String(idx % 24),
                    minute: String((idx * 5) % 60),
                }
                : undefined,
        regionList: [regions[idx % regions.length]],
        proxyUrl: idx % 5 === 0 ? `http://proxy${idx}.example.com:8080` : undefined,
        credentials: {
            accessKeyId: `AKIA********${(1000 + idx).toString().slice(-2)}`,
            secretAccessKey: `SeCrEt********${(2000 + idx).toString().slice(-2)}`,
        },
        credentialType: "ACCESS_KEY",
        eventSource: {
            cloudTrailName: `trail-${idx + 1}`,
        },
    };
});
