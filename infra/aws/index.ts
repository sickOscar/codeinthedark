import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const commonTags = {
    app: 'citd',
    deployed_by: process.env.DEPLOYED_BY || 'unknown'
}

createDataBucket();
createVoteWebsiteBucket();
createViewerWebsiteBucket();
createEditorWebsiteBucket();

createEC2();



function createEC2() {

    const originId = `${process.env.CITD_SERVER_PUBLIC_DNS}`;

    const vpc = new aws.ec2.Vpc('vpc', {
        cidrBlock: '13.0.0.0/16',
        enableDnsHostnames: true,
        enableDnsSupport: true,
        tags: Object.assign({}, commonTags, {
            Name: 'citd-vpc'
        }) as { [key: string]: string }
    });

    const internetGateway = new aws.ec2.InternetGateway('citd-internet-gateway', {
        vpcId: vpc.id,
        tags: commonTags
    });

    const publicSubnet = new aws.ec2.Subnet('public-subnet', {
        availabilityZone: 'eu-west-1c',
        cidrBlock: '13.0.6.0/24',
        vpcId: vpc.id,
        tags: Object.assign({}, commonTags, {
            Name: 'citd-public-subnet'
        }) as { [key: string]: string }
    })

    const routeTable = new aws.ec2.RouteTable('citd-route-table', {
        vpcId: vpc.id,
        tags: commonTags,
        routes: [{
            cidrBlock: '0.0.0.0/0',
            gatewayId: internetGateway.id
        }]
    })

    new aws.ec2.RouteTableAssociation('citd-route-table-association', {
        subnetId: publicSubnet.id,
        routeTableId: routeTable.id,
    })

    const securityGroup = new aws.ec2.SecurityGroup('security-group', {
        vpcId: vpc.id,
        tags: Object.assign({}, commonTags, {
            Name: 'citd-Security-Group'
        }) as { [key: string]: string },
        egress: [
            {
                fromPort: 0,
                protocol: 'tcp',
                toPort: 65535,
                cidrBlocks: ['0.0.0.0/0']
            }
        ],
        ingress: [
            {
                fromPort: 22,
                protocol: 'tcp',
                toPort: 22,
                cidrBlocks: ['0.0.0.0/0']
            },
            {
                fromPort: 3000,
                protocol: 'tcp',
                toPort: 3000,
                cidrBlocks: ['0.0.0.0/0']
            },
            {
                fromPort: 3001,
                protocol: 'tcp',
                toPort: 3001,
                cidrBlocks: ['0.0.0.0/0']
            }
        ]
    });

    const serverProfile = new aws.iam.InstanceProfile('server-profile', {
        name: 'server-profile',
        role: new aws.iam.Role('server-role', {
            assumeRolePolicy: JSON.stringify({
                Version: '2012-10-17',
                Statement: [{
                    Action: 'sts:AssumeRole',
                    Principal: {
                        Service: 'ec2.amazonaws.com'
                    },
                    Effect: 'Allow',
                    Sid: ''
                }]
            }),
            inlinePolicies: [{
                name: 'citd-server-policy',
                policy: JSON.stringify({
                    Version: '2012-10-17',
                    Statement: [{
                        Action: ['s3:*'],
                        Effect: 'Allow',
                        Resource: ['*']
                    }]
                })
            }]
        })
    });
    const server = new aws.ec2.Instance('server', {
        keyName: 'citd',
        ami: 'ami-0d71ea30463e0ff8d',
        vpcSecurityGroupIds: [securityGroup.id],
        subnetId: publicSubnet.id,
        instanceType: 't2.micro',
        associatePublicIpAddress: true,
        iamInstanceProfile: serverProfile,
        tags: Object.assign({}, commonTags, {
            Name: 'citd-server'
        }) as { [key: string]: string }
    });


    const serverDistribution = new aws.cloudfront.Distribution('server-distribution', {
        origins: [{
            domainName: originId,
            originId: originId,
            customOriginConfig: {
                httpPort: 3000,
                httpsPort: 443,
                originProtocolPolicy: 'http-only',
                originSslProtocols: ['TLSv1.2']
            }
        }],
        enabled: true,
        isIpv6Enabled: false,
        defaultCacheBehavior: {
            compress: true,
            allowedMethods: [
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
            ],
            cachedMethods: [
                "GET",
                "HEAD",
            ],
            targetOriginId: originId,
            forwardedValues: {
                headers: ["*"],
                queryString: true,
                cookies: {
                    forward: "all",
                },
            },
            viewerProtocolPolicy: "redirect-to-https",
            minTtl: 0,
            defaultTtl: 0,
            maxTtl: 0,
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            }
        },
        aliases: [
            "admin.codeinthedark.interlogica.it"
        ],
        viewerCertificate: {
            // cloudfrontDefaultCertificate: true,
            acmCertificateArn: process.env.CERTIFICATE_ARN,
            sslSupportMethod: "sni-only",
            minimumProtocolVersion: "TLSv1.2_2021",
        },
        tags: commonTags
    });




}

