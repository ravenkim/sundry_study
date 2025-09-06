export const cloudDummyList: Cloud[] = [
    {
        id: "cloud-001",
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
        proxyUrl: "http://proxy.example.com:8080",
        credentials: {
            accessKeyId: "AKIA********18",
            secretAccessKey: "jZd1********0n",
        },
        credentialType: "ACCESS_KEY",
        eventSource: {
            cloudTrailName: "main-trail",
        },
    },
    {
        id: "cloud-002",
        provider: "AWS",
        name: "staging-aws-cloud",
        cloudGroupName: ["default", "staging"],
        eventProcessEnabled: false,
        userActivityEnabled: true,
        scheduleScanEnabled: false,
        regionList: ["ap-northeast-1"],
        credentials: {
            accessKeyId: "AKIA********99",
            secretAccessKey: "zZy8********1a",
        },
        credentialType: "ACCESS_KEY",
        eventSource: {
            cloudTrailName: "staging-trail",
        },
    },
    {
        id: "cloud-003",
        provider: "AWS",
        name: "analytics-aws-cloud",
        cloudGroupName: ["analytics", "research"],
        eventProcessEnabled: true,
        userActivityEnabled: false,
        scheduleScanEnabled: true,
        scheduleScanSetting: {
            frequency: "WEEK",
            weekday: "MON",
            hour: "6",
            minute: "30",
        },
        regionList: ["eu-west-1", "eu-central-1"],
        proxyUrl: undefined,
        credentials: {
            accessKeyId: "AKIA********55",
            secretAccessKey: "dFs9********7b",
        },
        credentialType: "ACCESS_KEY",
        eventSource: {
            cloudTrailName: "analytics-trail",
        },
    },
];
