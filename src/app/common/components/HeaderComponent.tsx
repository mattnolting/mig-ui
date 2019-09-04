import React from 'react';
import styled from '@emotion/styled';
import {
  Brand,
  PageHeader,
} from '@patternfly/react-core';
import openshiftLogo from '../../../assets/Logo-Cluster_Application_Migration.svg';

const HeaderComponent = (
  <PageHeader
    logo={<Brand src={openshiftLogo} alt="Patternfly Logo" />}
  />
);
export default HeaderComponent;