function createDataBucket() {
    const dataBucket = new aws.s3.Bucket('data', {
        bucket: `citd.interlogica`,
        acl: 'public-read',
        requestPayer: 'BucketOwner',
        corsRules: [{
            allowedHeaders: ['*'],
            allowedMethods: [
                'GET', 'HEAD'
            ],
            allowedOrigins: ['*'],
            exposeHeaders: ['ETag'],
            maxAgeSeconds: 3000
        }],
        tags: commonTags
    })
}


function createVoteWebsiteBucket() {

    const originId = `${process.env.CITD_SERVER_PUBLIC_DNS}`;

    const bucket = new aws.s3.Bucket('vote', {
        bucket: `vote.codeinthedark.interlogica.it`,
        acl: 'public-read',
        requestPayer: 'BucketOwner',
        website: {
            indexDocument: 'index.html',
            errorDocument: 'index.html'
        },
        corsRules: [{
            allowedHeaders: ['*'],
            allowedMethods: [
                'GET', 'HEAD'
            ],
            allowedOrigins: ['*'],
            exposeHeaders: ['ETag'],
            maxAgeSeconds: 3000
        }],
        tags: commonTags
    });

    new aws.s3.BucketPolicy(`vote-bucket-policy`, {
        bucket: bucket.id,
        policy: {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Sid': 'PublicReadGetObject',
                    'Effect': 'Allow',
                    'Principal': '*',
                    'Action': [
                        's3:GetObject'
                    ],
                    'Resource': [
                        pulumi.interpolate`${bucket.arn}/*`
                    ]
                }
            ]
        }
    });

    const distribution = new aws.cloudfront.Distribution('vote-distribution', {
        origins: [{
            domainName: originId,
            originId: originId,
            customOriginConfig: {
                httpPort: 3001,
                httpsPort: 443,
                originProtocolPolicy: 'http-only',
                originSslProtocols: ['TLSv1.2']
            }
        }],
        enabled: true,
        isIpv6Enabled: false,
        priceClass: 'PriceClass_100',
        defaultCacheBehavior: {
            compress: true,
            allowedMethods: [
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
            ],
            cachedMethods: [
                "GET",
                "HEAD",
            ],
            targetOriginId: originId,
            forwardedValues: {
                headers: ["*"],
                queryString: true,
                cookies: {
                    forward: "all",
                },
            },
            viewerProtocolPolicy: "redirect-to-https",
            minTtl: 0,
            defaultTtl: 0,
            maxTtl: 0,
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            }
        },
        aliases: [
            "vote.codeinthedark.interlogica.it"
        ],
        viewerCertificate: {
            // cloudfrontDefaultCertificate: true,
            acmCertificateArn: process.env.CERTIFICATE_ARN,
            sslSupportMethod: "sni-only",
            minimumProtocolVersion: "TLSv1.2_2021",
        },
        tags: commonTags
    });


    return bucket;
}

