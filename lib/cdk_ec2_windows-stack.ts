import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';

export class CdkEc2WindowsStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new ec2.Vpc(this, 'VpcFromCDK', {
      cidr: '10.0.0.0/16', 
    });

    const webserverSecurityGroup = new ec2.SecurityGroup(this,"SecurityGroup",{
      vpc:vpc,
      description:"SecurityGroup from CDK",
      securityGroupName:"CDK SecurityGroup",
      allowAllOutbound:true
    })
    
    //Allow ssh from anywhere in the world
    webserverSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(),
      ec2.Port.tcp(3389), 
      'allow RDP access from the world'
    )
    
    //allow requests from any IP to port 80
    webserverSecurityGroup.addIngressRule(
      ec2.Peer.anyIpv4(), 
      ec2.Port.tcp(80), 
      'allow ingress http traffic'                                                                                                                                                     
    )

    //as per https://github.com/aws/aws-cdk/issues/12848
    const subnetSelection : ec2.SubnetSelection = {
      subnetType:ec2.SubnetType.PUBLIC
    }

    const userData = ec2.UserData.forWindows()
    //Wait for 20mins for userdata to complete
    //Check logs in C:\data.txt
    userData.addCommands('Start-Transcript -Path "C:\data.txt" -NoClobber')
    userData.addCommands('iex ((new-object net.webclient).DownloadString("https://chocolatey.org/install.ps1"))','install chocolatey')
    userData.addCommands('choco install googlechrome -y')
    userData.addCommands('choco install vscode -y')
    userData.addCommands('Install-WindowsFeature Web-Server -IncludeManagementTools -IncludeAllSubFeature')
    userData.addCommands('New-Item -ItemType directory -Path "C:\MyWebsite" -Force')
    userData.addCommands('New-Item -ItemType File -Name "index.html" -Path "C:\MyWebsite\"')
    userData.addCommands('Set-Content C:\MyWebsite\index.html "<html>Welcome to Our Site</html>"')
    //userData.addCommands('New-IISSite -Name "MyWebsite" -PhysicalPath "C:\MyWebsite\" -BindingInformation "*:8088:"')
    //userData.addCommands('Get-IISSite')

    // Pick a Windows edition to use
    const windows = ec2.MachineImage.latestWindows(ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_FULL_BASE);

    const webServer = new ec2.Instance(this, "WebInstance",{
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: windows,
      vpc: vpc,
      securityGroup:webserverSecurityGroup,
      vpcSubnets:subnetSelection,
      keyName:'windows',
      userData:userData
    })

  }
}
