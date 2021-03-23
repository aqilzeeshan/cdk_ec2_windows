#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkEc2WindowsStack } from '../lib/cdk_ec2_windows-stack';

const app = new cdk.App();
new CdkEc2WindowsStack(app, 'CdkEc2WindowsStack');
