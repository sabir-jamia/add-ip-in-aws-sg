const core = require("@actions/core");
const {
  EC2Client,
  RevokeSecurityGroupIngressCommand,
} = require("@aws-sdk/client-ec2");

const { getPublicIP } = require("./get-IPV4");

async function run() {
  const ip = await getPublicIP();

  const client = new EC2Client({
    credentials: {
      accessKeyId: core.getInput("aws-access-key-id"),
      secretAccessKey: core.getInput("aws-secret-access-key"),
    },
    region: core.getInput("aws-region"),
  });

  const command = new RevokeSecurityGroupIngressCommand({
    GroupId: core.getInput("aws-security-group-id"),
    IpPermissions: [
      {
        IpProtocol: core.getInput("aws-ip-protocol"),
        FromPort: core.getInput("aws-from-port"),
        ToPort: core.getInput("aws-to-port"),
        IpRanges: [{ CidrIp: `${ip}/32` }],
      },
    ],
  });

  try {
    await client.send(command);
    core.info(`IP ${ip} remove successfully from AWS security group`);
  } catch (err) {
    core.setFailed(err.message);
  }
}

run();