function createViewerWebsiteBucket() {
    const bucket = new aws.s3.Bucket('viewer', {
        bucket: `viewer.codeinthedark.interlogica.it`,
        acl: 'public-read',
        requestPayer: 'BucketOwner',
        website: {
            indexDocument: 'index.html',
            errorDocument: 'index.html'
        },
        corsRules: [{
            allowedHeaders: ['*'],
            allowedMethods: [
                'GET', 'HEAD'
            ],
            allowedOrigins: ['*'],
            exposeHeaders: ['ETag'],
            maxAgeSeconds: 3000
        }],
        tags: commonTags
    });

    new aws.s3.BucketPolicy(`viewer-bucket-policy`, {
        bucket: bucket.id,
        policy: {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Sid': 'PublicReadGetObject',
                    'Effect': 'Allow',
                    'Principal': '*',
                    'Action': [
                        's3:GetObject'
                    ],
                    'Resource': [
                        pulumi.interpolate`${bucket.arn}/*`
                    ]
                }
            ]
        }
    });

    const s3OriginId = "viewer.codeinthedark.interlogica.it";
    const distribution = new aws.cloudfront.Distribution('viewer-distribution', {
        origins: [{
            domainName: bucket.bucketRegionalDomainName,
            originId: s3OriginId,
        }],
        enabled: true,
        isIpv6Enabled: false,
        defaultRootObject: "index.html",
        defaultCacheBehavior: {
            compress: true,
            allowedMethods: [
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
            ],
            cachedMethods: [
                "GET",
                "HEAD",
            ],
            targetOriginId: s3OriginId,
            forwardedValues: {
                queryString: false,
                cookies: {
                    forward: "none",
                },
            },
            viewerProtocolPolicy: "redirect-to-https",
            minTtl: 0,
            defaultTtl: 3600,
            maxTtl: 86400,
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            }
        },
        aliases: [
            "viewer.codeinthedark.interlogica.it"
        ],
        viewerCertificate: {
            // cloudfrontDefaultCertificate: true,
            acmCertificateArn: process.env.CERTIFICATE_ARN,
            sslSupportMethod: "sni-only",
            minimumProtocolVersion: "TLSv1.2_2021",
        },
        tags: commonTags
    });

    return bucket;
}


function createEditorWebsiteBucket() {
    const bucket = new aws.s3.Bucket('editor', {
        bucket: `editor.codeinthedark.interlogica.it`,
        acl: 'public-read',
        requestPayer: 'BucketOwner',
        // website: {
        //     indexDocument: 'index.html',
        //     errorDocument: 'index.html'
        // },
        corsRules: [{
            allowedHeaders: ['*'],
            allowedMethods: [
                'GET', 'HEAD'
            ],
            allowedOrigins: ['*'],
            exposeHeaders: ['ETag'],
            maxAgeSeconds: 3000
        }],
        tags: commonTags
    });

    new aws.s3.BucketPolicy(`editor-bucket-policy`, {
        bucket: bucket.id,
        policy: {
            'Version': '2012-10-17',
            'Statement': [
                {
                    'Sid': 'PublicReadGetObject',
                    'Effect': 'Allow',
                    'Principal': '*',
                    'Action': [
                        's3:GetObject'
                    ],
                    'Resource': [
                        pulumi.interpolate`${bucket.arn}/*`
                    ]
                }
            ]
        }
    });


    const s3OriginId = "editor.codeinthedark.interlogica.it";
    const distribution = new aws.cloudfront.Distribution('editor-distribution', {
        origins: [{
            domainName: bucket.bucketRegionalDomainName,
            originId: s3OriginId,
        }],
        priceClass: "PriceClass_100",
        enabled: true,
        isIpv6Enabled: false,
        defaultRootObject: "index.html",
        defaultCacheBehavior: {
            compress: true,
            allowedMethods: [
                "DELETE",
                "GET",
                "HEAD",
                "OPTIONS",
                "PATCH",
                "POST",
                "PUT",
            ],
            cachedMethods: [
                "GET",
                "HEAD",
            ],
            targetOriginId: s3OriginId,
            forwardedValues: {
                queryString: false,
                cookies: {
                    forward: "none",
                },
            },
            viewerProtocolPolicy: "redirect-to-https",
            minTtl: 0,
            defaultTtl: 3600,
            maxTtl: 86400,
        },
        restrictions: {
            geoRestriction: {
                restrictionType: "none",
            }
        },
        aliases: [
            "editor.codeinthedark.interlogica.it"
        ],
        viewerCertificate: {
            acmCertificateArn: process.env.CERTIFICATE_ARN,
            sslSupportMethod: "sni-only",
            minimumProtocolVersion: "TLSv1.2_2021",
        },
        tags: commonTags
    });

    return bucket;
}
