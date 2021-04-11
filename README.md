* This can be used to create a management server where one can RDS and everything for demo e.g. showing how to createt Packer images 
* To add credentials to profile open it `%USERPROFILE%\.aws\config` and add new profile. Add credentials in `credentials` file.
* Use new profile by `cdk deploy --profile <profile name>`
* Valid Key pair needs to be created and specified in this stack to be able to connect through RDS. 

* Future todo `https://medium.com/@bard.ia/blender-cycles-on-aws-ec2-gpu-6d2d3583b94c`
* For now, create windows instance
* Install anything through choco using userdata
* Connect through RDP
