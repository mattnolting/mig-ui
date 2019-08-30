import React, { useContext } from 'react';
// import { Flex, Box } from '@rebass/emotion';
import {
  Button,
  DataListItem,
  DataListCell,
  DataListItemCells,
  DataListItemRow,
  DataListAction,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle
} from '@patternfly/react-core';
import StatusIcon from '../../../../common/components/StatusIcon';
import { LinkIcon } from '@patternfly/react-icons';
import { useOpenModal } from '../../../duck/hooks';
import AddEditClusterModal from '../../../../cluster/components/AddEditClusterModal';
import ConfirmModal from '../../../../common/components/ConfirmModal';
import { ClusterContext } from '../../../duck/context';

const ClusterItem = ({ cluster, clusterIndex, isLoading, migMeta, removeCluster, ...props }) => {
  const clusterName = cluster.MigCluster.metadata.name;
  let clusterStatus = null;
  if (cluster.MigCluster.status) {
    clusterStatus = cluster.MigCluster.status.conditions.filter(c => c.type === 'Ready').length > 0;
  }
  const clusterUrl = cluster.MigCluster.spec.isHostCluster
    ? migMeta.clusterApi
    : cluster.Cluster.spec.kubernetesApiEndpoints.serverEndpoints[0].serverAddress;

  const clusterSvcToken =
    !cluster.MigCluster.spec.isHostCluster && cluster.Secret.data.saToken
      ? atob(cluster.Secret.data.saToken)
      : null;

  const associatedPlanCount = props.associatedPlans[clusterName];
  const planText = associatedPlanCount === 1 ? 'plan' : 'plans';

  const [isAddEditOpen, toggleIsAddEditOpen] = useOpenModal(false);
  const [isConfirmOpen, toggleConfirmOpen] = useOpenModal(false);

  const isHostCluster = cluster.MigCluster.spec.isHostCluster;

  const removeMessage = `Are you sure you want to remove "${clusterName}"`;

  const handleRemoveCluster = isConfirmed => {
    if (isConfirmed) {
      removeCluster(clusterName);
      toggleConfirmOpen();
    } else {
      toggleConfirmOpen();
    }
  };

  const clusterContext = useContext(ClusterContext);

  const editCluster = () => {
    clusterContext.watchClusterAddEditStatus(clusterName);
    toggleIsAddEditOpen();
  };

  this.state = { isOpen1: false, isOpen2: false, isOpen3: false };

  this.onToggle1 = isOpen1 => {
    this.setState({ isOpen1 });
  };

  this.onSelect1 = event => {
    this.setState(prevState => ({
      isOpen1: !prevState.isOpen1
    }));
  };

  this.onToggle2 = isOpen2 => {
    this.setState({ isOpen2 });
  };

  this.onSelect2 = event => {
    this.setState(prevState => ({
      isOpen2: !prevState.isOpen2
    }));
  };

  this.onToggle3 = isOpen3 => {
    this.setState({ isOpen3 });
  };

  this.onSelect3 = event => {
    this.setState(prevState => ({
      isOpen3: !prevState.isOpen3
    }));
  };

  return (
    <DataListItem key={clusterIndex} aria-labelledby="cluster-item">
      <DataListItemRow>
        <DataListItemCells
          dataListCells={[
            <DataListCell key="name" width={1}>
              <div className="pf-l-flex">
                <span className="pf-l-flex__item">
                  <StatusIcon isReady={clusterStatus} />
                </span>
                <span className="pf-l-flex__item">
                  {/* update this id */}
                  <span id={`demo-${clusterName}`}>{clusterName}</span>
                </span>
              </div>
            </DataListCell>,
            <DataListCell key="url" width={2}>
              <a target="_blank" href={clusterUrl}>
                {clusterUrl}
              </a>
            </DataListCell>,
            <DataListCell key="count" width={2}>
              <div className="pf-l-flex">
                <span className="pf-l-flex__item">
                  <LinkIcon />
                </span>
                <span className="pf-l-flex__item">
                  {associatedPlanCount} associated migration {planText}
                </span>
              </div>
            </DataListCell>
          ]}
        />
        {/* Need to update this section */}
        <DataListAction
          className="pf-m-hidden-on-lg"
          aria-labelledby="check-action-item2 check-action-action2"
          id="check-action-action2"
          aria-label="Actions"
        >
          <Dropdown
            isPlain
            position={DropdownPosition.right}
            isOpen={this.state.isOpen2}
            onSelect={this.onSelect2}
            toggle={<KebabToggle onToggle={this.onToggle2} />}
            dropdownItems={[
              <DropdownItem key="pri-action2" component="button">Primary</DropdownItem>,
              <DropdownItem key="sec-action2" component="button">Secondary</DropdownItem>,
            ]}
          />
        </DataListAction>
        <DataListAction
          // update this section
          className="pf-m-visible-on-lg pf-m-hidden"
          aria-labelledby="check-action-item2 check-action-action2"
          id={cluster}
          aria-label="Actions"
        >
          <Button
            onClick={editCluster}
            variant="secondary"
            isDisabled={isHostCluster}
            >
            Edit
          </Button>
          <AddEditClusterModal
            isOpen={isAddEditOpen}
            onHandleClose={toggleIsAddEditOpen}
            initialClusterValues={{clusterName, clusterUrl, clusterSvcToken}}
            />
          <Button
            onClick={toggleConfirmOpen}
            variant="danger"
            isDisabled={isHostCluster}
            key="remove-action"
          >
            Remove
          </Button>
          <ConfirmModal
            message={removeMessage}
            isOpen={isConfirmOpen}
            onHandleClose={handleRemoveCluster}
            id="confirm-cluster-removal"
          />
        </DataListAction>
      </DataListItemRow>
    </DataListItem>
  );
};
export default ClusterItem;
