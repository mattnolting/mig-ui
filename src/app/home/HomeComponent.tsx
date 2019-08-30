import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Flex, Box, Text } from '@rebass/emotion';
import styled from '@emotion/styled';
import {
  Brand,
  Page,
  PageHeader,
  PageSection,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import { ClusterActions } from '../cluster/duck/actions';
import { StorageActions } from '../storage/duck/actions';
import { PlanActions } from '../plan/duck/actions';


import { clusterOperations } from '../cluster/duck';
import { storageOperations } from '../storage/duck';
import { planOperations } from '../plan/duck';
import DetailViewComponent from './DetailViewComponent';
import DashboardCard from './components/Card/DashboardCard';
import clusterSelectors from '../cluster/duck/selectors';
import storageSelectors from '../storage/duck/selectors';
import planSelectors from '../plan/duck/selectors';
import openshiftLogo from '../../assets/Logo-Cluster_Application_Migration.svg';
import { StatusPollingInterval } from '../common/duck/sagas';
import { PollingContext } from './duck/context';

interface IProps {
  allClusters: any[];
  allStorage: any[];
  allPlans: any[];
  startPlanPolling: (params) => void;
  stopPlanPolling: () => void;
  startStoragePolling: (params) => void;
  stopStoragePolling: () => void;
  startClusterPolling: (params) => void;
  stopClusterPolling: () => void;
  updateClusters: (updatedClusters) => void;
  updateStorages: (updatedStorages) => void;
  updatePlans: (updatedPlans) => void;
  isFetchingClusters: boolean;
  isFetchingStorage: boolean;
  isFetchingPlans: boolean;
  isClusterError: boolean;
  isStorageError: boolean;
  isPlanError: boolean;
  planStatusCounts: any;
}

const HomeComponent: React.FunctionComponent<IProps> = (props) => {
  const StyledPageHeader = styled(PageHeader)`
      .pf-c-brand {
        height: 2.5em;
      }
      background-color: #151515 !important;
      .pf-c-page__header-brand {
        background-color: #151515 !important;
        min-width: 56em;
      }
      -moz-box-shadow: 0 0.0625rem 0.125rem 0 rgba(3, 3, 3, 0.2);
      -webkit-box-shadow: 0 0.0625rem 0.125rem 0 rgba(3, 3, 3, 0.2);
      box-shadow: 0 0.0625rem 0.125rem 0 rgba(3, 3, 3, 0.2);
      text-decoration: none;
      .pf-c-page__header-brand-link {
        text-decoration: none;
      }
    `;

  const Header = (
    <StyledPageHeader
      logo={
        <React.Fragment>
          <Brand src={openshiftLogo} alt="OpenShift Logo" />
        </React.Fragment>
      }
    />
  );

  const {
    allClusters,
    allStorage,
    allPlans,
    startPlanPolling,
    stopPlanPolling,
    startStoragePolling,
    stopStoragePolling,
    startClusterPolling,
    stopClusterPolling,
    updateClusters,
    updateStorages,
    updatePlans,
    isFetchingClusters,
    isFetchingStorage,
    isFetchingPlans,
    isClusterError,
    isStorageError,
    isPlanError,
    planStatusCounts
  } = props;

  const handlePlanPoll = response => {
    if (response && response.isSuccessful === true) {
      updatePlans(response.updatedPlans);
      return true;
    }
    return false;
  };

  const handleClusterPoll = response => {
    if (response && response.isSuccessful === true) {
      updateClusters(response.updatedClusters);
      return true;
    }
    return false;
  };

  const handleStoragePoll = response => {
    if (response && response.isSuccessful === true) {
      updateStorages(response.updatedStorages);
      return true;
    }
    return false;
  };

  const startDefaultPlanPolling = () => {
    const planPollParams = {
      asyncFetch: planOperations.fetchPlansGenerator,
      callback: handlePlanPoll,
      delay: StatusPollingInterval,
      retryOnFailure: true,
      retryAfter: 5,
      stopAfterRetries: 2,
    };
    startPlanPolling(planPollParams);
  };

  const startDefaultClusterPolling = () => {
    const clusterPollParams = {
      asyncFetch: clusterOperations.fetchClustersGenerator,
      callback: handleClusterPoll,
      delay: StatusPollingInterval,
      retryOnFailure: true,
      retryAfter: 5,
      stopAfterRetries: 2,
    };
    startClusterPolling(clusterPollParams);
  };

  const startDefaultStoragePolling = () => {
    const storagePollParams = {
      asyncFetch: storageOperations.fetchStorageGenerator,
      callback: handleStoragePoll,
      delay: StatusPollingInterval,
      retryOnFailure: true,
      retryAfter: 5,
      stopAfterRetries: 2,
    };
    startStoragePolling(storagePollParams);
  };

  useEffect(() => {
    startDefaultClusterPolling();
    startDefaultStoragePolling();
    startDefaultPlanPolling();

  }, []);

  return (
    <Page header={Header}>
      <PageSection>
        <Grid gutter="md">
          <GridItem md={6} lg={4}>
            <DashboardCard
              type="clusters"
              title="Clusters"
              dataList={allClusters}
              isFetching={isFetchingClusters}
              isError={isClusterError}
            />
          </GridItem>
          <GridItem md={6} lg={4}>
            <DashboardCard
              title="Replication Repositories"
              type="repositories"
              dataList={allStorage}
              isFetching={isFetchingStorage}
              isError={isStorageError}
            />
          </GridItem>
          <GridItem md={6} lg={4}>
            <DashboardCard
              type="plans"
              title="Migration Plans"
              planStatusCounts={planStatusCounts}
              dataList={allPlans}
              isFetching={isFetchingPlans}
              isError={isPlanError}
            />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection>
        <PollingContext.Provider value={{
          startDefaultClusterPolling: () => startDefaultClusterPolling(),
          startDefaultStoragePolling: () => startDefaultStoragePolling(),
          startDefaultPlanPolling: () => startDefaultPlanPolling(),
          stopClusterPolling: () => stopClusterPolling(),
          stopStoragePolling: () => stopStoragePolling(),
          stopPlanPolling: () => stopPlanPolling(),
          startAllDefaultPolling: () => {
            startDefaultClusterPolling();
            startDefaultStoragePolling();
            startDefaultPlanPolling();
          },
          stopAllPolling: () => {
            stopClusterPolling();
            stopStoragePolling();
            stopPlanPolling();
          }
        }}>
          <DetailViewComponent />
        </PollingContext.Provider>
      </PageSection>
      <PageSection>
        {/* <TODO: footer content */}
      </PageSection>
    </Page>
  );
};

export default connect(
  state => ({
    planStatusCounts: planSelectors.getCounts(state),
    allClusters: clusterSelectors.getAllClusters(state),
    allStorage: storageSelectors.getAllStorage(state),
    allPlans: planSelectors.getPlansWithStatus(state),
    loggingIn: state.auth.loggingIn,
    user: state.auth.user,
    isFetchingClusters: state.cluster.isFetching,
    isFetchingStorage: state.storage.isFetching,
    isFetchingPlans: state.plan.isFetching,
    isClusterError: state.cluster.isError,
    isStorageError: state.storage.isError,
    isPlanError: state.plan.isError,
  }),
  dispatch => ({
    onLogout: () => console.debug('TODO: IMPLEMENT: user logged out.'),
    startPlanPolling: params => dispatch(PlanActions.startPlanPolling(params)),
    stopPlanPolling: () => dispatch(PlanActions.stopPlanPolling()),
    startStoragePolling: params => dispatch(StorageActions.startStoragePolling(params)),
    stopStoragePolling: () => dispatch(StorageActions.stopStoragePolling()),
    startClusterPolling: params => dispatch(ClusterActions.startClusterPolling(params)),
    stopClusterPolling: () => dispatch(ClusterActions.stopClusterPolling()),
    updateClusters: updatedClusters => dispatch(ClusterActions.updateClusters(updatedClusters)),
    updateStorages: updatedStorages => dispatch(StorageActions.updateStorages(updatedStorages)),
    updatePlans: updatedPlans => dispatch(PlanActions.updatePlans(updatedPlans)),
  })
)(HomeComponent);
